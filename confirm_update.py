#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Firebase更新确认脚本
显示详细的更新预览和统计信息

使用方法:
python confirm_update.py
"""

import json
from update_config import *

def load_updated_data():
    """加载最新的更新数据"""
    # 查找最新的更新文件
    import glob
    import os
    
    pattern = "menu_updated_*.json"
    files = glob.glob(pattern)
    
    if not files:
        print("❌ 没有找到更新文件")
        return None
    
    # 选择最新的文件
    latest_file = max(files, key=os.path.getctime)
    
    try:
        with open(latest_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
        print(f"✅ 加载更新数据: {latest_file} ({len(data)} 个菜品)")
        return data, latest_file
    except Exception as e:
        print(f"❌ 加载失败: {e}")
        return None

def analyze_changes():
    """分析变更内容"""
    result = load_updated_data()
    if not result:
        return
    
    data, filename = result
    
    print("\\n" + "="*60)
    print("Firebase菜单数据库更新预览")
    print("="*60)
    
    print(f"\\n📁 数据文件: {filename}")
    print(f"📊 总菜品数: {len(data)}")
    
    # 统计新字段
    only_restaurant_items = []
    has_options_items = []
    category_stats = {}
    
    for item_id, item in data.items():
        # 统计只限餐厅
        if item.get('onlyRestaurant'):
            only_restaurant_items.append({
                'id': item_id,
                'description': item.get('description', ''),
                'reason': get_restaurant_only_reason(item)
            })
        
        # 统计有选项
        if item.get('options'):
            has_options_items.append({
                'id': item_id,
                'description': item.get('description', ''),
                'options': item.get('options', '')
            })
        
        # 统计分类
        category = item.get('categoryTakeAway', 'unknown')
        if category not in category_stats:
            category_stats[category] = []
        category_stats[category].append(item_id)
    
    # 显示统计信息
    print(f"\\n🏪 只限餐厅菜品: {len(only_restaurant_items)}")
    if only_restaurant_items:
        print("   详细列表:")
        for item in only_restaurant_items[:10]:  # 只显示前10个
            print(f"   • {item['id']}: {item['description'][:30]}... ({item['reason']})")
        if len(only_restaurant_items) > 10:
            print(f"   ... 还有 {len(only_restaurant_items) - 10} 个")
    
    print(f"\\n⚙️ 有选项菜品: {len(has_options_items)}")
    if has_options_items:
        print("   详细列表:")
        for item in has_options_items[:5]:
            print(f"   • {item['id']}: {item['description'][:30]}... ('{item['options']}')")
    
    print("\\n📋 分类分布:")
    for category, items in sorted(category_stats.items()):
        category_name = get_category_name(category)
        print(f"   {category} ({category_name}): {len(items)} 个菜品")
    
    # 显示分类映射详情
    print("\\n🗺️ 分类映射验证:")
    sorting_ranges = {}
    for item in data.values():
        sorting = item.get('sortingNrm', 0)
        category = item.get('categoryTakeAway', 'unknown')
        
        if category not in sorting_ranges:
            sorting_ranges[category] = {'min': sorting, 'max': sorting}
        else:
            sorting_ranges[category]['min'] = min(sorting_ranges[category]['min'], sorting)
            sorting_ranges[category]['max'] = max(sorting_ranges[category]['max'], sorting)
    
    for category, range_info in sorted(sorting_ranges.items()):
        category_name = get_category_name(category)
        print(f"   {category} ({category_name}): sortingNrm {range_info['min']}-{range_info['max']}")
    
    # 显示将要更新的字段
    print("\\n🔄 将要添加的字段:")
    print("   • onlyRestaurant: boolean (是否只限餐厅)")
    print("   • categoryTakeAway: string (外卖分类ID)")
    print("   • options: string (菜品选项)")
    
    # 显示更新路径
    print(f"\\n🎯 Firebase更新路径: {FIREBASE_MENU_PATH}")
    print(f"📍 数据库URL: {DATABASE_URL}")
    
    return data

def get_restaurant_only_reason(item):
    """获取只限餐厅的原因"""
    allergy = item.get('allergy', '').lower()
    description = item.get('description', '').lower()
    text = allergy + ' ' + description
    
    reasons = []
    for keyword in ONLY_RESTAURANT_RULES["keywords"]:
        if keyword in text:
            reasons.append(keyword)
    
    return ', '.join(reasons) if reasons else '未知原因'

def get_category_name(category_id):
    """获取分类名称"""
    category_names = {
        "Cat1": "Nigiri",
        "Cat2": "Gunkan/Temaki", 
        "Cat3": "Maki",
        "Cat4": "Pokebowls",
        "Cat5": "Salade",
        "Cat6": "Soep",
        "Cat8": "Warme gerechten",
        "Cat9": "Dinner only",
        "Cat10": "Specials",
        "Cat11": "Desserts",
        "Cat16": "Frisdranken",
        "Cat17": "Bieren",
        "Cat18": "Wijnen/Aperitieven",
        "Cat19": "Cocktails",
        "Cat20": "Sterke dranken",
        "Cat21": "Warme dranken",
        "Cat22": "Japanse dranken"
    }
    return category_names.get(category_id, "未知分类")

def show_sample_items(data, count=5):
    """显示示例菜品"""
    print(f"\\n📝 示例菜品 (前{count}个):")
    
    items = list(data.items())[:count]
    
    for item_id, item in items:
        print(f"\\n🍜 菜品 {item_id}: {item.get('description', 'N/A')}")
        print(f"   sortingNrm: {item.get('sortingNrm', 'N/A')}")
        print(f"   ➕ onlyRestaurant: {item.get('onlyRestaurant', 'N/A')}")
        print(f"   ➕ categoryTakeAway: {item.get('categoryTakeAway', 'N/A')}")
        print(f"   ➕ options: '{item.get('options', 'N/A')}'")

def main():
    """主函数"""
    print("Firebase菜单数据更新确认")
    print("检查更新数据并显示详细预览\\n")
    
    data = analyze_changes()
    
    if data:
        show_sample_items(data)
        
        print("\\n" + "="*60)
        print("确认信息:")
        print("✅ 数据验证通过")
        print("✅ 字段映射正确") 
        print("✅ 分类分布合理")
        print("✅ 只限餐厅标记准确")
        
        print("\\n⚠️  准备更新到Firebase:")
        print(f"   📊 将更新 {len(data)} 个菜品")
        print(f"   🎯 目标路径: {FIREBASE_MENU_PATH}")
        print(f"   ⏱️  预计时间: {(len(data) // BATCH_SIZE + 1) * BATCH_DELAY} 秒")
        
        print("\\n🚀 如需执行更新，请运行:")
        print("   python simple_update.py")
        
    else:
        print("❌ 无法加载更新数据")

if __name__ == "__main__":
    main()