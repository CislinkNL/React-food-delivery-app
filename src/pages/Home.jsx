import React from "react";
import Helmet from "../components/Helmet/Helmet.js";
import { Container, Row, Col } from "reactstrap";

import { Link } from "react-router-dom";

import guyImg from "../assets/images/delivery-guy.png";
import "../styles/hero-section.css";

const Home = () => {
  return (
    <Helmet title="Home">
      {/* Hero Section */}
      <section className="hero__section">
        <Container>
          <Row>
            <Col lg="6" md="6">
              <div className="hero__content">
                <h5 className="mb-3">Authentieke Chinese Keuken • Snelle Bezorging</h5>
                <h1 className="mb-4 hero__title">
                  <span>Geniet van</span> authentieke Chinese gerechten
                </h1>
                <p className="hero__desc mb-4">
                  Wij bieden authentieke Chinese gerechten, bereid met verse ingrediënten en traditionele kooktechnieken.
                  Online bestellen mogelijk, snelle thuisbezorging.
                </p>

                <button className="order__btn d-flex align-items-center justify-content-between">
                  <Link to="/menu">
                    Bekijk Menu <i className="ri-arrow-right-s-line"></i>
                  </Link>
                </button>
              </div>
            </Col>

            <Col lg="6" md="6">
              <div className="hero__img">
                <img src={guyImg} alt="delivery-guy" className="w-100" />
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Restaurant Info Section */}
      <section className="restaurant__info pt-5 pb-5">
        <Container>
          <Row>
            <Col lg="12" className="text-center mb-5">
              <h2 className="section__title">Over Ons</h2>
              <p className="section__subtitle">Het bewaren van de Chinese culinaire cultuur en het bieden van kwaliteitsservice</p>
            </Col>
          </Row>
          <Row>
            <Col lg="4" md="6" sm="6" className="mb-4">
              <div className="feature__item text-center">
                <div className="feature__icon">
                  <i className="ri-restaurant-line"></i>
                </div>
                <h5>Authentieke Smaak</h5>
                <p>Gebruik van traditionele recepten en verse ingrediënten om de authentieke smaak van elk gerecht te garanderen</p>
              </div>
            </Col>
            <Col lg="4" md="6" sm="6" className="mb-4">
              <div className="feature__item text-center">
                <div className="feature__icon">
                  <i className="ri-timer-line"></i>
                </div>
                <h5>Snelle Bezorging</h5>
                <p>Professioneel bezorgteam, warme maaltijden binnen 30 minuten bij u thuis bezorgd</p>
              </div>
            </Col>
            <Col lg="4" md="6" sm="6" className="mb-4">
              <div className="feature__item text-center">
                <div className="feature__icon">
                  <i className="ri-shield-check-line"></i>
                </div>
                <h5>Kwaliteitsgarantie</h5>
                <p>Strikte voedselveiligheidsnormen, zodat u met vertrouwen en gemoedsrust kunt eten</p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Business Hours Section */}
      <section className="business__hours bg-light pt-5 pb-5">
        <Container>
          <Row>
            <Col lg="6" md="6">
              <div className="hours__content">
                <h3 className="mb-4">Openingstijden</h3>
                <div className="hours__list">
                  <div className="hour__item d-flex justify-content-between mb-2">
                    <span>Maandag - Vrijdag</span>
                    <span>11:00 - 22:00</span>
                  </div>
                  <div className="hour__item d-flex justify-content-between mb-2">
                    <span>Zaterdag - Zondag</span>
                    <span>10:00 - 23:00</span>
                  </div>
                  <div className="hour__item d-flex justify-content-between mb-2">
                    <span>Bezorgservice</span>
                    <span>Dagelijks 11:00 - 21:30</span>
                  </div>
                </div>
              </div>
            </Col>
            <Col lg="6" md="6">
              <div className="contact__info">
                <h3 className="mb-4">Contactgegevens</h3>
                <div className="contact__list">
                  <div className="contact__item mb-3">
                    <i className="ri-map-pin-line me-2"></i>
                    <span>Adres: Foodstraat 123, Amsterdam</span>
                  </div>
                  <div className="contact__item mb-3">
                    <i className="ri-phone-line me-2"></i>
                    <span>Telefoon: 020-123-4567</span>
                  </div>
                  <div className="contact__item mb-3">
                    <i className="ri-time-line me-2"></i>
                    <span>Bezorgtijd: 30-45 minuten</span>
                  </div>
                  <div className="contact__item mb-3">
                    <i className="ri-money-dollar-circle-line me-2"></i>
                    <span>Minimum bestelbedrag: €25</span>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </Helmet>
  );
};

export default Home;
