#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
将所有菜品的onlyRestaurant字段设置为false

使用方法:
python set_only_restaurant_false.py
"""

import json
import glob
import os

def update_only_restaurant_to_false():
    """将所有onlyRestaurant字段设置为false"""
    
    # 查找最新的更新文件
    pattern = "menu_updated_*.json"
    files = glob.glob(pattern)
    
    if not files:
        print("❌ 没有找到更新文件")
        return False
    
    # 选择最新的文件
    latest_file = max(files, key=os.path.getctime)
    print(f"📁 处理文件: {latest_file}")
    
    try:
        # 读取数据
        with open(latest_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        print(f"✅ 加载了 {len(data)} 个菜品")
        
        # 统计原来有多少个onlyRestaurant为true
        original_true_count = sum(1 for item in data.values() if item.get('onlyRestaurant', False))
        print(f"📊 原来有 {original_true_count} 个菜品标记为只限餐厅")
        
        # 将所有onlyRestaurant设置为false
        updated_count = 0
        for item_id, item in data.items():
            if item.get('onlyRestaurant', False):
                item['onlyRestaurant'] = False
                updated_count += 1
        
        print(f"🔄 已将 {updated_count} 个菜品的onlyRestaurant改为false")
        
        # 验证所有字段都是false
        final_true_count = sum(1 for item in data.values() if item.get('onlyRestaurant', False))
        print(f"✅ 验证: 现在有 {final_true_count} 个菜品标记为只限餐厅")
        
        # 保存更新后的数据
        new_filename = f"menu_updated_all_false_{int(os.path.getctime(latest_file))}.json"
        with open(new_filename, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        
        print(f"💾 保存新文件: {new_filename}")
        
        # 显示统计信息
        print("\\n📊 更新统计:")
        print(f"总菜品数: {len(data)}")
        print(f"只限餐厅: {final_true_count}")
        print(f"可外卖: {len(data) - final_true_count}")
        
        # 显示分类分布(保持不变)
        categories = {}
        for item in data.values():
            cat = item.get('categoryTakeAway', 'unknown')
            categories[cat] = categories.get(cat, 0) + 1
        
        print("\\n📋 分类分布(保持不变):")
        for cat, count in sorted(categories.items()):
            print(f"  {cat}: {count}")
        
        return True
        
    except Exception as e:
        print(f"❌ 处理失败: {e}")
        return False

def main():
    """主函数"""
    print("=" * 50)
    print("将所有菜品onlyRestaurant设置为false")
    print("=" * 50)
    
    print("\\n⚠️ 此操作将把所有菜品标记为可外卖")
    confirm = input("确认继续? (y/N): ").strip().lower()
    
    if confirm != 'y':
        print("❌ 操作取消")
        return
    
    success = update_only_restaurant_to_false()
    
    if success:
        print("\\n✅ 更新完成!")
        print("\\n🚀 如需上传到Firebase，请运行:")
        print("   python simple_update.py")
        print("   (选择使用最新的JSON文件)")
    else:
        print("\\n❌ 更新失败!")

if __name__ == "__main__":
    main()