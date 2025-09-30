import React from 'react';
import { Container, Row, Col } from 'reactstrap';
import CommonSection from '../components/UI/common-section/CommonSection';
import KeuzeMenusFixTool from '../components/KeuzeMenusFixTool';

const KeuzeMenusFixPage = () => {
    return (
        <>
            <CommonSection title="KeuzeMenus Fix Tool" />
            <section>
                <Container>
                    <Row>
                        <Col lg="12">
                            <KeuzeMenusFixTool />
                        </Col>
                    </Row>
                </Container>
            </section>
        </>
    );
};

export default KeuzeMenusFixPage;