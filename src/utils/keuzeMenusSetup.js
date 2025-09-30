import { database } from '../lib/firebase';
import { ref, get, set, update } from 'firebase/database';

/**
 * 创建一些示例选择菜单数据
 */
export const createSampleKeuzeMenus = async () => {
    const sampleKeuzeMenus = {
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

    try {
        const keuzeMenusRef = ref(database, 'keuzeMenus');
        await set(keuzeMenusRef, sampleKeuzeMenus);
        console.log('Sample keuzeMenus created successfully');
        return sampleKeuzeMenus;
    } catch (error) {
        console.error('Error creating sample keuzeMenus:', error);
        throw error;
    }
};

/**
 * 更新现有菜品添加选择菜单引用
 */
export const updateItemsWithKeuzeMenus = async () => {
    // 示例：为不同类型的菜品分配合适的选择菜单
    const itemKeuzeMenuMapping = {
        // 主菜类（有肉类的菜品）
        hoofdgerechten: ["pittigheid_basic", "portiegrootte_standard", "extra_ingredienten", "bereidingswijze_vlees"],

        // 素食类
        vegetarisch: ["pittigheid_basic", "portiegrootte_standard", "extra_ingredienten"],

        // 寿司类
        sushi: ["sushi_combo_opties"],

        // 饮料类
        dranken: ["drank_grootte"],

        // 小食类
        voorgerechten: ["portiegrootte_standard"]
    };

    try {
        // 先获取所有现有菜品
        const itemsRef = ref(database, 'items');
        const snapshot = await get(itemsRef);

        if (!snapshot.exists()) {
            console.log('No items found to update');
            return;
        }

        const items = snapshot.val();
        const updates = {};

        // 为每个菜品分配合适的选择菜单
        Object.entries(items).forEach(([itemId, item]) => {
            if (item.category) {
                let keuzeMenus = [];

                // 根据类别分配选择菜单
                if (item.category.includes('hoofdgerecht') ||
                    item.category.includes('vlees') ||
                    item.category.includes('kip') ||
                    item.category.includes('rund') ||
                    item.category.includes('varken')) {
                    keuzeMenus = itemKeuzeMenuMapping.hoofdgerechten;
                } else if (item.category.includes('vegetarisch') ||
                    item.category.includes('tofu')) {
                    keuzeMenus = itemKeuzeMenuMapping.vegetarisch;
                } else if (item.category.includes('sushi') ||
                    item.category.includes('nigiri') ||
                    item.category.includes('maki')) {
                    keuzeMenus = itemKeuzeMenuMapping.sushi;
                } else if (item.category.includes('drank') ||
                    item.category.includes('frisdrank') ||
                    item.category.includes('bier') ||
                    item.category.includes('wijn')) {
                    keuzeMenus = itemKeuzeMenuMapping.dranken;
                } else if (item.category.includes('voorgerecht') ||
                    item.category.includes('bijgerecht')) {
                    keuzeMenus = itemKeuzeMenuMapping.voorgerechten;
                } else {
                    // 默认选项
                    keuzeMenus = ["portiegrootte_standard"];
                }

                updates[`items/${itemId}/keuzeMenus`] = keuzeMenus;
            }
        });

        // 批量更新数据库
        await update(ref(database), updates);
        console.log('Items updated with keuzeMenus successfully');

    } catch (error) {
        console.error('Error updating items with keuzeMenus:', error);
        throw error;
    }
};