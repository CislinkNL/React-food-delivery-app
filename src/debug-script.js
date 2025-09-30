// 简单的分类数据测试脚本
// 在浏览器控制台中运行这些命令来调试

// 测试1: 基本数据库连接
console.log('=== 测试 1: 基本数据库连接 ===');
import { databaseService } from './services/DatabaseService';

// 测试根路径
databaseService.read('Develop').then(data => {
    console.log('Develop 节点数据:', data);
}).catch(err => {
    console.error('Develop 节点读取失败:', err);
});

// 测试2: 分类路径
console.log('=== 测试 2: 分类路径 ===');

// 测试分类根路径
databaseService.read('Develop/categorie').then(data => {
    console.log('Develop/categorie 数据:', data);
}).catch(err => {
    console.error('Develop/categorie 读取失败:', err);
});

// 测试食物分类路径
databaseService.read('Develop/categorie/food').then(data => {
    console.log('食物分类数据:', data);
    if (data) {
        console.log('食物分类类型:', typeof data);
        console.log('是否为数组:', Array.isArray(data));
        if (Array.isArray(data)) {
            console.log('数组长度:', data.length);
            console.log('第一个元素:', data[0]);
        } else {
            console.log('对象键:', Object.keys(data));
        }
    }
}).catch(err => {
    console.error('食物分类读取失败:', err);
});

// 测试饮品分类路径
databaseService.read('Develop/categorie/drinks').then(data => {
    console.log('饮品分类数据:', data);
    if (data) {
        console.log('饮品分类类型:', typeof data);
        console.log('是否为数组:', Array.isArray(data));
        if (Array.isArray(data)) {
            console.log('数组长度:', data.length);
            console.log('第一个元素:', data[0]);
        } else {
            console.log('对象键:', Object.keys(data));
        }
    }
}).catch(err => {
    console.error('饮品分类读取失败:', err);
});

// 测试3: 分类服务
console.log('=== 测试 3: 分类服务 ===');
import { categoryService } from './services/CategoryService';

// 测试食物分类服务
categoryService.getFoodCategories().then(data => {
    console.log('分类服务 - 食物分类:', data);
}).catch(err => {
    console.error('分类服务 - 食物分类失败:', err);
});

// 测试饮品分类服务
categoryService.getDrinksCategories().then(data => {
    console.log('分类服务 - 饮品分类:', data);
}).catch(err => {
    console.error('分类服务 - 饮品分类失败:', err);
});

// 测试组合分类服务
categoryService.getCombinedCategories().then(data => {
    console.log('分类服务 - 组合分类:', data);
}).catch(err => {
    console.error('分类服务 - 组合分类失败:', err);
});