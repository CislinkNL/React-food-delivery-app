import { databaseService } from './DatabaseService';
import { DatabasePaths } from '../config/FirebaseConfig';

// 访问控制服务
class AccessControlService {
    constructor() {
        this.serverAccessPath = DatabasePaths.serverAccessPath;
        this.serverAccessKey = DatabasePaths.serverAccessKey;
        this.isAccessInitialized = false;
    }

    // 初始化服务器访问权限
    async initializeServerAccess() {
        try {
            if (this.isAccessInitialized) {
                return true;
            }

            console.log('正在设置服务器访问权限...');

            // 设置服务器访问密钥
            await databaseService.write(this.serverAccessPath, this.serverAccessKey);

            this.isAccessInitialized = true;
            console.log('服务器访问权限设置成功');

            return true;
        } catch (error) {
            console.error('设置服务器访问权限失败:', error);
            return false;
        }
    }

    // 验证服务器访问权限
    async verifyServerAccess() {
        try {
            const currentAccessKey = await databaseService.read(this.serverAccessPath);
            return currentAccessKey === this.serverAccessKey;
        } catch (error) {
            console.error('验证服务器访问权限失败:', error);
            return false;
        }
    }

    // 确保访问权限已设置
    async ensureAccess() {
        try {
            const hasAccess = await this.verifyServerAccess();

            if (!hasAccess) {
                return await this.initializeServerAccess();
            }

            return true;
        } catch (error) {
            console.error('确保访问权限失败:', error);
            return false;
        }
    }

    // 获取访问状态信息
    async getAccessStatus() {
        try {
            const currentKey = await databaseService.read(this.serverAccessPath);
            const isValid = currentKey === this.serverAccessKey;

            return {
                hasAccess: isValid,
                currentKey,
                expectedKey: this.serverAccessKey,
                path: this.serverAccessPath
            };
        } catch (error) {
            console.error('获取访问状态失败:', error);
            return {
                hasAccess: false,
                error: error.message
            };
        }
    }
}

// 创建单例实例
export const accessControlService = new AccessControlService();
export default AccessControlService;