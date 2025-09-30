import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "reactstrap";
import Helmet from "../components/Helmet/Helmet";
import ProductCard from "../components/UI/product-card/ProductCard";
import ReactPaginate from "react-paginate";
import "../styles/pagination.css";
import "../styles/menu.css";

// Import Firebase services
import { menuService } from "../services/MenuService";
import { categoryService } from "../services/CategoryService";
import { categoryDebugger } from "../utils/CategoryDebugger";

const Menu = () => {
    const [activeCategory, setActiveCategory] = useState("all");
    const [pageNumber, setPageNumber] = useState(0);
    const [menuData, setMenuData] = useState([]);
    const [categories, setCategories] = useState([]);
    const [menuLoading, setMenuLoading] = useState(true);
    const [categoriesLoading, setCategoriesLoading] = useState(true);
    const [error, setError] = useState(null);

    // 分页配置
    const dishesPerPage = 9;
    const pagesVisited = pageNumber * dishesPerPage;
    const displayDishes = menuData.slice(pagesVisited, pagesVisited + dishesPerPage);
    const pageCount = Math.ceil(menuData.length / dishesPerPage);

    // 计算整体加载状态
    const loading = menuLoading || categoriesLoading;

    // 加载分类数据
    useEffect(() => {
        const loadCategories = async () => {
            try {
                setCategoriesLoading(true);
                console.log('Begin laden categorieën data...');

                // 直接测试数据库连接
                console.log('=== 直接测试数据库路径 ===');

                // 导入数据库服务
                const { databaseService } = await import('../services/DatabaseService');

                // 测试根路径
                try {
                    const developData = await databaseService.read('Develop');
                    console.log('Develop 数据:', developData);
                } catch (err) {
                    console.error('Develop 路径读取失败:', err);
                }

                // 测试分类根路径
                try {
                    const categorieData = await databaseService.read('Develop/categorie');
                    console.log('Develop/categorie 数据:', categorieData);
                } catch (err) {
                    console.error('Develop/categorie 路径读取失败:', err);
                }

                // 测试食物分类路径
                try {
                    const foodData = await databaseService.read('Develop/categorie/food');
                    console.log('食物分类原始数据:', foodData);
                    console.log('食物数据类型:', typeof foodData);
                    console.log('是否为数组:', Array.isArray(foodData));
                } catch (err) {
                    console.error('食物分类路径读取失败:', err);
                }

                // 测试饮品分类路径
                try {
                    const drinksData = await databaseService.read('Develop/categorie/drinks');
                    console.log('饮品分类原始数据:', drinksData);
                    console.log('饮品数据类型:', typeof drinksData);
                    console.log('是否为数组:', Array.isArray(drinksData));
                } catch (err) {
                    console.error('饮品分类路径读取失败:', err);
                }

                // 使用新的CategoryService获取分类
                const fetchedCategories = await categoryService.getCombinedCategories();
                console.log('Opgehaalde categorieën data:', fetchedCategories);

                if (fetchedCategories && fetchedCategories.length > 0) {
                    setCategories(fetchedCategories);
                    console.log('Categorieën data succesvol ingesteld:', fetchedCategories);
                } else {
                    console.log('Geen categorieën data gevonden, gebruik backup data');
                    const fallbackCategories = categoryService.getFallbackCategories();
                    console.log('Backup categorieën data:', fallbackCategories);
                    setCategories(fallbackCategories);
                }
            } catch (err) {
                console.error('Laden categorieën mislukt:', err);
                // 使用后备分类数据
                const fallbackCategories = categoryService.getFallbackCategories();
                console.log('Bij fout gebruik backup categorieën data:', fallbackCategories);
                setCategories(fallbackCategories);
            } finally {
                setCategoriesLoading(false);
            }
        };

        loadCategories();
    }, []);

    // 加载菜单数据
    useEffect(() => {
        const loadMenuData = async () => {
            try {
                setMenuLoading(true);
                setError(null);

                let dishes;
                if (activeCategory === "all") {
                    dishes = await menuService.getAllDishes();
                } else {
                    dishes = await menuService.getDishesByCategory(activeCategory);
                }

                setMenuData(dishes);

                // 重置页码当分类改变时
                setPageNumber(0);
            } catch (err) {
                console.error('Laden menudata mislukt:', err);
                setError('Laden menudata mislukt, probeer later opnieuw');
                // 使用后备数据
                const fallbackData = menuService.getFallbackMenuData();
                const filteredFallback = activeCategory === "all"
                    ? fallbackData
                    : fallbackData.filter(item => item.category === activeCategory);
                setMenuData(filteredFallback);
            } finally {
                setMenuLoading(false);
            }
        };

        loadMenuData();
    }, [activeCategory]);

    // 处理分类点击
    const handleCategoryClick = (categoryId) => {
        setActiveCategory(categoryId);
        setPageNumber(0); // 重置分页
    };

    // 处理分页点击
    const changePage = ({ selected }) => {
        setPageNumber(selected);
        // 滚动到顶部
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <Helmet title="Menu">
            <section className="menu-section">
                <Container>
                    <Row>
                        <Col lg="6" md="6" sm="6" xs="12">
                            <div className="menu__search d-flex align-items-center justify-content-between">
                                <div className="menu__search-title">
                                    <h2>Kies je favoriete gerechten</h2>
                                </div>
                            </div>
                        </Col>

                        <Col lg="6" md="6" sm="6" xs="12">
                            <div className="search__widget d-flex align-items-center justify-content-end">
                                <input
                                    type="search"
                                    placeholder="Zoek gerechten..."
                                    value=""
                                    onChange={() => { }}
                                />
                                <span>
                                    <i className="ri-search-line"></i>
                                </span>
                            </div>
                        </Col>
                    </Row>

                    {/* Categorie filter */}
                    <Row className="mt-4">
                        <Col lg="12">
                            {categoriesLoading ? (
                                <div className="menu__category-loading d-flex align-items-center justify-content-center">
                                    <div className="spinner-border spinner-border-sm text-primary me-2" role="status">
                                        <span className="visually-hidden">Categorieën laden...</span>
                                    </div>
                                    <span>Categorieën laden...</span>
                                </div>
                            ) : (
                                <div className="menu__category d-flex align-items-center justify-content-center gap-4">
                                    {categories.map((category) => (
                                        <button
                                            key={category.id}
                                            className={`menu__category-btn ${activeCategory === category.id ? "active" : ""
                                                }`}
                                            onClick={() => handleCategoryClick(category.id)}
                                        >
                                            <i className={category.icon}></i>
                                            {category.name}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </Col>
                    </Row>

                    {/* Laadstatus */}
                    {menuLoading && (
                        <Row className="mt-4">
                            <Col lg="12">
                                <div className="loading-container text-center">
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">Laden...</span>
                                    </div>
                                    <p className="mt-2">Menu laden...</p>
                                </div>
                            </Col>
                        </Row>
                    )}

                    {/* Foutstatus */}
                    {error && !menuLoading && (
                        <Row className="mt-4">
                            <Col lg="12">
                                <div className="error-container text-center">
                                    <div className="alert alert-warning" role="alert">
                                        <i className="ri-error-warning-line"></i>
                                        {error}
                                    </div>
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => window.location.reload()}
                                    >
                                        Opnieuw laden
                                    </button>
                                </div>
                            </Col>
                        </Row>
                    )}

                    {/* Gerechten weergave */}
                    {!menuLoading && !error && (
                        <>
                            <Row className="mt-4">
                                {displayDishes.length > 0 ? (
                                    displayDishes.map((item) => (
                                        <Col
                                            lg="4"
                                            md="4"
                                            sm="6"
                                            xs="6"
                                            key={item.id}
                                            className="mb-4"
                                        >
                                            <ProductCard item={item} />
                                        </Col>
                                    ))
                                ) : (
                                    <Col lg="12">
                                        <div className="text-center">
                                            <div className="empty-state">
                                                <i className="ri-restaurant-line empty-state-icon"></i>
                                                <h4>Geen gerechten</h4>
                                                <p>Er zijn momenteel geen gerechten beschikbaar in deze categorie</p>
                                            </div>
                                        </div>
                                    </Col>
                                )}
                            </Row>

                            {/* Paginering */}
                            {pageCount > 1 && (
                                <Row>
                                    <Col lg="12">
                                        <div className="pagination__wrapper d-flex align-items-center justify-content-center mt-4">
                                            <ReactPaginate
                                                pageCount={pageCount}
                                                onPageChange={changePage}
                                                forcePage={pageNumber}
                                                previousLabel="Vorige"
                                                nextLabel="Volgende"
                                                containerClassName="pagination-container"
                                                pageClassName="pagination-item"
                                                pageLinkClassName="pagination-link"
                                                previousClassName="pagination-item"
                                                previousLinkClassName="pagination-link"
                                                nextClassName="pagination-item"
                                                nextLinkClassName="pagination-link"
                                                activeClassName="active"
                                                disabledClassName="disabled"
                                            />
                                        </div>
                                    </Col>
                                </Row>
                            )}

                            {/* Gerechten statistieken */}
                            <Row className="mt-3">
                                <Col lg="12">
                                    <div className="menu__stats text-center">
                                        <p className="text-muted">
                                            {menuData.length} gerechten gevonden
                                            {activeCategory !== "all" && (
                                                <span> | Huidige categorie: {categories.find(cat => cat.id === activeCategory)?.name}</span>
                                            )}
                                        </p>
                                    </div>
                                </Col>
                            </Row>
                        </>
                    )}
                </Container>
            </section>
        </Helmet>
    );
};

export default Menu;