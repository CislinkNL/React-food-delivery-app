import React, { useState } from 'react';
import { Button, Alert, Spinner, Card, CardBody, CardHeader } from 'reactstrap';
import { setupCompleteKeuzeMenusSystem } from '../utils/setupKeuzeMenus';

const KeuzeMenusSetup = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');

    const handleSetup = async () => {
        setIsLoading(true);
        setMessage('');
        setMessageType('');

        try {
            console.log('🚀 开始设置 KeuzeMenus 系统...');
            setMessage('正在设置 KeuzeMenus 系统...');
            setMessageType('info');

            const success = await setupCompleteKeuzeMenusSystem();

            if (success) {
                setMessage('✅ KeuzeMenus 系统设置成功！所有数据已上传到数据库。');
                setMessageType('success');
                console.log('🎉 设置完成！');
            } else {
                setMessage('❌ 设置过程中出现错误，请检查控制台日志。');
                setMessageType('danger');
            }
        } catch (error) {
            console.error('设置错误:', error);
            setMessage(`❌ 设置失败: ${error.message}`);
            setMessageType('danger');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mt-4">
            <Card>
                <CardHeader>
                    <h4 className="mb-0">🎛️ KeuzeMenus 系统设置</h4>
                </CardHeader>
                <CardBody>
                    <div className="mb-3">
                        <p>这个工具将会：</p>
                        <ul>
                            <li>创建完整的 keuzeMenus 数据结构</li>
                            <li>包含 6 种不同类型的选择菜单</li>
                            <li>为示例菜品添加选择菜单引用</li>
                            <li>启用高级选项功能</li>
                        </ul>
                    </div>

                    {message && (
                        <Alert color={messageType} className="mb-3">
                            <div style={{ whiteSpace: 'pre-line' }}>{message}</div>
                        </Alert>
                    )}

                    <div className="mb-3">
                        <h6>将创建的 KeuzeMenus：</h6>
                        <div className="small text-muted">
                            <div>• <strong>pittigheid_basic</strong> - 辣度选择 (必选单选)</div>
                            <div>• <strong>portiegrootte_standard</strong> - 分量大小 (必选单选)</div>
                            <div>• <strong>extra_ingredienten</strong> - 额外配菜 (可选多选，最多5个)</div>
                            <div>• <strong>bereidingswijze_vlees</strong> - 烹饪方式 (可选单选)</div>
                            <div>• <strong>sushi_combo_opties</strong> - 寿司套餐选项 (可选多选，最多3个)</div>
                            <div>• <strong>drank_grootte</strong> - 饮料规格 (必选单选)</div>
                        </div>
                    </div>

                    <div className="d-flex gap-2">
                        <Button
                            color="primary"
                            onClick={handleSetup}
                            disabled={isLoading}
                            size="lg"
                        >
                            {isLoading ? (
                                <>
                                    <Spinner size="sm" className="me-2" />
                                    设置中...
                                </>
                            ) : (
                                '🚀 开始设置 KeuzeMenus'
                            )}
                        </Button>

                        <Button
                            color="info"
                            onClick={() => {
                                console.log('查看控制台获取详细日志');
                                setMessage('请查看浏览器控制台获取详细的设置日志');
                                setMessageType('info');
                            }}
                            outline
                        >
                            📊 查看日志
                        </Button>
                    </div>

                    <div className="mt-4 small text-muted">
                        <strong>注意：</strong>
                        <ul className="mb-0">
                            <li>此操作会修改数据库数据</li>
                            <li>建议在测试环境中先运行</li>
                            <li>请确保有足够的Firebase写入权限</li>
                            <li>详细日志会显示在浏览器控制台中</li>
                        </ul>
                    </div>
                </CardBody>
            </Card>
        </div>
    );
};

export default KeuzeMenusSetup;