import React, { useState } from 'react';
import { Button, Alert, Card, CardBody, CardHeader, Row, Col } from 'reactstrap';
import { fixKeuzeMenusFormat, checkKeuzeMenusFormat, setItemKeuzeMenus } from '../utils/keuzeMenusHelpers';

const KeuzeMenusFixTool = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');
    const [issues, setIssues] = useState([]);

    const handleCheck = async () => {
        setIsLoading(true);
        setMessage('检查中...');
        setMessageType('info');

        try {
            const foundIssues = await checkKeuzeMenusFormat();
            setIssues(foundIssues);

            if (foundIssues.length === 0) {
                setMessage('✅ 所有菜品的 keuzeMenus 格式都正确！');
                setMessageType('success');
            } else {
                setMessage(`⚠️ 发现 ${foundIssues.length} 个格式问题。请点击"修复问题"按钮来自动修复。`);
                setMessageType('warning');
            }
        } catch (error) {
            console.error('检查错误:', error);
            setMessage(`❌ 检查失败: ${error.message}`);
            setMessageType('danger');
        } finally {
            setIsLoading(false);
        }
    };

    const handleFix = async () => {
        setIsLoading(true);
        setMessage('修复中...');
        setMessageType('info');

        try {
            const success = await fixKeuzeMenusFormat();

            if (success) {
                setMessage('✅ 所有 keuzeMenus 格式问题已修复！现在可以正常使用选项功能了。');
                setMessageType('success');
                setIssues([]); // 清空问题列表
            } else {
                setMessage('❌ 修复过程中出现错误，请检查控制台日志。');
                setMessageType('danger');
            }
        } catch (error) {
            console.error('修复错误:', error);
            setMessage(`❌ 修复失败: ${error.message}`);
            setMessageType('danger');
        } finally {
            setIsLoading(false);
        }
    };

    const handleFixSpecificItem = async () => {
        setIsLoading(true);
        setMessage('修复菜品 ID 1...');
        setMessageType('info');

        try {
            // 修复您提到的具体菜品
            const success = await setItemKeuzeMenus('1', ['pittigheid_basic', 'extra_ingredienten']);

            if (success) {
                setMessage('✅ 菜品 ID 1 的 keuzeMenus 已修复！现在应该可以显示选项弹窗了。');
                setMessageType('success');
            } else {
                setMessage('❌ 修复菜品 ID 1 时出现错误。');
                setMessageType('danger');
            }
        } catch (error) {
            console.error('修复错误:', error);
            setMessage(`❌ 修复失败: ${error.message}`);
            setMessageType('danger');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mt-4">
            <Card>
                <CardHeader>
                    <h4 className="mb-0">🔧 KeuzeMenus 格式修复工具</h4>
                </CardHeader>
                <CardBody>
                    <div className="mb-3">
                        <p>这个工具用于修复 keuzeMenus 字段的格式问题。</p>
                        <p className="text-muted">
                            <strong>常见问题：</strong> keuzeMenus 应该是字符串数组，如 <code>["pittigheid_basic", "extra_ingredienten"]</code>，
                            而不是包含逗号分隔字符串的数组，如 <code>["pittigheid_basic,extra_ingredienten"]</code>。
                        </p>
                    </div>

                    {message && (
                        <Alert color={messageType} className="mb-3">
                            <div style={{ whiteSpace: 'pre-line' }}>{message}</div>
                        </Alert>
                    )}

                    <Row className="mb-3">
                        <Col md="4">
                            <Button
                                color="info"
                                onClick={handleCheck}
                                disabled={isLoading}
                                className="w-100 mb-2"
                            >
                                🔍 检查格式问题
                            </Button>
                        </Col>
                        <Col md="4">
                            <Button
                                color="warning"
                                onClick={handleFix}
                                disabled={isLoading || issues.length === 0}
                                className="w-100 mb-2"
                            >
                                🔧 修复所有问题
                            </Button>
                        </Col>
                        <Col md="4">
                            <Button
                                color="primary"
                                onClick={handleFixSpecificItem}
                                disabled={isLoading}
                                className="w-100 mb-2"
                            >
                                🎯 修复菜品 ID 1
                            </Button>
                        </Col>
                    </Row>

                    {issues.length > 0 && (
                        <div className="mt-4">
                            <h6>发现的问题：</h6>
                            <div className="small">
                                {issues.map((issue, index) => (
                                    <div key={index} className="mb-2 p-2 border rounded bg-light">
                                        <strong>菜品 {issue.itemId}:</strong> {issue.issue}
                                        <br />
                                        <span className="text-muted">
                                            当前值: <code>{JSON.stringify(issue.current)}</code>
                                        </span>
                                        <br />
                                        <span className="text-success">
                                            建议值: <code>{JSON.stringify(issue.suggestion)}</code>
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="mt-4">
                        <h6>修复后的效果：</h6>
                        <ul className="small text-muted">
                            <li>点击菜品的"添加到购物车"按钮时会显示选项弹窗</li>
                            <li>菜品卡片会显示"Opties beschikbaar"提示</li>
                            <li>按钮文字会变为"Opties Kiezen"</li>
                            <li>可以选择辣度、分量大小、额外配菜等选项</li>
                        </ul>
                    </div>
                </CardBody>
            </Card>
        </div>
    );
};

export default KeuzeMenusFixTool;