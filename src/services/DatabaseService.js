import {
    ref,
    get,
    set,
    update,
    remove,
    push,
    onValue,
    off,
    query,
    orderByChild,
    orderByKey,
    orderByValue,
    equalTo,
    startAt,
    endAt,
    limitToFirst,
    limitToLast
} from 'firebase/database';

import { database, DatabasePaths, DatabaseConfig } from '../config/FirebaseConfig';

// Realtime Database 服务类
class DatabaseService {
    constructor() {
        this.cache = new Map();
        this.listeners = new Map();
        this.config = DatabaseConfig;
    }

    // 通用错误处理
    handleError(error, operation) {
        console.error(`Database ${operation} error:`, error);
        if (process.env.REACT_APP_DEBUG_MODE === 'true') {
            console.error('Error details:', error);
        }
        throw error;
    }

    // 生成缓存键
    generateCacheKey(path, queryParams = {}) {
        return `${path}_${JSON.stringify(queryParams)}`;
    }

    // 检查缓存
    getFromCache(cacheKey) {
        if (!this.config.cache.enabled) return null;

        const cached = this.cache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < this.config.cache.maxAge * 60 * 1000) {
            return cached.data;
        }
        return null;
    }

    // 设置缓存
    setCache(cacheKey, data) {
        if (!this.config.cache.enabled) return;

        // 检查缓存大小限制
        if (this.cache.size >= this.config.cache.maxEntries) {
            // 删除最旧的缓存项
            const firstKey = this.cache.keys().next().value;
            this.cache.delete(firstKey);
        }

        this.cache.set(cacheKey, {
            data,
            timestamp: Date.now()
        });
    }

    // 清除缓存
    clearCache(pattern = null) {
        if (pattern) {
            // 清除匹配模式的缓存
            for (const key of this.cache.keys()) {
                if (key.includes(pattern)) {
                    this.cache.delete(key);
                }
            }
        } else {
            // 清除所有缓存
            this.cache.clear();
        }
    }

    // 读取数据
    async read(path, useCache = true) {
        try {
            const cacheKey = this.generateCacheKey(path);

            // 检查缓存
            if (useCache) {
                const cached = this.getFromCache(cacheKey);
                if (cached) {
                    return cached;
                }
            }

            const dbRef = ref(database, path);
            const snapshot = await get(dbRef);

            if (snapshot.exists()) {
                const data = snapshot.val();
                this.setCache(cacheKey, data);
                return data;
            } else {
                return null;
            }
        } catch (error) {
            this.handleError(error, 'read');
        }
    }

    // 写入数据
    async write(path, data) {
        try {
            const dbRef = ref(database, path);
            await set(dbRef, data);

            // 清除相关缓存
            this.clearCache(path);

            return true;
        } catch (error) {
            this.handleError(error, 'write');
        }
    }

    // 更新数据
    async updateData(path, updates) {
        try {
            const dbRef = ref(database, path);
            await update(dbRef, updates);

            // 清除相关缓存
            this.clearCache(path);

            return true;
        } catch (error) {
            this.handleError(error, 'update');
        }
    }

    // 删除数据
    async delete(path) {
        try {
            const dbRef = ref(database, path);
            await remove(dbRef);

            // 清除相关缓存
            this.clearCache(path);

            return true;
        } catch (error) {
            this.handleError(error, 'delete');
        }
    }

    // 推送新数据（生成唯一键）
    async push(path, data) {
        try {
            const dbRef = ref(database, path);
            const newRef = await push(dbRef, data);

            // 清除相关缓存
            this.clearCache(path);

            return newRef.key;
        } catch (error) {
            this.handleError(error, 'push');
        }
    }

    // 查询数据
    async query(path, queryParams = {}) {
        try {
            const cacheKey = this.generateCacheKey(path, queryParams);

            // 检查缓存
            const cached = this.getFromCache(cacheKey);
            if (cached) {
                return cached;
            }

            let dbRef = ref(database, path);
            let dbQuery = dbRef;

            // 应用查询参数
            if (queryParams.orderBy) {
                switch (queryParams.orderBy.type) {
                    case 'child':
                        dbQuery = query(dbQuery, orderByChild(queryParams.orderBy.key));
                        break;
                    case 'key':
                        dbQuery = query(dbQuery, orderByKey());
                        break;
                    case 'value':
                        dbQuery = query(dbQuery, orderByValue());
                        break;
                }
            }

            if (queryParams.equalTo !== undefined) {
                dbQuery = query(dbQuery, equalTo(queryParams.equalTo));
            }

            if (queryParams.startAt !== undefined) {
                dbQuery = query(dbQuery, startAt(queryParams.startAt));
            }

            if (queryParams.endAt !== undefined) {
                dbQuery = query(dbQuery, endAt(queryParams.endAt));
            }

            if (queryParams.limitToFirst) {
                dbQuery = query(dbQuery, limitToFirst(queryParams.limitToFirst));
            }

            if (queryParams.limitToLast) {
                dbQuery = query(dbQuery, limitToLast(queryParams.limitToLast));
            }

            const snapshot = await get(dbQuery);
            let data = null;

            if (snapshot.exists()) {
                data = snapshot.val();

                // 如果数据是对象，转换为数组
                if (typeof data === 'object' && !Array.isArray(data)) {
                    data = Object.keys(data).map(key => ({
                        id: key,
                        ...data[key]
                    }));
                }
            } else {
                data = [];
            }

            this.setCache(cacheKey, data);
            return data;
        } catch (error) {
            this.handleError(error, 'query');
        }
    }

    // 实时监听
    subscribeToPath(path, callback, queryParams = {}) {
        try {
            const listenerId = `${path}_${Date.now()}_${Math.random()}`;

            let dbRef = ref(database, path);
            let dbQuery = dbRef;

            // 应用查询参数
            if (queryParams.orderBy) {
                switch (queryParams.orderBy.type) {
                    case 'child':
                        dbQuery = query(dbQuery, orderByChild(queryParams.orderBy.key));
                        break;
                    case 'key':
                        dbQuery = query(dbQuery, orderByKey());
                        break;
                    case 'value':
                        dbQuery = query(dbQuery, orderByValue());
                        break;
                }
            }

            const unsubscribe = onValue(dbQuery, (snapshot) => {
                try {
                    let data = null;

                    if (snapshot.exists()) {
                        data = snapshot.val();

                        // 如果数据是对象，转换为数组
                        if (typeof data === 'object' && !Array.isArray(data)) {
                            data = Object.keys(data).map(key => ({
                                id: key,
                                ...data[key]
                            }));
                        }
                    } else {
                        data = [];
                    }

                    // 更新缓存
                    const cacheKey = this.generateCacheKey(path, queryParams);
                    this.setCache(cacheKey, data);

                    callback(data);
                } catch (error) {
                    console.error('Real-time listener callback error:', error);
                    callback(null, error);
                }
            }, (error) => {
                console.error('Real-time listener error:', error);
                callback(null, error);
            });

            // 保存监听器
            this.listeners.set(listenerId, {
                unsubscribe,
                path,
                queryParams
            });

            return listenerId;
        } catch (error) {
            this.handleError(error, 'subscribe');
        }
    }

    // 取消监听
    unsubscribeFromPath(listenerId) {
        try {
            const listener = this.listeners.get(listenerId);
            if (listener) {
                listener.unsubscribe();
                this.listeners.delete(listenerId);
                return true;
            }
            return false;
        } catch (error) {
            this.handleError(error, 'unsubscribe');
        }
    }

    // 取消所有监听
    unsubscribeAll() {
        try {
            for (const [listenerId, listener] of this.listeners) {
                listener.unsubscribe();
            }
            this.listeners.clear();
        } catch (error) {
            this.handleError(error, 'unsubscribeAll');
        }
    }

    // 批量操作（Realtime Database不支持真正的批量操作，模拟实现）
    async batchWrite(operations) {
        try {
            const promises = operations.map(async (op) => {
                switch (op.type) {
                    case 'set':
                        return this.write(op.path, op.data);
                    case 'update':
                        return this.updateData(op.path, op.data);
                    case 'delete':
                        return this.delete(op.path);
                    default:
                        throw new Error(`Unsupported batch operation: ${op.type}`);
                }
            });

            await Promise.all(promises);
            return true;
        } catch (error) {
            this.handleError(error, 'batchWrite');
        }
    }

    // 检查连接状态
    checkConnection() {
        return new Promise((resolve) => {
            const connectedRef = ref(database, '.info/connected');
            onValue(connectedRef, (snapshot) => {
                resolve(snapshot.val() === true);
            }, { onlyOnce: true });
        });
    }

    // 获取服务器时间戳
    getServerTimestamp() {
        return Date.now(); // Realtime Database使用客户端时间戳
    }
}

// 创建并导出单例实例
export const databaseService = new DatabaseService();
export default databaseService;