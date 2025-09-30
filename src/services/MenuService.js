import { databaseService } from './DatabaseService';
import { DatabasePaths } from '../config/FirebaseConfig';
import { accessControlService } from './AccessControlService';
import { categoryService } from './CategoryService';

// 菜单数据服务类
class MenuService {
    constructor() {
        this.dishesPath = DatabasePaths.menu.dishes;
        this.categoriesPath = DatabasePaths.menu.categories;
        this.optionsPath = DatabasePaths.menu.options;
    }

    // 确保访问权限
    async ensureAccess() {
        return await accessControlService.ensureAccess();
    }

    // ==================== 菜品管理 ====================

    // 获取所有菜品
    async getAllDishes() {
        try {
            // 确保有访问权限
            await this.ensureAccess();

            const dishes = await databaseService.read(this.dishesPath);
            if (dishes) {
                // 转换对象为数组
                const dishArray = Object.keys(dishes).map(key => ({
                    id: key,
                    ...dishes[key]
                }));
                return dishArray.map(dish => this.transformDishData(dish));
            }
            return this.getFallbackMenuData();
        } catch (error) {
            console.error('获取菜品失败:', error);
            // 如果Firebase失败，返回本地数据作为后备
            return this.getFallbackMenuData();
        }
    }

    // 根据分类获取菜品
    async getDishesByCategory(category) {
        try {
            const dishes = await databaseService.query(this.dishesPath, {
                orderBy: { type: 'child', key: 'category' },
                equalTo: category
            });
            return dishes ? dishes.map(dish => this.transformDishData(dish)) : [];
        } catch (error) {
            console.error('根据分类获取菜品失败:', error);
            // 返回本地数据的筛选结果
            const fallbackData = this.getFallbackMenuData();
            return fallbackData.filter(dish => dish.category === category);
        }
    }

    // 根据ID获取单个菜品
    async getDishById(dishId) {
        try {
            const dish = await databaseService.read(`${this.dishesPath}/${dishId}`);
            return dish ? this.transformDishData({ id: dishId, ...dish }) : null;
        } catch (error) {
            console.error('根据ID获取菜品失败:', error);
            // 从本地数据中查找
            const fallbackData = this.getFallbackMenuData();
            return fallbackData.find(dish => dish.id === dishId) || null;
        }
    }

    // 根据SKU获取菜品 (利用数据库索引)
    async getDishBySku(sku) {
        try {
            const dishes = await databaseService.query(this.dishesPath, {
                orderBy: { type: 'child', key: 'sku' },
                equalTo: sku,
                limitToFirst: 1
            });

            if (dishes && dishes.length > 0) {
                return this.transformDishData(dishes[0]);
            }
            return null;
        } catch (error) {
            console.error('根据SKU获取菜品失败:', error);
            // 从本地数据中查找
            const fallbackData = this.getFallbackMenuData();
            return fallbackData.find(dish => dish.sku === sku) || null;
        }
    }

    // 批量根据SKU获取菜品 (利用数据库索引)
    async getDishesBySkus(skus) {
        try {
            const results = await Promise.all(
                skus.map(sku => this.getDishBySku(sku))
            );
            return results.filter(dish => dish !== null);
        } catch (error) {
            console.error('批量根据SKU获取菜品失败:', error);
            return [];
        }
    }

    // 搜索菜品
    async searchDishes(searchTerm) {
        try {
            const allDishes = await this.getAllDishes();
            if (!searchTerm || searchTerm.trim() === '') {
                return allDishes;
            }

            const term = searchTerm.toLowerCase().trim();
            return allDishes.filter(dish =>
                dish.title.toLowerCase().includes(term) ||
                dish.desc.toLowerCase().includes(term) ||
                dish.category.toLowerCase().includes(term)
            );
        } catch (error) {
            console.error('搜索菜品失败:', error);
            return [];
        }
    }

    // 获取推荐菜品
    async getFeaturedDishes(limit = 6) {
        try {
            const dishes = await databaseService.query(this.dishesPath, {
                orderBy: { type: 'child', key: 'featured' },
                equalTo: true,
                limitToFirst: limit
            });
            return dishes ? dishes.map(dish => this.transformDishData(dish)) : [];
        } catch (error) {
            console.error('获取推荐菜品失败:', error);
            // 从本地数据中获取推荐菜品
            const fallbackData = this.getFallbackMenuData();
            return fallbackData.filter(dish => dish.featured).slice(0, limit);
        }
    }

