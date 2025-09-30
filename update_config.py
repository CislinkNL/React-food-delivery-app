# Firebase菜单更新脚本配置
# 请根据你的实际情况修改这些配置

# Firebase Admin SDK密钥文件路径
# 请确保此文件存在并且有正确的权限
SERVICE_ACCOUNT_PATH = "cislink-firebase-adminsdk-kt8fr-4c591329ea.json"

# Firebase数据库URL
DATABASE_URL = "https://cislink-default-rtdb.europe-west1.firebasedatabase.app"

# Firebase中菜单数据的路径
FIREBASE_MENU_PATH = "Develop/menukaart"

# 本地示例数据文件路径
LOCAL_MENU_FILE = "example_menukaart_data.json"

# 分类映射规则
# 格式: (最小sortingNrm, 最大sortingNrm): "分类ID"
CATEGORY_MAPPING = {
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

# 只限餐厅的特殊规则
ONLY_RESTAURANT_RULES = {
    # 特定菜品ID (如果有的话)
    "ids": [],
    
    # 描述或过敏信息中的关键词
    "keywords": [
        "sashimi",
        "rauwe",
        "niet geschikt voor zwangeren",
        "alleen restaurant",
        "rauw vlees",
        "rawe vis"
    ]
}

# 有选项的菜品规则
HAS_OPTIONS_RULES = {
    "keywords": [
        "keuze",
        "optie",
        "extra",
        "topping",
        "sauce",
        "bijgerecht",
        "garnering"
    ]
}

# 批处理大小 (一次更新多少个菜品)
BATCH_SIZE = 50

# 是否在批次之间添加延迟 (秒)
BATCH_DELAY = 1