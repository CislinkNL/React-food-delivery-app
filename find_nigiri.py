#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
查找真正的Nigiri菜品在哪个分类

使用方法:
python find_nigiri.py
"""

import json
import firebase_admin
from firebase_admin import credentials, db
from update_config import *

def find_nigiri_dishes():
    """查找包含nigiri关键词的菜品"""
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
        
        # 查找包含nigiri的菜品
        nigiri_dishes = []
        for item_id, item_data in menu_data.items():
            description = item_data.get('description', '').lower()
            if 'nigiri' in description:
                nigiri_dishes.append({
                    'id': item_id,
                    'description': item_data.get('description', 'N/A'),
                    'sortingNrm': item_data.get('sortingNrm', 0),
                    'categoryTakeAway': item_data.get('categoryTakeAway', 'N/A')
                })
        
        print(f"\\n🍣 找到 {len(nigiri_dishes)} 个包含'nigiri'的菜品:")
        
        # 按sortingNrm排序
        nigiri_dishes.sort(key=lambda x: x['sortingNrm'] if isinstance(x['sortingNrm'], (int, float)) else 0)
        
        # 统计分类分布
        category_count = {}
        for dish in nigiri_dishes:
            cat = dish['categoryTakeAway']
            category_count[cat] = category_count.get(cat, 0) + 1
        
        print("\\n📊 Nigiri菜品的分类分布:")
        for cat, count in sorted(category_count.items()):
            print(f"   {cat}: {count} 个菜品")
        
        print("\\n📝 详细列表:")
        for dish in nigiri_dishes:
            print(f"   {dish['id']}: {dish['description']}")
            print(f"      sortingNrm: {dish['sortingNrm']}, categoryTakeAway: {dish['categoryTakeAway']}")
            print()
        
        # 检查各个分类的sortingNrm范围
        print("\\n🔍 各分类的sortingNrm范围:")
        for cat in sorted(category_count.keys()):
            cat_dishes = [d for d in nigiri_dishes if d['categoryTakeAway'] == cat]
            sorting_values = [d['sortingNrm'] for d in cat_dishes if isinstance(d['sortingNrm'], (int, float))]
            if sorting_values:
                min_val = min(sorting_values)
                max_val = max(sorting_values)
                print(f"   {cat}: sortingNrm {min_val}-{max_val} ({len(cat_dishes)} 个菜品)")
        
        return True
        
    except Exception as e:
        print(f"❌ 查找失败: {e}")
        return False

def main():
    """主函数"""
    print("=" * 60)
    print("查找真正的Nigiri菜品")
    print("=" * 60)
    
    success = find_nigiri_dishes()
    
    if success:
        print("\\n✅ 查找完成!")
    else:
        print("\\n❌ 查找失败!")

if __name__ == "__main__":
    main()