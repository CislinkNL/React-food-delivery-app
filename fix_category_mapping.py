#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
修复分类映射错误
重新正确映射Cat1分类的菜品

使用方法:
python fix_category_mapping.py
"""

import json
import firebase_admin
from firebase_admin import credentials, db
from update_config import *

def fix_cat1_mapping():
    """修复Cat1分类的映射错误"""
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
        
        # 分析当前Cat1的问题
        cat1_dishes = []
        for item_id, item_data in menu_data.items():
            if item_data.get('categoryTakeAway') == 'Cat1':
                cat1_dishes.append({
                    'id': item_id,
                    'description': item_data.get('description', 'N/A'),
                    'sortingNrm': item_data.get('sortingNrm', 0)
                })
        
        print(f"\\n🔍 当前Cat1有 {len(cat1_dishes)} 个菜品")
        
        # 根据正确的映射规则重新分类
        correct_mapping = {
            # 食物分类 - 根据sortingNrm重新映射
            (1, 12): "Cat1",     # 应该是Nigiri，但当前有其他菜品
            (13, 30): "Cat2",    # Gunkan/Temaki
            (31, 54): "Cat3",    # Maki
            (55, 61): "Cat4",    # Pokebowls
            (62, 71): "Cat5",    # Salade
            (72, 76): "Cat8",    # Warme gerechten
            (77, 100): "Cat6",   # Soep
            (101, 136): "Cat9",  # Dinner only
            (137, 146): "Cat11", # Desserts
            (147, 200): "Cat10", # Specials
            
            # 饮品分类
            (201, 219): "Cat16", # Frisdranken
            (220, 230): "Cat17", # Bieren
            (231, 244): "Cat22", # Japanse dranken
            (245, 249): "Cat18", # Wijnen/Aperitieven
            (250, 291): "Cat20", # Sterke dranken
            (292, 313): "Cat21", # Warme dranken
            (314, 999): "Cat19"  # Cocktails
        }
        
        def get_correct_category(sorting_nrm):
            """根据sortingNrm获取正确的分类"""
            if not sorting_nrm:
                return "Cat10"  # 默认为Specials
                
            for (min_val, max_val), category_id in correct_mapping.items():
                if min_val <= sorting_nrm <= max_val:
                    return category_id
            
            return "Cat10"  # 默认分类
        
        # 重新映射所有菜品
        updates = {}
        changes = []
        
        for item_id, item_data in menu_data.items():
            current_category = item_data.get('categoryTakeAway', '')
            sorting_nrm = item_data.get('sortingNrm', 0)
            correct_category = get_correct_category(sorting_nrm)
            
            if current_category != correct_category:
                updates[item_id] = {
                    **item_data,
                    'categoryTakeAway': correct_category
                }
                changes.append({
                    'id': item_id,
                    'description': item_data.get('description', 'N/A'),
                    'sortingNrm': sorting_nrm,
                    'old_category': current_category,
                    'new_category': correct_category
                })
        
        print(f"\\n🔄 需要更新 {len(updates)} 个菜品的分类")
        print("\\n主要变更:")
        
        # 显示前10个变更
        for change in changes[:10]:
            print(f"   {change['id']}: {change['description'][:30]}...")
            print(f"      sortingNrm: {change['sortingNrm']}")
            print(f"      {change['old_category']} → {change['new_category']}")
            print()
        
        if len(changes) > 10:
            print(f"   ...还有 {len(changes) - 10} 个变更")
        
        # 分析新的分类分布
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
        
        # 询问是否执行更新
        print("\\n⚠️ 即将更新Firebase中的分类映射")
        confirm = input("确认继续? (y/N): ").strip().lower()
        
        if confirm != 'y':
            print("❌ 用户取消操作")
            return False
        
        # 执行更新
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
        
        return True
        
    except Exception as e:
        print(f"❌ 修复失败: {e}")
        return False

def main():
    """主函数"""
    print("=" * 60)
    print("修复分类映射错误")
    print("=" * 60)
    
    success = fix_cat1_mapping()
    
    if success:
        print("\\n✅ 修复完成!")
        print("\\n建议:")
        print("1. 访问 http://localhost:3000/category-mapping-debug 验证结果")
        print("2. 检查各分类是否显示正确的菜品")
    else:
        print("\\n❌ 修复失败!")

if __name__ == "__main__":
    main()