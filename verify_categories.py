#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
验证Firebase中分类和菜品的对应关系

使用方法:
python verify_categories.py
"""

import json
import firebase_admin
from firebase_admin import credentials, db
from update_config import *

def verify_firebase_data():
    """验证Firebase中的分类和菜品数据"""
    try:
        # 初始化Firebase
        if not firebase_admin._apps:
            cred = credentials.Certificate(SERVICE_ACCOUNT_PATH)
            firebase_admin.initialize_app(cred, {'databaseURL': DATABASE_URL})
        
        print("🔗 连接Firebase成功")
        
        # 获取分类数据
        print("\\n📋 检查分类数据...")
        category_ref = db.reference("Develop/categorie")
        categories_data = category_ref.get()
        
        if categories_data:
            print(f"✅ 分类数据加载成功")
            
            # 分析食物分类
            food_categories = categories_data.get('food', {})
            drink_categories = categories_data.get('drinks', {})
            
            print(f"   🍽️ 食物分类: {len(food_categories)} 个")
            print(f"   🥤 饮品分类: {len(drink_categories)} 个")
            
            # 显示所有分类
            print("\\n   分类列表:")
            all_cats = {}
            
            # 处理food分类 (可能是列表或字典)
            if isinstance(food_categories, list):
                for i, cat_data in enumerate(food_categories):
                    if isinstance(cat_data, dict):
                        cat_id = cat_data.get('id', f'Cat{i+1}')
                        cat_name = cat_data.get('name', 'Unknown')
                        all_cats[cat_id] = f"{cat_name} (食物)"
            elif isinstance(food_categories, dict):
                for cat_id, cat_data in food_categories.items():
                    if isinstance(cat_data, dict):
                        cat_name = cat_data.get('name', 'Unknown')
                        all_cats[cat_id] = f"{cat_name} (食物)"
            
            # 处理drinks分类 (可能是列表或字典)
            if isinstance(drink_categories, list):
                for i, cat_data in enumerate(drink_categories):
                    if isinstance(cat_data, dict):
                        cat_id = cat_data.get('id', f'DrinkCat{i+1}')
                        cat_name = cat_data.get('name', 'Unknown')
                        all_cats[cat_id] = f"{cat_name} (饮品)"
            elif isinstance(drink_categories, dict):
                for cat_id, cat_data in drink_categories.items():
                    if isinstance(cat_data, dict):
                        cat_name = cat_data.get('name', 'Unknown')
                        all_cats[cat_id] = f"{cat_name} (饮品)"
            
            for cat_id, cat_info in sorted(all_cats.items()):
                print(f"     {cat_id}: {cat_info}")
        else:
            print("❌ 无法加载分类数据")
            return False
        
        # 获取菜单数据
        print("\\n🍽️ 检查菜单数据...")
        menu_ref = db.reference(FIREBASE_MENU_PATH)
        menu_data = menu_ref.get()
        
        if menu_data:
            print(f"✅ 菜单数据加载成功: {len(menu_data)} 个菜品")
            
            # 分析categoryTakeAway分布
            category_stats = {}
            missing_category = []
            only_restaurant_count = 0
            has_options_count = 0
            
            for item_id, item_data in menu_data.items():
                # 统计categoryTakeAway
                category = item_data.get('categoryTakeAway', 'missing')
                if category == 'missing' or not category:
                    missing_category.append(item_id)
                    category = 'missing'
                
                category_stats[category] = category_stats.get(category, 0) + 1
                
                # 统计新字段
                if item_data.get('onlyRestaurant', False):
                    only_restaurant_count += 1
                if item_data.get('options', ''):
                    has_options_count += 1
            
            print("\\n📊 菜品统计:")
            print(f"   总菜品数: {len(menu_data)}")
            print(f"   只限餐厅: {only_restaurant_count}")
            print(f"   有选项: {has_options_count}")
            print(f"   缺少categoryTakeAway: {len(missing_category)}")
            
            print("\\n📋 分类分布:")
            for category, count in sorted(category_stats.items()):
                status = "✅" if category in all_cats else "❌" if category != 'missing' else "⚠️"
                cat_name = all_cats.get(category, "未知分类")
                print(f"     {status} {category}: {count} 个菜品 ({cat_name})")
            
            # 验证分类匹配
            print("\\n🔍 分类匹配验证:")
            valid_categories = set(all_cats.keys())
            menu_categories = set(category_stats.keys()) - {'missing'}
            
            # 菜单中有但分类中没有的
            invalid_categories = menu_categories - valid_categories
            if invalid_categories:
                print(f"❌ 菜单中存在无效分类: {invalid_categories}")
            else:
                print("✅ 所有菜单分类都有效")
            
            # 分类中有但菜单中没有的
            unused_categories = valid_categories - menu_categories
            if unused_categories:
                print(f"⚠️ 未使用的分类: {unused_categories}")
            else:
                print("✅ 所有分类都有菜品")
            
            # 显示一些样例
            print("\\n📝 菜品样例:")
            count = 0
            for item_id, item_data in menu_data.items():
                if count >= 3:
                    break
                print(f"\\n   {item_id}: {item_data.get('description', 'N/A')}")
                print(f"     sortingNrm: {item_data.get('sortingNrm', 'N/A')}")
                print(f"     categoryTakeAway: {item_data.get('categoryTakeAway', 'N/A')}")
                print(f"     onlyRestaurant: {item_data.get('onlyRestaurant', 'N/A')}")
                print(f"     options: '{item_data.get('options', 'N/A')}'")
                count += 1
            
            return True
            
        else:
            print("❌ 无法加载菜单数据")
            return False
            
    except Exception as e:
        print(f"❌ 验证失败: {e}")
        return False

def main():
    """主函数"""
    print("=" * 60)
    print("Firebase分类和菜品对应关系验证")
    print("=" * 60)
    
    success = verify_firebase_data()
    
    if success:
        print("\\n✅ 验证完成!")
    else:
        print("\\n❌ 验证失败!")

if __name__ == "__main__":
    main()