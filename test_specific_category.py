#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
测试特定分类的菜品映射
验证 Nigiri (Cat1) 分类的菜品是否正确

使用方法:
python test_specific_category.py
"""

import json
import firebase_admin
from firebase_admin import credentials, db
from update_config import *

def test_category_mapping():
    """测试特定分类的菜品映射"""
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
        
        # 测试Cat1 (Nigiri)分类
        target_category = "Cat1"
        print(f"\\n🔍 查找分类 '{target_category}' 的菜品...")
        
        cat1_dishes = []
        for item_id, item_data in menu_data.items():
            category_takeaway = item_data.get('categoryTakeAway', '')
            if category_takeaway == target_category:
                cat1_dishes.append({
                    'id': item_id,
                    'description': item_data.get('description', 'N/A'),
                    'sortingNrm': item_data.get('sortingNrm', 'N/A'),
                    'categoryTakeAway': category_takeaway
                })
        
        print(f"✅ 找到 {len(cat1_dishes)} 个 {target_category} 分类的菜品:")
        
        # 按sortingNrm排序
        cat1_dishes.sort(key=lambda x: x['sortingNrm'] if isinstance(x['sortingNrm'], (int, float)) else 0)
        
        # 显示所有Cat1菜品
        for dish in cat1_dishes:
            print(f"   {dish['id']}: {dish['description']} (sortingNrm: {dish['sortingNrm']})")
        
        # 验证sortingNrm范围
        print(f"\\n🔍 验证sortingNrm范围...")
        sorting_values = [dish['sortingNrm'] for dish in cat1_dishes if isinstance(dish['sortingNrm'], (int, float))]
        
        if sorting_values:
            min_sorting = min(sorting_values)
            max_sorting = max(sorting_values)
            print(f"   sortingNrm范围: {min_sorting} - {max_sorting}")
            
            # 根据我们的映射规则，Cat1应该是sortingNrm 1-12
            expected_range = (1, 12)
            if min_sorting >= expected_range[0] and max_sorting <= expected_range[1]:
                print(f"✅ sortingNrm范围正确 (预期: {expected_range[0]}-{expected_range[1]})")
            else:
                print(f"⚠️ sortingNrm范围异常 (预期: {expected_range[0]}-{expected_range[1]}, 实际: {min_sorting}-{max_sorting})")
        
        # 测试其他几个分类
        test_categories = ['Cat2', 'Cat3', 'Cat16', 'Cat10']
        print(f"\\n🔍 测试其他分类的菜品数量...")
        
        for cat in test_categories:
            count = sum(1 for item in menu_data.values() if item.get('categoryTakeAway') == cat)
            print(f"   {cat}: {count} 个菜品")
        
        # 检查是否有菜品缺少categoryTakeAway字段
        missing_category = []
        for item_id, item_data in menu_data.items():
            if not item_data.get('categoryTakeAway'):
                missing_category.append(item_id)
        
        if missing_category:
            print(f"\\n⚠️ 有 {len(missing_category)} 个菜品缺少categoryTakeAway字段:")
            for item_id in missing_category[:5]:  # 只显示前5个
                print(f"   {item_id}")
            if len(missing_category) > 5:
                print(f"   ...还有 {len(missing_category) - 5} 个")
        else:
            print(f"\\n✅ 所有菜品都有categoryTakeAway字段")
        
        return True
        
    except Exception as e:
        print(f"❌ 测试失败: {e}")
        return False

def main():
    """主函数"""
    print("=" * 60)
    print("测试分类映射 - Nigiri (Cat1) 专项检查")
    print("=" * 60)
    
    success = test_category_mapping()
    
    if success:
        print("\\n✅ 测试完成!")
    else:
        print("\\n❌ 测试失败!")

if __name__ == "__main__":
    main()