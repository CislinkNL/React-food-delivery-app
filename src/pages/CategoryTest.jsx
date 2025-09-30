import React, { useState, useEffect } from 'react';
import { databaseService } from '../services/DatabaseService';
import { DatabasePaths } from '../config/FirebaseConfig';
import { accessControlService } from '../services/AccessControlService';
import { categoryService } from '../services/CategoryService';

const CategoryTestPage = () => {
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);

    // 真实的荷兰语食物分类数据
    const foodCategoriesData = {
        Cat1: {
            name: 'Nigiri',
            target: 1
        },
        Cat2: {
            name: 'Gunkan/Temaki',
            target: 13
        },
        Cat3: {
            name: 'Maki',
            target: 31
        },
        Cat4: {
            name: 'Pokebowls',
            target: 55
        },
        Cat5: {
            name: 'Salade',
            target: 62
        },
        Cat6: {
            name: 'Soep',
            target: 77
        },
        Cat8: {
            name: 'Warme gerechten',
            target: 72
        },
        Cat9: {
            name: 'Dinner only',
            target: 101
        },
        Cat10: {
            name: 'Specials',
            target: 147
        },
        Cat11: {
            name: 'Desserts',
            target: 137
        }
    };

    const drinksCategoriesData = {
        Cat16: {
            name: 'Frisdranken',
            target: 201
        },
        Cat17: {
            name: 'Bieren',
            target: 220
        },
        Cat18: {
            name: 'Wijnen/Aperitieven',
            target: 245
        },
        Cat19: {
            name: 'Cocktails',
            target: 314
        },
        Cat20: {
            name: 'Sterke dranken',
            target: 250
        },
        Cat21: {
            name: 'Warme dranken',
            target: 292
        },
        Cat22: {
            name: 'Japanse dranken',
            target: 231
        }
    };

    // 创建分类数据
    const createCategoriesData = async () => {
        try {
            setLoading(true);
            setResult('Begin met aanmaken categorieën data...');

            console.log('Categorieën data aanmaken - start');
            console.log('Voedselcategorieën pad:', DatabasePaths.categories.food);
            console.log('Drankencategorieën pad:', DatabasePaths.categories.drinks);

            // 确保访问权限
            await accessControlService.ensureAccess();

            // 写入食物分类
            await databaseService.write(DatabasePaths.categories.food, foodCategoriesData);
            console.log('Voedselcategorieën data weggeschreven');

            // 写入饮品分类
            await databaseService.write(DatabasePaths.categories.drinks, drinksCategoriesData);
            console.log('Drankencategorieën data weggeschreven');

            setResult(`✅ Categorieën data succesvol aangemaakt!

📍 Data paden:
- Voedselcategorieën: ${DatabasePaths.categories.food}
- Drankencategorieën: ${DatabasePaths.categories.drinks}

📊 Aangemaakte data:
Voedselcategorieën (${Object.keys(foodCategoriesData).length} stuks):
${Object.entries(foodCategoriesData).map(([key, value]) => `• ${key}: ${value.name}`).join('\n')}

Drankencategorieën (${Object.keys(drinksCategoriesData).length} stuks):
${Object.entries(drinksCategoriesData).map(([key, value]) => `• ${key}: ${value.name}`).join('\n')}

💡 Ververs nu de menupagina om de categorielabels te bekijken`);

        } catch (error) {
            console.error('Categorieën data aanmaken mislukt:', error);
            setResult(`❌ Categorieën data aanmaken mislukt: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };    // 测试分类服务
    const testCategoryService = async () => {
        try {
            setLoading(true);
            setResult('开始测试分类服务...');

            console.log('测试CategoryService - 开始');

            // 测试食物分类
            const foodCategories = await categoryService.getFoodCategories();
            console.log('食物分类结果:', foodCategories);

            // 测试饮品分类
            const drinksCategories = await categoryService.getDrinksCategories();
            console.log('饮品分类结果:', drinksCategories);

            // 测试合并分类
            const combinedCategories = await categoryService.getCombinedCategories();
            console.log('合并分类结果:', combinedCategories);

            setResult(`🧪 分类服务测试完成！

📊 测试结果:
- 食物分类: ${foodCategories.length} 个
- 饮品分类: ${drinksCategories.length} 个
- 合并分类: ${combinedCategories.length} 个

📋 合并分类详情:
${combinedCategories.map((cat, index) => `${index + 1}. ${cat.name} (${cat.id}) - ${cat.type}`).join('\n')}

💡 详细信息请查看浏览器控制台`);

        } catch (error) {
            console.error('测试分类服务失败:', error);
            setResult(`❌ 测试分类服务失败: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    // 读取原始数据
    const readRawData = async () => {
        try {
            setLoading(true);
            setResult('读取原始分类数据...');

            await accessControlService.ensureAccess();

            // 读取食物分类
            const foodData = await databaseService.read(DatabasePaths.categories.food);
            console.log('原始食物分类数据:', foodData);

            // 读取饮品分类
            const drinksData = await databaseService.read(DatabasePaths.categories.drinks);
            console.log('原始饮品分类数据:', drinksData);

            setResult(`📖 原始数据读取完成！

🍽️ 食物分类路径: ${DatabasePaths.categories.food}
状态: ${foodData ? `✅ 找到 ${Object.keys(foodData).length} 个分类` : '❌ 未找到数据'}

🥤 饮品分类路径: ${DatabasePaths.categories.drinks}
状态: ${drinksData ? `✅ 找到 ${Object.keys(drinksData).length} 个分类` : '❌ 未找到数据'}

💡 详细数据请查看浏览器控制台`);

        } catch (error) {
            console.error('读取原始数据失败:', error);
            setResult(`❌ 读取原始数据失败: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
            <h1>🗂️ Categorieën Data Test Tool</h1>

            <div style={{ backgroundColor: '#f8f9fa', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
                <h3>📍 Huidige geconfigureerde paden</h3>
                <p><strong>Voedselcategorieën:</strong> <code>{DatabasePaths.categories.food}</code></p>
                <p><strong>Drankencategorieën:</strong> <code>{DatabasePaths.categories.drinks}</code></p>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                <button
                    onClick={readRawData}
                    disabled={loading}
                    style={{
                        padding: '0.75rem 1.5rem',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        fontSize: '1rem'
                    }}
                >
                    📖 Lees ruwe data
                </button>

                <button
                    onClick={createCategoriesData}
                    disabled={loading}
                    style={{
                        padding: '0.75rem 1.5rem',
                        backgroundColor: '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        fontSize: '1rem'
                    }}
                >
                    ✨ Maak voorbeelddata aan
                </button>

                <button
                    onClick={testCategoryService}
                    disabled={loading}
                    style={{
                        padding: '0.75rem 1.5rem',
                        backgroundColor: '#6f42c1',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        fontSize: '1rem'
                    }}
                >
                    🧪 Test categorieënservice
                </button>
            </div>

            {loading && (
                <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                    <div style={{
                        display: 'inline-block',
                        width: '20px',
                        height: '20px',
                        border: '3px solid #f3f3f3',
                        borderTop: '3px solid #007bff',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                    }}></div>
                    <p>Bezig met verwerken...</p>
                </div>
            )}            {result && (
                <div style={{
                    marginTop: '1rem',
                    padding: '1.5rem',
                    backgroundColor: '#fff',
                    borderRadius: '8px',
                    border: '1px solid #ddd',
                    whiteSpace: 'pre-line',
                    fontFamily: 'monospace',
                    fontSize: '0.9rem',
                    maxHeight: '400px',
                    overflowY: 'auto'
                }}>
                    {result}
                </div>
            )}

            <style jsx>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default CategoryTestPage;