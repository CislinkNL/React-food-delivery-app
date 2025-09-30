// 外卖订单测试工具
import { takeAwayOrderService } from '../services/TakeAwayOrderService';

// 示例订单数据
const sampleOrderData = {
    customerInfo: {
        name: "张三",
        phone: "13812345678",
        email: "zhangsan@example.com",
        address: {
            street: "朝阳区三里屯路123号",
            city: "北京",
            postalCode: "100027",
            notes: "小区门口左转"
        }
    },
    items: [
        {
            dishId: "1",
            title: "宫保鸡丁",
            price: 24.00,
            quantity: 2,
            selectedOptions: {
                spiciness: "中辣",
                size: "标准",
                extras: ["加米饭"]
            },
            specialInstructions: "少放花生米"
        },
        {
            dishId: "5",
            title: "饺子",
            price: 16.00,
            quantity: 1,
            selectedOptions: {
                filling: "猪肉韭菜",
                cooking: "水煮",
                quantity: "12个"
            }
        }
    ],
    pricing: {
        subtotal: 64.00,
        deliveryFee: 5.00,
        tax: 0,
        discount: 0,
        total: 69.00
    },
    delivery: {
        type: "delivery",
        estimatedTime: 30,
        instructions: "送到门口即可"
    },
    payment: {
        method: "cash",
        status: "pending"
    },
    metadata: {
        device: "web",
        notes: "测试订单"
    }
};

// 测试函数
export async function testCreateOrder() {
    try {
        console.log('🚀 开始创建测试订单...');

        const orderId = await takeAwayOrderService.createOrder(sampleOrderData);
        console.log('✅ 订单创建成功! 订单ID:', orderId);

        return orderId;
    } catch (error) {
        console.error('❌ 创建订单失败:', error);
        throw error;
    }
}

export async function testGetOrderDetails(orderId) {
    try {
        console.log('📋 获取订单详情...', orderId);

        const orderDetails = await takeAwayOrderService.getOrderDetails(orderId);
        console.log('✅ 订单详情:', orderDetails);

        return orderDetails;
    } catch (error) {
        console.error('❌ 获取订单详情失败:', error);
        throw error;
    }
}

export async function testUpdateOrderStatus(orderId) {
    try {
        console.log('🔄 更新订单状态...');

        // 测试状态变更流程
        const statuses = ['confirmed', 'preparing', 'ready'];

        for (const status of statuses) {
            await takeAwayOrderService.updateOrderStatus(orderId, status);
            console.log(`✅ 订单状态更新为: ${status}`);

            // 等待1秒再更新下一个状态
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        return true;
    } catch (error) {
        console.error('❌ 更新订单状态失败:', error);
        throw error;
    }
}

export async function testGetActiveOrders() {
    try {
        console.log('📊 获取活跃订单...');

        const activeOrders = await takeAwayOrderService.getActiveOrders();
        console.log('✅ 活跃订单数量:', activeOrders.length);
        console.log('订单列表:', activeOrders);

        return activeOrders;
    } catch (error) {
        console.error('❌ 获取活跃订单失败:', error);
        throw error;
    }
}

export async function testOrderStatistics() {
    try {
        console.log('📈 获取今日订单统计...');

        const stats = await takeAwayOrderService.getTodayOrderStats();
        console.log('✅ 今日统计:', stats);

        return stats;
    } catch (error) {
        console.error('❌ 获取统计数据失败:', error);
        throw error;
    }
}

export function testRealtimeOrderUpdates() {
    try {
        console.log('👂 开始监听订单实时更新...');

        const listenerId = takeAwayOrderService.subscribeToOrders((orders, error) => {
            if (error) {
                console.error('❌ 监听错误:', error);
                return;
            }

            console.log('🔔 订单更新通知:', {
                订单数量: orders.length,
                最新订单: orders[0]?.orderId || '无'
            });
        });

        console.log('✅ 订单监听已启动, ID:', listenerId);

        // 返回取消监听的函数
        return () => {
            takeAwayOrderService.unsubscribeFromOrders(listenerId);
            console.log('🔇 订单监听已停止');
        };
    } catch (error) {
        console.error('❌ 启动订单监听失败:', error);
        throw error;
    }
}

// 完整测试流程
export async function runCompleteOrderTest() {
    try {
        console.log('🧪 ===== 开始完整订单测试 =====');

        // 1. 创建订单
        const orderId = await testCreateOrder();

        // 2. 获取订单详情
        await testGetOrderDetails(orderId);

        // 3. 更新订单状态
        await testUpdateOrderStatus(orderId);

        // 4. 获取活跃订单
        await testGetActiveOrders();

        // 5. 获取统计数据
        await testOrderStatistics();

        // 6. 测试实时监听
        const stopListening = testRealtimeOrderUpdates();

        // 10秒后停止监听
        setTimeout(() => {
            stopListening();
            console.log('🏁 ===== 订单测试完成 =====');
        }, 10000);

        return orderId;
    } catch (error) {
        console.error('❌ 完整测试失败:', error);
        throw error;
    }
}

// 清理测试数据
export async function cleanupTestData() {
    try {
        if (process.env.REACT_APP_ENVIRONMENT === 'development') {
            console.log('🧹 清理测试数据...');
            await takeAwayOrderService.clearTestOrders();
            console.log('✅ 测试数据已清理');
        } else {
            console.log('⚠️ 仅在开发环境中允许清理数据');
        }
    } catch (error) {
        console.error('❌ 清理测试数据失败:', error);
        throw error;
    }
}

// 如果在浏览器环境中，将函数添加到全局对象
if (typeof window !== 'undefined') {
    window.orderTest = {
        createOrder: testCreateOrder,
        getOrderDetails: testGetOrderDetails,
        updateOrderStatus: testUpdateOrderStatus,
        getActiveOrders: testGetActiveOrders,
        getStatistics: testOrderStatistics,
        startRealtimeUpdates: testRealtimeOrderUpdates,
        runCompleteTest: runCompleteOrderTest,
        cleanup: cleanupTestData
    };

    console.log('🛠️ 订单测试工具已加载!');
    console.log('使用方式:');
    console.log('- orderTest.createOrder() - 创建测试订单');
    console.log('- orderTest.runCompleteTest() - 运行完整测试');
    console.log('- orderTest.cleanup() - 清理测试数据');
}