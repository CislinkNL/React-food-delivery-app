import React, { useState } from 'react';
import { databaseService } from '../services/DatabaseService';
import { DatabasePaths } from '../config/FirebaseConfig';
import { accessControlService } from '../services/AccessControlService';

const CategoryDataManager = () => {
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);

    // 示例分类数据
    const foodCategoriesData = {
        main: {
            name: '主菜',
            icon: 'ri-restaurant-line',
            description: '各种主菜和正餐',
            order: 1,
            isActive: true
        },
        appetizer: {
            name: '开胃菜',
            icon: 'ri-cake-line',
            description: '开胃小菜和前菜',
            order: 2,
            isActive: true
        },
        hotpot: {
            name: '火锅',
            icon: 'ri-fire-line',
            description: '各式火锅料理',
            order: 3,
            isActive: true
        },
        noodles: {
            name: '面食',
            icon: 'ri-bowl-line',
            description: '面条、拉面等面食',
            order: 4,
            isActive: true
        },
        rice: {
            name: '米饭',
            icon: 'ri-restaurant-2-line',
            description: '各种米饭类主食',
            order: 5,
            isActive: true
        }
    };

    const drinksCategoriesData = {
        tea: {
            name: '茶饮',
            icon: 'ri-cup-line',
            description: '各种茶类饮品',
            order: 1,
            isActive: true
        },
        coffee: {
            name: '咖啡',
            icon: 'ri-cup-2-line',
            description: '咖啡和咖啡饮品',
            order: 2,
            isActive: true
        },
        juice: {
            name: '果汁',
            icon: 'ri-drinks-2-line',
            description: '新鲜果汁和饮料',
            order: 3,
            isActive: true
        },
        soda: {
            name: '汽水',
            icon: 'ri-bottle-line',
            description: '碳酸饮料和汽水',
            order: 4,
            isActive: true
        },
        alcohol: {
            name: '酒类',
            icon: 'ri-wine-glass-line',
            description: '啤酒、白酒等酒类',
            order: 5,
            isActive: true
        }
    };

    // 创建分类数据
    const createCategoriesData = async () => {
        try {
            setLoading(true);
            setResult('开始创建分类数据...');

            // 确保访问权限
            await accessControlService.ensureAccess();

            // 写入食物分类
            console.log('写入食物分类到路径:', DatabasePaths.categories.food);
            await databaseService.write(DatabasePaths.categories.food, foodCategoriesData);

            // 写入饮品分类
            console.log('写入饮品分类到路径:', DatabasePaths.categories.drinks);
            await databaseService.write(DatabasePaths.categories.drinks, drinksCategoriesData);

            setResult(`分类数据创建成功！
食物分类路径: ${DatabasePaths.categories.food}
饮品分类路径: ${DatabasePaths.categories.drinks}

食物分类 (${Object.keys(foodCategoriesData).length} 个):
${Object.entries(foodCategoriesData).map(([key, value]) => `- ${key}: ${value.name}`).join('\n')}

饮品分类 (${Object.keys(drinksCategoriesData).length} 个):
${Object.entries(drinksCategoriesData).map(([key, value]) => `- ${key}: ${value.name}`).join('\n')}`);

        } catch (error) {
            console.error('创建分类数据失败:', error);
            setResult(`创建分类数据失败: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    // 读取分类数据
    const readCategoriesData = async () => {
        try {
            setLoading(true);
            setResult('开始读取分类数据...');

            await accessControlService.ensureAccess();

            // 读取食物分类
            const foodData = await databaseService.read(DatabasePaths.categories.food);
            console.log('食物分类数据:', foodData);

            // 读取饮品分类
            const drinksData = await databaseService.read(DatabasePaths.categories.drinks);
            console.log('饮品分类数据:', drinksData);

            setResult(`分类数据读取完成！

食物分类路径: ${DatabasePaths.categories.food}
食物分类数据: ${foodData ? `${Object.keys(foodData).length} 个分类` : '未找到数据'}

饮品分类路径: ${DatabasePaths.categories.drinks}
饮品分类数据: ${drinksData ? `${Object.keys(drinksData).length} 个分类` : '未找到数据'}

详细数据请查看浏览器控制台`);

        } catch (error) {
            console.error('读取分类数据失败:', error);
            setResult(`读取分类数据失败: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    // 清空分类数据
    const clearCategoriesData = async () => {
        try {
            setLoading(true);
            setResult('开始清空分类数据...');

            await accessControlService.ensureAccess();

            // 删除食物分类
            await databaseService.delete(DatabasePaths.categories.food);

            // 删除饮品分类
            await databaseService.delete(DatabasePaths.categories.drinks);

            setResult('分类数据已清空');
        } catch (error) {
            console.error('清空分类数据失败:', error);
            setResult(`清空分类数据失败: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="category-manager" style={{ padding: '2rem', backgroundColor: '#f8f9fa', borderRadius: '8px', margin: '1rem 0' }}>
            <h3>🗂️ 分类数据管理器</h3>
            <p style={{ color: '#666', marginBottom: '1rem' }}>
                管理Firebase中的分类数据: <br />
                食物分类路径: <code>{DatabasePaths.categories.food}</code><br />
                饮品分类路径: <code>{DatabasePaths.categories.drinks}</code>
            </p>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                <button
                    onClick={createCategoriesData}
                    disabled={loading}
                    style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: loading ? 'not-allowed' : 'pointer'
                    }}
                >
                    {loading ? '处理中...' : '创建分类数据'}
                </button>

                <button
                    onClick={readCategoriesData}
                    disabled={loading}
                    style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: loading ? 'not-allowed' : 'pointer'
                    }}
                >
                    {loading ? '处理中...' : '读取分类数据'}
                </button>

                <button
                    onClick={clearCategoriesData}
                    disabled={loading}
                    style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: loading ? 'not-allowed' : 'pointer'
                    }}
                >
                    {loading ? '处理中...' : '清空分类数据'}
                </button>
            </div>

            {result && (
                <div style={{
                    marginTop: '1rem',
                    padding: '1rem',
                    backgroundColor: '#fff',
                    borderRadius: '4px',
                    border: '1px solid #ddd',
                    whiteSpace: 'pre-line',
                    fontFamily: 'monospace',
                    fontSize: '0.9rem'
                }}>
                    {result}
                </div>
            )}
        </div>
    );
};

export default CategoryDataManager;