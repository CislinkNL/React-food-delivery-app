// 在浏览器控制台中运行这个脚本来快速修复菜品 ID 1 的 keuzeMenus
// 复制并粘贴到浏览器控制台中执行

// 假设您已经有 databaseService 可用
async function quickFixItem1() {
    try {
        console.log('🔧 开始修复菜品 ID 1...');

        // 获取当前数据
        const item = await databaseService.getData('items/1');
        console.log('当前菜品数据:', item);

        // 修复 keuzeMenus 格式
        const fixedKeuzeMenus = ['pittigheid_basic', 'extra_ingredienten'];

        await databaseService.updateData('items/1', {
            keuzeMenus: fixedKeuzeMenus
        });

        console.log('✅ 菜品 ID 1 修复完成！');
        console.log('新的 keuzeMenus:', fixedKeuzeMenus);

        // 验证修复结果
        const updatedItem = await databaseService.getData('items/1');
        console.log('修复后的菜品数据:', updatedItem);

        return true;
    } catch (error) {
        console.error('❌ 修复失败:', error);
        return false;
    }
}

// 执行修复
quickFixItem1().then(success => {
    if (success) {
        console.log('🎉 修复成功！现在刷新页面并尝试点击菜品的添加按钮。');
    }
});