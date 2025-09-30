#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
正确重新映射Nigiri菜品到Cat1分类
根据菜品名称而不是sortingNrm来分类

使用方法:
python remap_nigiri_to_cat1.py
"""

import json
import firebase_admin
from firebase_admin import credentials, db
from update_config import *

def remap_nigiri_to_cat1():
    """将所有Nigiri菜品重新映射到Cat1分类"""
    try:
        # 初始化Firebase
        if not firebase_admin._apps:
            cred = credentials.Certificate(SERVICE_ACCOUNT_PATH)
            firebase_admin.initialize_app(cred, {'databaseURL': DATABASE_URL})
        
        print("🔗 连接Firebase成功")
        
        # 获取菜单数据
        menu_ref = db.reference(FIREBASE_MENU_PATH)
        menu_data = menu_ref.get()
        
        if not menu_data:
            print("❌ 无法加载菜单数据")
            return False
        
        print(f"✅ 加载了 {len(menu_data)} 个菜品")
        
        # 定义正确的分类规则
        def determine_correct_category(item_data):
            """根据菜品特征确定正确的分类"""
            description = item_data.get('description', '').lower()
            sorting_nrm = item_data.get('sortingNrm', 0)
            
            # 1. 首先按菜品名称分类
            if 'nigiri' in description:
                return 'Cat1'  # 所有Nigiri归到Cat1
            elif 'gunkan' in description or 'temaki' in description:
                return 'Cat2'  # Gunkan/Temaki
            elif 'maki' in description and 'gunkan' not in description:
                return 'Cat3'  # Maki (排除gunkan maki)
            elif 'pokebowl' in description or 'poke bowl' in description:
                return 'Cat4'  # Pokebowls
            elif 'salade' in description or 'salad' in description:
                return 'Cat5'  # Salade
            elif 'soep' in description or 'soup' in description:
                return 'Cat6'  # Soep
            elif 'dessert' in description or 'ice' in description or 'ijs' in description:
                return 'Cat11'  # Desserts
            
            # 2. 然后按sortingNrm分类 (针对没有明确关键词的菜品)
            elif sorting_nrm >= 1 and sorting_nrm <= 12:
                return 'Cat1'   # Lunch/AYCE菜单可能应该在Cat1，或者单独分类
            elif sorting_nrm >= 13 and sorting_nrm <= 30:
                return 'Cat2'   # Gunkan/Temaki
            elif sorting_nrm >= 31 and sorting_nrm <= 54:
                return 'Cat3'   # Maki
            elif sorting_nrm >= 55 and sorting_nrm <= 61:
                return 'Cat4'   # Pokebowls
            elif sorting_nrm >= 62 and sorting_nrm <= 71:
                return 'Cat5'   # Salade
            elif sorting_nrm >= 72 and sorting_nrm <= 76:
                return 'Cat8'   # Warme gerechten
            elif sorting_nrm >= 77 and sorting_nrm <= 100:
                return 'Cat6'   # Soep
            elif sorting_nrm >= 101 and sorting_nrm <= 136:
                return 'Cat9'   # Dinner only
            elif sorting_nrm >= 137 and sorting_nrm <= 146:
                return 'Cat11'  # Desserts
            elif sorting_nrm >= 147 and sorting_nrm <= 200:
                return 'Cat10'  # Specials
            elif sorting_nrm >= 201 and sorting_nrm <= 219:
                return 'Cat16'  # Frisdranken
            elif sorting_nrm >= 220 and sorting_nrm <= 230:
                return 'Cat17'  # Bieren
            elif sorting_nrm >= 231 and sorting_nrm <= 244:
                return 'Cat22'  # Japanse dranken
            elif sorting_nrm >= 245 and sorting_nrm <= 249:
                return 'Cat18'  # Wijnen/Aperitieven
            elif sorting_nrm >= 250 and sorting_nrm <= 291:
                return 'Cat20'  # Sterke dranken
            elif sorting_nrm >= 292 and sorting_nrm <= 313:
                return 'Cat21'  # Warme dranken
            elif sorting_nrm >= 314:
                return 'Cat19'  # Cocktails
            else:
                return 'Cat10'  # 默认为Specials
        
        # 分析需要更改的菜品
        changes = []
        updates = {}
        
        for item_id, item_data in menu_data.items():
            current_category = item_data.get('categoryTakeAway', '')
            correct_category = determine_correct_category(item_data)
            
            if current_category != correct_category:
                updates[item_id] = {
                    **item_data,
                    'categoryTakeAway': correct_category
                }
                changes.append({
                    'id': item_id,
                    'description': item_data.get('description', 'N/A'),
                    'sortingNrm': item_data.get('sortingNrm', 0),
                    'old_category': current_category,
                    'new_category': correct_category,
                    'reason': 'nigiri关键词' if 'nigiri' in item_data.get('description', '').lower() else 'sortingNrm规则'
                })
        
        print(f"\\n🔄 需要更新 {len(updates)} 个菜品的分类")
        
        # 统计Nigiri菜品的变化
        nigiri_changes = [c for c in changes if 'nigiri' in c['description'].lower()]
        print(f"\\n🍣 其中 {len(nigiri_changes)} 个是Nigiri菜品:")
        for change in nigiri_changes:
            print(f"   {change['id']}: {change['description']}")
            print(f"      {change['old_category']} → {change['new_category']}")
        
        print("\\n📋 其他主要变更 (前10个):")
        other_changes = [c for c in changes if 'nigiri' not in c['description'].lower()]
        for change in other_changes[:10]:
            print(f"   {change['id']}: {change['description'][:40]}...")
            print(f"      sortingNrm: {change['sortingNrm']}")
            print(f"      {change['old_category']} → {change['new_category']} ({change['reason']})")
            print()
        
        if len(other_changes) > 10:
            print(f"   ...还有 {len(other_changes) - 10} 个其他变更")
        
        # 计算新的分类分布
        new_distribution = {}
        for item_data in updates.values():
            cat = item_data.get('categoryTakeAway', 'unknown')
            new_distribution[cat] = new_distribution.get(cat, 0) + 1
        
        # 加上未变更的菜品
        for item_id, item_data in menu_data.items():
            if item_id not in updates:
                cat = item_data.get('categoryTakeAway', 'unknown')
                new_distribution[cat] = new_distribution.get(cat, 0) + 1
        
        print("\\n📊 新的分类分布:")
        for cat, count in sorted(new_distribution.items()):
            print(f"   {cat}: {count} 个菜品")
        
        # 特别检查Cat1将包含什么
        print("\\n🔍 Cat1分类将包含:")
        cat1_items = []
        for item_id, item_data in menu_data.items():
            if item_id in updates and updates[item_id]['categoryTakeAway'] == 'Cat1':
                cat1_items.append(updates[item_id])
            elif item_id not in updates and item_data.get('categoryTakeAway') == 'Cat1':
                cat1_items.append(item_data)
        
        nigiri_in_cat1 = [item for item in cat1_items if 'nigiri' in item.get('description', '').lower()]
        other_in_cat1 = [item for item in cat1_items if 'nigiri' not in item.get('description', '').lower()]
        
        print(f"   🍣 Nigiri菜品: {len(nigiri_in_cat1)} 个")
        for item in nigiri_in_cat1:
            print(f"      • {item.get('description', 'N/A')}")
        
        print(f"   📋 其他菜品: {len(other_in_cat1)} 个")
        for item in other_in_cat1[:5]:  # 只显示前5个
            print(f"      • {item.get('description', 'N/A')}")
        if len(other_in_cat1) > 5:
            print(f"      ...还有 {len(other_in_cat1) - 5} 个")
        
        # 询问是否执行更新
        print("\\n⚠️ 即将更新Firebase中的分类映射")
        print("这将确保所有Nigiri菜品都在Cat1分类中")
        confirm = input("确认继续? (y/N): ").strip().lower()
        
        if confirm != 'y':
            print("❌ 用户取消操作")
            return False
        
        # 执行更新
        if updates:
            print("🔄 开始更新Firebase...")
            batch_size = 50
            items = list(updates.items())
            
            for i in range(0, len(items), batch_size):
                batch = dict(items[i:i + batch_size])
                batch_num = (i // batch_size) + 1
                total_batches = (len(items) + batch_size - 1) // batch_size
                
                print(f"📦 更新第 {batch_num}/{total_batches} 批 ({len(batch)} 个菜品)...")
                menu_ref.update(batch)
            
            print("✅ 所有分类映射更新完成!")
        else:
            print("ℹ️ 没有需要更新的菜品")
        
        return True
        
    except Exception as e:
        print(f"❌ 重新映射失败: {e}")
        return False

def main():
    """主函数"""
    print("=" * 60)
    print("重新映射Nigiri菜品到Cat1分类")
    print("=" * 60)
    
    success = remap_nigiri_to_cat1()
    
    if success:
        print("\\n✅ 重新映射完成!")
        print("\\n现在Cat1分类应该包含所有的Nigiri菜品")
        print("\\n建议:")
        print("1. 访问 http://localhost:3000/category-mapping-debug 验证结果")
        print("2. 点击Cat1分类，确认显示的都是Nigiri菜品")
    else:
        print("\\n❌ 重新映射失败!")

if __name__ == "__main__":
    main()