#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
简化版Firebase菜单更新脚本
使用外部配置文件

使用前准备:
1. pip install firebase-admin
2. 确保Firebase Admin SDK密钥文件存在
3. 检查update_config.py中的配置

使用方法:
python simple_update.py --dry-run  # 测试模式
python simple_update.py           # 实际更新
"""

import json
import firebase_admin
from firebase_admin import credentials, db
import sys
import time
from update_config import *

class SimpleMenuUpdater:
    def __init__(self):
        """初始化更新器"""
        self.firebase_initialized = False
    
    def init_firebase(self):
        """初始化Firebase连接"""
        if self.firebase_initialized:
            return True
            
        try:
            if not firebase_admin._apps:
                cred = credentials.Certificate(SERVICE_ACCOUNT_PATH)
                firebase_admin.initialize_app(cred, {'databaseURL': DATABASE_URL})
            
            self.firebase_initialized = True
            print("✅ Firebase连接成功")
            return True
        except Exception as e:
            print(f"❌ Firebase连接失败: {e}")
            return False
    
    def get_category_from_sorting(self, sorting_nrm):
        """根据sortingNrm获取分类ID"""
        if not sorting_nrm:
            return "Cat1"
            
        for (min_val, max_val), category_id in CATEGORY_MAPPING.items():
            if min_val <= sorting_nrm <= max_val:
                return category_id
        
        # 默认分类
        return "Cat1" if sorting_nrm < 200 else "Cat16"
    
    def is_only_restaurant(self, item):
        """判断是否只限餐厅"""
        # 检查ID
        if str(item.get('id', '')) in ONLY_RESTAURANT_RULES["ids"]:
            return True
            
        # 检查关键词
        text_to_check = (
            item.get('description', '') + ' ' + 
            item.get('allergy', '')
        ).lower()
        
        for keyword in ONLY_RESTAURANT_RULES["keywords"]:
            if keyword in text_to_check:
                return True
                
        return False
    
    def get_options(self, item):
        """获取菜品选项"""
        # 如果已有选项标记
        if item.get('hasOptions', False):
            return "待配置选项"
            
        # 检查关键词
        text_to_check = (
            item.get('description', '') + ' ' + 
            item.get('allergy', '')
        ).lower()
        
        for keyword in HAS_OPTIONS_RULES["keywords"]:
            if keyword in text_to_check:
                return "待配置选项"
                
        return ""
    
    def update_item(self, item):
        """为单个菜品添加新字段"""
        updated = item.copy()
        
        # 添加三个新字段
        updated['onlyRestaurant'] = self.is_only_restaurant(item)
        updated['categoryTakeAway'] = self.get_category_from_sorting(item.get('sortingNrm', 0))
        updated['options'] = self.get_options(item)
        
        return updated
    
    def load_from_file(self):
        """从本地文件加载数据"""
        try:
            with open(LOCAL_MENU_FILE, 'r', encoding='utf-8') as f:
                data = json.load(f)
            print(f"✅ 从文件加载 {len(data)} 个菜品")
            return data
        except Exception as e:
            print(f"❌ 文件加载失败: {e}")
            return None
    
    def load_from_firebase(self):
        """从Firebase加载数据"""
        try:
            ref = db.reference(FIREBASE_MENU_PATH)
            data = ref.get()
            print(f"✅ 从Firebase加载 {len(data or {})} 个菜品")
            return data
        except Exception as e:
            print(f"❌ Firebase加载失败: {e}")
            return None
    
    def save_to_firebase(self, data, dry_run=False):
        """保存到Firebase"""
        if dry_run:
            print("🧪 测试模式 - 跳过Firebase更新")
            return True
            
        try:
            ref = db.reference(FIREBASE_MENU_PATH)
            
            # 分批更新
            items = list(data.items())
            total_batches = (len(items) + BATCH_SIZE - 1) // BATCH_SIZE
            
            print(f"🔄 开始更新，共{len(items)}个菜品，分{total_batches}批...")
            
            for i in range(0, len(items), BATCH_SIZE):
                batch = dict(items[i:i + BATCH_SIZE])
                batch_num = (i // BATCH_SIZE) + 1
                
                print(f"📦 第{batch_num}/{total_batches}批 ({len(batch)}个菜品)")
                ref.update(batch)
                
                if batch_num < total_batches and BATCH_DELAY > 0:
                    time.sleep(BATCH_DELAY)
            
            print("✅ Firebase更新完成")
            return True
            
        except Exception as e:
            print(f"❌ Firebase更新失败: {e}")
            return False
    
    def analyze_data(self, data):
        """分析数据统计"""
        print("\\n📊 数据分析:")
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
    
    def save_backup(self, data, suffix="backup"):
        """保存备份文件"""
        filename = f"menu_{suffix}_{int(time.time())}.json"
        try:
            with open(filename, 'w', encoding='utf-8') as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
            print(f"💾 备份保存: {filename}")
            return filename
        except Exception as e:
            print(f"❌ 备份失败: {e}")
            return None
    
    def run(self, source="local", dry_run=False):
        """执行更新流程"""
        print("🚀 开始菜单字段更新...")
        
        # 初始化Firebase
        if not self.init_firebase():
            return False
        
        # 加载数据
        if source == "local":
            original_data = self.load_from_file()
        else:
            original_data = self.load_from_firebase()
        
        if not original_data:
            return False
        
        # 备份原始数据
        self.save_backup(original_data, "original")
        
        # 更新数据
        print("🔄 添加新字段...")
        updated_data = {}
        for item_id, item in original_data.items():
            updated_data[item_id] = self.update_item(item)
        
        # 分析结果
        self.analyze_data(updated_data)
        
        # 保存更新后的数据
        backup_file = self.save_backup(updated_data, "updated")
        
        if dry_run:
            print("\\n🧪 测试完成，数据未实际更新")
            return True
        
        # 确认更新
        print("\\n⚠️ 即将更新Firebase数据库")
        confirm = input("确认继续? (y/N): ").strip().lower()
        
        if confirm != 'y':
            print("❌ 用户取消")
            return False
        
        # 执行更新
        success = self.save_to_firebase(updated_data, dry_run=False)
        
        if success:
            print(f"\\n🎉 更新完成! 备份文件: {backup_file}")
        
        return success

def main():
    """主函数"""
    dry_run = "--dry-run" in sys.argv
    
    if "--help" in sys.argv:
        print("""
菜单字段更新脚本

使用方法:
  python simple_update.py              # 从本地文件更新到Firebase
  python simple_update.py --dry-run    # 测试模式，不实际更新
  python simple_update.py --help       # 显示帮助
        """)
        return
    
    updater = SimpleMenuUpdater()
    
    print("数据源选择:")
    print("1. 本地JSON文件")
    print("2. Firebase数据库")
    
    choice = input("请选择 (1/2): ").strip()
    
    if choice == "1":
        source = "local"
    elif choice == "2":
        source = "firebase"
    else:
        print("❌ 无效选择")
        return
    
    success = updater.run(source=source, dry_run=dry_run)
    
    if success:
        print("\\n✅ 任务完成!")
    else:
        print("\\n❌ 任务失败!")

if __name__ == "__main__":
    main()