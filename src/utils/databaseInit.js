import { menuService } from '../services/MenuService';
import { databaseService } from '../services/DatabaseService';

// 初始化数据库数据
export const initializeDatabase = async () => {
    try {
        console.log('开始初始化数据库...');

        // 检查是否已有数据
        const existingDishes = await menuService.getAllDishes();

        if (existingDishes.length > 0) {
            console.log('数据库已有数据，跳过初始化');
            return { success: true, message: '数据库已有数据' };
        }

        // 准备初始菜品数据
        const initialDishes = [
            {
                title: "宫保鸡丁",
                price: 32,
                image01: "/images/main-dishes/gongbao-chicken.jpg",
                category: "main-dishes",
                desc: "经典川菜，鸡丁配花生米，酸甜微辣",
                options: {
                    spiciness: [
                        { name: "不辣", price: 0 },
                        { name: "微辣", price: 0 },
                        { name: "中辣", price: 0 },
                        { name: "特辣", price: 2 }
                    ],
                    size: [
                        { name: "小份", price: 0 },
                        { name: "大份", price: 8 }
                    ]
                },
                available: true,
                featured: true
            },
            {
                title: "糖醋里脊",
                price: 28,
                image01: "/images/main-dishes/sweet-sour-pork.jpg",
                category: "main-dishes",
                desc: "酸甜可口，外酥内嫩的经典菜品",
                options: {
                    size: [
                        { name: "小份", price: 0 },
                        { name: "大份", price: 8 }
                    ]
                },
                available: true,
                featured: false
            },
            {
                title: "红烧肉",
                price: 35,
                image01: "/images/main-dishes/braised-pork.jpg",
                category: "main-dishes",
                desc: "肥而不腻，入口即化的传统名菜",
                options: {
                    size: [
                        { name: "小份", price: 0 },
                        { name: "大份", price: 10 }
                    ],
                    cooking: [
                        { name: "正常", price: 0 },
                        { name: "少糖", price: 0 },
                        { name: "无糖", price: 0 }
                    ]
                },
                available: true,
                featured: true
            },
            {
                title: "麻婆豆腐",
                price: 22,
                image01: "/images/main-dishes/mapo-tofu.jpg",
                category: "main-dishes",
                desc: "川菜经典，麻辣鲜香",
                options: {
                    spiciness: [
                        { name: "微辣", price: 0 },
                        { name: "中辣", price: 0 },
                        { name: "特辣", price: 0 }
                    ],
                    tofu: [
                        { name: "嫩豆腐", price: 0 },
                        { name: "老豆腐", price: 0 }
                    ]
                },
                available: true,
                featured: false
            },
            {
                title: "口水鸡",
                price: 26,
                image01: "/images/appetizers/saliva-chicken.jpg",
                category: "appetizers",
                desc: "四川特色凉菜，麻辣鲜香",
                options: {
                    spiciness: [
                        { name: "微辣", price: 0 },
                        { name: "中辣", price: 0 },
                        { name: "特辣", price: 0 }
                    ]
                },
                available: true,
                featured: false
            },
            {
                title: "凉拌黄瓜",
                price: 12,
                image01: "/images/appetizers/cucumber-salad.jpg",
                category: "appetizers",
                desc: "清爽解腻，夏日必备",
                options: {},
                available: true,
                featured: false
            },
            {
                title: "酱牛肉",
                price: 32,
                image01: "/images/appetizers/sauced-beef.jpg",
                category: "appetizers",
                desc: "选用优质牛肉，酱香浓郁",
                options: {
                    cut: [
                        { name: "厚切", price: 0 },
                        { name: "薄切", price: 0 }
                    ]
                },
                available: true,
                featured: true
            },
            {
                title: "西红柿鸡蛋汤",
                price: 16,
                image01: "/images/soups/tomato-egg-soup.jpg",
                category: "soups",
                desc: "家常美味，酸甜开胃",
                options: {
                    consistency: [
                        { name: "清汤", price: 0 },
                        { name: "浓汤", price: 2 }
                    ]
                },
                available: true,
                featured: false
            },
            {
                title: "冬瓜排骨汤",
                price: 28,
                image01: "/images/soups/winter-melon-soup.jpg",
                category: "soups",
                desc: "清淡鲜美，营养丰富",
                options: {
                    size: [
                        { name: "小份", price: 0 },
                        { name: "大份", price: 8 }
                    ]
                },
                available: true,
                featured: false
            },
            {
                title: "紫菜蛋花汤",
                price: 14,
                image01: "/images/soups/seaweed-egg-soup.jpg",
                category: "soups",
                desc: "清香淡雅，简单美味",
                options: {},
                available: true,
                featured: false
            },
            {
                title: "柠檬蜂蜜茶",
                price: 18,
                image01: "/images/beverages/lemon-honey-tea.jpg",
                category: "beverages",
                desc: "清香甘甜，生津止渴",
                options: {
                    temperature: [
                        { name: "热饮", price: 0 },
                        { name: "温饮", price: 0 },
                        { name: "冰饮", price: 0 }
                    ],
                    sweetness: [
                        { name: "正常甜", price: 0 },
                        { name: "少糖", price: 0 },
                        { name: "无糖", price: 0 }
                    ]
                },
                available: true,
                featured: true
            },
            {
                title: "鲜榨橙汁",
                price: 22,
                image01: "/images/beverages/orange-juice.jpg",
                category: "beverages",
                desc: "新鲜橙子现榨，维C丰富",
                options: {
                    ice: [
                        { name: "正常冰", price: 0 },
                        { name: "少冰", price: 0 },
                        { name: "去冰", price: 0 }
                    ]
                },
                available: true,
                featured: false
            },
            {
                title: "乌龙茶",
                price: 15,
                image01: "/images/beverages/oolong-tea.jpg",
                category: "beverages",
                desc: "传统中式茶饮，清香回甘",
                options: {
                    temperature: [
                        { name: "热茶", price: 0 },
                        { name: "温茶", price: 0 },
                        { name: "冰茶", price: 0 }
                    ]
                },
                available: true,
                featured: false
            },
            {
                title: "红豆沙",
                price: 16,
                image01: "/images/desserts/red-bean-paste.jpg",
                category: "desserts",
                desc: "传统甜品，香甜可口",
                options: {
                    temperature: [
                        { name: "热食", price: 0 },
                        { name: "冰食", price: 0 }
                    ]
                },
                available: true,
                featured: false
            },
            {
                title: "芒果布丁",
                price: 20,
                image01: "/images/desserts/mango-pudding.jpg",
                category: "desserts",
                desc: "口感顺滑，果香浓郁",
                options: {},
                available: true,
                featured: true
            },
            {
                title: "绿豆糕",
                price: 18,
                image01: "/images/desserts/mung-bean-cake.jpg",
                category: "desserts",
                desc: "传统糕点，清香淡雅",
                options: {
                    packaging: [
                        { name: "堂食", price: 0 },
                        { name: "打包", price: 2 }
                    ]
                },
                available: true,
                featured: false
            }
        ];

        // 批量导入菜品数据
        await menuService.importDishes(initialDishes);

        console.log('数据库初始化完成！');
        return {
            success: true,
            message: `成功导入 ${initialDishes.length} 道菜品`,
            count: initialDishes.length
        };

    } catch (error) {
        console.error('数据库初始化失败:', error);
        return {
            success: false,
            message: `初始化失败: ${error.message}`,
            error
        };
    }
};

