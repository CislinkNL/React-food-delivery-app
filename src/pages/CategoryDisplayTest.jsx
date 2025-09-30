import React, { useState, useEffect } from 'react';
import { menuService } from '../services/MenuService';
import { categoryService } from '../services/CategoryService';
import 'bootstrap/dist/css/bootstrap.min.css';

const CategoryDisplayTest = () => {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [dishes, setDishes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [stats, setStats] = useState({});

    // 加载分类列表
    useEffect(() => {
        const loadCategories = async () => {
            try {
                const categoryData = await categoryService.getCombinedCategories();
                console.log('🏷️ 加载的分类:', categoryData);

                // 添加"所有"选项
                const allCategories = [
                    { id: 'all', name: 'Alle Categorieën', nameNL: 'Alle Categorieën' },
                    ...categoryData
                ];

                setCategories(allCategories);
            } catch (err) {
                console.error('❌ 加载分类失败:', err);
                setError('加载分类失败');
            }
        };

        loadCategories();
    }, []);

    // 加载菜品数据
    useEffect(() => {
        const loadDishes = async () => {
            if (!selectedCategory) return;

            try {
                setLoading(true);
                setError(null);

                console.log(`🍽️ 加载分类 "${selectedCategory}" 的菜品...`);

                let dishData;
                if (selectedCategory === 'all') {
                    dishData = await menuService.getAllDishes();
                } else {
                    dishData = await menuService.getDishesByCategory(selectedCategory);
                }

                console.log(`✅ 加载完成: ${dishData.length} 个菜品`);
                setDishes(dishData);

                // 计算统计信息
                const categoryStats = {};
                dishData.forEach(dish => {
                    const cat = dish.categoryTakeAway || dish.category || 'unknown';
                    categoryStats[cat] = (categoryStats[cat] || 0) + 1;
                });
                setStats(categoryStats);

            } catch (err) {
                console.error('❌ 加载菜品失败:', err);
                setError(`加载菜品失败: ${err.message}`);
                setDishes([]);
            } finally {
                setLoading(false);
            }
        };

        loadDishes();
    }, [selectedCategory]);

    const handleCategoryChange = (categoryId) => {
        console.log(`🔄 切换到分类: ${categoryId}`);
        setSelectedCategory(categoryId);
    };

    return (
        <div className="container mt-4">
            <div className="row">
                <div className="col-12">
                    <h1 className="mb-4">分类显示测试</h1>
                    <p className="text-muted">测试每个分类是否正确显示对应的菜品</p>
                </div>
            </div>

            {/* 分类选择 */}
            <div className="row mb-4">
                <div className="col-12">
                    <div className="card">
                        <div className="card-header">
                            <h5>分类选择</h5>
                        </div>
                        <div className="card-body">
                            <div className="row">
                                {categories.map(category => (
                                    <div key={category.id} className="col-md-3 col-sm-6 mb-2">
                                        <button
                                            className={`btn w-100 ${selectedCategory === category.id
                                                    ? 'btn-primary'
                                                    : 'btn-outline-primary'
                                                }`}
                                            onClick={() => handleCategoryChange(category.id)}
                                        >
                                            {category.nameNL || category.name}
                                            {category.id !== 'all' && (
                                                <span className="badge bg-secondary ms-2">
                                                    {category.id}
                                                </span>
                                            )}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 当前分类信息 */}
            <div className="row mb-4">
                <div className="col-12">
                    <div className="card">
                        <div className="card-header">
                            <h5>当前分类: {categories.find(c => c.id === selectedCategory)?.nameNL || selectedCategory}</h5>
                        </div>
                        <div className="card-body">
                            {loading ? (
                                <div className="text-center">
                                    <div className="spinner-border" role="status">
                                        <span className="visually-hidden">加载中...</span>
                                    </div>
                                    <p>正在加载菜品...</p>
                                </div>
                            ) : error ? (
                                <div className="alert alert-danger">
                                    <strong>错误:</strong> {error}
                                </div>
                            ) : (
                                <div>
                                    <p><strong>菜品总数:</strong> {dishes.length}</p>

                                    {selectedCategory === 'all' && Object.keys(stats).length > 0 && (
                                        <div>
                                            <h6>分类分布:</h6>
                                            <div className="row">
                                                {Object.entries(stats).map(([category, count]) => (
                                                    <div key={category} className="col-md-3 col-sm-6 mb-2">
                                                        <span className="badge bg-info me-2">{category}</span>
                                                        <span>{count} 个菜品</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* 菜品列表 */}
            {!loading && !error && dishes.length > 0 && (
                <div className="row">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-header">
                                <h5>菜品列表 ({dishes.length} 个)</h5>
                            </div>
                            <div className="card-body">
                                <div className="table-responsive">
                                    <table className="table table-striped">
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>菜品名称</th>
                                                <th>sortingNrm</th>
                                                <th>categoryTakeAway</th>
                                                <th>onlyRestaurant</th>
                                                <th>价格</th>
                                                <th>状态</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {dishes.slice(0, 20).map(dish => (
                                                <tr key={dish.id}>
                                                    <td>{dish.id}</td>
                                                    <td>
                                                        <div>
                                                            <strong>{dish.description || dish.name}</strong>
                                                            {dish.allergy && (
                                                                <>
                                                                    <br />
                                                                    <small className="text-muted">
                                                                        {dish.allergy.substring(0, 50)}...
                                                                    </small>
                                                                </>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <span className="badge bg-secondary">
                                                            {dish.sortingNrm || 'N/A'}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <span className={`badge ${dish.categoryTakeAway === selectedCategory
                                                                ? 'bg-success'
                                                                : selectedCategory === 'all'
                                                                    ? 'bg-info'
                                                                    : 'bg-warning'
                                                            }`}>
                                                            {dish.categoryTakeAway || 'N/A'}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <span className={`badge ${dish.onlyRestaurant ? 'bg-danger' : 'bg-success'
                                                            }`}>
                                                            {dish.onlyRestaurant ? '仅餐厅' : '可外卖'}
                                                        </span>
                                                    </td>
                                                    <td>€{dish.price || 0}</td>
                                                    <td>
                                                        <span className={`badge ${dish.status === 'beschikbaar' ? 'bg-success' : 'bg-warning'
                                                            }`}>
                                                            {dish.status || 'N/A'}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    {dishes.length > 20 && (
                                        <p className="text-muted text-center">
                                            显示前20个菜品，总共 {dishes.length} 个
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* 验证结果 */}
            {!loading && !error && selectedCategory !== 'all' && dishes.length > 0 && (
                <div className="row mt-4">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-header">
                                <h5>分类验证结果</h5>
                            </div>
                            <div className="card-body">
                                {(() => {
                                    const correctItems = dishes.filter(dish =>
                                        dish.categoryTakeAway === selectedCategory
                                    );
                                    const incorrectItems = dishes.filter(dish =>
                                        dish.categoryTakeAway !== selectedCategory
                                    );

                                    return (
                                        <div>
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <div className={`alert ${correctItems.length === dishes.length ? 'alert-success' : 'alert-warning'}`}>
                                                        <strong>✅ 正确分类的菜品:</strong> {correctItems.length}
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className={`alert ${incorrectItems.length === 0 ? 'alert-success' : 'alert-danger'}`}>
                                                        <strong>❌ 错误分类的菜品:</strong> {incorrectItems.length}
                                                    </div>
                                                </div>
                                            </div>

                                            {incorrectItems.length > 0 && (
                                                <div className="mt-3">
                                                    <h6>错误分类的菜品:</h6>
                                                    <ul>
                                                        {incorrectItems.slice(0, 5).map(dish => (
                                                            <li key={dish.id}>
                                                                <strong>{dish.description}</strong>
                                                                <span className="text-muted">
                                                                    {' '}(ID: {dish.id}, categoryTakeAway: {dish.categoryTakeAway})
                                                                </span>
                                                            </li>
                                                        ))}
                                                        {incorrectItems.length > 5 && (
                                                            <li className="text-muted">...还有 {incorrectItems.length - 5} 个</li>
                                                        )}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })()}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CategoryDisplayTest;