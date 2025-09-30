#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Firebase菜单数据更新脚本
为所有菜品添加新字段: onlyRestaurant, categoryTakeAway, options

依赖:
pip install firebase-admin

使用方法:
1. 确保Firebase Admin SDK密钥文件存在
2. 更新数据库URL和路径配置
3. 运行脚本: python update_menu_fields.py
"""

import json
import firebase_admin
from firebase_admin import credentials
from firebase_admin import db
import sys
from typing import Dict, Any, Optional
import time

class MenuFieldUpdater:
    def __init__(self, service_account_path: str, database_url: str):
        """
        初始化Firebase连接
        
        Args:
            service_account_path: Firebase Admin SDK密钥文件路径
            database_url: Firebase数据库URL
        """
        self.service_account_path = service_account_path
        self.database_url = database_url
        
        # 分类映射规则 (基于sortingNrm)
        self.category_mapping = {
            # 食物分类
            (1, 12): "Cat1",     # Nigiri
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
        
        # 特殊规则配置
        self.special_rules = {
            # 只限餐厅的菜品 (根据ID或其他条件)
            "only_restaurant_ids": [],  # 可以添加特定ID
            "only_restaurant_keywords": ["sashimi", "rauwe", "niet geschikt voor zwangeren"],
            
            # 有选项的菜品
            "has_options_keywords": ["keuze", "optie", "extra", "topping", "sauce"],
        }
        
    def initialize_firebase(self):
        """初始化Firebase连接"""
        try:
            if not firebase_admin._apps:
                cred = credentials.Certificate(self.service_account_path)
                firebase_admin.initialize_app(cred, {
                    'databaseURL': self.database_url
                })
            print("✅ Firebase初始化成功")
            return True
        except Exception as e:
            print(f"❌ Firebase初始化失败: {e}")
            return False
    
    def determine_category_takeaway(self, sorting_nrm: int) -> str:
        """
        根据sortingNrm确定categoryTakeAway
        
        Args:
            sorting_nrm: 菜品排序号
            
        Returns:
            分类ID (如 "Cat1")
        """
        if not sorting_nrm:
            return "Cat1"  # 默认分类
            
        for (min_val, max_val), category_id in self.category_mapping.items():
            if min_val <= sorting_nrm <= max_val:
                return category_id
                
        # 如果没有匹配，根据范围判断
        if sorting_nrm < 200:
            return "Cat1"  # 默认食物分类
        else:
            return "Cat16"  # 默认饮品分类
    
    def determine_only_restaurant(self, item_data: Dict[str, Any]) -> bool:
        """
        判断是否只限餐厅
        
        Args:
            item_data: 菜品数据
            
        Returns:
            是否只限餐厅
        """
        # 检查ID是否在特殊列表中
        item_id = str(item_data.get('id', ''))
        if item_id in self.special_rules["only_restaurant_ids"]:
            return True
            
        # 检查过敏信息或描述中的关键词
        allergy = item_data.get('allergy', '').lower()
        description = item_data.get('description', '').lower()
        
        for keyword in self.special_rules["only_restaurant_keywords"]:
            if keyword in allergy or keyword in description:
                return True
                
        return False
    
    def determine_options(self, item_data: Dict[str, Any]) -> str:
        """
        确定菜品选项
        
        Args:
            item_data: 菜品数据
            
        Returns:
            选项字符串
        """
        # 如果已经有hasOptions字段且为True，可能有选项
        if item_data.get('hasOptions', False):
            return "待配置选项"
            
        # 检查描述中是否提到选项
        allergy = item_data.get('allergy', '').lower()
        description = item_data.get('description', '').lower()
        
        for keyword in self.special_rules["has_options_keywords"]:
            if keyword in allergy or keyword in description:
                return "待配置选项"
                
        return ""
    
    def add_new_fields(self, item_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        为单个菜品添加新字段
        
        Args:
            item_data: 原始菜品数据
            
        Returns:
            添加新字段后的菜品数据
        """
        # 获取sortingNrm
        sorting_nrm = item_data.get('sortingNrm', 0)
        
        # 添加新字段
        updated_item = item_data.copy()
        updated_item['onlyRestaurant'] = self.determine_only_restaurant(item_data)
        updated_item['categoryTakeAway'] = self.determine_category_takeaway(sorting_nrm)
        updated_item['options'] = self.determine_options(item_data)
        
        return updated_item
    
    def load_local_data(self, file_path: str) -> Optional[Dict[str, Any]]:
        """
        从本地JSON文件加载数据
        
        Args:
            file_path: JSON文件路径
            
        Returns:
            菜单数据字典
        """
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
            print(f"✅ 成功加载本地数据: {len(data)} 个菜品")
            return data
        except Exception as e:
            print(f"❌ 加载本地数据失败: {e}")
            return None
    
    def get_firebase_data(self, path: str) -> Optional[Dict[str, Any]]:
        """
        从Firebase获取数据
        
        Args:
            path: Firebase数据路径
            
        Returns:
            菜单数据字典
        """
        try:
            ref = db.reference(path)
            data = ref.get()
            if data:
                print(f"✅ 成功获取Firebase数据: {len(data)} 个菜品")
                return data
            else:
                print("⚠️ Firebase路径为空")
                return None
        except Exception as e:
            print(f"❌ 获取Firebase数据失败: {e}")
            return None
    
    def update_firebase_data(self, path: str, updated_data: Dict[str, Any], batch_size: int = 50) -> bool:
        """
        批量更新Firebase数据
        
        Args:
            path: Firebase数据路径
            updated_data: 更新后的数据
            batch_size: 批处理大小
            
        Returns:
            是否更新成功
        """
        try:
            ref = db.reference(path)
            
            # 分批更新以避免超时
            items = list(updated_data.items())
            total_batches = (len(items) + batch_size - 1) // batch_size
            
            print(f"🔄 开始批量更新，共 {len(items)} 个菜品，分 {total_batches} 批处理...")
            
            for i in range(0, len(items), batch_size):
                batch = dict(items[i:i + batch_size])
                batch_num = (i // batch_size) + 1
                
                print(f"📦 处理第 {batch_num}/{total_batches} 批 ({len(batch)} 个菜品)...")
                
                # 更新这一批数据
                ref.update(batch)
                
                # 添加延迟以避免频率限制
                if batch_num < total_batches:
                    time.sleep(1)
                    
            print("✅ 所有数据更新完成")
            return True
            
        except Exception as e:
            print(f"❌ 更新Firebase数据失败: {e}")
            return False
    
    def analyze_updates(self, original_data: Dict[str, Any], updated_data: Dict[str, Any]):
        """
        分析更新统计
        
        Args:
            original_data: 原始数据
            updated_data: 更新后数据
        """
        print("\\n📊 更新统计分析:")
        print(f"总菜品数量: {len(updated_data)}")
        
        # 统计新字段
        only_restaurant_count = sum(1 for item in updated_data.values() if item.get('onlyRestaurant', False))
        has_options_count = sum(1 for item in updated_data.values() if item.get('options', ''))
        
        print(f"只限餐厅菜品: {only_restaurant_count}")
        print(f"有选项菜品: {has_options_count}")
        
        # 统计分类分布
        category_distribution = {}
        for item in updated_data.values():
            category = item.get('categoryTakeAway', 'unknown')
            category_distribution[category] = category_distribution.get(category, 0) + 1
        
        print("\\n📋 分类分布:")
        for category, count in sorted(category_distribution.items()):
            print(f"  {category}: {count} 个菜品")
    
    def save_backup(self, data: Dict[str, Any], backup_path: str):
        """
        保存备份文件
        
        Args:
            data: 要备份的数据
            backup_path: 备份文件路径
        """
        try:
            with open(backup_path, 'w', encoding='utf-8') as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
            print(f"✅ 备份保存至: {backup_path}")
        except Exception as e:
            print(f"❌ 保存备份失败: {e}")
    
    def run_update(self, source_type: str = "local", source_path: str = "", firebase_path: str = "Develop/menukaart", dry_run: bool = False):
        """
        执行更新流程
        
        Args:
            source_type: 数据源类型 ("local" 或 "firebase")
            source_path: 源文件路径 (local模式)
            firebase_path: Firebase数据路径
            dry_run: 是否只是测试运行
        """
        print("🚀 开始菜单字段更新流程...")
        
        # 初始化Firebase
        if not self.initialize_firebase():
            return False
        
        # 获取原始数据
        if source_type == "local":
            original_data = self.load_local_data(source_path)
        else:
            original_data = self.get_firebase_data(firebase_path)
        
        if not original_data:
            print("❌ 无法获取原始数据")
            return False
        
        # 保存原始数据备份
        backup_path = f"menu_backup_{int(time.time())}.json"
        self.save_backup(original_data, backup_path)
        
        # 更新数据
        print("🔄 开始添加新字段...")
        updated_data = {}
        
        for item_id, item_data in original_data.items():
            updated_item = self.add_new_fields(item_data)
            updated_data[item_id] = updated_item
        
        print(f"✅ 字段添加完成，处理了 {len(updated_data)} 个菜品")
        
        # 分析更新
        self.analyze_updates(original_data, updated_data)
        
        # 保存更新后的数据
        updated_backup_path = f"menu_updated_{int(time.time())}.json"
        self.save_backup(updated_data, updated_backup_path)
        
        if dry_run:
            print("\\n🧪 测试模式 - 不会实际更新Firebase")
            print(f"更新后的数据已保存至: {updated_backup_path}")
            return True
        
        # 询问确认
        print("\\n⚠️ 即将更新Firebase数据库")
        confirm = input("确认继续吗? (y/N): ").lower().strip()
        
        if confirm != 'y':
            print("❌ 用户取消操作")
            return False
        
        # 更新Firebase
        success = self.update_firebase_data(firebase_path, updated_data)
        
        if success:
            print("\\n🎉 更新完成!")
            print(f"原始数据备份: {backup_path}")
            print(f"更新后数据: {updated_backup_path}")
        
        return success

def main():
    """主函数"""
    
    # 配置参数
    CONFIG = {
        "service_account_path": "cislink-firebase-adminsdk-kt8fr-4c591329ea.json",
        "database_url": "https://cislink-default-rtdb.europe-west1.firebasedatabase.app",
        "firebase_path": "Develop/menukaart",
        "local_file": "example_menukaart_data.json"
    }
    
    # 创建更新器
    updater = MenuFieldUpdater(
        service_account_path=CONFIG["service_account_path"],
        database_url=CONFIG["database_url"]
    )
    
    # 检查参数
    if len(sys.argv) > 1:
        if sys.argv[1] == "--dry-run":
            print("🧪 测试模式 - 只分析不更新")
            dry_run = True
        elif sys.argv[1] == "--help":
            print("""
使用方法:
  python update_menu_fields.py          # 正常更新模式
  python update_menu_fields.py --dry-run # 测试模式
  python update_menu_fields.py --help    # 显示帮助
            """)
            return
        else:
            dry_run = False
    else:
        dry_run = False
    
    # 询问数据源
    print("请选择数据源:")
    print("1. 本地JSON文件")
    print("2. Firebase数据库")
    
    choice = input("请输入选择 (1/2): ").strip()
    
    if choice == "1":
        # 从本地文件更新
        success = updater.run_update(
            source_type="local",
            source_path=CONFIG["local_file"],
            firebase_path=CONFIG["firebase_path"],
            dry_run=dry_run
        )
    elif choice == "2":
        # 从Firebase更新
        success = updater.run_update(
            source_type="firebase",
            firebase_path=CONFIG["firebase_path"],
            dry_run=dry_run
        )
    else:
        print("❌ 无效选择")
        return
    
    if success:
        print("\\n✅ 任务完成!")
    else:
        print("\\n❌ 任务失败!")

if __name__ == "__main__":
    main()