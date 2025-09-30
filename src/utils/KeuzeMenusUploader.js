import { databaseService } from '../services/DatabaseService';
import { DatabasePaths } from '../config/FirebaseConfig';

// KeuzeMenus 数据 - 直接定义在文件中，避免文件读取问题
const keuzeMenusData = {
    "pittigheid_basic": {
        "id": "pittigheid_basic",
        "name": "Pittigheid",
        "nameEn": "Spiciness",
        "nameCn": "辣度",
        "type": "single_choice",
        "required": true,
        "displayOrder": 1,
        "options": [
            {
                "id": "mild",
                "name": "Mild",
                "nameCn": "微辣",
                "price": 0,
                "available": true
            },
            {
                "id": "medium",
                "name": "Medium",
                "nameCn": "中辣",
                "price": 0,
                "available": true,
                "default": true
            },
            {
                "id": "hot",
                "name": "Heet",
                "nameCn": "重辣",
                "price": 0.5,
                "available": true
            },
            {
                "id": "extra_hot",
                "name": "Extra Heet",
                "nameCn": "特辣",
                "price": 1,
                "available": true
            }
        ]
    },
    "portiegrootte_standard": {
        "id": "portiegrootte_standard",
        "name": "Portiegrootte",
        "nameEn": "Portion Size",
        "nameCn": "分量",
        "type": "single_choice",
        "required": true,
        "displayOrder": 2,
        "options": [
            {
                "id": "small",
                "name": "Klein",
                "nameCn": "小份",
                "price": -1,
                "available": true
            },
            {
                "id": "normal",
                "name": "Normaal",
                "nameCn": "正常",
                "price": 0,
                "available": true,
                "default": true
            },
            {
                "id": "large",
                "name": "Groot",
                "nameCn": "大份",
                "price": 2,
                "available": true
            }
        ]
    },
    "extra_ingredienten": {
        "id": "extra_ingredienten",
        "name": "Extra Ingrediënten",
        "nameEn": "Extra Ingredients",
        "nameCn": "额外配料",
        "type": "multiple_choice",
        "required": false,
        "displayOrder": 3,
        "options": [
            {
                "id": "avocado",
                "name": "Avocado",
                "nameCn": "牛油果",
                "price": 1.5,
                "available": true
            },
            {
                "id": "komkommer",
                "name": "Komkommer",
                "nameCn": "黄瓜",
                "price": 0.5,
                "available": true
            },
            {
                "id": "sesam",
                "name": "Sesam",
                "nameCn": "芝麻",
                "price": 0.3,
                "available": true
            },
            {
                "id": "wasabi",
                "name": "Extra Wasabi",
                "nameCn": "额外芥末",
                "price": 0.5,
                "available": true
            }
        ]
    }
};

class KeuzeMenusUploader {
    async uploadKeuzeMenusData() {
        try {
            console.log('🚀 开始上传 keuzeMenus 数据...');

            const path = DatabasePaths.menu.keuzeMenus;
            console.log(`📍 上传路径: ${path}`);

            await databaseService.write(path, keuzeMenusData);

            console.log('✅ KeuzeMenus 数据上传成功!');
            console.log(`📦 上传了 ${Object.keys(keuzeMenusData).length} 个选择菜单定义`);

            return true;
        } catch (error) {
            console.error('❌ 上传 keuzeMenus 数据失败:', error);
            throw error;
        }
    }

    async verifyUpload() {
        try {
            console.log('🔍 验证上传结果...');

            const path = DatabasePaths.menu.keuzeMenus;
            const uploadedData = await databaseService.read(path);

            if (uploadedData) {
                console.log('✅ 验证成功!');
                console.log(`📋 找到 ${Object.keys(uploadedData).length} 个选择菜单`);
                console.log('📝 选择菜单列表:', Object.keys(uploadedData));
                return true;
            } else {
                console.log('❌ 验证失败 - 没有找到数据');
                return false;
            }
        } catch (error) {
            console.error('❌ 验证过程出错:', error);
            return false;
        }
    }

    async uploadAndVerify() {
        try {
            await this.uploadKeuzeMenusData();
            const verified = await this.verifyUpload();

            if (verified) {
                console.log('🎉 keuzeMenus 数据上传并验证成功!');
                console.log('💡 现在可以测试选项弹窗了');
            }

            return verified;
        } catch (error) {
            console.error('❌ 上传或验证过程失败:', error);
            return false;
        }
    }
}

export const keuzeMenusUploader = new KeuzeMenusUploader();
export default keuzeMenusUploader;