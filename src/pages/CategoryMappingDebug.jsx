import React, { useState, useEffect } from 'react';
import { menuService } from '../services/MenuService';
import { categoryService } from '../services/CategoryService';
import 'bootstrap/dist/css/bootstrap.min.css';

const CategoryMappingDebug = () => {
    const [categories, setCategories] = useState([]);
    const [allDishes, setAllDishes] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('Cat1');
    const [filteredDishes, setFilteredDishes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);

    // 分页配置 - 每页最多25个
    const itemsPerPage = 25;
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentDishes = filteredDishes.slice(startIndex, endIndex);
    const totalPages = Math.ceil(filteredDishes.length / itemsPerPage);

    // 加载所有数据
    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);

                // 加载分类
                const categoryData = await categoryService.getCombinedCategories();
                setCategories(categoryData);

                // 加载所有菜品
                const dishData = await menuService.getAllDishes();
                setAllDishes(dishData);

                console.log('📊 调试信息:');
                console.log('分类数量:', categoryData.length);
                console.log('菜品数量:', dishData.length);
                console.log('前3个菜品:', dishData.slice(0, 3));

            } catch (error) {
                console.error('❌ 加载数据失败:', error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    // 当选择分类改变时，手动过滤菜品
    useEffect(() => {
        if (allDishes.length > 0 && selectedCategory) {
            console.log(`🔍 手动过滤分类: ${selectedCategory}`);

            const filtered = allDishes.filter(dish => {
                const dishCategory = dish.categoryTakeAway || dish.category;
                const categoryMatches = dishCategory === selectedCategory;

                // 排除只限餐厅的菜品
                const isOnlyRestaurant = dish.onlyRestaurant === true;
                const shouldInclude = categoryMatches && !isOnlyRestaurant;

                // 调试输出前几个菜品的匹配情况
                if (allDishes.indexOf(dish) < 5) {
                    console.log(`菜品 ${dish.id}: categoryTakeAway="${dish.categoryTakeAway}", category="${dish.category}", onlyRestaurant=${dish.onlyRestaurant}, 分类匹配=${categoryMatches}, 排除餐厅=${isOnlyRestaurant}, 最终结果=${shouldInclude}`);
                }

                return shouldInclude;
            });

            console.log(`✅ 找到 ${filtered.length} 个匹配的菜品 (已排除只限餐厅菜品)`);
            setFilteredDishes(filtered);
            setCurrentPage(0); // 重置到第一页
        }
    }, [allDishes, selectedCategory]);

    const testMenuService = async (categoryId) => {
        console.log(`🧪 测试MenuService.getDishesByCategory("${categoryId}")`);
        try {
            const result = await menuService.getDishesByCategory(categoryId);
            console.log(`MenuService返回: ${result.length} 个菜品`);
            console.log('前3个结果:', result.slice(0, 3));
            return result;
        } catch (error) {
            console.error('MenuService测试失败:', error);
            return [];
        }
    };

    const analyzeCategoryDistribution = () => {
        if (allDishes.length === 0) return {};

        const distribution = {};
        allDishes.forEach(dish => {
            // 排除只限餐厅的菜品
            if (dish.onlyRestaurant === true) {
                return;
            }

            const category = dish.categoryTakeAway || dish.category || 'undefined';
            distribution[category] = (distribution[category] || 0) + 1;
        });

        return distribution;
    };

    const categoryDistribution = analyzeCategoryDistribution();

    if (loading) {
        return (
            <div className="container mt-4 text-center">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">加载中...</span>
                </div>
                <p>正在加载调试数据...</p>
            </div>
        );
    }

    return (
        <div className="container-fluid mt-4">
            <div className="row">
                <div className="col-12">
                    <h1 className="mb-4">分类映射调试</h1>
                    <p className="text-muted">
                        调试分类ID和菜品categoryTakeAway字段的匹配关系
                    </p>
                    <div className="alert alert-info mb-4">
                        <strong>ℹ️ 注意:</strong> 已自动排除 <code>onlyRestaurant: true</code> 的菜品（只限餐厅菜品）
                    </div>
                </div>
            </div>

            {/* 统计概览 */}
            <div className="row mb-4">
                <div className="col-md-4">
                    <div className="card">
                        <div className="card-header">
                            <h5>数据概览</h5>
                        </div>
                        <div className="card-body">
                            <p><strong>分类总数:</strong> {categories.length}</p>
                            <p><strong>菜品总数:</strong> {allDishes.length}</p>
                            <p><strong>当前选择:</strong> {selectedCategory}</p>
                            <p><strong>匹配菜品:</strong> {filteredDishes.length}</p>
                        </div>
                    </div>
                </div>

                <div className="col-md-8">
                    <div className="card">
                        <div className="card-header">
                            <h5>分类分布</h5>
                        </div>
                        <div className="card-body">
                            <div className="row">
                                {Object.entries(categoryDistribution).map(([cat, count]) => (
                                    <div key={cat} className="col-md-3 mb-2">
                                        <button
                                            className={`btn btn-sm w-100 ${selectedCategory === cat ? 'btn-primary' : 'btn-outline-secondary'
                                                }`}
                                            onClick={() => setSelectedCategory(cat)}
                                        >
                                            {cat}
                                            <br />
                                            <small>({count})</small>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 分类选择 - 移动端友好的横向滚动 */}
            <div className="row mb-4">
                <div className="col-12">
                    <div className="card">
                        <div className="card-header">
                            <h5>可用分类 (横向滚动)</h5>
                        </div>
                        <div className="card-body">
                            <div className="category-scroll-container">
                                <div className="category-scroll">
                                    {categories.map(category => (
                                        <button
                                            key={category.id}
                                            className={`btn category-scroll-btn ${selectedCategory === category.id ? 'btn-success' : 'btn-outline-primary'}`}
                                            onClick={() => setSelectedCategory(category.id)}
                                        >
                                            {category.id}
                                            <br />
                                            <small>{category.nameNL || category.name}</small>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 测试按钮 */}
            <div className="row mb-4">
                <div className="col-12">
                    <div className="card">
                        <div className="card-header">
                            <h5>测试工具</h5>
                        </div>
                        <div className="card-body">
                            <button
                                className="btn btn-warning me-2"
                                onClick={() => testMenuService(selectedCategory)}
                            >
                                测试 MenuService.getDishesByCategory("{selectedCategory}")
                            </button>
                            <button
                                className="btn btn-info"
                                onClick={() => {
                                    console.log('🔍 当前选择的分类:', selectedCategory);
                                    console.log('🔍 手动过滤的结果:', filteredDishes.length);
                                    console.log('🔍 前5个匹配菜品:', filteredDishes.slice(0, 5));
                                }}
                            >
                                在控制台输出调试信息
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* 匹配结果 */}
            <div className="row">
                <div className="col-12">
                    <div className="card">
                        <div className="card-header d-flex justify-content-between align-items-center">
                            <h5 className="mb-0">
                                分类 "{selectedCategory}" 的匹配菜品 ({filteredDishes.length})
                            </h5>
                            {totalPages > 1 && (
                                <div className="pagination-info">
                                    <small className="text-muted">
                                        页面 {currentPage + 1} / {totalPages}
                                        (显示 {startIndex + 1}-{Math.min(endIndex, filteredDishes.length)} 项)
                                    </small>
                                </div>
                            )}
                        </div>
                        <div className="card-body">
                            {filteredDishes.length === 0 ? (
                                <div className="alert alert-warning">
                                    <strong>⚠️ 没有找到匹配的菜品！</strong>
                                    <br />
                                    检查是否存在categoryTakeAway字段为 "{selectedCategory}" 的菜品
                                </div>
                            ) : (
                                <>
                                    <div className="table-responsive">
                                        <table className="table table-sm table-striped">
                                            <thead>
                                                <tr>
                                                    <th>ID</th>
                                                    <th>菜品名称</th>
                                                    <th>sortingNrm</th>
                                                    <th>categoryTakeAway</th>
                                                    <th>category (legacy)</th>
                                                    <th>匹配原因</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {currentDishes.map(dish => {
                                                    const matchReason = dish.categoryTakeAway === selectedCategory
                                                        ? 'categoryTakeAway匹配'
                                                        : dish.category === selectedCategory
                                                            ? 'category匹配'
                                                            : '未知';

                                                    return (
                                                        <tr key={dish.id}>
                                                            <td>{dish.id}</td>
                                                            <td>
                                                                <strong>{dish.description || dish.name}</strong>
                                                            </td>
                                                            <td>
                                                                <span className="badge bg-secondary">
                                                                    {dish.sortingNrm || 'N/A'}
                                                                </span>
                                                            </td>
                                                            <td>
                                                                <span className={`badge ${dish.categoryTakeAway === selectedCategory
                                                                    ? 'bg-success' : 'bg-warning'
                                                                    }`}>
                                                                    {dish.categoryTakeAway || 'N/A'}
                                                                </span>
                                                            </td>
                                                            <td>
                                                                <span className="badge bg-info">
                                                                    {dish.category || 'N/A'}
                                                                </span>
                                                            </td>
                                                            <td>
                                                                <small className="text-muted">
                                                                    {matchReason}
                                                                </small>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* 移动端友好的分页控制 */}
                                    {totalPages > 1 && (
                                        <div className="mt-3">
                                            {/* 移动端分页 */}
                                            <div className="d-block d-md-none">
                                                <div className="mobile-pagination">
                                                    <div className="pagination-info-mobile text-center mb-3">
                                                        <span className="badge bg-primary">
                                                            页面 {currentPage + 1} / {totalPages}
                                                        </span>
                                                        <div className="text-muted small mt-1">
                                                            显示 {currentDishes.length} / {filteredDishes.length} 项 (每页最多 {itemsPerPage} 项)
                                                        </div>
                                                    </div>
                                                    <div className="pagination-controls d-flex justify-content-between">
                                                        <button
                                                            className="btn btn-outline-primary btn-sm"
                                                            onClick={() => setCurrentPage(currentPage - 1)}
                                                            disabled={currentPage === 0}
                                                        >
                                                            <i className="fas fa-chevron-left me-1"></i>
                                                            上一页
                                                        </button>
                                                        <button
                                                            className="btn btn-outline-primary btn-sm"
                                                            onClick={() => setCurrentPage(currentPage + 1)}
                                                            disabled={currentPage >= totalPages - 1}
                                                        >
                                                            下一页
                                                            <i className="fas fa-chevron-right ms-1"></i>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* 桌面端分页 */}
                                            <div className="d-none d-md-block">
                                                <nav aria-label="分页导航">
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <div className="pagination-info-desktop">
                                                            <small className="text-muted">
                                                                显示第 {startIndex + 1}-{Math.min(endIndex, filteredDishes.length)} 项，
                                                                共 {filteredDishes.length} 项 (每页 {itemsPerPage} 项)
                                                            </small>
                                                        </div>
                                                        <ul className="pagination pagination-sm mb-0">
                                                            <li className={`page-item ${currentPage === 0 ? 'disabled' : ''}`}>
                                                                <button
                                                                    className="page-link"
                                                                    onClick={() => setCurrentPage(currentPage - 1)}
                                                                    disabled={currentPage === 0}
                                                                >
                                                                    上一页
                                                                </button>
                                                            </li>

                                                            {/* 页码按钮 */}
                                                            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                                                                let pageNum;
                                                                if (totalPages <= 5) {
                                                                    pageNum = i;
                                                                } else if (currentPage <= 2) {
                                                                    pageNum = i;
                                                                } else if (currentPage >= totalPages - 3) {
                                                                    pageNum = totalPages - 5 + i;
                                                                } else {
                                                                    pageNum = currentPage - 2 + i;
                                                                }

                                                                return (
                                                                    <li key={pageNum} className={`page-item ${currentPage === pageNum ? 'active' : ''}`}>
                                                                        <button
                                                                            className="page-link"
                                                                            onClick={() => setCurrentPage(pageNum)}
                                                                        >
                                                                            {pageNum + 1}
                                                                        </button>
                                                                    </li>
                                                                );
                                                            })}

                                                            <li className={`page-item ${currentPage >= totalPages - 1 ? 'disabled' : ''}`}>
                                                                <button
                                                                    className="page-link"
                                                                    onClick={() => setCurrentPage(currentPage + 1)}
                                                                    disabled={currentPage >= totalPages - 1}
                                                                >
                                                                    下一页
                                                                </button>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </nav>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// 添加内联样式
const styles = `
    .category-scroll-container {
        position: relative;
        width: 100%;
    }
    
    .category-scroll {
        display: flex;
        gap: 0.8rem;
        overflow-x: auto;
        overflow-y: hidden;
        padding: 0.5rem 0;
        scroll-behavior: smooth;
        -webkit-overflow-scrolling: touch;
        scrollbar-width: none;
        -ms-overflow-style: none;
    }
    
    .category-scroll::-webkit-scrollbar {
        display: none;
    }
    
    .category-scroll-btn {
        white-space: nowrap;
        flex-shrink: 0;
        min-width: 100px;
        text-align: center;
        font-size: 0.8rem !important;
        padding: 0.5rem 0.8rem !important;
    }
    
    .mobile-pagination {
        background: #f8f9fa;
        border-radius: 10px;
        padding: 1rem;
    }
    
    .pagination-controls button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
    
    @media (max-width: 768px) {
        .category-scroll-btn {
            min-width: 80px;
            font-size: 0.7rem !important;
            padding: 0.4rem 0.6rem !important;
        }
    }
`;

// 注入样式
if (typeof document !== 'undefined') {
    const styleElement = document.createElement('style');
    styleElement.textContent = styles;
    document.head.appendChild(styleElement);
}

export default CategoryMappingDebug;