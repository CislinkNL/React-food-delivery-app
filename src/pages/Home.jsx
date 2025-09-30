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
                <h5 className="mb-3">正宗中华美食 • 快速配送</h5>
                <h1 className="mb-4 hero__title">
                  <span>享受</span> 地道的中华料理
                </h1>
                <p className="hero__desc mb-4">
                  我们提供正宗的中华美食，采用新鲜食材，传统工艺烹制。
                  支持在线订餐，快速配送到家。
                </p>

                <button className="order__btn d-flex align-items-center justify-content-between">
                  <Link to="/menu">
                    查看菜单 <i className="ri-arrow-right-s-line"></i>
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
              <h2 className="section__title">关于我们</h2>
              <p className="section__subtitle">传承中华美食文化，为您提供优质服务</p>
            </Col>
          </Row>
          <Row>
            <Col lg="4" md="6" sm="6" className="mb-4">
              <div className="feature__item text-center">
                <div className="feature__icon">
                  <i className="ri-restaurant-line"></i>
                </div>
                <h5>正宗口味</h5>
                <p>采用传统配方和新鲜食材，确保每道菜品的正宗口味</p>
              </div>
            </Col>
            <Col lg="4" md="6" sm="6" className="mb-4">
              <div className="feature__item text-center">
                <div className="feature__icon">
                  <i className="ri-timer-line"></i>
                </div>
                <h5>快速配送</h5>
                <p>专业配送团队，30分钟内将热腾腾的美食送到您手中</p>
              </div>
            </Col>
            <Col lg="4" md="6" sm="6" className="mb-4">
              <div className="feature__item text-center">
                <div className="feature__icon">
                  <i className="ri-shield-check-line"></i>
                </div>
                <h5>品质保证</h5>
                <p>严格的食品安全标准，让您吃得放心，吃得安心</p>
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
                <h3 className="mb-4">营业时间</h3>
                <div className="hours__list">
                  <div className="hour__item d-flex justify-content-between mb-2">
                    <span>周一 - 周五</span>
                    <span>11:00 - 22:00</span>
                  </div>
                  <div className="hour__item d-flex justify-content-between mb-2">
                    <span>周六 - 周日</span>
                    <span>10:00 - 23:00</span>
                  </div>
                  <div className="hour__item d-flex justify-content-between mb-2">
                    <span>外卖服务</span>
                    <span>每日 11:00 - 21:30</span>
                  </div>
                </div>
              </div>
            </Col>
            <Col lg="6" md="6">
              <div className="contact__info">
                <h3 className="mb-4">联系方式</h3>
                <div className="contact__list">
                  <div className="contact__item mb-3">
                    <i className="ri-map-pin-line me-2"></i>
                    <span>地址：北京市朝阳区美食街123号</span>
                  </div>
                  <div className="contact__item mb-3">
                    <i className="ri-phone-line me-2"></i>
                    <span>电话：010-8888-9999</span>
                  </div>
                  <div className="contact__item mb-3">
                    <i className="ri-time-line me-2"></i>
                    <span>配送时间：30-45分钟</span>
                  </div>
                  <div className="contact__item mb-3">
                    <i className="ri-money-dollar-circle-line me-2"></i>
                    <span>起送金额：￥30</span>
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