// 清理数据库数据（开发用）
export const clearDatabase = async () => {
    try {
        console.log('开始清理数据库...');

        const dishes = await menuService.getAllDishes();

        if (dishes.length === 0) {
            return { success: true, message: '数据库已为空' };
        }

        // 批量删除所有菜品
        const deleteOperations = dishes.map(dish => ({
            type: 'delete',
            collectionPath: 'dishes',
            docId: dish.id
        }));

        await databaseService.batchWrite(deleteOperations);

        console.log('数据库清理完成！');
        return {
            success: true,
            message: `成功删除 ${dishes.length} 道菜品`,
            count: dishes.length
        };

    } catch (error) {
        console.error('数据库清理失败:', error);
        return {
            success: false,
            message: `清理失败: ${error.message}`,
            error
        };
    }
};

// 重置数据库（清理 + 初始化）
export const resetDatabase = async () => {
    try {
        console.log('开始重置数据库...');

        // 先清理
        const clearResult = await clearDatabase();
        if (!clearResult.success) {
            return clearResult;
        }

        // 再初始化
        const initResult = await initializeDatabase();
        return initResult;

    } catch (error) {
        console.error('数据库重置失败:', error);
        return {
            success: false,
            message: `重置失败: ${error.message}`,
            error
        };
    }
};

export default {
    initializeDatabase,
    clearDatabase,
    resetDatabase
};