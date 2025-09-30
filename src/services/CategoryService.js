import { databaseService } from './DatabaseService';
import { DatabasePaths } from '../config/FirebaseConfig';
import { accessControlService } from './AccessControlService';

// 分类数据服务类
class CategoryService {
    constructor() {
        this.categoriesPath = DatabasePaths.categories.root;
        this.foodCategoriesPath = DatabasePaths.categories.food;
        this.drinksCategoriesPath = DatabasePaths.categories.drinks;

        // 调试：打印配置的路径
        console.log('CategoryService 初始化路径:');
        console.log('- 分类根路径:', this.categoriesPath);
        console.log('- 食物分类路径:', this.foodCategoriesPath);
        console.log('- 饮品分类路径:', this.drinksCategoriesPath);

        // 临时修复：如果路径仍然是旧的，直接使用正确的路径
        if (this.foodCategoriesPath === 'Develop/categories/food') {
            console.log('检测到旧路径，使用正确的路径');
            this.categoriesPath = 'Develop/categorie';
            this.foodCategoriesPath = 'Develop/categorie/food';
            this.drinksCategoriesPath = 'Develop/categorie/drinks';

            console.log('修正后的路径:');
            console.log('- 分类根路径:', this.categoriesPath);
            console.log('- 食物分类路径:', this.foodCategoriesPath);
            console.log('- 饮品分类路径:', this.drinksCategoriesPath);
        }
    }

    // 确保访问权限
    async ensureAccess() {
        return await accessControlService.ensureAccess();
    }

    // 获取所有分类
    async getAllCategories() {
        try {
            // 确保有访问权限
            await this.ensureAccess();

            const categories = await databaseService.read(this.categoriesPath);

            if (categories) {
                // 转换对象为数组
                const categoryArray = Object.keys(categories).map(key => ({
                    id: key,
                    ...categories[key]
                }));
                return categoryArray.map(category => this.transformCategoryData(category));
            }

            // 如果没有数据，返回空数组
            return [];
        } catch (error) {
            console.error('获取分类失败:', error);
            return this.getFallbackCategories();
        }
    }

    // 获取食物分类
    async getFoodCategories() {
        try {
            console.log('开始获取食物分类，路径:', this.foodCategoriesPath);
            await this.ensureAccess();

            const foodCategories = await databaseService.read(this.foodCategoriesPath);
            console.log('食物分类原始数据:', foodCategories);

            if (foodCategories) {
                let categoryArray = [];

                if (Array.isArray(foodCategories)) {
                    // 如果Firebase返回数组，直接使用
                    categoryArray = foodCategories.filter(item => item && item.id && item.name);
                } else if (typeof foodCategories === 'object') {
                    // Firebase经常将数组转换为对象，键为数字索引
                    // 将对象转换回数组
                    const keys = Object.keys(foodCategories);
                    categoryArray = keys
                        .map(key => foodCategories[key])
                        .filter(item => item && item.id && item.name);
                }

                console.log('转换后的食物分类数组:', categoryArray);

                const transformedCategories = categoryArray.map(category => ({
                    id: category.id,
                    name: category.name,
                    type: 'food',
                    target: category.target || 0,
                    icon: this.getCategoryIcon(category.id, 'food'),
                    order: category.target || 999  // 使用target作为排序依据
                }));

                console.log('最终的食物分类:', transformedCategories);
                return transformedCategories;
            }

            console.log('未找到食物分类数据，返回空数组');
            return [];
        } catch (error) {
            console.error('获取食物分类失败:', error);
            return [];
        }
    }

    // 获取饮品分类
    async getDrinksCategories() {
        try {
            console.log('开始获取饮品分类，路径:', this.drinksCategoriesPath);
            await this.ensureAccess();

            const drinksCategories = await databaseService.read(this.drinksCategoriesPath);
            console.log('饮品分类原始数据:', drinksCategories);

            if (drinksCategories) {
                let categoryArray = [];

                if (Array.isArray(drinksCategories)) {
                    // 如果Firebase返回数组，直接使用
                    categoryArray = drinksCategories.filter(item => item && item.id && item.name);
                } else if (typeof drinksCategories === 'object') {
                    // Firebase经常将数组转换为对象，键为数字索引
                    // 将对象转换回数组
                    const keys = Object.keys(drinksCategories);
                    categoryArray = keys
                        .map(key => drinksCategories[key])
                        .filter(item => item && item.id && item.name);
                }

                console.log('转换后的饮品分类数组:', categoryArray);

                const transformedCategories = categoryArray.map(category => ({
                    id: category.id,
                    name: category.name,
                    type: 'drinks',
                    target: category.target || 0,
                    icon: this.getCategoryIcon(category.id, 'drinks'),
                    order: category.target || 999  // 使用target作为排序依据
                }));

                console.log('最终的饮品分类:', transformedCategories);
                return transformedCategories;
            }

            console.log('未找到饮品分类数据，返回空数组');
            return [];
        } catch (error) {
            console.error('获取饮品分类失败:', error);
            return [];
        }
    }

