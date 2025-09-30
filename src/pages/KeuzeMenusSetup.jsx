import React from 'react';
import { Container, Row, Col } from 'reactstrap';
import CommonSection from '../components/UI/common-section/CommonSection';
import KeuzeMenusSetup from '../components/KeuzeMenusSetup';

const KeuzeMenusSetupPage = () => {
    return (
        <>
            <CommonSection title="KeuzeMenus Setup" />
            <section>
                <Container>
                    <Row>
                        <Col lg="12">
                            <KeuzeMenusSetup />
                        </Col>
                    </Row>
                </Container>
            </section>
        </>
    );
};

export default KeuzeMenusSetupPage;