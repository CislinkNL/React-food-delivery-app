// KeuzeMenus Setup Script - React环境中使用
// 该脚本会创建 keuzeMenus 数据结构并更新数据库

import { databaseService } from '../services/DatabaseService';

// 定义 keuzeMenus 数据
const keuzeMenusData = {
    pittigheid_basic: {
        id: "pittigheid_basic",
        name: "Pittigheid",
        nameEn: "Spiciness",
        nameCn: "辣度",
        type: "single_choice",
        required: true,
        displayOrder: 1,
        options: [
            {
                id: "mild",
                name: "Mild",
                nameCn: "微辣",
                price: 0,
                available: true
            },
            {
                id: "medium",
                name: "Medium",
                nameCn: "中辣",
                price: 0,
                available: true,
                default: true
            },
            {
                id: "hot",
                name: "Heet",
                nameCn: "重辣",
                price: 0.5,
                available: true
            },
            {
                id: "extra_hot",
                name: "Extra Heet",
                nameCn: "特辣",
                price: 1,
                available: true
            }
        ]
    },
    portiegrootte_standard: {
        id: "portiegrootte_standard",
        name: "Portiegrootte",
        nameEn: "Portion Size",
        nameCn: "分量",
        type: "single_choice",
        required: true,
        displayOrder: 2,
        options: [
            {
                id: "small",
                name: "Klein",
                nameCn: "小份",
                price: -2,
                available: true
            },
            {
                id: "regular",
                name: "Standaard",
                nameCn: "标准",
                price: 0,
                available: true,
                default: true
            },
            {
                id: "large",
                name: "Groot",
                nameCn: "大份",
                price: 3,
                available: true
            },
            {
                id: "extra_large",
                name: "Extra Groot",
                nameCn: "特大份",
                price: 5,
                available: true
            }
        ]
    },
    extra_ingredienten: {
        id: "extra_ingredienten",
        name: "Extra Ingrediënten",
        nameEn: "Extra Ingredients",
        nameCn: "额外配菜",
        type: "multiple_choice",
        required: false,
        displayOrder: 3,
        maxSelections: 5,
        options: [
            {
                id: "extra_groenten",
                name: "Extra Groenten",
                nameCn: "额外蔬菜",
                price: 1.5,
                available: true
            },
            {
                id: "extra_vlees",
                name: "Extra Vlees",
                nameCn: "额外肉类",
                price: 2.5,
                available: true
            },
            {
                id: "extra_tofu",
                name: "Extra Tofu",
                nameCn: "额外豆腐",
                price: 1.8,
                available: true
            },
            {
                id: "extra_garnalen",
                name: "Extra Garnalen",
                nameCn: "额外虾仁",
                price: 3.5,
                available: true
            },
            {
                id: "extra_champignons",
                name: "Extra Champignons",
                nameCn: "额外蘑菇",
                price: 1.2,
                available: true
            }
        ]
    },
    bereidingswijze_vlees: {
        id: "bereidingswijze_vlees",
        name: "Bereidingswijze",
        nameEn: "Cooking Style",
        nameCn: "烹饪方式",
        type: "single_choice",
        required: false,
        displayOrder: 4,
        options: [
            {
                id: "geroosterd",
                name: "Geroosterd",
                nameCn: "烤制",
                price: 0,
                available: true,
                default: true
            },
            {
                id: "gestoomd",
                name: "Gestoomd",
                nameCn: "蒸制",
                price: 0,
                available: true
            },
            {
                id: "gefrituurd",
                name: "Gefrituurd",
                nameCn: "油炸",
                price: 0.5,
                available: true
            },
            {
                id: "gegrild",
                name: "Gegrild",
                nameCn: "烧烤",
                price: 1,
                available: true
            }
        ]
    },
    sushi_combo_opties: {
        id: "sushi_combo_opties",
        name: "Sushi Combo Aanpassingen",
        nameEn: "Sushi Combo Options",
        nameCn: "寿司套餐选择",
        type: "multiple_choice",
        required: false,
        displayOrder: 5,
        maxSelections: 3,
        options: [
            {
                id: "extra_wasabi",
                name: "Extra Wasabi",
                nameCn: "额外芥末",
                price: 0.5,
                available: true
            },
            {
                id: "extra_gember",
                name: "Extra Gember",
                nameCn: "额外生姜",
                price: 0.5,
                available: true
            },
            {
                id: "soja_saus_apart",
                name: "Soja Saus Apart",
                nameCn: "单独酱油",
                price: 0,
                available: true
            },
            {
                id: "geen_zeewier",
                name: "Zonder Zeewier",
                nameCn: "无海苔",
                price: 0,
                available: true
            }
        ]
    },
    drank_grootte: {
        id: "drank_grootte",
        name: "Drankgrootte",
        nameEn: "Drink Size",
        nameCn: "饮料规格",
        type: "single_choice",
        required: true,
        displayOrder: 1,
        options: [
            {
                id: "klein_330ml",
                name: "Klein (330ml)",
                nameCn: "小杯(330ml)",
                price: 0,
                available: true,
                default: true
            },
            {
                id: "groot_500ml",
                name: "Groot (500ml)",
                nameCn: "大杯(500ml)",
                price: 1.5,
                available: true
            }
        ]
    }
};

