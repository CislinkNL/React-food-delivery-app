#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
测试排除onlyRestaurant:true的菜品过滤功能

使用方法:
python test_exclude_restaurant_only.py
"""

import json
import firebase_admin
from firebase_admin import credentials, db
from update_config import *

def test_filter_exclude_restaurant_only():
    """测试排除只限餐厅菜品的过滤功能"""
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
        
        # 统计onlyRestaurant菜品
        restaurant_only_dishes = []
        takeaway_available_dishes = []
        
        for item_id, item_data in menu_data.items():
            if item_data.get('onlyRestaurant', False):
                restaurant_only_dishes.append({
                    'id': item_id,
                    'description': item_data.get('description', 'N/A'),
                    'categoryTakeAway': item_data.get('categoryTakeAway', 'N/A')
                })
            else:
                takeaway_available_dishes.append({
                    'id': item_id,
                    'description': item_data.get('description', 'N/A'),
                    'categoryTakeAway': item_data.get('categoryTakeAway', 'N/A')
                })
        
        print(f"\\n📊 菜品分布:")
        print(f"   🏪 只限餐厅: {len(restaurant_only_dishes)} 个")
        print(f"   🚚 可外卖: {len(takeaway_available_dishes)} 个")
        
        # 显示只限餐厅的菜品
        if restaurant_only_dishes:
            print(f"\\n🏪 只限餐厅的菜品:")
            for dish in restaurant_only_dishes:
                print(f"   {dish['id']}: {dish['description']} (分类: {dish['categoryTakeAway']})")
        else:
            print("\\n✅ 没有只限餐厅的菜品")
        
        # 按分类统计可外卖菜品
        takeaway_by_category = {}
        for dish in takeaway_available_dishes:
            category = dish['categoryTakeAway']
            takeaway_by_category[category] = takeaway_by_category.get(category, 0) + 1
        
        print(f"\\n🚚 可外卖菜品按分类分布:")
        for category, count in sorted(takeaway_by_category.items()):
            print(f"   {category}: {count} 个菜品")
        
        # 测试特定分类的过滤
        test_categories = ['Cat1', 'Cat2', 'Cat16']
        print(f"\\n🧪 测试特定分类的过滤效果:")
        
        for category in test_categories:
            # 不过滤的结果
            all_in_category = [
                dish for dish in menu_data.values() 
                if dish.get('categoryTakeAway') == category
            ]
            
            # 过滤掉只限餐厅的结果
            takeaway_in_category = [
                dish for dish in menu_data.values() 
                if dish.get('categoryTakeAway') == category and not dish.get('onlyRestaurant', False)
            ]
            
            restaurant_only_in_category = [
                dish for dish in menu_data.values() 
                if dish.get('categoryTakeAway') == category and dish.get('onlyRestaurant', False)
            ]
            
            print(f"\\n   {category}分类:")
            print(f"     总菜品: {len(all_in_category)} 个")
            print(f"     可外卖: {len(takeaway_in_category)} 个")
            print(f"     只限餐厅: {len(restaurant_only_in_category)} 个")
            
            if restaurant_only_in_category:
                print(f"     被排除的菜品:")
                for dish in restaurant_only_in_category:
                    print(f"       • {dish.get('description', 'N/A')}")
        
        return True
        
    except Exception as e:
        print(f"❌ 测试失败: {e}")
        return False

def main():
    """主函数"""
    print("=" * 60)
    print("测试排除只限餐厅菜品的过滤功能")
    print("=" * 60)
    
    success = test_filter_exclude_restaurant_only()
    
    if success:
        print("\\n✅ 测试完成!")
        print("\\n现在前端应用会自动排除onlyRestaurant:true的菜品")
        print("\\n建议:")
        print("1. 访问 http://localhost:3000/category-mapping-debug 查看过滤效果")
        print("2. 访问 http://localhost:3000/menu 测试主菜单页面")
    else:
        print("\\n❌ 测试失败!")

if __name__ == "__main__":
    main()