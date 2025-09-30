// 简单的Firebase连接测试脚本
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, get } from 'firebase/database';

// Firebase配置
const firebaseConfig = {
    apiKey: "AIzaSyA_NlCWWWULhzonlPd2CRX0vazmippuhfs",
    authDomain: "cislink.firebaseapp.com",
    projectId: "cislink",
    storageBucket: "cislink.firebasestorage.app",
    messagingSenderId: "123456789",
    appId: "1:295505146634:web:748a4c465419a976f7c0f3",
    measurementId: "G-VETRLBZ1YZ",
    databaseURL: "https://cislink-default-rtdb.europe-west1.firebasedatabase.app"
};

// 初始化Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// 示例菜单数据
const sampleMenuData = {
    dishes: {
        "dish001": {
            title: "宫保鸡丁",
            price: 24.00,
            category: "main-dishes",
            desc: "经典川菜，鸡肉丁配花生米，香辣可口",
            image01: "/images/gongbao-chicken.jpg",
            featured: true,
            spicyLevel: 2,
            available: true,
            options: {
                spiciness: ["不辣", "微辣", "中辣", "特辣"],
                size: ["小份", "标准", "大份"],
                extras: ["加米饭", "加面条"]
            },
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        "dish002": {
            title: "红烧肉",
            price: 32.00,
            category: "main-dishes",
            desc: "肥瘦相间的五花肉，红亮甜糯",
            image01: "/images/hongshao-pork.jpg",
            featured: true,
            spicyLevel: 0,
            available: true,
            options: {
                size: ["小份", "标准", "大份"],
                extras: ["加米饭", "加馒头"]
            },
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        "dish003": {
            title: "麻婆豆腐",
            price: 18.00,
            category: "main-dishes",
            desc: "嫩滑豆腐配麻辣肉末，下饭神器",
            image01: "/images/mapo-tofu.jpg",
            featured: false,
            spicyLevel: 3,
            available: true,
            options: {
                spiciness: ["微辣", "中辣", "特辣"],
                size: ["小份", "标准", "大份"]
            },
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        "dish004": {
            title: "春卷",
            price: 12.00,
            category: "appetizers",
            desc: "酥脆外皮包裹新鲜蔬菜丝",
            image01: "/images/spring-rolls.jpg",
            featured: false,
            spicyLevel: 0,
            available: true,
            options: {
                quantity: ["3个", "6个", "9个"],
                dipping: ["甜酸酱", "辣椒酱", "蒜蓉酱"]
            },
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        "dish005": {
            title: "饺子",
            price: 16.00,
            category: "appetizers",
            desc: "手工包制，皮薄馅大",
            image01: "/images/dumplings.jpg",
            featured: true,
            spicyLevel: 0,
            available: true,
            options: {
                filling: ["猪肉韭菜", "牛肉大葱", "三鲜"],
                cooking: ["水煮", "煎饺", "蒸饺"],
                quantity: ["6个", "12个", "18个"]
            },
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        "dish006": {
            title: "冬瓜排骨汤",
            price: 20.00,
            category: "soups",
            desc: "清香鲜美，营养丰富",
            image01: "/images/wintermelon-soup.jpg",
            featured: false,
            spicyLevel: 0,
            available: true,
            options: {
                size: ["小份", "标准", "大份"]
            },
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        "dish007": {
            title: "茉莉花茶",
            price: 8.00,
            category: "beverages",
            desc: "清香怡人的茉莉花茶",
            image01: "/images/jasmine-tea.jpg",
            featured: false,
            spicyLevel: 0,
            available: true,
            options: {
                temperature: ["热饮", "冰饮"],
                sweetness: ["无糖", "少糖", "正常"]
            },
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        "dish008": {
            title: "红豆沙",
            price: 10.00,
            category: "desserts",
            desc: "香甜软糯的红豆沙甜品",
            image01: "/images/red-bean-dessert.jpg",
            featured: false,
            spicyLevel: 0,
            available: true,
            options: {
                temperature: ["热", "冰"],
                sweetness: ["少糖", "正常", "加糖"]
            },
            createdAt: Date.now(),
            updatedAt: Date.now()
        }
    },
    categories: {
        "main-dishes": {
            name: "主食",
            icon: "ri-bowl-line",
            order: 1,
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        "appetizers": {
            name: "开胃菜",
            icon: "ri-restaurant-line",
            order: 2,
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        "soups": {
            name: "汤类",
            icon: "ri-cup-line",
            order: 3,
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        "beverages": {
            name: "饮品",
            icon: "ri-cup-2-line",
            order: 4,
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        "desserts": {
            name: "甜品",
            icon: "ri-cake-line",
            order: 5,
            createdAt: Date.now(),
            updatedAt: Date.now()
        }
    }
};

// 初始化数据库的函数
export async function initializeDatabase() {
    try {
        const menuPath = "Develop/menukaart";

        console.log('开始初始化数据库...');

        // 写入菜品数据
        await set(ref(database, `${menuPath}/dishes`), sampleMenuData.dishes);
        console.log('菜品数据写入成功');

        // 写入分类数据
        await set(ref(database, `${menuPath}/categories`), sampleMenuData.categories);
        console.log('分类数据写入成功');

        console.log('数据库初始化完成!');

        // 验证数据是否写入成功
        const dishesSnapshot = await get(ref(database, `${menuPath}/dishes`));
        const categoriesSnapshot = await get(ref(database, `${menuPath}/categories`));

        console.log('验证结果:');
        console.log(`菜品数量: ${dishesSnapshot.exists() ? Object.keys(dishesSnapshot.val()).length : 0}`);
        console.log(`分类数量: ${categoriesSnapshot.exists() ? Object.keys(categoriesSnapshot.val()).length : 0}`);

        return true;
    } catch (error) {
        console.error('数据库初始化失败:', error);
        throw error;
    }
}

// 读取数据库的函数
export async function readMenuData() {
    try {
        const menuPath = "Develop/menukaart";

        console.log('读取菜单数据...');

        // 读取菜品数据
        const dishesSnapshot = await get(ref(database, `${menuPath}/dishes`));
        const categoriesSnapshot = await get(ref(database, `${menuPath}/categories`));

        const dishes = dishesSnapshot.exists() ? dishesSnapshot.val() : null;
        const categories = categoriesSnapshot.exists() ? categoriesSnapshot.val() : null;

        console.log('读取成功:');
        console.log('菜品:', dishes);
        console.log('分类:', categories);

        return {
            dishes,
            categories
        };
    } catch (error) {
        console.error('读取数据失败:', error);
        throw error;
    }
}

// 测试连接的函数
export async function testConnection() {
    try {
        console.log('测试Firebase连接...');

        // 写入一个测试值
        const testRef = ref(database, 'Develop/test');
        await set(testRef, {
            message: 'Hello Firebase!',
            timestamp: Date.now()
        });

        // 读取测试值
        const snapshot = await get(testRef);
        if (snapshot.exists()) {
            console.log('连接测试成功:', snapshot.val());
            return true;
        } else {
            console.log('连接测试失败: 无法读取数据');
            return false;
        }
    } catch (error) {
        console.error('连接测试失败:', error);
        return false;
    }
}

// 如果直接运行此脚本
if (typeof window !== 'undefined') {
    // 在浏览器环境中，将函数添加到全局对象
    window.firebaseTest = {
        testConnection,
        initializeDatabase,
        readMenuData
    };

    console.log('Firebase测试工具已加载!');
    console.log('使用方式:');
    console.log('- firebaseTest.testConnection() - 测试连接');
    console.log('- firebaseTest.initializeDatabase() - 初始化数据');
    console.log('- firebaseTest.readMenuData() - 读取数据');
}

export { app, database };