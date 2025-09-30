import { initializeApp } from 'firebase/app';
import { getDatabase, connectDatabaseEmulator } from 'firebase/database';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getStorage, connectStorageEmulator } from 'firebase/storage';

// Firebase 配置对象
const FirebaseConfig = {
    // 开发环境配置
    development: {
        apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "your-dev-api-key",
        authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "your-project-dev.firebaseapp.com",
        projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "your-project-dev",
        storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "your-project-dev.appspot.com",
        messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "123456789",
        appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:123456789:web:abcdef",
        measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || "G-XXXXXXXXXX",
        databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL || "https://your-project-dev.firebaseio.com"
    },

    // 生产环境配置
    production: {
        apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
        authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
        storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.REACT_APP_FIREBASE_APP_ID,
        measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
        databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL
    },

    // 获取当前环境的Firebase配置
    getCurrentConfig() {
        const env = process.env.REACT_APP_ENVIRONMENT || process.env.NODE_ENV || 'development';
        return this[env] || this.development;
    }
};

// 数据库路径配置
export const DatabasePaths = {
    // 餐厅路径配置 
    restaurantPath: process.env.REACT_APP_RESTAURANT_PATH || 'Develop',
    menuPath: process.env.REACT_APP_MENU_PATH || 'Develop/menukaart',
    takeAwayPath: process.env.REACT_APP_TAKEAWAY_PATH || 'Develop/takeAway',

    // 服务器访问控制路径 (基于数据库规则)
    serverAccessPath: 'AsianBoulevard/server_access',
    serverAccessKey: process.env.REACT_APP_SERVER_ACCESS_KEY || 'Time9changeit',

    // 菜单相关路径 (从你的Firebase截图中可以看到数据在这里)
    menu: {
        dishes: process.env.REACT_APP_MENU_PATH || 'Develop/menukaart', // 直接指向menukaart，因为菜品数据就在这个节点下
        categories: process.env.REACT_APP_MENU_PATH ? `${process.env.REACT_APP_MENU_PATH}/categories` : 'Develop/menukaart/categories',
        options: process.env.REACT_APP_MENU_PATH ? `${process.env.REACT_APP_MENU_PATH}/options` : 'Develop/menukaart/options',
        keuzeMenus: process.env.REACT_APP_KEUZE_MENUS_PATH || 'Develop/keuzeMenus' // 添加 keuzeMenus 路径
    },

    // 分类相关路径 (动态分类加载)
    categories: {
        root: process.env.REACT_APP_CATEGORIES_PATH || 'Develop/categorie',
        food: process.env.REACT_APP_FOOD_CATEGORY_PATH || 'Develop/categorie/food',
        drinks: process.env.REACT_APP_DRINKS_CATEGORY_PATH || 'Develop/categorie/drinks'
    },

    // 外卖订单相关路径 (分离的takeAway路径)
    takeAway: {
        orders: process.env.REACT_APP_TAKEAWAY_PATH ? `${process.env.REACT_APP_TAKEAWAY_PATH}/orders` : 'Develop/takeAway/orders',
        orderDetails: process.env.REACT_APP_TAKEAWAY_PATH ? `${process.env.REACT_APP_TAKEAWAY_PATH}/orders` : 'Develop/takeAway/orders', // 订单详情和订单在同一路径
        customers: process.env.REACT_APP_TAKEAWAY_PATH ? `${process.env.REACT_APP_TAKEAWAY_PATH}/customers` : 'Develop/takeAway/customers',
        activeOrders: process.env.REACT_APP_TAKEAWAY_PATH ? `${process.env.REACT_APP_TAKEAWAY_PATH}/orders` : 'Develop/takeAway/orders', // 实时活跃订单
        // orderHistory: 'firestore', // 未来将存储在Firestore中，现在标记为注释
    },

    // 订单相关路径 (保持向后兼容，指向takeAway路径)
    orders: {
        orders: process.env.REACT_APP_TAKEAWAY_PATH ? `${process.env.REACT_APP_TAKEAWAY_PATH}/orders` : 'Develop/takeAway/orders',
        orderItems: process.env.REACT_APP_TAKEAWAY_PATH ? `${process.env.REACT_APP_TAKEAWAY_PATH}/orders` : 'Develop/takeAway/orders' // orderItems包含在orders中
    },    // 用户相关路径
    users: {
        profiles: 'users/profiles',
        preferences: 'users/preferences'
    }
};

// 初始化Firebase应用
const firebaseConfig = FirebaseConfig.getCurrentConfig();
const app = initializeApp(firebaseConfig);

// 初始化Firebase服务
export const database = getDatabase(app);  // Realtime Database
export const db = getFirestore(app);       // Firestore (保留兼容性)
export const auth = getAuth(app);
export const storage = getStorage(app);

// 开发环境模拟器连接（可选）
if (process.env.NODE_ENV === 'development' && process.env.REACT_APP_USE_EMULATOR === 'true') {
    // 连接到Realtime Database模拟器
    if (process.env.REACT_APP_DATABASE_EMULATOR_PORT) {
        connectDatabaseEmulator(database, 'localhost', parseInt(process.env.REACT_APP_DATABASE_EMULATOR_PORT));
    }

    // 连接到Firestore模拟器
    if (process.env.REACT_APP_FIRESTORE_EMULATOR_PORT && !db._delegate._settings) {
        connectFirestoreEmulator(db, 'localhost', parseInt(process.env.REACT_APP_FIRESTORE_EMULATOR_PORT));
    }

    // 连接到Auth模拟器
    if (process.env.REACT_APP_AUTH_EMULATOR_PORT && !auth._delegate._config) {
        connectAuthEmulator(auth, `http://localhost:${process.env.REACT_APP_AUTH_EMULATOR_PORT}`);
    }

    // 连接到Storage模拟器
    if (process.env.REACT_APP_STORAGE_EMULATOR_PORT && !storage._delegate._config) {
        connectStorageEmulator(storage, 'localhost', parseInt(process.env.REACT_APP_STORAGE_EMULATOR_PORT));
    }
}

// 数据库操作配置
export const DatabaseConfig = {
    // 实时监听配置
    realtime: {
        enabled: process.env.REACT_APP_ENABLE_REALTIME !== 'false',
        maxRetries: 3,
        retryDelay: 1000
    },

    // 缓存配置
    cache: {
        enabled: process.env.REACT_APP_ENABLE_CACHE !== 'false',
        maxAge: parseInt(process.env.REACT_APP_CACHE_EXPIRY) || 30, // 分钟
        maxEntries: parseInt(process.env.REACT_APP_MAX_CACHE_ENTRIES) || 100
    },

    // 错误处理配置
    errorHandling: {
        retryAttempts: 3,
        retryDelay: 1000,
        enableFallback: process.env.REACT_APP_ENABLE_OFFLINE !== 'false'
    }
};

// 默认导出
export default FirebaseConfig;