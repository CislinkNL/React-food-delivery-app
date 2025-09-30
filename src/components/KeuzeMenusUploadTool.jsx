import React, { useState } from 'react';
import { Button, Card, Container, Row, Col } from 'reactstrap';
import { keuzeMenusUploader } from '../utils/KeuzeMenusUploader';

const KeuzeMenusUploadTool = () => {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState('');

    const handleUpload = async () => {
        setIsUploading(true);
        setUploadStatus('⏳ 正在上传...');

        try {
            const success = await keuzeMenusUploader.uploadAndVerify();
            if (success) {
                setUploadStatus('✅ 上传成功! 现在可以测试选项弹窗了');
            } else {
                setUploadStatus('❌ 上传失败，请检查控制台');
            }
        } catch (error) {
            setUploadStatus('❌ 上传出错: ' + error.message);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <Container className="mt-4">
            <Row>
                <Col lg="8" className="mx-auto">
                    <Card body>
                        <h4>🛠️ KeuzeMenus 数据上传工具</h4>
                        <p>点击下面的按钮上传 keuzeMenus 选择菜单数据到 Firebase</p>

                        <Button
                            color="primary"
                            onClick={handleUpload}
                            disabled={isUploading}
                            className="mb-3"
                        >
                            {isUploading ? '⏳ 上传中...' : '🚀 上传 KeuzeMenus 数据'}
                        </Button>

                        {uploadStatus && (
                            <div className="alert alert-info">
                                {uploadStatus}
                            </div>
                        )}

                        <small className="text-muted">
                            这个工具会上传选择菜单的定义数据（如辣度、分量等选项）到 Firebase。
                            <br />
                            上传路径: Develop/keuzeMenus
                        </small>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default KeuzeMenusUploadTool;