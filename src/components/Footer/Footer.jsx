import React from "react";
import { Container, Row, Col } from "reactstrap";
import "../../styles/footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <Container>
        <Row className="align-items-center">
          <Col lg="6" md="6" sm="12" className="text-center text-md-start">
            <div className="footer__content">
              <h5 className="footer__title">Sushi Delivery Nederland</h5>
              <p className="footer__subtitle">
                Verse sushi bezorgd aan je deur. Bestel nu online!
              </p>
            </div>
          </Col>

          <Col lg="3" md="3" sm="6" className="text-center">
            <div className="footer__info">
              <h6 className="footer__section-title">Bezorgtijden</h6>
              <div className="delivery__time">
                <p className="delivery__hours">Ma - Zo: 16:00 - 22:00</p>
                <p className="delivery__note">Gratis bezorging vanaf €25</p>
              </div>
            </div>
          </Col>

          <Col lg="3" md="3" sm="6" className="text-center">
            <div className="footer__contact">
              <h6 className="footer__section-title">Contact</h6>
              <p className="contact__item">📞 +31 (0) 123 456 789</p>
              <p className="contact__item">📧 info@sushidelivery.nl</p>
            </div>
          </Col>
        </Row>

        <hr className="footer__divider" />

        <Row>
          <Col lg="12" className="text-center">
            <div className="footer__bottom">
              <p className="copyright">
                © {new Date().getFullYear()} Sushi Delivery Nederland.
                Alle rechten voorbehouden.
              </p>
              <div className="footer__links">
                <span className="footer__link">Privacybeleid</span>
                <span className="footer__separator">|</span>
                <span className="footer__link">Algemene voorwaarden</span>
                <span className="footer__separator">|</span>
                <span className="footer__link">Cookie beleid</span>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
