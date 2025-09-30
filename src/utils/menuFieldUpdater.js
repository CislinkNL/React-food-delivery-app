// 菜品分类映射工具
// 根据sortingNrm字段自动映射到正确的categoryTakeAway

const categoryMapping = {
    // 食物分类 (基于target范围)
    "Cat1": { name: "Nigiri", targetRange: [1, 12] },          // 1-12
    "Cat2": { name: "Gunkan/Temaki", targetRange: [13, 30] },  // 13-30 
    "Cat3": { name: "Maki", targetRange: [31, 54] },           // 31-54
    "Cat4": { name: "Pokebowls", targetRange: [55, 61] },      // 55-61
    "Cat5": { name: "Salade", targetRange: [62, 71] },         // 62-71
    "Cat8": { name: "Warme gerechten", targetRange: [72, 76] }, // 72-76
    "Cat6": { name: "Soep", targetRange: [77, 100] },          // 77-100
    "Cat9": { name: "Dinner only", targetRange: [101, 136] },  // 101-136
    "Cat11": { name: "Desserts", targetRange: [137, 146] },    // 137-146
    "Cat10": { name: "Specials", targetRange: [147, 200] },    // 147-200

    // 饮品分类 (基于target范围)
    "Cat16": { name: "Frisdranken", targetRange: [201, 219] },     // 201-219
    "Cat17": { name: "Bieren", targetRange: [220, 230] },          // 220-230
    "Cat22": { name: "Japanse dranken", targetRange: [231, 244] }, // 231-244
    "Cat18": { name: "Wijnen/Aperitieven", targetRange: [245, 249] }, // 245-249
    "Cat20": { name: "Sterke dranken", targetRange: [250, 291] },  // 250-291
    "Cat21": { name: "Warme dranken", targetRange: [292, 313] },   // 292-313
    "Cat19": { name: "Cocktails", targetRange: [314, 999] }        // 314+
};

/**
 * 根据sortingNrm自动确定categoryTakeAway
 * @param {number} sortingNrm - 菜品的排序号
 * @returns {string} - 对应的分类ID (如 "Cat1")
 */
function determineCategoryTakeAway(sortingNrm) {
    for (const [categoryId, categoryInfo] of Object.entries(categoryMapping)) {
        const [min, max] = categoryInfo.targetRange;
        if (sortingNrm >= min && sortingNrm <= max) {
            return categoryId;
        }
    }

    // 默认分类 (如果没有匹配)
    console.warn(`No category found for sortingNrm: ${sortingNrm}`);
    return "Cat1"; // 默认为Nigiri分类
}

/**
 * 为菜品添加新字段
 * @param {Object} menuItem - 原始菜品数据
 * @returns {Object} - 添加新字段后的菜品数据
 */
function addNewFieldsToMenuItem(menuItem) {
    const categoryTakeAway = determineCategoryTakeAway(menuItem.sortingNrm);

    return {
        ...menuItem,
        onlyRestaurant: false,           // 默认支持外卖
        categoryTakeAway: categoryTakeAway, // 自动映射的分类ID
        options: ""                      // 默认无选项
    };
}

/**
 * 批量处理菜单数据
 * @param {Object} menuData - 完整的菜单数据
 * @returns {Object} - 更新后的菜单数据
 */
function updateMenuData(menuData) {
    const updatedMenu = {};

    for (const [itemId, itemData] of Object.entries(menuData)) {
        updatedMenu[itemId] = addNewFieldsToMenuItem(itemData);
    }

    return updatedMenu;
}

/**
 * 验证分类映射
 * @param {Object} menuData - 菜单数据
 */
function validateCategoryMapping(menuData) {
    const categoryStats = {};

    for (const [itemId, itemData] of Object.entries(menuData)) {
        const category = itemData.categoryTakeAway || determineCategoryTakeAway(itemData.sortingNrm);

        if (!categoryStats[category]) {
            categoryStats[category] = {
                count: 0,
                items: [],
                sortingRange: [Infinity, -Infinity]
            };
        }

        categoryStats[category].count++;
        categoryStats[category].items.push({
            id: itemId,
            description: itemData.description,
            sortingNrm: itemData.sortingNrm
        });

        // 更新排序范围
        categoryStats[category].sortingRange[0] = Math.min(
            categoryStats[category].sortingRange[0],
            itemData.sortingNrm
        );
        categoryStats[category].sortingRange[1] = Math.max(
            categoryStats[category].sortingRange[1],
            itemData.sortingNrm
        );
    }

    console.log('分类统计:', categoryStats);
    return categoryStats;
}

// 导出工具函数
module.exports = {
    categoryMapping,
    determineCategoryTakeAway,
    addNewFieldsToMenuItem,
    updateMenuData,
    validateCategoryMapping
};

// 使用示例:
/*
const fs = require('fs');

// 读取原始菜单数据
const originalMenu = JSON.parse(fs.readFileSync('example_menukaart_data.json', 'utf8'));

// 更新菜单数据
const updatedMenu = updateMenuData(originalMenu);

// 验证映射结果
validateCategoryMapping(updatedMenu);

// 保存更新后的数据
fs.writeFileSync('updated_menukaart_data.json', JSON.stringify(updatedMenu, null, 2));
*/