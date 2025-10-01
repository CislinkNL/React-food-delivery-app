import React, { useState, useEffect, useRef } from "react";
import { Container, Row, Col } from "reactstrap";
import Helmet from "../components/Helmet/Helmet";
import ProductCard from "../components/UI/product-card/ProductCard";
import ReactPaginate from "react-paginate";
import "../styles/pagination.css";
import "../styles/menu.css";

// Import Firebase services
import { menuService } from "../services/MenuService";
import { categoryService } from "../services/CategoryService";

const Menu = () => {
    const [activeCategory, setActiveCategory] = useState("all");
    const [pageNumber, setPageNumber] = useState(0);
    const [menuData, setMenuData] = useState([]);
    const [categories, setCategories] = useState([]);
    const [menuLoading, setMenuLoading] = useState(true);
    const [categoriesLoading, setCategoriesLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState(""); // 添加搜索状态
    const searchInputRef = useRef(null); // 搜索输入框引用
    const categorySticky = useRef(null); // 分类菜单引用

    // 分页配置 - 每页最多25个
    const dishesPerPage = 25;
    const pagesVisited = pageNumber * dishesPerPage;

    // 处理分类菜单的 sticky 定位
    useEffect(() => {
        const updateStickyPosition = () => {
            const headerElement = document.querySelector('.header');
            const categoryElement = categorySticky.current;

            if (headerElement && categoryElement) {
                const isHeaderShrunk = headerElement.classList.contains('header__shrink');
                const topPosition = isHeaderShrunk ? '40px' : '60px';

                categoryElement.style.top = topPosition;

                // 调试输出
                if (process.env.NODE_ENV === 'development') {
                    console.log('分类栏位置更新:', {
                        headerShrunk: isHeaderShrunk,
                        topPosition: topPosition
                    });
                }
            }
        };

        const handleScroll = () => {
            updateStickyPosition();
        };

        // 初始设置
        updateStickyPosition();

        // 监听滚动事件
        window.addEventListener('scroll', handleScroll);

        // 使用 MutationObserver 监听 header 类变化
        const headerElement = document.querySelector('.header');
        let observer;

        if (headerElement) {
            observer = new MutationObserver(updateStickyPosition);
            observer.observe(headerElement, {
                attributes: true,
                attributeFilter: ['class']
            });
        }

        return () => {
            window.removeEventListener('scroll', handleScroll);
            if (observer) {
                observer.disconnect();
            }
        };
    }, []);

    // 处理初始分类按钮滚动定位（仅移动端）
    useEffect(() => {
        if (!categoriesLoading && categories.length > 0 && window.innerWidth <= 768) {
            // 延迟执行，确保DOM渲染完成
            setTimeout(() => {
                const activeButton = document.querySelector(`button.menu__category-btn[data-category="${activeCategory}"]`);
                if (activeButton) {
                    const scrollContainer = activeButton.closest('.menu__category-scroll');
                    if (scrollContainer) {
                        const buttonOffsetLeft = activeButton.offsetLeft;
                        const buttonWidth = activeButton.offsetWidth;
                        const containerWidth = scrollContainer.offsetWidth;

                        const targetScrollLeft = buttonOffsetLeft - (containerWidth / 2) + (buttonWidth / 2);

                        // 初始定位不使用动画，直接设置
                        scrollContainer.scrollLeft = Math.max(0, targetScrollLeft);
                    }
                }
            }, 200);
        }
    }, [categoriesLoading, categories, activeCategory]);

    // 过滤菜单数据（先按类别过滤，再按搜索词过滤）
    const filteredMenuData = menuData.filter(dish => {
        // 类别过滤
        const categoryMatch = activeCategory === "all" ||
            dish.categoryTakeAway === activeCategory ||
            dish.category === activeCategory;

        // 搜索词过滤
        const searchMatch = searchTerm === "" ||
            dish.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            dish.desc.toLowerCase().includes(searchTerm.toLowerCase());

        return categoryMatch && searchMatch;
    });

    const displayDishes = filteredMenuData.slice(pagesVisited, pagesVisited + dishesPerPage);
    const pageCount = Math.ceil(filteredMenuData.length / dishesPerPage);

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

        // 只在移动端执行滚动逻辑（宽度 <= 768px）
        if (window.innerWidth <= 768) {
            setTimeout(() => {
                // 找到被点击的按钮（即将变为active的按钮）
                const targetButton = document.querySelector(`button.menu__category-btn[data-category="${categoryId}"]`);

                if (targetButton) {
                    const scrollContainer = targetButton.closest('.menu__category-scroll');
                    if (scrollContainer) {
                        // 获取按钮在容器中的位置
                        const buttonOffsetLeft = targetButton.offsetLeft;
                        const buttonWidth = targetButton.offsetWidth;
                        const containerWidth = scrollContainer.offsetWidth;

                        // 计算让按钮居中所需的滚动位置
                        const targetScrollLeft = buttonOffsetLeft - (containerWidth / 2) + (buttonWidth / 2);

                        // 平滑滚动到目标位置
                        scrollContainer.scrollTo({
                            left: Math.max(0, targetScrollLeft),
                            behavior: 'smooth'
                        });
                    }
                }
            }, 100); // 增加延迟确保状态更新完成
        }
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
                    {/* 标题行 */}
                    <Row>
                        <Col lg="12">
                            <div className="menu__search d-flex align-items-center justify-content-center">
                                <div className="menu__search-title">
                                    <h2>Kies je favoriete gerechten</h2>
                                </div>
                            </div>
                        </Col>
                    </Row>

                    {/* 搜索框行 - 更靠近分类栏 */}
                    <Row className="mt-3 mb-2">
                        <Col lg="12" className="d-flex justify-content-center">
                            <div className="search__widget d-flex align-items-center" style={{ width: '100%', maxWidth: '500px' }}>
                                <input
                                    ref={searchInputRef}
                                    type="text"
                                    placeholder="Zoek gerechten..."
                                    value={searchTerm}
                                    style={{
                                        width: '100%',
                                        maxWidth: '500px',
                                        padding: '12px 20px',
                                        border: '2px solid #ddd',
                                        borderRadius: '25px',
                                        fontSize: '16px',
                                        outline: 'none',
                                        background: 'white',
                                        color: '#333',
                                        display: 'block',
                                        visibility: 'visible',
                                        opacity: 1,
                                        zIndex: 1
                                    }}
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value);
                                        setPageNumber(0); // 重置到第一页
                                    }}
                                />
                                <span
                                    style={{
                                        cursor: 'pointer',
                                        padding: '5px',
                                        marginLeft: '5px',
                                        transition: 'all 0.3s ease'
                                    }}
                                    onClick={() => {
                                        if (searchTerm) {
                                            // 如果有搜索词，清除搜索
                                            setSearchTerm('');
                                            setPageNumber(0);
                                        } else {
                                            // 如果没有搜索词，聚焦到搜索框
                                            searchInputRef.current?.focus();
                                        }
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.transform = 'scale(1.1)';
                                        e.target.style.color = '#df2020';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.transform = 'scale(1)';
                                        e.target.style.color = '#666';
                                    }}
                                >
                                    <i className={searchTerm ? "ri-close-line" : "ri-search-line"}></i>
                                </span>
                            </div>
                        </Col>
                    </Row>

                    {/* 搜索结果提示 */}
                    {searchTerm && (
                        <Row>
                            <Col lg="12" className="text-center">
                                <div style={{ fontSize: '12px', color: '#666', marginBottom: '10px' }}>
                                    搜索 "{searchTerm}" - 找到 {filteredMenuData.length} 个结果
                                </div>
                            </Col>
                        </Row>
                    )}

                    {/* Categorie filter - 移动端友好的横向滚动 */}
                    <Row className="mt-2">
                        <Col lg="12">
                            {categoriesLoading ? (
                                <div className="menu__category-loading d-flex align-items-center justify-content-center">
                                    <div className="spinner-border spinner-border-sm text-primary me-2" role="status">
                                        <span className="visually-hidden">Categorieën laden...</span>
                                    </div>
                                    <span>Categorieën laden...</span>
                                </div>
                            ) : (
                                <div className="menu__category-container">
                                    {/* 占位空间，防止内容被fixed定位的分类栏遮挡 */}
                                    <div className="menu__category-spacer"></div>
                                    <div className="menu__category-sticky" ref={categorySticky}>
                                        <div className="menu__category-scroll">
                                            <button
                                                key="all"
                                                className={`menu__category-btn ${activeCategory === "all" ? "active" : ""}`}
                                                data-category="all"
                                                onClick={() => handleCategoryClick("all")}
                                            >
                                                <i className="ri-restaurant-line"></i>
                                                Alle gerechten
                                            </button>
                                            {categories.map((category) => (
                                                <button
                                                    key={category.id}
                                                    className={`menu__category-btn ${activeCategory === category.id ? "active" : ""}`}
                                                    data-category={category.id}
                                                    onClick={() => handleCategoryClick(category.id)}
                                                >
                                                    <i className={category.icon || "ri-restaurant-line"}></i>
                                                    {category.nameNL || category.name}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
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

                            {/* 移动端友好的分页控制 */}
                            {pageCount > 1 && (
                                <Row>
                                    <Col lg="12">
                                        <div className="pagination__wrapper-mobile">
                                            {/* 移动端简化分页控制 */}
                                            <div className="pagination__mobile d-block d-md-none">
                                                <div className="pagination__info">
                                                    <span className="pagination__current">
                                                        Pagina {pageNumber + 1} van {pageCount}
                                                    </span>
                                                    <span className="pagination__total">
                                                        ({displayDishes.length} van {filteredMenuData.length} gerechten{searchTerm ? ` (gefilterd van ${menuData.length})` : ''})
                                                    </span>
                                                </div>
                                                <div className="pagination__controls">
                                                    <button
                                                        className="pagination__btn pagination__btn--prev"
                                                        onClick={() => changePage({ selected: pageNumber - 1 })}
                                                        disabled={pageNumber === 0}
                                                    >
                                                        <i className="ri-arrow-left-line"></i>
                                                        Vorige
                                                    </button>
                                                    <button
                                                        className="pagination__btn pagination__btn--next"
                                                        onClick={() => changePage({ selected: pageNumber + 1 })}
                                                        disabled={pageNumber >= pageCount - 1}
                                                    >
                                                        Volgende
                                                        <i className="ri-arrow-right-line"></i>
                                                    </button>
                                                </div>
                                            </div>

                                            {/* 桌面端完整分页控制 */}
                                            <div className="pagination__desktop d-none d-md-flex">
                                                <ReactPaginate
                                                    pageCount={pageCount}
                                                    onPageChange={changePage}
                                                    forcePage={pageNumber}
                                                    previousLabel={
                                                        <span>
                                                            <i className="ri-arrow-left-line me-1"></i>
                                                            Vorige
                                                        </span>
                                                    }
                                                    nextLabel={
                                                        <span>
                                                            Volgende
                                                            <i className="ri-arrow-right-line ms-1"></i>
                                                        </span>
                                                    }
                                                    containerClassName="pagination-container"
                                                    pageClassName="pagination-item"
                                                    pageLinkClassName="pagination-link"
                                                    previousClassName="pagination-item"
                                                    previousLinkClassName="pagination-link"
                                                    nextClassName="pagination-item"
                                                    nextLinkClassName="pagination-link"
                                                    activeClassName="active"
                                                    disabledClassName="disabled"
                                                    marginPagesDisplayed={1}
                                                    pageRangeDisplayed={3}
                                                />
                                            </div>
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