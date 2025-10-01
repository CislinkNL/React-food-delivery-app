import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set } from 'firebase/database';

// Firebase配置
const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

// 初始化Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

/**
 * 设置餐厅配置
 */
async function setupRestaurantConfig() {
    try {
        const restaurantPath = process.env.REACT_APP_RESTAURANT_PATH || 'Develop';

        // 示例logo URL（你可以替换为实际的logo URL）
        const sampleLogoUrl = 'https://via.placeholder.com/150x60/df2020/ffffff?text=LOGO';

        // 设置标题图片/logo配置
        const titleImageRef = ref(database, `${restaurantPath}/config/titleImage`);
        await set(titleImageRef, sampleLogoUrl);

        console.log('✅ 餐厅配置设置成功!');
        console.log(`📍 路径: ${restaurantPath}/config/titleImage`);
        console.log(`🖼️ Logo URL: ${sampleLogoUrl}`);

        // 设置其他可能的配置项
        const configs = {
            restaurantName: 'Tasty Treat',
            primaryColor: '#df2020',
            secondaryColor: '#ff4757',
            contactPhone: '+31-123-456-789',
            contactEmail: 'info@tastytreat.nl',
            address: 'Amsterdam, Netherlands'
        };

        for (const [key, value] of Object.entries(configs)) {
            const configRef = ref(database, `${restaurantPath}/config/${key}`);
            await set(configRef, value);
            console.log(`✅ 配置 ${key}: ${value}`);
        }

        console.log('\n🎉 所有配置设置完成！');
        console.log('现在可以在应用中测试动态logo功能了。');

    } catch (error) {
        console.error('❌ 设置配置失败:', error);
    }
}

// 如果直接运行此脚本
if (import.meta.url === `file://${process.argv[1]}`) {
    setupRestaurantConfig();
}

export { setupRestaurantConfig };