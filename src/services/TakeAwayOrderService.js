import { databaseService } from './DatabaseService';
import { DatabasePaths } from '../config/FirebaseConfig';

// 外卖订单服务类
class TakeAwayOrderService {
    constructor() {
        this.ordersPath = DatabasePaths.takeAway.orders;
        this.customersPath = DatabasePaths.takeAway.customers;
    }

    // ==================== 订单管理 ====================

    // 创建新订单
    async createOrder(orderData) {
        try {
            const timestamp = Date.now();
            const orderWithDetails = {
                // 基本订单信息
                orderId: `ORDER_${timestamp}`,
                status: 'pending', // pending, confirmed, preparing, ready, completed, cancelled
                createdAt: timestamp,
                updatedAt: timestamp,

                // 客户信息
                customerInfo: {
                    name: orderData.customerInfo.name,
                    phone: orderData.customerInfo.phone,
                    email: orderData.customerInfo.email || '',
                    address: {
                        street: orderData.customerInfo.address.street,
                        city: orderData.customerInfo.address.city,
                        postalCode: orderData.customerInfo.address.postalCode,
                        notes: orderData.customerInfo.address.notes || ''
                    }
                },

                // 订单详情 - 包含所有必要信息用于后续获取
                orderDetails: {
                    items: orderData.items.map(item => ({
                        dishId: item.dishId,
                        title: item.title,
                        price: item.price,
                        quantity: item.quantity,
                        selectedOptions: item.selectedOptions || {},
                        specialInstructions: item.specialInstructions || '',
                        itemTotal: item.price * item.quantity
                    })),

                    // 价格明细
                    pricing: {
                        subtotal: orderData.pricing.subtotal,
                        deliveryFee: orderData.pricing.deliveryFee || 0,
                        tax: orderData.pricing.tax || 0,
                        discount: orderData.pricing.discount || 0,
                        total: orderData.pricing.total
                    },

                    // 配送信息
                    delivery: {
                        type: orderData.delivery.type, // 'delivery' 或 'pickup'
                        estimatedTime: orderData.delivery.estimatedTime || 30, // 分钟
                        scheduledTime: orderData.delivery.scheduledTime || null,
                        instructions: orderData.delivery.instructions || ''
                    },

                    // 支付信息
                    payment: {
                        method: orderData.payment.method, // 'cash', 'card', 'online'
                        status: orderData.payment.status || 'pending', // 'pending', 'paid', 'failed'
                        transactionId: orderData.payment.transactionId || null
                    }
                },

                // 元数据
                metadata: {
                    source: 'web', // 订单来源
                    device: orderData.metadata?.device || 'unknown',
                    sessionId: orderData.metadata?.sessionId || null,
                    notes: orderData.metadata?.notes || ''
                }
            };

            const orderKey = await databaseService.push(this.ordersPath, orderWithDetails);

            // 更新订单ID为实际的Firebase key (修复路径错误)
            await databaseService.updateData(`${this.ordersPath}/${orderKey}`, {
                orderId: orderKey,
                orderDetails: {
                    ...orderWithDetails.orderDetails,
                    orderId: orderKey
                }
            });

            return orderKey;
        } catch (error) {
            console.error('创建订单失败:', error);
            throw error;
        }
    }

    // 获取订单详情
    async getOrderDetails(orderId) {
        try {
            const order = await databaseService.read(`${this.ordersPath}/${orderId}`);
            return order;
        } catch (error) {
            console.error('获取订单详情失败:', error);
            throw error;
        }
    }

    // 更新订单状态
    async updateOrderStatus(orderId, status, additionalData = {}) {
        try {
            const updates = {
                status,
                updatedAt: Date.now(),
                ...additionalData
            };

            // 如果是状态变更，记录时间戳
            if (status) {
                updates[`statusHistory.${status}`] = Date.now();
            }

            await databaseService.updateData(`${this.ordersPath}/${orderId}`, updates);
            return true;
        } catch (error) {
            console.error('更新订单状态失败:', error);
            throw error;
        }
    }

