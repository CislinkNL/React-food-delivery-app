import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Card, Alert } from 'reactstrap';
import { categoryDebugger } from '../utils/CategoryDebugger';
import { categoryService } from '../services/CategoryService';
import { databaseService } from '../services/DatabaseService';

const CategoryDebugPage = () => {
    const [debugResults, setDebugResults] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [rawData, setRawData] = useState({});

    // 运行完整诊断
    const runDiagnostics = async () => {
        setIsLoading(true);
        try {
            const results = await categoryDebugger.runFullDiagnostics();
            setDebugResults(results);
            categoryDebugger.showDiagnosticsSummary(results);
        } catch (error) {
            console.error('诊断失败:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // 直接测试Firebase路径
    const testFirebasePaths = async () => {
        setIsLoading(true);
        const paths = [
            'Develop',
            'Develop/categorie',
            'Develop/categorie/food',
            'Develop/categorie/drinks'
        ];

        const pathResults = {};

        for (const path of paths) {
            try {
                console.log(`测试路径: ${path}`);
                const data = await databaseService.read(path);
                console.log(`路径 ${path} 数据:`, data);
                pathResults[path] = data;
            } catch (error) {
                console.error(`路径 ${path} 失败:`, error);
                pathResults[path] = { error: error.message };
            }
        }

        setRawData(pathResults);
        setIsLoading(false);
    };

    // 测试分类服务方法
    const testCategoryMethods = async () => {
        setIsLoading(true);
        try {
            console.log('=== 测试分类服务方法 ===');

            // 测试食物分类
            console.log('1. 测试食物分类...');
            const foodCategories = await categoryService.getFoodCategories();
            console.log('食物分类结果:', foodCategories);

            // 测试饮品分类
            console.log('2. 测试饮品分类...');
            const drinksCategories = await categoryService.getDrinksCategories();
            console.log('饮品分类结果:', drinksCategories);

            // 测试组合分类
            console.log('3. 测试组合分类...');
            const combinedCategories = await categoryService.getCombinedCategories();
            console.log('组合分类结果:', combinedCategories);

        } catch (error) {
            console.error('分类方法测试失败:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container className="mt-4">
            <Row>
                <Col lg="12">
                    <h2>分类数据调试页面</h2>
                    <p>这个页面帮助诊断分类数据加载问题</p>
                </Col>
            </Row>

            <Row className="mt-3">
                <Col lg="12">
                    <div className="d-flex gap-2 mb-3">
                        <Button
                            color="primary"
                            onClick={runDiagnostics}
                            disabled={isLoading}
                        >
                            {isLoading ? '运行中...' : '运行完整诊断'}
                        </Button>

                        <Button
                            color="secondary"
                            onClick={testFirebasePaths}
                            disabled={isLoading}
                        >
                            测试Firebase路径
                        </Button>

                        <Button
                            color="info"
                            onClick={testCategoryMethods}
                            disabled={isLoading}
                        >
                            测试分类服务
                        </Button>
                    </div>
                </Col>
            </Row>

            {/* 诊断结果显示 */}
            {debugResults && (
                <Row className="mt-4">
                    <Col lg="12">
                        <Card body>
                            <h4>诊断结果</h4>
                            <pre style={{ background: '#f8f9fa', padding: '1rem', overflow: 'auto' }}>
                                {JSON.stringify(debugResults, null, 2)}
                            </pre>
                        </Card>
                    </Col>
                </Row>
            )}

            {/* 原始数据显示 */}
            {Object.keys(rawData).length > 0 && (
                <Row className="mt-4">
                    <Col lg="12">
                        <Card body>
                            <h4>原始路径数据</h4>
                            {Object.entries(rawData).map(([path, data]) => (
                                <div key={path} className="mb-3">
                                    <h6>{path}</h6>
                                    <pre style={{ background: '#f8f9fa', padding: '0.5rem', fontSize: '0.8rem' }}>
                                        {JSON.stringify(data, null, 2)}
                                    </pre>
                                </div>
                            ))}
                        </Card>
                    </Col>
                </Row>
            )}

            {/* 控制台提示 */}
            <Row className="mt-4">
                <Col lg="12">
                    <Alert color="info">
                        <h6>调试提示:</h6>
                        <ul className="mb-0">
                            <li>检查浏览器开发者工具的控制台查看详细日志</li>
                            <li>可以在控制台中使用 <code>window.categoryDebugger</code> 进行手动调试</li>
                            <li>使用 <code>categoryDebugger.runFullDiagnostics()</code> 运行完整诊断</li>
                        </ul>
                    </Alert>
                </Col>
            </Row>
        </Container>
    );
};

export default CategoryDebugPage;