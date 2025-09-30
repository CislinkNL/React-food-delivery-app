import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Card, Table, Alert } from 'reactstrap';
import { menuService } from '../services/MenuService';
import { categoryService } from '../services/CategoryService';

const MenuFieldTest = () => {
    const [menuData, setMenuData] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [fieldStats, setFieldStats] = useState({});

    // 加载数据
    const loadData = async () => {
        setIsLoading(true);
        try {
            // 加载分类
            const categoriesData = await categoryService.getCombinedCategories();
            setCategories(categoriesData);

            // 加载菜单数据
            const menuItemsData = await menuService.getAllDishes();
            setMenuData(menuItemsData);

            // 分析字段统计
            analyzeFieldStats(menuItemsData);
        } catch (error) {
            console.error('加载数据失败:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // 分析字段统计
    const analyzeFieldStats = (data) => {
        const stats = {
            total: data.length,
            hasOnlyRestaurant: 0,
            hasCategoryTakeAway: 0,
            hasOptions: 0,
            categoryDistribution: {},
            missingFields: []
        };

        data.forEach(item => {
            // 统计字段存在情况
            if (item.onlyRestaurant !== undefined) stats.hasOnlyRestaurant++;
            if (item.categoryTakeAway) stats.hasCategoryTakeAway++;
            if (item.options !== undefined) stats.hasOptions++;

            // 分类分布
            const category = item.categoryTakeAway || 'unknown';
            stats.categoryDistribution[category] = (stats.categoryDistribution[category] || 0) + 1;

            // 检查缺失字段
            const missing = [];
            if (item.onlyRestaurant === undefined) missing.push('onlyRestaurant');
            if (!item.categoryTakeAway) missing.push('categoryTakeAway');
            if (item.options === undefined) missing.push('options');

            if (missing.length > 0) {
                stats.missingFields.push({
                    id: item.id,
                    title: item.title,
                    missing: missing
                });
            }
        });

        setFieldStats(stats);
    };

    // 按分类过滤数据
    const getFilteredData = () => {
        if (selectedCategory === 'all') {
            return menuData;
        }
        return menuData.filter(item => item.categoryTakeAway === selectedCategory);
    };

    useEffect(() => {
        loadData();
    }, []);

    const filteredData = getFilteredData();

    return (
        <Container className="mt-4">
            <Row>
                <Col lg="12">
                    <h2>菜单字段测试</h2>
                    <p>测试新增字段: onlyRestaurant, categoryTakeAway, options</p>
                </Col>
            </Row>

            <Row className="mt-3">
                <Col lg="12">
                    <Button
                        color="primary"
                        onClick={loadData}
                        disabled={isLoading}
                    >
                        {isLoading ? '加载中...' : '重新加载数据'}
                    </Button>
                </Col>
            </Row>

            {/* 字段统计 */}
            {Object.keys(fieldStats).length > 0 && (
                <Row className="mt-4">
                    <Col lg="6">
                        <Card body>
                            <h4>字段统计</h4>
                            <p><strong>总菜品数量:</strong> {fieldStats.total}</p>
                            <p><strong>有onlyRestaurant字段:</strong> {fieldStats.hasOnlyRestaurant}</p>
                            <p><strong>有categoryTakeAway字段:</strong> {fieldStats.hasCategoryTakeAway}</p>
                            <p><strong>有options字段:</strong> {fieldStats.hasOptions}</p>
                        </Card>
                    </Col>
                    <Col lg="6">
                        <Card body>
                            <h4>分类分布</h4>
                            {Object.entries(fieldStats.categoryDistribution).map(([category, count]) => (
                                <div key={category}>
                                    <strong>{category}:</strong> {count} 个菜品
                                </div>
                            ))}
                        </Card>
                    </Col>
                </Row>
            )}

            {/* 缺失字段警告 */}
            {fieldStats.missingFields && fieldStats.missingFields.length > 0 && (
                <Row className="mt-4">
                    <Col lg="12">
                        <Alert color="warning">
                            <h5>缺失字段的菜品 ({fieldStats.missingFields.length} 个):</h5>
                            <ul>
                                {fieldStats.missingFields.slice(0, 10).map((item, index) => (
                                    <li key={index}>
                                        <strong>{item.title} (ID: {item.id})</strong> -
                                        缺失: {item.missing.join(', ')}
                                    </li>
                                ))}
                                {fieldStats.missingFields.length > 10 && (
                                    <li>... 还有 {fieldStats.missingFields.length - 10} 个</li>
                                )}
                            </ul>
                        </Alert>
                    </Col>
                </Row>
            )}

            {/* 分类过滤器 */}
            <Row className="mt-4">
                <Col lg="12">
                    <h4>按分类查看</h4>
                    <div className="d-flex flex-wrap gap-2">
                        <Button
                            color={selectedCategory === 'all' ? 'primary' : 'outline-primary'}
                            size="sm"
                            onClick={() => setSelectedCategory('all')}
                        >
                            全部 ({menuData.length})
                        </Button>
                        {categories.map(category => {
                            const count = menuData.filter(item => item.categoryTakeAway === category.id).length;
                            return (
                                <Button
                                    key={category.id}
                                    color={selectedCategory === category.id ? 'primary' : 'outline-primary'}
                                    size="sm"
                                    onClick={() => setSelectedCategory(category.id)}
                                >
                                    {category.name} ({count})
                                </Button>
                            );
                        })}
                    </div>
                </Col>
            </Row>

            {/* 菜品数据表 */}
            <Row className="mt-4">
                <Col lg="12">
                    <Card>
                        <Table responsive striped>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>名称</th>
                                    <th>sortingNrm</th>
                                    <th>categoryTakeAway</th>
                                    <th>onlyRestaurant</th>
                                    <th>options</th>
                                    <th>价格</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredData.slice(0, 20).map(item => (
                                    <tr key={item.id}>
                                        <td>{item.id}</td>
                                        <td>{item.title}</td>
                                        <td>{item.sortingNrm}</td>
                                        <td>
                                            <span className={`badge ${item.categoryTakeAway ? 'bg-success' : 'bg-warning'}`}>
                                                {item.categoryTakeAway || 'N/A'}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`badge ${item.onlyRestaurant ? 'bg-danger' : 'bg-success'}`}>
                                                {item.onlyRestaurant ? 'Only Restaurant' : 'TakeAway OK'}
                                            </span>
                                        </td>
                                        <td>{item.options || 'N/A'}</td>
                                        <td>€{item.price}</td>
                                    </tr>
                                ))}
                                {filteredData.length > 20 && (
                                    <tr>
                                        <td colSpan="7" className="text-center text-muted">
                                            ... 还有 {filteredData.length - 20} 个菜品
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default MenuFieldTest;