    // 获取所有活跃订单 (用于实时监控)
    async getActiveOrders() {
        try {
            const orders = await databaseService.query(this.ordersPath, {
                orderBy: { type: 'child', key: 'status' },
                // 获取非完成状态的订单
            });

            if (orders) {
                return orders.filter(order =>
                    order.status && !['completed', 'cancelled'].includes(order.status)
                );
            }
            return [];
        } catch (error) {
            console.error('获取活跃订单失败:', error);
            return [];
        }
    }

    // 实时监听订单变化
    subscribeToOrders(callback, filterStatus = null) {
        try {
            let queryParams = {
                orderBy: { type: 'child', key: 'createdAt' }
            };

            if (filterStatus) {
                queryParams.equalTo = filterStatus;
                queryParams.orderBy = { type: 'child', key: 'status' };
            }

            return databaseService.subscribeToPath(
                this.ordersPath,
                (data, error) => {
                    if (error) {
                        console.error('订单监听错误:', error);
                        callback([], error);
                        return;
                    }

                    const orders = data || [];
                    // 按创建时间倒序排序
                    orders.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
                    callback(orders);
                },
                queryParams
            );
        } catch (error) {
            console.error('订阅订单更新失败:', error);
            callback([]);
            return null;
        }
    }

    // 取消监听
    unsubscribeFromOrders(listenerId) {
        if (listenerId) {
            databaseService.unsubscribeFromPath(listenerId);
        }
    }

    // ==================== 客户管理 ====================

    // 保存/更新客户信息
    async saveCustomerInfo(customerInfo) {
        try {
            const customerKey = customerInfo.phone; // 使用电话号码作为key
            const customerData = {
                ...customerInfo,
                lastOrderAt: Date.now(),
                updatedAt: Date.now()
            };

            await databaseService.write(`${this.customersPath}/${customerKey}`, customerData);
            return customerKey;
        } catch (error) {
            console.error('保存客户信息失败:', error);
            throw error;
        }
    }

    // 获取客户信息
    async getCustomerInfo(customerKey) {
        try {
            const customer = await databaseService.read(`${this.customersPath}/${customerKey}`);
            return customer;
        } catch (error) {
            console.error('获取客户信息失败:', error);
            return null;
        }
    }

    // ==================== 统计和查询 ====================

    // 获取今日订单统计
    async getTodayOrderStats() {
        try {
            const todayStart = new Date();
            todayStart.setHours(0, 0, 0, 0);
            const todayStartTimestamp = todayStart.getTime();

            const orders = await databaseService.query(this.ordersPath, {
                orderBy: { type: 'child', key: 'createdAt' },
                startAt: todayStartTimestamp
            });

            if (!orders) return { total: 0, revenue: 0, byStatus: {} };

            const stats = {
                total: orders.length,
                revenue: 0,
                byStatus: {}
            };

            orders.forEach(order => {
                // 计算收入
                if (order.orderDetails?.pricing?.total) {
                    stats.revenue += order.orderDetails.pricing.total;
                }

                // 按状态统计
                const status = order.status || 'unknown';
                stats.byStatus[status] = (stats.byStatus[status] || 0) + 1;
            });

            return stats;
        } catch (error) {
            console.error('获取今日订单统计失败:', error);
            return { total: 0, revenue: 0, byStatus: {} };
        }
    }

    // ==================== 数据清理 (仅开发环境) ====================

    // 清理测试订单数据 (仅开发环境使用)
    async clearTestOrders() {
        if (process.env.REACT_APP_ENVIRONMENT !== 'development') {
            throw new Error('清理操作仅允许在开发环境中执行');
        }

        try {
            await databaseService.delete(this.ordersPath);
            console.log('测试订单数据已清理');
            return true;
        } catch (error) {
            console.error('清理测试订单失败:', error);
            throw error;
        }
    }
}

// 创建并导出单例实例
export const takeAwayOrderService = new TakeAwayOrderService();
export default takeAwayOrderService;