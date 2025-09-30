import React from "react";
import { Container, Row, Col } from "reactstrap";
import Helmet from "../components/Helmet/Helmet";
import "../styles/contact.css";

const Contact = () => {
    return (
        <Helmet title="联系我们">
            <section className="contact__section">
                <Container>
                    <Row>
                        <Col lg="12" className="text-center mb-5">
                            <h2 className="contact__title">联系我们</h2>
                            <p className="contact__subtitle">我们期待为您提供最优质的服务</p>
                        </Col>
                    </Row>

                    <Row>
                        {/* Contact Information */}
                        <Col lg="6" md="6">
                            <div className="contact__info">
                                <h4 className="mb-4">餐厅信息</h4>

                                <div className="info__item mb-4">
                                    <div className="info__icon">
                                        <i className="ri-map-pin-line"></i>
                                    </div>
                                    <div className="info__content">
                                        <h6>地址</h6>
                                        <p>北京市朝阳区美食街123号<br />地铁1号线美食站A出口</p>
                                    </div>
                                </div>

                                <div className="info__item mb-4">
                                    <div className="info__icon">
                                        <i className="ri-phone-line"></i>
                                    </div>
                                    <div className="info__content">
                                        <h6>联系电话</h6>
                                        <p>订餐热线：010-8888-9999<br />客服电话：010-8888-8888</p>
                                    </div>
                                </div>

                                <div className="info__item mb-4">
                                    <div className="info__icon">
                                        <i className="ri-time-line"></i>
                                    </div>
                                    <div className="info__content">
                                        <h6>营业时间</h6>
                                        <p>周一至周五：11:00 - 22:00<br />周六至周日：10:00 - 23:00</p>
                                    </div>
                                </div>

                                <div className="info__item mb-4">
                                    <div className="info__icon">
                                        <i className="ri-mail-line"></i>
                                    </div>
                                    <div className="info__content">
                                        <h6>邮箱</h6>
                                        <p>info@chineserestaurant.com<br />订餐：order@chineserestaurant.com</p>
                                    </div>
                                </div>
                            </div>
                        </Col>

                        {/* Contact Form */}
                        <Col lg="6" md="6">
                            <div className="contact__form">
                                <h4 className="mb-4">给我们留言</h4>
                                <form>
                                    <Row>
                                        <Col lg="6" md="6">
                                            <div className="form__group mb-3">
                                                <input
                                                    type="text"
                                                    className="form__input"
                                                    placeholder="您的姓名"
                                                    required
                                                />
                                            </div>
                                        </Col>
                                        <Col lg="6" md="6">
                                            <div className="form__group mb-3">
                                                <input
                                                    type="email"
                                                    className="form__input"
                                                    placeholder="您的邮箱"
                                                    required
                                                />
                                            </div>
                                        </Col>
                                        <Col lg="12">
                                            <div className="form__group mb-3">
                                                <input
                                                    type="tel"
                                                    className="form__input"
                                                    placeholder="联系电话"
                                                    required
                                                />
                                            </div>
                                        </Col>
                                        <Col lg="12">
                                            <div className="form__group mb-3">
                                                <select className="form__input">
                                                    <option value="">选择主题</option>
                                                    <option value="complaint">投诉建议</option>
                                                    <option value="praise">表扬夸奖</option>
                                                    <option value="cooperation">合作洽谈</option>
                                                    <option value="other">其他</option>
                                                </select>
                                            </div>
                                        </Col>
                                        <Col lg="12">
                                            <div className="form__group mb-4">
                                                <textarea
                                                    className="form__input"
                                                    rows="5"
                                                    placeholder="请详细描述您的问题或建议..."
                                                    required
                                                ></textarea>
                                            </div>
                                        </Col>
                                        <Col lg="12">
                                            <button type="submit" className="submit__btn">
                                                发送消息
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
                                <h4 className="text-center mb-4">我们的服务</h4>
                                <Row>
                                    <Col lg="3" md="6" sm="6" className="mb-3">
                                        <div className="service__item text-center">
                                            <i className="ri-restaurant-line"></i>
                                            <h6>堂食服务</h6>
                                            <p>舒适的用餐环境</p>
                                        </div>
                                    </Col>
                                    <Col lg="3" md="6" sm="6" className="mb-3">
                                        <div className="service__item text-center">
                                            <i className="ri-takeaway-line"></i>
                                            <h6>外卖配送</h6>
                                            <p>快速送达到家</p>
                                        </div>
                                    </Col>
                                    <Col lg="3" md="6" sm="6" className="mb-3">
                                        <div className="service__item text-center">
                                            <i className="ri-calendar-line"></i>
                                            <h6>预约订餐</h6>
                                            <p>提前预订座位</p>
                                        </div>
                                    </Col>
                                    <Col lg="3" md="6" sm="6" className="mb-3">
                                        <div className="service__item text-center">
                                            <i className="ri-gift-line"></i>
                                            <h6>聚餐定制</h6>
                                            <p>团体用餐方案</p>
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