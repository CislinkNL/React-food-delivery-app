import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Card } from 'reactstrap';
import { menuService } from '../services/MenuService';
import { takeAwayOrderService } from '../services/TakeAwayOrderService';
import { accessControlService } from '../services/AccessControlService';
import { categoryService } from '../services/CategoryService';

const FirebaseTestPage = () => {
    const [testResults, setTestResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [menuData, setMenuData] = useState([]);
    const [categories, setCategories] = useState([]);

    // 添加测试结果
    const addTestResult = (name, status, message, data = null) => {
        const result = {
            id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            name,
            status, // 'success', 'error', 'info'
            message,
            data,
            timestamp: new Date().toLocaleTimeString()
        };
        setTestResults(prev => [result, ...prev]);
    };

    // 清除结果
    const clearResults = () => {
        setTestResults([]);
    };

    // 测试Firebase连接
    const testFirebaseConnection = async () => {
        try {
            addTestResult('Firebase连接测试', 'info', '开始测试Firebase连接...');

            // 测试基础连接
            const testData = await menuService.getAllDishes();
            addTestResult('Firebase连接测试', 'success',
                `Firebase连接成功，获取到 ${testData.length} 个菜品`);

        } catch (error) {
            addTestResult('Firebase连接测试', 'error',
                `Firebase连接失败: ${error.message}`);
        }
    };

    // 测试分类数据
    const testCategoriesData = async () => {
        try {
            addTestResult('分类数据测试', 'info', '开始测试动态分类加载...');

            // 测试分类统计
            const categoryStats = await categoryService.getCategoryStats();
            addTestResult('分类数据测试', 'info',
                `分类统计: 总计 ${categoryStats.total} 个分类 (食物: ${categoryStats.food}, 饮品: ${categoryStats.drinks})`,
                categoryStats);

            // 测试获取所有分类
            const allCategories = await categoryService.getCombinedCategories();
            if (allCategories && allCategories.length > 0) {
                addTestResult('分类数据测试', 'success',
                    `成功读取 ${allCategories.length} 个分类`, allCategories);
                setCategories(allCategories);
            } else {
                addTestResult('分类数据测试', 'info',
                    '未找到分类数据，使用后备数据');
                setCategories(categoryService.getFallbackCategories());
            }

            // 测试食物分类
            const foodCategories = await categoryService.getFoodCategories();
            addTestResult('分类数据测试', 'info',
                `食物分类: ${foodCategories.length} 个`, foodCategories);

            // 测试饮品分类
            const drinksCategories = await categoryService.getDrinksCategories();
            addTestResult('分类数据测试', 'info',
                `饮品分类: ${drinksCategories.length} 个`, drinksCategories);

        } catch (error) {
            addTestResult('分类数据测试', 'error',
                `分类数据测试失败: ${error.message}`);
        }
    };

    // 运行完整测试
    const runCompleteTest = async () => {
        if (isLoading) return;

        setIsLoading(true);
        clearResults();

        try {
            await testFirebaseConnection();
            await testCategoriesData();
        } catch (error) {
            addTestResult('完整测试', 'error', `完整测试失败: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    // 页面加载时运行测试
    useEffect(() => {
        runCompleteTest();
    }, []);

    return (
        <Container>
            <Row>
                <Col lg="12">
                    <h1 className="text-center mb-4">🔥 Firebase 测试中心</h1>
                </Col>
            </Row>

            {/* 测试控制面板 */}
            <Row className="mb-4">
                <Col lg="12">
                    <div className="d-flex gap-3 justify-content-center flex-wrap">
                        <Button
                            color="primary"
                            onClick={runCompleteTest}
                            disabled={isLoading}
                        >
                            {isLoading ? '测试中...' : '🚀 运行完整测试'}
                        </Button>
                        <Button
                            color="info"
                            onClick={testFirebaseConnection}
                            disabled={isLoading}
                        >
                            📡 测试Firebase连接
                        </Button>
                        <Button
                            color="warning"
                            onClick={testCategoriesData}
                            disabled={isLoading}
                        >
                            🗂️ 测试分类数据
                        </Button>
                        <Button
                            color="secondary"
                            onClick={clearResults}
                        >
                            🗑️ 清除结果
                        </Button>
                    </div>
                </Col>
            </Row>

            {/* 数据概览 */}
            <Row className="mb-4">
                <Col lg="6">
                    <Card body>
                        <h5>📋 菜单数据概览</h5>
                        <p>菜品数量: <strong>{menuData.length}</strong></p>
                        <p>分类数量: <strong>{categories.length}</strong></p>
                        <p>数据源: <strong>{menuData.length > 0 ? 'Firebase' : '本地后备数据'}</strong></p>
                    </Card>
                </Col>
                <Col lg="6">
                    <Card body>
                        <h5>📊 测试状态</h5>
                        <p>测试结果: <strong>{testResults.length}</strong></p>
                        <p>状态: <strong>{isLoading ? '⏳ 测试中...' : '✅ 就绪'}</strong></p>
                        <p>最后更新: <strong>{testResults.length > 0 ? testResults[0].timestamp : '未测试'}</strong></p>
                    </Card>
                </Col>
            </Row>

            {/* 测试结果 */}
            <Row>
                <Col lg="12">
                    <Card body>
                        <h5>📋 测试结果</h5>
                        {testResults.length === 0 ? (
                            <p className="text-muted">暂无测试结果</p>
                        ) : (
                            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                                {testResults.map((result) => (
                                    <div
                                        key={result.id}
                                        className={`alert alert-${result.status === 'success' ? 'success' :
                                                result.status === 'error' ? 'danger' : 'info'
                                            } mb-2`}
                                    >
                                        <div className="d-flex justify-content-between align-items-start">
                                            <div>
                                                <strong>{result.name}</strong>
                                                <p className="mb-1">{result.message}</p>
                                                {result.data && (
                                                    <details>
                                                        <summary>详细数据</summary>
                                                        <pre style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>
                                                            {JSON.stringify(result.data, null, 2)}
                                                        </pre>
                                                    </details>
                                                )}
                                            </div>
                                            <small className="text-muted">{result.timestamp}</small>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default FirebaseTestPage;