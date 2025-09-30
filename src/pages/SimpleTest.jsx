import React, { useState } from 'react';
import { Container, Row, Col, Button, Alert } from 'reactstrap';
import { databaseService } from '../services/DatabaseService';

const SimpleTest = () => {
    const [testResults, setTestResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const runTest = async () => {
        setIsLoading(true);
        const results = [];

        try {
            // 测试1: 读取Develop根节点
            results.push('=== 测试1: Develop根节点 ===');
            try {
                const developData = await databaseService.read('Develop');
                results.push(`✅ Develop节点读取成功`);
                results.push(`数据类型: ${typeof developData}`);
                if (developData && typeof developData === 'object') {
                    results.push(`包含键: ${Object.keys(developData).join(', ')}`);
                }
            } catch (err) {
                results.push(`❌ Develop节点读取失败: ${err.message}`);
            }

            // 测试2: 读取分类根节点
            results.push('\\n=== 测试2: 分类根节点 ===');
            try {
                const categorieData = await databaseService.read('Develop/categorie');
                results.push(`✅ categorie节点读取成功`);
                results.push(`数据类型: ${typeof categorieData}`);
                if (categorieData && typeof categorieData === 'object') {
                    results.push(`包含键: ${Object.keys(categorieData).join(', ')}`);
                }
            } catch (err) {
                results.push(`❌ categorie节点读取失败: ${err.message}`);
            }

            // 测试3: 读取食物分类
            results.push('\\n=== 测试3: 食物分类 ===');
            try {
                const foodData = await databaseService.read('Develop/categorie/food');
                results.push(`✅ food节点读取成功`);
                results.push(`数据类型: ${typeof foodData}`);
                results.push(`是否为数组: ${Array.isArray(foodData)}`);

                if (Array.isArray(foodData)) {
                    results.push(`数组长度: ${foodData.length}`);
                    if (foodData.length > 0) {
                        results.push(`第一个元素: ${JSON.stringify(foodData[0])}`);
                    }
                } else if (foodData && typeof foodData === 'object') {
                    results.push(`对象键: ${Object.keys(foodData).join(', ')}`);
                }

                console.log('食物分类详细数据:', foodData);
            } catch (err) {
                results.push(`❌ food节点读取失败: ${err.message}`);
            }

            // 测试4: 读取饮品分类
            results.push('\\n=== 测试4: 饮品分类 ===');
            try {
                const drinksData = await databaseService.read('Develop/categorie/drinks');
                results.push(`✅ drinks节点读取成功`);
                results.push(`数据类型: ${typeof drinksData}`);
                results.push(`是否为数组: ${Array.isArray(drinksData)}`);

                if (Array.isArray(drinksData)) {
                    results.push(`数组长度: ${drinksData.length}`);
                    if (drinksData.length > 0) {
                        results.push(`第一个元素: ${JSON.stringify(drinksData[0])}`);
                    }
                } else if (drinksData && typeof drinksData === 'object') {
                    results.push(`对象键: ${Object.keys(drinksData).join(', ')}`);
                }

                console.log('饮品分类详细数据:', drinksData);
            } catch (err) {
                results.push(`❌ drinks节点读取失败: ${err.message}`);
            }

        } catch (error) {
            results.push(`总体测试失败: ${error.message}`);
        }

        setTestResults(results);
        setIsLoading(false);
    };

    return (
        <Container className="mt-4">
            <Row>
                <Col lg="12">
                    <h2>简单数据库测试</h2>
                    <Button
                        color="primary"
                        onClick={runTest}
                        disabled={isLoading}
                    >
                        {isLoading ? '测试中...' : '运行数据库测试'}
                    </Button>
                </Col>
            </Row>

            {testResults.length > 0 && (
                <Row className="mt-4">
                    <Col lg="12">
                        <Alert color="info">
                            <h4>测试结果:</h4>
                            <pre style={{ whiteSpace: 'pre-wrap' }}>
                                {testResults.join('\\n')}
                            </pre>
                        </Alert>
                    </Col>
                </Row>
            )}
        </Container>
    );
};

export default SimpleTest;