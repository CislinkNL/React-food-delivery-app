// 应用主配置文件
export const AppConfig = {
    // 应用基本信息
    app: {
        name: "中华美食外卖",
        version: "1.0.0",
        description: "专业的中式餐厅外卖平台",
        author: "Restaurant Team"
    },

    // 环境配置
    environment: {
        development: {
            apiUrl: "http://localhost:3000/api",
            debugMode: true,
            logLevel: "debug"
        },
        production: {
            apiUrl: "https://your-domain.com/api",
            debugMode: false,
            logLevel: "error"
        }
    },

    // 获取当前环境配置
    getCurrentEnvironment() {
        const env = process.env.NODE_ENV || 'development';
        return this.environment[env] || this.environment.development;
    },

    // 餐厅基本信息
    restaurant: {
        name: "中华美食餐厅",
        address: "北京市朝阳区美食街123号",
        phone: "010-8888-9999",
        email: "info@chineserestaurant.com",
        businessHours: {
            weekdays: "11:00 - 22:00",
            weekends: "10:00 - 23:00",
            delivery: "11:00 - 21:30"
        },
        deliveryInfo: {
            minimumOrder: 30,
            deliveryFee: 8,
            estimatedTime: "30-45分钟",
            serviceArea: "5公里内"
        }
    },

    // 菜品分类配置
    categories: {
        "main-dishes": { name: "主食", icon: "ri-bowl-line", order: 1 },
        "appetizers": { name: "开胃菜", icon: "ri-cake-line", order: 2 },
        "soups": { name: "汤类", icon: "ri-drop-line", order: 3 },
        "beverages": { name: "饮料", icon: "ri-cup-line", order: 4 },
        "desserts": { name: "甜品", icon: "ri-heart-line", order: 5 }
    },

    // 选项配置映射
    optionTypes: {
        spiciness: "辣度",
        size: "分量",
        cooking: "烹饪方式",
        tofu: "豆腐类型",
        cut: "切法",
        consistency: "汤的浓度",
        temperature: "温度",
        sweetness: "甜度",
        ice: "冰量",
        packaging: "包装方式"
    },

    // 应用功能开关
    features: {
        enableRealtimeUpdates: true,
        enableOrderTracking: true,
        enableUserReviews: true,
        enableCouponSystem: false,
        enableLoyaltyPoints: false
    },

    // 分页配置
    pagination: {
        itemsPerPage: 8,
        maxPages: 10
    },

    // UI配置
    ui: {
        theme: {
            primaryColor: "#df2020",
            secondaryColor: "#ff4757",
            accentColor: "#2c3e50",
            backgroundColor: "#f8f9fa"
        },
        animations: {
            enabled: true,
            duration: 300
        }
    }
};

export default AppConfig;