    // 获取合并的分类数据 (食物 + 饮品)
    async getCombinedCategories() {
        try {
            console.log('Begin ophalen gecombineerde categorieën...');

            const [foodCategories, drinksCategories] = await Promise.all([
                this.getFoodCategories(),
                this.getDrinksCategories()
            ]);

            console.log('Voedselcategorieën data:', foodCategories);
            console.log('Drankencategorieën data:', drinksCategories);

            // Voeg "Alle" categorie toe
            const allCategory = {
                id: 'all',
                name: 'Alle',
                icon: 'ri-restaurant-line',
                type: 'all',
                order: 0
            };

            // Combineer alle categorieën
            const combinedCategories = [
                allCategory,
                ...foodCategories,
                ...drinksCategories
            ];

            console.log('Gecombineerde categorieën data:', combinedCategories);

            // Sorteer op order veld
            const sortedCategories = combinedCategories.sort((a, b) => (a.order || 999) - (b.order || 999));
            console.log('Gesorteerde categorieën data:', sortedCategories);

            return sortedCategories;
        } catch (error) {
            console.error('Ophalen gecombineerde categorieën mislukt:', error);
            console.log('Terugval naar backup categorieën data');
            return this.getFallbackCategories();
        }
    }    // 根据分类ID获取分类信息
    async getCategoryById(categoryId) {
        try {
            if (categoryId === 'all') {
                return {
                    id: 'all',
                    name: 'Alle',
                    icon: 'ri-restaurant-line',
                    type: 'all'
                };
            }

            // 先尝试从食物分类中查找
            const foodCategories = await this.getFoodCategories();
            let category = foodCategories.find(cat => cat.id === categoryId);

            if (category) {
                return category;
            }

            // 再从饮品分类中查找
            const drinksCategories = await this.getDrinksCategories();
            category = drinksCategories.find(cat => cat.id === categoryId);

            return category || null;
        } catch (error) {
            console.error('Ophalen categorie via ID mislukt:', error);
            return null;
        }
    }

    // 转换分类数据格式
    transformCategoryData(category) {
        return {
            id: category.id,
            name: category.name || category.title || 'Onbekende categorie',
            icon: category.icon || 'ri-restaurant-line',
            type: category.type || 'food',
            order: category.order || category.target || 999,
            description: category.description || '',
            image: category.image || null,
            isActive: category.isActive !== false // 默认为true
        };
    }

    // 后备分类数据 (荷兰语)
    getFallbackCategories() {
        return [
            {
                id: 'all',
                name: 'Alle',
                icon: 'ri-restaurant-line',
                type: 'all',
                order: 0
            },
            {
                id: 'Cat1',
                name: 'Nigiri',
                icon: 'ri-restaurant-line',
                type: 'food',
                order: 1
            },
            {
                id: 'Cat3',
                name: 'Maki',
                icon: 'ri-cake-line',
                type: 'food',
                order: 2
            },
            {
                id: 'Cat4',
                name: 'Pokebowls',
                icon: 'ri-bowl-line',
                type: 'food',
                order: 3
            },
            {
                id: 'Cat16',
                name: 'Frisdranken',
                icon: 'ri-cup-line',
                type: 'drinks',
                order: 4
            },
            {
                id: 'Cat17',
                name: 'Bieren',
                icon: 'ri-beer-line',
                type: 'drinks',
                order: 5
            }
        ];
    }

    // 验证分类数据结构
    validateCategoryData(category) {
        const required = ['id', 'name'];
        const missing = required.filter(field => !category[field]);

        if (missing.length > 0) {
            throw new Error(`分类数据缺少必需字段: ${missing.join(', ')}`);
        }

        return true;
    }

    // 获取分类统计信息
    async getCategoryStats() {
        try {
            const [foodCategories, drinksCategories] = await Promise.all([
                this.getFoodCategories(),
                this.getDrinksCategories()
            ]);

            return {
                total: foodCategories.length + drinksCategories.length,
                food: foodCategories.length,
                drinks: drinksCategories.length,
                categories: {
                    food: foodCategories,
                    drinks: drinksCategories
                }
            };
        } catch (error) {
            console.error('获取分类统计失败:', error);
            return {
                total: 0,
                food: 0,
                drinks: 0,
                categories: { food: [], drinks: [] }
            };
        }
    }

    // 获取分类图标
    getCategoryIcon(categoryId, type) {
        // 食物分类图标映射
        const foodIcons = {
            'Cat1': 'ri-restaurant-line',      // Nigiri
            'Cat2': 'ri-restaurant-2-line',    // Gunkan/Temaki
            'Cat3': 'ri-bowl-line',            // Sashimi
            'Cat4': 'ri-restaurant-line',      // Maki
            'Cat5': 'ri-cake-line',            // Speciale rollen
            'Cat6': 'ri-restaurant-line',      // Poke bowls
            'Cat7': 'ri-fire-line',            // Warme gerechten
            'Cat8': 'ri-leaf-line',            // Salade
            'Cat9': 'ri-restaurant-line',      // Voorgerechten
            'Cat10': 'ri-cake-2-line',         // Desserts
            'Cat11': 'ri-restaurant-line'      // Extra's
        };

        // 饮品分类图标映射
        const drinkIcons = {
            'Cat16': 'ri-cup-line',            // Frisdranken
            'Cat17': 'ri-beer-line',           // Bieren
            'Cat18': 'ri-wine-glass-line',     // Wijnen/Aperitieven
            'Cat19': 'ri-cocktail-line',       // Cocktails
            'Cat20': 'ri-glass-line',          // Sterke dranken
            'Cat21': 'ri-cup-line',            // Warme dranken
            'Cat22': 'ri-cup-line'             // Japanse dranken
        };

        if (type === 'food' && foodIcons[categoryId]) {
            return foodIcons[categoryId];
        }

        if (type === 'drinks' && drinkIcons[categoryId]) {
            return drinkIcons[categoryId];
        }

        // 默认图标
        return type === 'drinks' ? 'ri-cup-line' : 'ri-restaurant-line';
    }
}

// 创建单例实例
export const categoryService = new CategoryService();
export default CategoryService;