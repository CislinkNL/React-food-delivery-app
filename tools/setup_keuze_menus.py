import json
import sys
import os

def create_keuze_menus_json():
    """
    创建 keuzeMenus 数据的 JSON 文件，可以手动导入到 Firebase
    """
    
    # 定义 keuzeMenus 数据
    keuze_menus = {
        "pittigheid_basic": {
            "id": "pittigheid_basic",
            "name": "Pittigheid",
            "nameEn": "Spiciness",
            "nameCn": "辣度",
            "type": "single_choice",
            "required": True,
            "displayOrder": 1,
            "options": [
                {
                    "id": "mild",
                    "name": "Mild",
                    "nameCn": "微辣",
                    "price": 0,
                    "available": True
                },
                {
                    "id": "medium",
                    "name": "Medium",
                    "nameCn": "中辣",
                    "price": 0,
                    "available": True,
                    "default": True
                },
                {
                    "id": "hot",
                    "name": "Heet",
                    "nameCn": "重辣",
                    "price": 0.5,
                    "available": True
                },
                {
                    "id": "extra_hot",
                    "name": "Extra Heet",
                    "nameCn": "特辣",
                    "price": 1,
                    "available": True
                }
            ]
        },
        "portiegrootte_standard": {
            "id": "portiegrootte_standard",
            "name": "Portiegrootte",
            "nameEn": "Portion Size",
            "nameCn": "分量",
            "type": "single_choice",
            "required": True,
            "displayOrder": 2,
            "options": [
                {
                    "id": "small",
                    "name": "Klein",
                    "nameCn": "小份",
                    "price": -2,
                    "available": True
                },
                {
                    "id": "regular",
                    "name": "Standaard",
                    "nameCn": "标准",
                    "price": 0,
                    "available": True,
                    "default": True
                },
                {
                    "id": "large",
                    "name": "Groot",
                    "nameCn": "大份",
                    "price": 3,
                    "available": True
                },
                {
                    "id": "extra_large",
                    "name": "Extra Groot",
                    "nameCn": "特大份",
                    "price": 5,
                    "available": True
                }
            ]
        },
        "extra_ingredienten": {
            "id": "extra_ingredienten",
            "name": "Extra Ingrediënten",
            "nameEn": "Extra Ingredients",
            "nameCn": "额外配菜",
            "type": "multiple_choice",
            "required": False,
            "displayOrder": 3,
            "maxSelections": 5,
            "options": [
                {
                    "id": "extra_groenten",
                    "name": "Extra Groenten",
                    "nameCn": "额外蔬菜",
                    "price": 1.5,
                    "available": True
                },
                {
                    "id": "extra_vlees",
                    "name": "Extra Vlees",
                    "nameCn": "额外肉类",
                    "price": 2.5,
                    "available": True
                },
                {
                    "id": "extra_tofu",
                    "name": "Extra Tofu",
                    "nameCn": "额外豆腐",
                    "price": 1.8,
                    "available": True
                },
                {
                    "id": "extra_garnalen",
                    "name": "Extra Garnalen",
                    "nameCn": "额外虾仁",
                    "price": 3.5,
                    "available": True
                },
                {
                    "id": "extra_champignons",
                    "name": "Extra Champignons",
                    "nameCn": "额外蘑菇",
                    "price": 1.2,
                    "available": True
                }
            ]
        },
        "bereidingswijze_vlees": {
            "id": "bereidingswijze_vlees",
            "name": "Bereidingswijze",
            "nameEn": "Cooking Style",
            "nameCn": "烹饪方式",
            "type": "single_choice",
            "required": False,
            "displayOrder": 4,
            "options": [
                {
                    "id": "geroosterd",
                    "name": "Geroosterd",
                    "nameCn": "烤制",
                    "price": 0,
                    "available": True,
                    "default": True
                },
                {
                    "id": "gestoomd",
                    "name": "Gestoomd",
                    "nameCn": "蒸制",
                    "price": 0,
                    "available": True
                },
                {
                    "id": "gefrituurd",
                    "name": "Gefrituurd",
                    "nameCn": "油炸",
                    "price": 0.5,
                    "available": True
                },
                {
                    "id": "gegrild",
                    "name": "Gegrild",
                    "nameCn": "烧烤",
                    "price": 1,
                    "available": True
                }
            ]
        },
        "sushi_combo_opties": {
            "id": "sushi_combo_opties",
            "name": "Sushi Combo Aanpassingen",
            "nameEn": "Sushi Combo Options",
            "nameCn": "寿司套餐选择",
            "type": "multiple_choice",
            "required": False,
            "displayOrder": 5,
            "maxSelections": 3,
            "options": [
                {
                    "id": "extra_wasabi",
                    "name": "Extra Wasabi",
                    "nameCn": "额外芥末",
                    "price": 0.5,
                    "available": True
                },
                {
                    "id": "extra_gember",
                    "name": "Extra Gember",
                    "nameCn": "额外生姜",
                    "price": 0.5,
                    "available": True
                },
                {
                    "id": "soja_saus_apart",
                    "name": "Soja Saus Apart",
                    "nameCn": "单独酱油",
                    "price": 0,
                    "available": True
                },
                {
                    "id": "geen_zeewier",
                    "name": "Zonder Zeewier",
                    "nameCn": "无海苔",
                    "price": 0,
                    "available": True
                }
            ]
        },
        "drank_grootte": {
            "id": "drank_grootte",
            "name": "Drankgrootte",
            "nameEn": "Drink Size",
            "nameCn": "饮料规格",
            "type": "single_choice",
            "required": True,
            "displayOrder": 1,
            "options": [
                {
                    "id": "klein_330ml",
                    "name": "Klein (330ml)",
                    "nameCn": "小杯(330ml)",
                    "price": 0,
                    "available": True,
                    "default": True
                },
                {
                    "id": "groot_500ml",
                    "name": "Groot (500ml)",
                    "nameCn": "大杯(500ml)",
                    "price": 1.5,
                    "available": True
                }
            ]
        }
    }

    try:
        # 创建输出文件路径
        output_file = os.path.join(os.path.dirname(__file__), 'keuze_menus_data.json')
        
        # 写入JSON文件
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(keuze_menus, f, ensure_ascii=False, indent=2)
        
        print("✅ KeuzeMenus 数据已生成为 JSON 文件!")
        print(f"📁 文件位置: {output_file}")
        print(f"📊 包含 {len(keuze_menus)} 个 keuzeMenus:")
        
        for menu_id, menu in keuze_menus.items():
            print(f"   - {menu_id}: {menu['name']} ({len(menu['options'])} 个选项)")
        
        print("\n💡 使用方法:")
        print("1. 在 Firebase 控制台打开 Realtime Database")
        print("2. 导航到根节点")
        print("3. 点击 '+' 添加子节点")
        print("4. 名称设为 'keuzeMenus'")
        print("5. 导入刚生成的 JSON 文件内容")
        
        print("\n🔧 或者使用前端 React 组件:")
        print("1. 访问 /keuze-menus-setup 页面")
        print("2. 点击设置按钮")
        print("3. 系统会自动上传数据")
        
        return True
        
    except Exception as e:
        print(f"❌ 生成 JSON 文件时出错: {e}")
        return False