    // ==================== 分类管理 ====================

    // 获取所有分类 (使用新的CategoryService)
    async getAllCategories() {
        try {
            return await categoryService.getCombinedCategories();
        } catch (error) {
            console.error('获取分类失败:', error);
            return this.getFallbackCategories();
        }
    }

    // 获取食物分类
    async getFoodCategories() {
        try {
            return await categoryService.getFoodCategories();
        } catch (error) {
            console.error('获取食物分类失败:', error);
            return [];
        }
    }

    // 获取饮品分类
    async getDrinksCategories() {
        try {
            return await categoryService.getDrinksCategories();
        } catch (error) {
            console.error('获取饮品分类失败:', error);
            return [];
        }
    }

    // 根据分类ID获取分类信息
    async getCategoryById(categoryId) {
        try {
            return await categoryService.getCategoryById(categoryId);
        } catch (error) {
            console.error('根据ID获取分类失败:', error);
            return null;
        }
    }

    // ==================== 实时监听 ====================

    // 监听菜品变化
    subscribeToDishes(callback, category = null) {
        try {
            let queryParams = {};

            if (category) {
                queryParams = {
                    orderBy: { type: 'child', key: 'category' },
                    equalTo: category
                };
            }

            return databaseService.subscribeToPath(
                this.dishesPath,
                (data, error) => {
                    if (error) {
                        console.error('菜品监听错误:', error);
                        callback(this.getFallbackMenuData(), error);
                        return;
                    }

                    const transformedData = data ?
                        data.map(dish => this.transformDishData(dish)) :
                        this.getFallbackMenuData();

                    callback(transformedData);
                },
                queryParams
            );
        } catch (error) {
            console.error('订阅菜品更新失败:', error);
            // 返回本地数据
            callback(this.getFallbackMenuData());
            return null;
        }
    }

    // 监听分类变化
    subscribeToCategories(callback) {
        try {
            return databaseService.subscribeToPath(
                this.categoriesPath,
                (data, error) => {
                    if (error) {
                        console.error('分类监听错误:', error);
                        callback(this.getFallbackCategories(), error);
                        return;
                    }

                    let categories = [];
                    if (data) {
                        categories = Object.keys(data).map(key => ({
                            id: key,
                            ...data[key]
                        }));
                        categories.sort((a, b) => (a.order || 0) - (b.order || 0));
                    } else {
                        categories = this.getFallbackCategories();
                    }

                    callback(categories);
                }
            );
        } catch (error) {
            console.error('订阅分类更新失败:', error);
            callback(this.getFallbackCategories());
            return null;
        }
    }

    // 取消监听
    unsubscribe(listenerId) {
        if (listenerId) {
            databaseService.unsubscribeFromPath(listenerId);
        }
    }

    // ==================== 数据管理 ====================

    // 添加菜品
    async addDish(dishData) {
        try {
            const dishWithTimestamp = {
                ...dishData,
                createdAt: databaseService.getServerTimestamp(),
                updatedAt: databaseService.getServerTimestamp()
            };

            return await databaseService.push(this.dishesPath, dishWithTimestamp);
        } catch (error) {
            console.error('添加菜品失败:', error);
            throw error;
        }
    }

    // 更新菜品
    async updateDish(dishId, updates) {
        try {
            const updateData = {
                ...updates,
                updatedAt: databaseService.getServerTimestamp()
            };

            return await databaseService.updateData(`${this.dishesPath}/${dishId}`, updateData);
        } catch (error) {
            console.error('更新菜品失败:', error);
            throw error;
        }
    }

    // 删除菜品
    async deleteDish(dishId) {
        try {
            return await databaseService.delete(`${this.dishesPath}/${dishId}`);
        } catch (error) {
            console.error('删除菜品失败:', error);
            throw error;
        }
    }

    // ==================== 数据转换 ====================

    // 转换菜品数据格式
    transformDishData(dish) {
        return {
            id: dish.id,
            title: dish.title || dish.name || '未知菜品',
            price: parseFloat(dish.price) || 0,
            category: dish.category || 'main-dishes',
            desc: dish.desc || dish.description || '',
            image01: dish.image01 || dish.image || '/images/default-dish.png',
            options: dish.options || {},
            available: dish.available !== false, // 默认为可用
            featured: dish.featured === true,
            spicyLevel: dish.spicyLevel || 0,
            preparationTime: dish.preparationTime || 15,
            nutrition: dish.nutrition || {},
            allergens: dish.allergens || [],
            createdAt: dish.createdAt,
            updatedAt: dish.updatedAt
        };
    }

