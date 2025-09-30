import React from "react";
import { Container, Row, Col } from "reactstrap";
import Helmet from "../components/Helmet/Helmet";
import "../styles/contact.css";

const Contact = () => {
    return (
        <Helmet title="Contact">
            <section className="contact__section">
                <Container>
                    <Row>
                        <Col lg="12" className="text-center mb-5">
                            <h2 className="contact__title">Contact Ons</h2>
                            <p className="contact__subtitle">Wij kijken ernaar uit u de beste service te bieden</p>
                        </Col>
                    </Row>

                    <Row>
                        {/* Contact Information */}
                        <Col lg="6" md="6">
                            <div className="contact__info">
                                <h4 className="mb-4">Restaurant Informatie</h4>

                                <div className="info__item mb-4">
                                    <div className="info__icon">
                                        <i className="ri-map-pin-line"></i>
                                    </div>
                                    <div className="info__content">
                                        <h6>Adres</h6>
                                        <p>Foodstraat 123, Amsterdam<br />Metro Lijn 52, Station Foodstraat uitgang A</p>
                                    </div>
                                </div>

                                <div className="info__item mb-4">
                                    <div className="info__icon">
                                        <i className="ri-phone-line"></i>
                                    </div>
                                    <div className="info__content">
                                        <h6>Telefoon</h6>
                                        <p>Bestel lijn: 020-123-4567<br />Klantenservice: 020-123-4568</p>
                                    </div>
                                </div>

                                <div className="info__item mb-4">
                                    <div className="info__icon">
                                        <i className="ri-time-line"></i>
                                    </div>
                                    <div className="info__content">
                                        <h6>Openingstijden</h6>
                                        <p>Maandag t/m Vrijdag: 11:00 - 22:00<br />Zaterdag t/m Zondag: 10:00 - 23:00</p>
                                    </div>
                                </div>

                                <div className="info__item mb-4">
                                    <div className="info__icon">
                                        <i className="ri-mail-line"></i>
                                    </div>
                                    <div className="info__content">
                                        <h6>E-mail</h6>
                                        <p>info@chinesrestaurant.nl<br />Bestellen: bestellen@chinesrestaurant.nl</p>
                                    </div>
                                </div>
                            </div>
                        </Col>

                        {/* Contact Form */}
                        <Col lg="6" md="6">
                            <div className="contact__form">
                                <h4 className="mb-4">Stuur ons een bericht</h4>
                                <form>
                                    <Row>
                                        <Col lg="6" md="6">
                                            <div className="form__group mb-3">
                                                <input
                                                    type="text"
                                                    className="form__input"
                                                    placeholder="Uw naam"
                                                    required
                                                />
                                            </div>
                                        </Col>
                                        <Col lg="6" md="6">
                                            <div className="form__group mb-3">
                                                <input
                                                    type="email"
                                                    className="form__input"
                                                    placeholder="Uw e-mailadres"
                                                    required
                                                />
                                            </div>
                                        </Col>
                                        <Col lg="12">
                                            <div className="form__group mb-3">
                                                <input
                                                    type="tel"
                                                    className="form__input"
                                                    placeholder="Telefoonnummer"
                                                    required
                                                />
                                            </div>
                                        </Col>
                                        <Col lg="12">
                                            <div className="form__group mb-3">
                                                <select className="form__input">
                                                    <option value="">Kies onderwerp</option>
                                                    <option value="complaint">Klacht of suggestie</option>
                                                    <option value="praise">Compliment</option>
                                                    <option value="cooperation">Samenwerking</option>
                                                    <option value="other">Anders</option>
                                                </select>
                                            </div>
                                        </Col>
                                        <Col lg="12">
                                            <div className="form__group mb-4">
                                                <textarea
                                                    className="form__input"
                                                    rows="5"
                                                    placeholder="Beschrijf uw vraag of suggestie in detail..."
                                                    required
                                                ></textarea>
                                            </div>
                                        </Col>
                                        <Col lg="12">
                                            <button type="submit" className="submit__btn">
                                                Bericht Versturen
                                            </button>
                                        </Col>
                                    </Row>
                                </form>
                            </div>
                        </Col>
                    </Row>

                    {/* Additional Services */}
                    <Row className="mt-5">
                        <Col lg="12">
                            <div className="services__section">
                                <h4 className="text-center mb-4">Onze Services</h4>
                                <Row>
                                    <Col lg="3" md="6" sm="6" className="mb-3">
                                        <div className="service__item text-center">
                                            <i className="ri-restaurant-line"></i>
                                            <h6>Dine-in Service</h6>
                                            <p>Comfortabele eetomgeving</p>
                                        </div>
                                    </Col>
                                    <Col lg="3" md="6" sm="6" className="mb-3">
                                        <div className="service__item text-center">
                                            <i className="ri-takeaway-line"></i>
                                            <h6>Bezorgservice</h6>
                                            <p>Snel thuisbezorgd</p>
                                        </div>
                                    </Col>
                                    <Col lg="3" md="6" sm="6" className="mb-3">
                                        <div className="service__item text-center">
                                            <i className="ri-calendar-line"></i>
                                            <h6>Reserveringen</h6>
                                            <p>Vooraf tafel reserveren</p>
                                        </div>
                                    </Col>
                                    <Col lg="3" md="6" sm="6" className="mb-3">
                                        <div className="service__item text-center">
                                            <i className="ri-gift-line"></i>
                                            <h6>Groepsarrangementen</h6>
                                            <p>Feesten en groepscatering</p>
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>
        </Helmet>
    );
};

export default Contact;