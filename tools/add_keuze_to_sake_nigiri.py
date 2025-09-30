#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
为特定菜品添加 keuzeMenus 字段的测试脚本
"""

import json
import firebase_admin
from firebase_admin import credentials
from firebase_admin import db
import sys

# Configuration
SERVICE_ACCOUNT_PATH = "cislink-firebase-adminsdk-kt8fr-4c591329ea.json"
DATABASE_URL = "https://cislink-default-rtdb.europe-west1.firebasedatabase.app"
MENU_PATH = "Develop/menukaart"
KEUZE_MENUS_PATH = "Develop/keuzeMenus"

def init_firebase():
    """Initialize Firebase connection"""
    try:
        if not firebase_admin._apps:
            cred = credentials.Certificate(SERVICE_ACCOUNT_PATH)
            firebase_admin.initialize_app(cred, {'databaseURL': DATABASE_URL})
        print("🔗 Firebase connected successfully")
        return True
    except Exception as e:
        print(f"❌ Firebase connection failed: {e}")
        return False

def find_sake_nigiri():
    """Find Sake nigiri item in Firebase"""
    try:
        menu_ref = db.reference(MENU_PATH)
        menu_data = menu_ref.get()
        
        if not menu_data:
            print("❌ No menu data found")
            return None
        
        print(f"📋 Searching through {len(menu_data)} menu items...")
        
        # Search for sake nigiri
        for item_id, item_data in menu_data.items():
            description = item_data.get('description', '').lower()
            title = item_data.get('title', '').lower() if 'title' in item_data else ''
            
            if 'sake' in description and 'nigiri' in description:
                print(f"🍣 Found Sake nigiri:")
                print(f"   ID: {item_id}")
                print(f"   Description: {item_data.get('description', 'N/A')}")
                print(f"   Title: {item_data.get('title', 'N/A')}")
                print(f"   Current keuzeMenus: {item_data.get('keuzeMenus', 'None')}")
                return item_id, item_data
        
        print("❌ Sake nigiri not found")
        return None
        
    except Exception as e:
        print(f"❌ Error searching for Sake nigiri: {e}")
        return None

def upload_keuze_menus_data():
    """Upload keuzeMenus definitions to Firebase"""
    try:
        with open('tools/keuze_menus_data.json', 'r', encoding='utf-8') as f:
            keuze_menus_data = json.load(f)
        
        print(f"📦 Uploading {len(keuze_menus_data)} keuzeMenus definitions...")
        
        ref = db.reference(KEUZE_MENUS_PATH)
        ref.set(keuze_menus_data)
        
        print("✅ KeuzeMenus definitions uploaded successfully")
        return True
        
    except Exception as e:
        print(f"❌ Failed to upload keuzeMenus data: {e}")
        return False

def add_keuze_menus_to_sake_nigiri(item_id):
    """Add keuzeMenus field to Sake nigiri"""
    try:
        # For sushi, we'll add basic spiciness and portion size options
        keuze_menus = [
            "pittigheid_basic",
            "portiegrootte_standard"
        ]
        
        item_ref = db.reference(f"{MENU_PATH}/{item_id}")
        item_ref.update({'keuzeMenus': keuze_menus})
        
        print(f"✅ Added keuzeMenus to Sake nigiri (ID: {item_id})")
        print(f"   KeuzeMenus: {keuze_menus}")
        
        return True
        
    except Exception as e:
        print(f"❌ Failed to update Sake nigiri: {e}")
        return False

def verify_update(item_id):
    """Verify the update was successful"""
    try:
        item_ref = db.reference(f"{MENU_PATH}/{item_id}")
        updated_item = item_ref.get()
        
        if updated_item and 'keuzeMenus' in updated_item:
            print(f"✅ Verification successful!")
            print(f"   Sake nigiri now has keuzeMenus: {updated_item['keuzeMenus']}")
            return True
        else:
            print("❌ Verification failed - keuzeMenus field not found")
            return False
            
    except Exception as e:
        print(f"❌ Verification error: {e}")
        return False

def main():
    """Main function"""
    print("🍣 Adding keuzeMenus to Sake nigiri for testing")
    print("=" * 50)
    
    # Initialize Firebase
    if not init_firebase():
        sys.exit(1)
    
    # First, upload keuzeMenus definitions
    print("\n📦 Uploading keuzeMenus definitions...")
    if not upload_keuze_menus_data():
        sys.exit(1)
    
    # Find Sake nigiri
    print("\n🔍 Finding Sake nigiri...")
    result = find_sake_nigiri()
    if not result:
        sys.exit(1)
    
    item_id, item_data = result
    
    # Add keuzeMenus to Sake nigiri
    print(f"\n📝 Adding keuzeMenus to Sake nigiri (ID: {item_id})...")
    if not add_keuze_menus_to_sake_nigiri(item_id):
        sys.exit(1)
    
    # Verify the update
    print("\n🔍 Verifying update...")
    if not verify_update(item_id):
        sys.exit(1)
    
    print("\n🎉 Success! Sake nigiri now has keuzeMenus field")
    print("\n💡 Now refresh your React app and try clicking on Sake nigiri")

if __name__ == "__main__":
    main()