    // ==================== 后备数据 ====================

    // 获取本地菜单数据作为后备
    getFallbackMenuData() {
        return [
            {
                id: "01",
                title: "宫保鸡丁",
                price: 24.00,
                category: "main-dishes",
                desc: "经典川菜，鸡肉丁配花生米，香辣可口",
                image01: "/images/gongbao-chicken.jpg",
                featured: true,
                spicyLevel: 2,
                options: {
                    spiciness: ["不辣", "微辣", "中辣", "特辣"],
                    size: ["小份", "标准", "大份"],
                    extras: ["加米饭", "加面条"]
                }
            },
            {
                id: "02",
                title: "红烧肉",
                price: 32.00,
                category: "main-dishes",
                desc: "肥瘦相间的五花肉，红亮甜糯",
                image01: "/images/hongshao-pork.jpg",
                featured: true,
                spicyLevel: 0,
                options: {
                    size: ["小份", "标准", "大份"],
                    extras: ["加米饭", "加馒头"]
                }
            },
            {
                id: "03",
                title: "麻婆豆腐",
                price: 18.00,
                category: "main-dishes",
                desc: "嫩滑豆腐配麻辣肉末，下饭神器",
                image01: "/images/mapo-tofu.jpg",
                featured: false,
                spicyLevel: 3,
                options: {
                    spiciness: ["微辣", "中辣", "特辣"],
                    size: ["小份", "标准", "大份"]
                }
            },
            {
                id: "04",
                title: "春卷",
                price: 12.00,
                category: "appetizers",
                desc: "酥脆外皮包裹新鲜蔬菜丝",
                image01: "/images/spring-rolls.jpg",
                featured: false,
                spicyLevel: 0,
                options: {
                    quantity: ["3个", "6个", "9个"],
                    dipping: ["甜酸酱", "辣椒酱", "蒜蓉酱"]
                }
            },
            {
                id: "05",
                title: "饺子",
                price: 16.00,
                category: "appetizers",
                desc: "手工包制，皮薄馅大",
                image01: "/images/dumplings.jpg",
                featured: true,
                spicyLevel: 0,
                options: {
                    filling: ["猪肉韭菜", "牛肉大葱", "三鲜"],
                    cooking: ["水煮", "煎饺", "蒸饺"],
                    quantity: ["6个", "12个", "18个"]
                }
            },
            {
                id: "06",
                title: "冬瓜排骨汤",
                price: 20.00,
                category: "soups",
                desc: "清香鲜美，营养丰富",
                image01: "/images/wintermelon-soup.jpg",
                featured: false,
                spicyLevel: 0,
                options: {
                    size: ["小份", "标准", "大份"]
                }
            },
            {
                id: "07",
                title: "茉莉花茶",
                price: 8.00,
                category: "beverages",
                desc: "清香怡人的茉莉花茶",
                image01: "/images/jasmine-tea.jpg",
                featured: false,
                spicyLevel: 0,
                options: {
                    temperature: ["热饮", "冰饮"],
                    sweetness: ["无糖", "少糖", "正常"]
                }
            },
            {
                id: "08",
                title: "红豆沙",
                price: 10.00,
                category: "desserts",
                desc: "香甜软糯的红豆沙甜品",
                image01: "/images/red-bean-dessert.jpg",
                featured: false,
                spicyLevel: 0,
                options: {
                    temperature: ["热", "冰"],
                    sweetness: ["少糖", "正常", "加糖"]
                }
            }
        ];
    }

    // 获取本地分类数据作为后备
    getFallbackCategories() {
        return [
            { id: "main-dishes", name: "主食", icon: "ri-bowl-line", order: 1 },
            { id: "appetizers", name: "开胃菜", icon: "ri-restaurant-line", order: 2 },
            { id: "soups", name: "汤类", icon: "ri-cup-line", order: 3 },
            { id: "beverages", name: "饮品", icon: "ri-cup-2-line", order: 4 },
            { id: "desserts", name: "甜品", icon: "ri-cake-line", order: 5 }
        ];
    }
}

// 创建并导出单例实例
export const menuService = new MenuService();
export default menuService;