def create_sample_item_updates():
    """
    创建示例菜品更新的 JSON 文件
    """
    sample_updates = {
        "items": {
            "1": {"keuzeMenus": ["pittigheid_basic", "portiegrootte_standard", "extra_ingredienten"]},
            "2": {"keuzeMenus": ["pittigheid_basic", "portiegrootte_standard", "bereidingswijze_vlees"]},
            "3": {"keuzeMenus": ["sushi_combo_opties"]},
            "4": {"keuzeMenus": ["drank_grootte"]},
            "5": {"keuzeMenus": ["pittigheid_basic", "portiegrootte_standard", "extra_ingredienten"]},
            "10": {"keuzeMenus": ["pittigheid_basic", "portiegrootte_standard"]},
            "11": {"keuzeMenus": ["pittigheid_basic", "portiegrootte_standard"]},
            "12": {"keuzeMenus": ["pittigheid_basic", "portiegrootte_standard"]},
            "15": {"keuzeMenus": ["sushi_combo_opties"]},
            "16": {"keuzeMenus": ["sushi_combo_opties"]},
            "20": {"keuzeMenus": ["drank_grootte"]},
            "21": {"keuzeMenus": ["drank_grootte"]}
        }
    }
    
    try:
        output_file = os.path.join(os.path.dirname(__file__), 'sample_item_updates.json')
        
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(sample_updates, f, ensure_ascii=False, indent=2)
        
        print(f"\n✅ 示例菜品更新数据已生成: {output_file}")
        print(f"📊 包含 {len(sample_updates['items'])} 个菜品的更新")
        
        return True
        
    except Exception as e:
        print(f"❌ 生成示例更新文件时出错: {e}")
        return False

if __name__ == "__main__":
    print("🚀 生成 KeuzeMenus 数据文件...")
    
    # 1. 生成主要的 keuzeMenus 数据
    if create_keuze_menus_json():
        print("\n📝 步骤 1: KeuzeMenus 数据文件生成完成!")
        
        # 2. 生成示例菜品更新数据
        if create_sample_item_updates():
            print("\n📝 步骤 2: 示例菜品更新文件生成完成!")
            print("\n🎉 所有数据文件已准备就绪!")
        else:
            print("\n⚠️  警告: 主数据文件已生成，但示例更新文件生成失败")
    else:
        print("\n❌ 数据文件生成失败!")