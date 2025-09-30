// 分类数据调试工具
import { categoryService } from '../services/CategoryService';
import { databaseService } from '../services/DatabaseService';

class CategoryDebugger {
    constructor() {
        this.logPrefix = '[CategoryDebugger]';
    }

    // 测试数据库连接
    async testDatabaseConnection() {
        console.log(`${this.logPrefix} 测试数据库连接...`);

        try {
            // 测试基本的数据库读取
            const testData = await databaseService.read('Develop');
            console.log(`${this.logPrefix} 数据库连接成功，Develop节点数据:`, testData);
            return true;
        } catch (error) {
            console.error(`${this.logPrefix} 数据库连接失败:`, error);
            return false;
        }
    }

    // 测试分类路径
    async testCategoryPaths() {
        console.log(`${this.logPrefix} 测试分类路径...`);

        const paths = {
            categories: 'Develop/categorie',
            food: 'Develop/categorie/food',
            drinks: 'Develop/categorie/drinks'
        };

        const results = {};

        for (const [name, path] of Object.entries(paths)) {
            try {
                const data = await databaseService.read(path);
                console.log(`${this.logPrefix} 路径 ${path}:`, data);
                results[name] = {
                    success: true,
                    data: data,
                    count: Array.isArray(data) ? data.length : (data ? Object.keys(data).length : 0)
                };
            } catch (error) {
                console.error(`${this.logPrefix} 路径 ${path} 失败:`, error);
                results[name] = {
                    success: false,
                    error: error.message
                };
            }
        }

        return results;
    }

    // 测试分类服务
    async testCategoryService() {
        console.log(`${this.logPrefix} 测试分类服务...`);

        try {
            // 测试食物分类
            console.log(`${this.logPrefix} 获取食物分类...`);
            const foodCategories = await categoryService.getFoodCategories();
            console.log(`${this.logPrefix} 食物分类结果:`, foodCategories);

            // 测试饮品分类
            console.log(`${this.logPrefix} 获取饮品分类...`);
            const drinksCategories = await categoryService.getDrinksCategories();
            console.log(`${this.logPrefix} 饮品分类结果:`, drinksCategories);

            // 测试组合分类
            console.log(`${this.logPrefix} 获取组合分类...`);
            const combinedCategories = await categoryService.getCombinedCategories();
            console.log(`${this.logPrefix} 组合分类结果:`, combinedCategories);

            return {
                food: foodCategories,
                drinks: drinksCategories,
                combined: combinedCategories
            };
        } catch (error) {
            console.error(`${this.logPrefix} 分类服务测试失败:`, error);
            return null;
        }
    }

    // 完整的诊断测试
    async runFullDiagnostics() {
        console.log(`${this.logPrefix} 开始完整诊断...`);

        const diagnostics = {
            timestamp: new Date().toISOString(),
            database: await this.testDatabaseConnection(),
            paths: await this.testCategoryPaths(),
            service: await this.testCategoryService()
        };

        console.log(`${this.logPrefix} 诊断完成:`, diagnostics);
        return diagnostics;
    }

    // 显示诊断结果摘要
    showDiagnosticsSummary(diagnostics) {
        console.log(`${this.logPrefix} === 诊断结果摘要 ===`);
        console.log(`数据库连接: ${diagnostics.database ? '✅ 成功' : '❌ 失败'}`);

        if (diagnostics.paths) {
            console.log(`分类路径测试:`);
            console.log(`  - 根路径: ${diagnostics.paths.categories?.success ? '✅' : '❌'} (${diagnostics.paths.categories?.count || 0} 项)`);
            console.log(`  - 食物路径: ${diagnostics.paths.food?.success ? '✅' : '❌'} (${diagnostics.paths.food?.count || 0} 项)`);
            console.log(`  - 饮品路径: ${diagnostics.paths.drinks?.success ? '✅' : '❌'} (${diagnostics.paths.drinks?.count || 0} 项)`);
        }

        if (diagnostics.service) {
            console.log(`分类服务测试:`);
            console.log(`  - 食物分类: ${diagnostics.service.food?.length || 0} 项`);
            console.log(`  - 饮品分类: ${diagnostics.service.drinks?.length || 0} 项`);
            console.log(`  - 组合分类: ${diagnostics.service.combined?.length || 0} 项`);
        }
    }
}

// 创建全局调试器实例
export const categoryDebugger = new CategoryDebugger();

// 添加到全局window对象以便在浏览器控制台中使用
if (typeof window !== 'undefined') {
    window.categoryDebugger = categoryDebugger;
}

export default CategoryDebugger;