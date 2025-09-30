import { databaseService } from '../services/DatabaseService';

/**
 * 修复数据库中 keuzeMenus 字段的格式
 * 将 ["pittigheid_basic,extra_ingredienten"] 转换为 ["pittigheid_basic", "extra_ingredienten"]
 */
export async function fixKeuzeMenusFormat() {
    try {
        console.log('🔧 开始修复 keuzeMenus 格式...');

        // 获取所有菜品
        const allItems = await databaseService.getData('items');

        if (!allItems) {
            console.log('❌ 未找到菜品数据');
            return false;
        }

        const updates = {};
        let fixedCount = 0;

        // 遍历所有菜品
        Object.entries(allItems).forEach(([itemId, item]) => {
            if (item.keuzeMenus && Array.isArray(item.keuzeMenus)) {
                let needsFix = false;
                const fixedKeuzeMenus = [];

                item.keuzeMenus.forEach(keuzeMenu => {
                    if (typeof keuzeMenu === 'string' && keuzeMenu.includes(',')) {
                        // 需要修复：将逗号分隔的字符串拆分为数组
                        const splitMenus = keuzeMenu.split(',').map(s => s.trim());
                        fixedKeuzeMenus.push(...splitMenus);
                        needsFix = true;
                    } else {
                        // 已经是正确格式
                        fixedKeuzeMenus.push(keuzeMenu);
                    }
                });

                if (needsFix) {
                    updates[`items/${itemId}/keuzeMenus`] = fixedKeuzeMenus;
                    fixedCount++;
                    console.log(`🔧 修复菜品 ${itemId}: ${JSON.stringify(item.keuzeMenus)} -> ${JSON.stringify(fixedKeuzeMenus)}`);
                }
            }
        });

        if (Object.keys(updates).length > 0) {
            // 应用修复
            await databaseService.updateData('', updates);
            console.log(`✅ 成功修复 ${fixedCount} 个菜品的 keuzeMenus 格式`);
            return true;
        } else {
            console.log('✅ 所有菜品的 keuzeMenus 格式都是正确的');
            return true;
        }

    } catch (error) {
        console.error('❌ 修复 keuzeMenus 格式时出错:', error);
        return false;
    }
}

/**
 * 为指定菜品设置 keuzeMenus
 */
export async function setItemKeuzeMenus(itemId, keuzeMenus) {
    try {
        console.log(`🔧 为菜品 ${itemId} 设置 keuzeMenus: ${JSON.stringify(keuzeMenus)}`);

        await databaseService.updateData(`items/${itemId}`, {
            keuzeMenus: keuzeMenus
        });

        console.log(`✅ 菜品 ${itemId} 的 keuzeMenus 设置成功`);
        return true;
    } catch (error) {
        console.error(`❌ 设置菜品 ${itemId} 的 keuzeMenus 时出错:`, error);
        return false;
    }
}

/**
 * 批量为菜品设置 keuzeMenus
 */
export async function batchSetKeuzeMenus(itemKeuzeMenusMap) {
    try {
        console.log('🔧 批量设置 keuzeMenus...');

        const updates = {};
        Object.entries(itemKeuzeMenusMap).forEach(([itemId, keuzeMenus]) => {
            updates[`items/${itemId}/keuzeMenus`] = keuzeMenus;
        });

        await databaseService.updateData('', updates);

        console.log(`✅ 成功为 ${Object.keys(itemKeuzeMenusMap).length} 个菜品设置了 keuzeMenus`);
        return true;
    } catch (error) {
        console.error('❌ 批量设置 keuzeMenus 时出错:', error);
        return false;
    }
}

/**
 * 检查菜品的 keuzeMenus 格式
 */
export async function checkKeuzeMenusFormat() {
    try {
        console.log('🔍 检查 keuzeMenus 格式...');

        const allItems = await databaseService.getData('items');

        if (!allItems) {
            console.log('❌ 未找到菜品数据');
            return [];
        }

        const issues = [];

        Object.entries(allItems).forEach(([itemId, item]) => {
            if (item.keuzeMenus) {
                if (!Array.isArray(item.keuzeMenus)) {
                    issues.push({
                        itemId,
                        issue: 'keuzeMenus不是数组',
                        current: item.keuzeMenus,
                        suggestion: Array.isArray(item.keuzeMenus) ? item.keuzeMenus : []
                    });
                } else {
                    item.keuzeMenus.forEach((keuzeMenu, index) => {
                        if (typeof keuzeMenu === 'string' && keuzeMenu.includes(',')) {
                            issues.push({
                                itemId,
                                issue: `keuzeMenus[${index}]包含逗号分隔的值`,
                                current: keuzeMenu,
                                suggestion: keuzeMenu.split(',').map(s => s.trim())
                            });
                        }
                    });
                }
            }
        });

        if (issues.length > 0) {
            console.log('⚠️ 发现格式问题:');
            issues.forEach(issue => {
                console.log(`   - 菜品 ${issue.itemId}: ${issue.issue}`);
                console.log(`     当前值: ${JSON.stringify(issue.current)}`);
                console.log(`     建议值: ${JSON.stringify(issue.suggestion)}`);
            });
        } else {
            console.log('✅ 所有菜品的 keuzeMenus 格式都正确');
        }

        return issues;
    } catch (error) {
        console.error('❌ 检查 keuzeMenus 格式时出错:', error);
        return [];
    }
}