// 创建 keuzeMenus 的函数
export async function setupKeuzeMenus() {
    try {
        console.log('🚀 开始设置 KeuzeMenus...');

        // 设置 keuzeMenus 数据
        await databaseService.setData('keuzeMenus', keuzeMenusData);

        console.log('✅ KeuzeMenus 数据已成功上传到 Firebase!');
        console.log(`📊 创建了 ${Object.keys(keuzeMenusData).length} 个 keuzeMenus:`);

        Object.entries(keuzeMenusData).forEach(([menuId, menu]) => {
            console.log(`   - ${menuId}: ${menu.name} (${menu.options.length} 个选项)`);
        });

        return true;
    } catch (error) {
        console.error('❌ 设置 KeuzeMenus 时出错:', error);
        return false;
    }
}

// 为示例菜品添加 keuzeMenus 引用的函数
export async function updateSampleItemsWithKeuzeMenus() {
    try {
        console.log('📝 开始更新示例菜品...');

        // 示例更新：为不同类型的菜品分配合适的选择菜单
        const sampleUpdates = {
            // 为一些菜品添加选择菜单
            "items/1/keuzeMenus": ["pittigheid_basic", "portiegrootte_standard", "extra_ingredienten"],
            "items/2/keuzeMenus": ["pittigheid_basic", "portiegrootte_standard", "bereidingswijze_vlees"],
            "items/3/keuzeMenus": ["sushi_combo_opties"],
            "items/4/keuzeMenus": ["drank_grootte"],
            "items/5/keuzeMenus": ["pittigheid_basic", "portiegrootte_standard", "extra_ingredienten"],

            // 为更多菜品添加基础选项
            "items/10/keuzeMenus": ["pittigheid_basic", "portiegrootte_standard"],
            "items/11/keuzeMenus": ["pittigheid_basic", "portiegrootte_standard"],
            "items/12/keuzeMenus": ["pittigheid_basic", "portiegrootte_standard"],
            "items/15/keuzeMenus": ["sushi_combo_opties"],
            "items/16/keuzeMenus": ["sushi_combo_opties"],
            "items/20/keuzeMenus": ["drank_grootte"],
            "items/21/keuzeMenus": ["drank_grootte"],
        };

        await databaseService.updateData('', sampleUpdates);

        console.log('✅ 示例菜品已更新为包含 keuzeMenus 引用!');
        console.log(`📊 更新了 ${Object.keys(sampleUpdates).length} 个菜品的菜单引用`);

        return true;
    } catch (error) {
        console.error('❌ 更新示例菜品时出错:', error);
        return false;
    }
}

// 完整设置函数
export async function setupCompleteKeuzeMenusSystem() {
    console.log('🚀 开始设置完整的 KeuzeMenus 系统...');

    try {
        // 1. 创建选择菜单
        const step1Success = await setupKeuzeMenus();
        if (step1Success) {
            console.log('\n📝 步骤 1: KeuzeMenus 设置完成!');

            // 2. 更新示例菜品
            const step2Success = await updateSampleItemsWithKeuzeMenus();
            if (step2Success) {
                console.log('\n📝 步骤 2: 示例菜品更新完成!');
                console.log('\n🎉 KeuzeMenus 系统已准备就绪!');
                console.log('\n💡 后续步骤:');
                console.log('   1. 测试 DishOptionsModal 组件');
                console.log('   2. 根据需要添加更多 keuzeMenus');
                console.log('   3. 为更多菜品分配 keuzeMenus');
                return true;
            } else {
                console.log('\n⚠️  警告: KeuzeMenus 已创建，但示例菜品更新失败');
                return false;
            }
        } else {
            console.log('\n❌ 设置失败!');
            return false;
        }
    } catch (error) {
        console.error('❌ 设置过程中出现错误:', error);
        return false;
    }
}

// 如果在Node.js环境中运行
if (typeof window === 'undefined') {
    console.log('此脚本应该在浏览器环境中运行，或者作为React组件的一部分使用');
}