#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Import keuzeMenus data to Firebase
This script imports the generated JSON files to Firebase Realtime Database
"""

import json
import firebase_admin
from firebase_admin import credentials
from firebase_admin import db
import sys
import os

# Configuration
SERVICE_ACCOUNT_PATH = "cislink-firebase-adminsdk-kt8fr-4c591329ea.json"
DATABASE_URL = "https://cislink-default-rtdb.europe-west1.firebasedatabase.app"
KEUZE_MENUS_PATH = "Develop/keuzeMenus"  # Where to store keuzeMenus data
MENU_PATH = "Develop/menukaart"  # Where the menu items are stored

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

def import_keuze_menus_data():
    """Import keuzeMenus data to Firebase"""
    try:
        # Read the keuzeMenus data file
        with open('tools/keuze_menus_data.json', 'r', encoding='utf-8') as f:
            keuze_menus_data = json.load(f)
        
        print(f"📦 Loaded {len(keuze_menus_data)} keuzeMenus definitions")
        
        # Upload to Firebase
        ref = db.reference(KEUZE_MENUS_PATH)
        ref.set(keuze_menus_data)
        
        print(f"✅ Successfully uploaded keuzeMenus data to Firebase at {KEUZE_MENUS_PATH}")
        return True
        
    except FileNotFoundError:
        print("❌ keuze_menus_data.json file not found in tools/ directory")
        return False
    except Exception as e:
        print(f"❌ Failed to upload keuzeMenus data: {e}")
        return False

def update_menu_items():
    """Update menu items with keuzeMenus field"""
    try:
        # Read the sample updates file
        with open('tools/sample_item_updates.json', 'r', encoding='utf-8') as f:
            updates_data = json.load(f)
        
        items_to_update = updates_data.get('items', {})
        print(f"📝 Found {len(items_to_update)} items to update")
        
        # Get current menu data
        menu_ref = db.reference(MENU_PATH)
        current_menu = menu_ref.get()
        
        if not current_menu:
            print("❌ No menu data found in Firebase")
            return False
        
        # Update items
        update_count = 0
        for item_id, updates in items_to_update.items():
            if item_id in current_menu:
                # Update the specific item
                item_ref = db.reference(f"{MENU_PATH}/{item_id}")
                item_ref.update(updates)
                update_count += 1
                print(f"   ✅ Updated item {item_id} with keuzeMenus: {updates['keuzeMenus']}")
            else:
                print(f"   ⚠️ Item {item_id} not found in menu")
        
        print(f"✅ Successfully updated {update_count} menu items")
        return True
        
    except FileNotFoundError:
        print("❌ sample_item_updates.json file not found in tools/ directory")
        return False
    except Exception as e:
        print(f"❌ Failed to update menu items: {e}")
        return False

def verify_import():
    """Verify that the data was imported correctly"""
    try:
        # Check keuzeMenus data
        keuze_ref = db.reference(KEUZE_MENUS_PATH)
        keuze_data = keuze_ref.get()
        
        if keuze_data:
            print(f"✅ KeuzeMenus data verified: {len(keuze_data)} definitions found")
        else:
            print("❌ KeuzeMenus data not found")
            return False
        
        # Check updated menu items
        menu_ref = db.reference(MENU_PATH)
        menu_data = menu_ref.get()
        
        items_with_keuze = 0
        if menu_data:
            for item_id, item_data in menu_data.items():
                if 'keuzeMenus' in item_data:
                    items_with_keuze += 1
            
            print(f"✅ Menu verification: {items_with_keuze} items have keuzeMenus field")
        
        return True
        
    except Exception as e:
        print(f"❌ Verification failed: {e}")
        return False

def main():
    """Main function"""
    print("🚀 Starting keuzeMenus data import")
    print("=" * 50)
    
    # Initialize Firebase
    if not init_firebase():
        sys.exit(1)
    
    # Import keuzeMenus definitions
    print("\n📦 Importing keuzeMenus definitions...")
    if not import_keuze_menus_data():
        sys.exit(1)
    
    # Update menu items
    print("\n📝 Updating menu items...")
    if not update_menu_items():
        sys.exit(1)
    
    # Verify import
    print("\n🔍 Verifying import...")
    if not verify_import():
        sys.exit(1)
    
    print("\n🎉 Import completed successfully!")
    print("\n💡 You can now test the options modal in your React app")

if __name__ == "__main__":
    main()