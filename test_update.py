#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
菜单字段更新测试脚本
用于在不连接Firebase的情况下测试更新逻辑

使用方法:
python test_update.py
"""

import json
from update_config import *

class UpdateTester:
    def __init__(self):
        """初始化测试器"""
        pass
    
    def get_category_from_sorting(self, sorting_nrm):
        """根据sortingNrm获取分类ID"""
        if not sorting_nrm:
            return "Cat1"
            
        for (min_val, max_val), category_id in CATEGORY_MAPPING.items():
            if min_val <= sorting_nrm <= max_val:
                return category_id
        
        return "Cat1" if sorting_nrm < 200 else "Cat16"
    
    def is_only_restaurant(self, item):
        """判断是否只限餐厅"""
        if str(item.get('id', '')) in ONLY_RESTAURANT_RULES["ids"]:
            return True
            
        text = (item.get('description', '') + ' ' + item.get('allergy', '')).lower()
        return any(keyword in text for keyword in ONLY_RESTAURANT_RULES["keywords"])
    
    def get_options(self, item):
        """获取菜品选项"""
        if item.get('hasOptions', False):
            return "待配置选项"
            
        text = (item.get('description', '') + ' ' + item.get('allergy', '')).lower()
        
        for keyword in HAS_OPTIONS_RULES["keywords"]:
            if keyword in text:
                return "待配置选项"
        
        return ""
    
    def update_item(self, item):
        """更新单个菜品"""
        updated = item.copy()
        updated['onlyRestaurant'] = self.is_only_restaurant(item)
        updated['categoryTakeAway'] = self.get_category_from_sorting(item.get('sortingNrm', 0))
        updated['options'] = self.get_options(item)
        return updated
    
    def test_with_sample_data(self):
        """使用示例数据测试"""
        # 创建一些测试数据
        test_items = {
            "item1": {
                "id": "1",
                "description": "Verse zalm nigiri",
                "sortingNrm": 5,
                "price": 2.50,
                "allergy": ""
            },
            "item2": {
                "id": "2", 
                "description": "Sashimi selectie - rawe vis",
                "sortingNrm": 15,
                "price": 12.50,
                "allergy": "niet geschikt voor zwangeren"
            },
            "item3": {
                "id": "3",
                "description": "Coca Cola",
                "sortingNrm": 205,
                "price": 2.50,
                "allergy": ""
            },
            "item4": {
                "id": "4",
                "description": "Ramen soep met keuze van topping",
                "sortingNrm": 80,
                "price": 8.50,
                "allergy": "",
                "hasOptions": True
            }
        }
        
        print("🧪 测试菜品字段更新逻辑\\n")
        
        for item_id, item in test_items.items():
            print(f"📝 测试菜品: {item_id}")
            print(f"   原始: {item['description']} (sortingNrm: {item['sortingNrm']})")
            
            updated = self.update_item(item)
            
            print(f"   ✅ onlyRestaurant: {updated['onlyRestaurant']}")
            print(f"   ✅ categoryTakeAway: {updated['categoryTakeAway']}")
            print(f"   ✅ options: '{updated['options']}'")
            print()
        
        return test_items
    
    def test_with_real_data(self):
        """使用真实数据文件测试"""
        try:
            with open(LOCAL_MENU_FILE, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            print(f"📁 加载真实数据: {len(data)} 个菜品\\n")
            
            # 更新所有数据
            updated_data = {}
            for item_id, item in data.items():
                updated_data[item_id] = self.update_item(item)
            
            # 分析结果
            self.analyze_results(updated_data)
            
            # 保存测试结果
            with open('test_result.json', 'w', encoding='utf-8') as f:
                json.dump(updated_data, f, ensure_ascii=False, indent=2)
            
            print("💾 测试结果保存到 test_result.json")
            return updated_data
            
        except FileNotFoundError:
            print(f"❌ 找不到文件: {LOCAL_MENU_FILE}")
            return None
        except Exception as e:
            print(f"❌ 测试失败: {e}")
            return None
    
    def analyze_results(self, data):
        """分析测试结果"""
        print("📊 结果分析:")
        print(f"总菜品数: {len(data)}")
        
        # 统计新字段
        only_restaurant = sum(1 for item in data.values() if item.get('onlyRestaurant'))
        has_options = sum(1 for item in data.values() if item.get('options'))
        
        print(f"只限餐厅: {only_restaurant}")
        print(f"有选项: {has_options}")
        
        # 分类统计
        categories = {}
        for item in data.values():
            cat = item.get('categoryTakeAway', 'unknown')
            categories[cat] = categories.get(cat, 0) + 1
        
        print("\\n📋 分类分布:")
        for cat, count in sorted(categories.items()):
            print(f"  {cat}: {count}")
        
        # 显示一些样例
        print("\\n🔍 样例展示:")
        count = 0
        for item_id, item in data.items():
            if count >= 5:
                break
            
            print(f"\\n{item_id}: {item.get('description', '')[:40]}...")
            print(f"  sortingNrm: {item.get('sortingNrm')}")
            print(f"  onlyRestaurant: {item.get('onlyRestaurant')}")
            print(f"  categoryTakeAway: {item.get('categoryTakeAway')}")
            print(f"  options: '{item.get('options')}'")
            
            count += 1
    
    def test_mapping_coverage(self):
        """测试分类映射覆盖率"""
        print("🗺️ 测试分类映射覆盖率\\n")
        
        # 测试各个范围
        test_values = [1, 5, 12, 13, 25, 30, 31, 50, 54, 55, 60, 61, 
                       62, 70, 71, 72, 75, 76, 77, 90, 100, 101, 130, 136,
                       137, 145, 146, 147, 180, 200, 201, 210, 219, 220, 
                       225, 230, 231, 240, 244, 245, 248, 249, 250, 280, 
                       291, 292, 310, 313, 314, 350, 400, 999]
        
        for val in test_values:
            category = self.get_category_from_sorting(val)
            print(f"sortingNrm {val:3d} → {category}")
    
    def run_all_tests(self):
        """运行所有测试"""
        print("=" * 60)
        print("菜单字段更新逻辑测试")
        print("=" * 60)
        
        # 测试1: 示例数据
        print("\\n1️⃣ 示例数据测试:")
        self.test_with_sample_data()
        
        # 测试2: 分类映射
        print("\\n2️⃣ 分类映射测试:")
        self.test_mapping_coverage()
        
        # 测试3: 真实数据 (如果存在)
        print("\\n3️⃣ 真实数据测试:")
        result = self.test_with_real_data()
        
        print("\\n" + "=" * 60)
        print("✅ 所有测试完成")
        
        return result

def main():
    """主函数"""
    tester = UpdateTester()
    tester.run_all_tests()

if __name__ == "__main__":
    main()