import { ref, onValue, off } from 'firebase/database';
import { database } from '../config/FirebaseConfig';

class ConfigService {
    constructor() {
        this.listeners = new Map();
    }

    /**
     * 获取餐厅配置
     * @param {string} configKey - 配置键名
     * @returns {Promise} - 返回配置值
     */
    async getRestaurantConfig(configKey) {
        return new Promise((resolve, reject) => {
            try {
                const restaurantPath = process.env.REACT_APP_RESTAURANT_PATH;
                if (!restaurantPath) {
                    throw new Error('REACT_APP_RESTAURANT_PATH 环境变量未设置');
                }

                const configPath = `${restaurantPath}/config/${configKey}`;
                const configRef = ref(database, configPath);

                // 使用 onValue 监听器获取数据
                const unsubscribe = onValue(configRef, (snapshot) => {
                    if (snapshot.exists()) {
                        resolve(snapshot.val());
                    } else {
                        console.warn(`配置项 ${configKey} 不存在于路径 ${configPath}`);
                        resolve(null);
                    }

                    // 立即清理监听器
                    unsubscribe();
                }, (error) => {
                    console.error('获取餐厅配置失败:', error);
                    reject(error);
                });

            } catch (error) {
                console.error('ConfigService.getRestaurantConfig 错误:', error);
                reject(error);
            }
        });
    }

    /**
     * 获取标题图片/Logo
     * @returns {Promise<string|null>} - 返回logo URL
     */
    async getTitleImage() {
        try {
            const logoUrl = await this.getRestaurantConfig('titleImage');
            return logoUrl;
        } catch (error) {
            console.error('获取标题图片失败:', error);
            return null;
        }
    }

    /**
     * 获取餐厅名称
     * @returns {Promise<string|null>} - 返回餐厅名称
     */
    async getRestaurantName() {
        try {
            const restName = await this.getRestaurantConfig('restName');
            return restName;
        } catch (error) {
            console.error('获取餐厅名称失败:', error);
            return null;
        }
    }

    /**
     * 监听配置变化
     * @param {string} configKey - 配置键名
     * @param {function} callback - 回调函数
     * @returns {function} - 取消监听的函数
     */
    listenToConfig(configKey, callback) {
        try {
            const restaurantPath = process.env.REACT_APP_RESTAURANT_PATH;
            if (!restaurantPath) {
                throw new Error('REACT_APP_RESTAURANT_PATH 环境变量未设置');
            }

            const configPath = `${restaurantPath}/config/${configKey}`;
            const configRef = ref(database, configPath);

            const unsubscribe = onValue(configRef, (snapshot) => {
                if (snapshot.exists()) {
                    callback(snapshot.val());
                } else {
                    console.warn(`配置项 ${configKey} 不存在于路径 ${configPath}`);
                    callback(null);
                }
            }, (error) => {
                console.error('监听配置变化失败:', error);
                callback(null);
            });

            // 存储监听器引用
            this.listeners.set(configKey, unsubscribe);

            // 返回取消监听的函数
            return () => {
                if (this.listeners.has(configKey)) {
                    off(configRef, 'value', this.listeners.get(configKey));
                    this.listeners.delete(configKey);
                }
            };

        } catch (error) {
            console.error('ConfigService.listenToConfig 错误:', error);
            return () => { }; // 返回空函数避免错误
        }
    }

    /**
     * 清理所有监听器
     */
    cleanup() {
        this.listeners.forEach((unsubscribe, configKey) => {
            try {
                const restaurantPath = process.env.REACT_APP_RESTAURANT_PATH;
                const configPath = `${restaurantPath}/config/${configKey}`;
                const configRef = ref(database, configPath);
                off(configRef, 'value', unsubscribe);
            } catch (error) {
                console.error('清理监听器失败:', error);
            }
        });
        this.listeners.clear();
    }
}

// 导出单例实例
export const configService = new ConfigService();
export default configService;