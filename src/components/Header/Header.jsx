import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Container } from "reactstrap";
// 移除本地logo导入，只使用数据库logo
import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { cartUiActions } from "../../store/shopping-cart/cartUiSlice";
import { configService } from "../../services/ConfigService";

import "../../styles/header.css";

const nav__links = [
  {
    display: "Home",
    path: "/home",
  },
  {
    display: "Menu",
    path: "/menu",
  },
  {
    display: "Winkelwagen",
    path: "/cart",
  },
  {
    display: "Contact",
    path: "/contact",
  },
];

const Header = () => {
  const menuRef = useRef(null);
  const headerRef = useRef(null);
  const totalQuantity = useSelector((state) => state.cart.totalQuantity);
  const dispatch = useDispatch();

  // 动态logo状态
  const [dynamicLogo, setDynamicLogo] = useState(null); // 初始为null，避免显示本地logo
  const [logoLoading, setLogoLoading] = useState(true); // 初始为true，表示正在加载

  // 动态餐厅名称状态
  const [restaurantName, setRestaurantName] = useState(''); // 初始为空
  const [nameLoading, setNameLoading] = useState(true); // 初始为true，表示正在加载

  // 响应式状态
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 992);

  // 简化调试信息 - 只在开发模式下显示
  if (process.env.NODE_ENV === 'development') {
    console.log('Header状态:', {
      logo: dynamicLogo ? '✅数据库logo' : (logoLoading ? '⏳加载中' : '❌无logo'),
      name: restaurantName || (nameLoading ? '⏳加载中' : '❌无名称'),
      mobile: isMobile
    });
  }

  const toggleMenu = () => menuRef.current.classList.toggle("show__menu");
  let navigate = useNavigate();

  const toggleCart = () => {
    dispatch(cartUiActions.toggle());
  };

  useEffect(() => {
    const handleScroll = () => {
      if (
        document.body.scrollTop > 10 ||
        document.documentElement.scrollTop > 10
      ) {
        headerRef.current?.classList.add("header__shrink");
      } else {
        headerRef.current?.classList.remove("header__shrink");
      }
    };

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 992);
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // 动态加载logo和餐厅名称
  useEffect(() => {
    let isMounted = true;
    let timeoutId = null;

    const loadDynamicConfig = async () => {
      try {
        console.log('开始加载动态配置...');

        // 并行加载logo和餐厅名称
        const [logoUrl, restName] = await Promise.all([
          configService.getTitleImage(),
          configService.getRestaurantName()
        ]);

        console.log('ConfigService返回的logoUrl:', logoUrl);
        console.log('ConfigService返回的餐厅名称:', restName);

        if (!isMounted) return;

        // 处理餐厅名称
        if (restName && restName.trim() !== '') {
          console.log('设置数据库餐厅名称:', restName);
          setRestaurantName(restName);
        } else {
          console.log('未找到餐厅名称配置，使用默认名称');
          setRestaurantName('Tasty Treat'); // 只在没有数据库配置时使用默认值
        }
        setNameLoading(false);

        // 处理logo
        if (logoUrl && logoUrl.trim() !== '') {
          console.log('获取到数据库logo URL:', logoUrl);

          // 验证URL是否有效
          const img = new Image();

          img.onload = () => {
            if (isMounted) {
              console.log('数据库logo加载成功，设置logo:', logoUrl);
              setDynamicLogo(logoUrl);
              setLogoLoading(false);
              // 清除超时定时器，因为加载成功了
              if (timeoutId) {
                clearTimeout(timeoutId);
                timeoutId = null;
              }
            }
          };

          img.onerror = () => {
            if (isMounted) {
              console.warn('数据库logo加载失败，不显示logo:', logoUrl);
              setDynamicLogo(null); // 数据库logo失败时不显示logo
              setLogoLoading(false);
              // 清除超时定时器
              if (timeoutId) {
                clearTimeout(timeoutId);
                timeoutId = null;
              }
            }
          };

          // 设置5秒超时
          timeoutId = setTimeout(() => {
            if (isMounted) {
              console.warn('数据库logo加载超时，不显示logo');
              setDynamicLogo(null); // 超时时不显示logo
              setLogoLoading(false);
            }
          }, 5000);

          img.src = logoUrl;
        } else {
          console.log('未找到数据库logo配置，不显示logo');
          setDynamicLogo(null); // 没有数据库配置时不显示logo
          setLogoLoading(false);
        }
      } catch (error) {
        if (isMounted) {
          console.error('加载动态配置失败，使用默认值:', error);
          setDynamicLogo(null); // 出错时不显示logo
          setRestaurantName('Tasty Treat'); // 只在出错时使用默认名称
          setLogoLoading(false);
          setNameLoading(false);
        }
      }
    };

    loadDynamicConfig();

    // 清理函数
    return () => {
      isMounted = false;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []); // 只在组件挂载时执行一次

  return (
    <header className="header" ref={headerRef}>
      <Container>
        <div className="nav__wrapper d-flex align-items-center justify-content-between">
          <div className="logo" onClick={() => navigate("/home")}>
            {dynamicLogo && (
              <img
                src={dynamicLogo}
                alt="logo"
                style={{
                  opacity: logoLoading ? 0.8 : 1,
                  transition: 'opacity 0.2s ease',
                  maxHeight: isMobile ? '35px' : '50px',
                  width: 'auto',
                  objectFit: 'contain',
                  marginTop: '0',
                  display: 'block'
                }}
              />
            )}
            {restaurantName && (
              <h5 style={{
                opacity: nameLoading ? 0.8 : 1,
                transition: 'opacity 0.2s ease',
                marginTop: dynamicLogo ? '2px' : '5px',
                marginBottom: '0',
                fontSize: isMobile ? '0.75rem' : '1rem',
                fontWeight: '600',
                color: '#212245',
                lineHeight: '1.2',
                textAlign: 'center'
              }}>
                {restaurantName}
              </h5>
            )}
          </div>
          {/* ======= menu ======= */}
          <div className="navigation" ref={menuRef} onClick={toggleMenu}>
            <div
              className="menu d-flex align-items-center gap-5"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="header__closeButton">
                <span onClick={toggleMenu}>
                  <i className="ri-close-fill"></i>
                </span>
              </div>
              {nav__links.map((item, index) => (
                <NavLink
                  to={item.path}
                  key={index}
                  className={(navClass) =>
                    navClass.isActive ? "active__menu" : ""
                  }
                  onClick={toggleMenu}
                >
                  {item.display}
                </NavLink>
              ))}
            </div>
          </div>

          {/* ======== nav right icons ========= */}
          <div className="nav__right d-flex align-items-center gap-4">
            <span className="cart__icon" onClick={toggleCart}>
              <i className="ri-shopping-basket-line" style={{ fontSize: '1.7rem' }}></i>
              <span className="cart__badge">{totalQuantity}</span>
            </span>

            <span className="mobile__menu" onClick={toggleMenu}>
              <i className="ri-menu-line" style={{ fontSize: '1.7rem' }}></i>
            </span>
          </div>
        </div>
      </Container>
    </header>
  );
};

export default Header;
