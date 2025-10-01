import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Helmet from "../components/Helmet/Helmet";
import CommonSection from "../components/UI/common-section/CommonSection";
import { Container, Row, Col } from "reactstrap";
import { useDispatch } from "react-redux";
import { cartActions } from "../store/shopping-cart/cartSlice";
import DishOptionsModal from "../components/DishOptionsModal/DishOptionsModal";
import SuccessNotification from "../components/SuccessNotification/SuccessNotification";
import { menuService } from "../services/MenuService";
import { categoryService } from "../services/CategoryService";
import "../styles/product-details.css";
import "../styles/product-card.css";

const PizzaDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // State management
  const [dish, setDish] = useState(null);
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [successDetails, setSuccessDetails] = useState(null);
  const [previewImg, setPreviewImg] = useState("");

  // Load dish data from Firebase
  useEffect(() => {
    const loadDishDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get all dishes and find the one with matching ID
        const allDishes = await menuService.getAllDishes();
        const foundDish = allDishes.find(dish => String(dish.id) === String(id));

        if (foundDish) {
          setDish(foundDish);
          setPreviewImg(foundDish.image01);

          // Load category name
          if (foundDish.categoryTakeAway || foundDish.category) {
            const categoryId = foundDish.categoryTakeAway || foundDish.category;
            const categoryInfo = await categoryService.getCategoryById(categoryId);
            if (categoryInfo) {
              setCategoryName(categoryInfo.name);
            } else {
              setCategoryName(categoryId); // 备用显示原始ID
            }
          }
        } else {
          setError('Gerecht niet gevonden');
        }
      } catch (err) {
        console.error('Fout bij laden gerecht details:', err);
        setError('Kon gerecht niet laden');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadDishDetails();
    }
  }, [id]);

  // Auto-hide success notification
  useEffect(() => {
    if (showSuccessNotification) {
      const timer = setTimeout(() => {
        setShowSuccessNotification(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessNotification]);

  // Auto-scroll to back button when dish is loaded (mobile-friendly)
  useEffect(() => {
    if (dish && !loading) {
      // 延迟一点时间确保DOM已完全渲染
      const timer = setTimeout(() => {
        const backButton = document.getElementById('back-button');
        if (backButton) {
          // 使用smooth scrolling并偏移一些像素以确保按钮可见
          const yOffset = -20; // 向上偏移20px，让按钮不贴边
          const yPosition = backButton.getBoundingClientRect().top + window.pageYOffset + yOffset;
          
          window.scrollTo({
            top: yPosition,
            behavior: 'smooth'
          });
        }
      }, 100); // 100ms延迟确保渲染完成
      
      return () => clearTimeout(timer);
    }
  }, [dish, loading]);

  // Check if dish has options (支持新旧两种格式)
  const hasKeuzeMenus = dish && dish.keuzeMenus && Array.isArray(dish.keuzeMenus) && dish.keuzeMenus.length > 0;
  const hasLegacyOptions = dish && dish.options && Object.keys(dish.options).length > 0;
  const hasOptions = hasKeuzeMenus || hasLegacyOptions;

  // Handle add to cart with options
  const handleAddToCart = () => {
    if (hasOptions) {
      setShowOptionsModal(true);
    } else {
      quickAddToCart();
    }
  };

  // Quick add to cart (no options)
  const quickAddToCart = () => {
    if (!dish) return;

    const cartItem = {
      id: String(dish.id),
      title: dish.title,
      image01: dish.image01,
      price: dish.price,
      category: dish.categoryTakeAway || dish.category,
      desc: dish.desc
    };

    dispatch(cartActions.addItem(cartItem));
    setSuccessMessage(`${dish.title} toegevoegd aan winkelwagen!`);
    setShowSuccessNotification(true);
  };

  // Handle modal success
  const handleModalSuccess = (dishTitle, optionsText) => {
    setSuccessMessage(`${dishTitle} toegevoegd aan winkelwagen!`);
    setSuccessDetails(optionsText ? [optionsText] : null);
    setShowSuccessNotification(true);
    setShowOptionsModal(false);
  };

  // Handle back navigation
  const handleGoBack = () => {
    navigate(-1); // 返回上一页
  };

  // Loading state
  if (loading) {
    return (
      <Helmet title="Laden...">
        <CommonSection title="Gerecht Details" />
        <Container>
          <Row>
            <Col lg="12" className="text-center">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Laden...</span>
              </div>
              <p className="mt-2">Gerecht laden...</p>
            </Col>
          </Row>
        </Container>
      </Helmet>
    );
  }

  // Error state
  if (error || !dish) {
    return (
      <Helmet title="Gerecht Niet Gevonden">
        <CommonSection title="Gerecht Niet Gevonden" />
        <Container>
          <Row>
            <Col lg="12" className="text-center">
              <h4>Gerecht niet gevonden</h4>
              <p>{error || 'Het gerecht dat u zoekt bestaat niet.'}</p>
              <button
                className="btn btn-primary mt-3"
                onClick={() => window.history.back()}
              >
                Terug naar menu
              </button>
            </Col>
          </Row>
        </Container>
      </Helmet>
    );
  }

  return (
    <Helmet title={dish.title || "Gerecht Details"}>
      <CommonSection title={dish.title || "Gerecht Details"} />
      <section>
        <Container>
          {/* 返回按钮 */}
          <Row className="mb-4">
            <Col lg="12">
              <button
                id="back-button"
                className="btn btn-outline-primary"
                onClick={handleGoBack}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <i className="ri-arrow-left-line"></i>
                Terug
              </button>
            </Col>
          </Row>

          <Row>
            <Col lg="6" md="6">
              <div className="product__main-img">
                <img src={previewImg || dish.image01} alt={dish.title} className="w-100" />
              </div>
            </Col>

            <Col lg="6" md="6">
              <div className="single__product-content">
                <h2 className="product__title mb-3">{dish.title}</h2>
                <p className="product__price mb-4">Prijs: <span>€{dish.price.toFixed(2)}</span></p>
                <p className="category mb-3">
                  <span>Categorie: <span>{categoryName || dish.categoryTakeAway || dish.category}</span></span>
                </p>

                <div className="product__desc mb-4">
                  <h6>Beschrijving:</h6>
                  <div dangerouslySetInnerHTML={{ __html: dish.desc }} />
                </div>

                {/* 过敏信息 - 不显示标题，直接显示内容 */}
                {dish.allergy && (
                  <div className="product__allergy mb-4">
                    <div
                      style={{
                        backgroundColor: '#fff3cd',
                        border: '1px solid #ffeaa7',
                        padding: '0.75rem',
                        borderRadius: '4px',
                        color: '#856404'
                      }}
                      dangerouslySetInnerHTML={{ __html: dish.allergy }}
                    />
                  </div>
                )}

                {hasOptions && (
                  <div className="product__options-info mb-4">
                    <i className="ri-settings-3-line"></i>
                    <span>Dit gerecht heeft keuzemenu's beschikbaar</span>
                  </div>
                )}

                <button
                  className="addTOCart__btn"
                  onClick={handleAddToCart}
                >
                  {hasOptions ? 'Opties Kiezen' : 'Toevoegen aan winkelwagen'}
                </button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Options Modal */}
      {showOptionsModal && (
        <DishOptionsModal
          dish={dish}
          isOpen={showOptionsModal}
          toggle={() => setShowOptionsModal(false)}
          onAddSuccess={handleModalSuccess}
        />
      )}

      {/* Success Notification */}
      <SuccessNotification
        isVisible={showSuccessNotification}
        message={successMessage}
        details={successDetails}
        onClose={() => setShowSuccessNotification(false)}
      />
    </Helmet>
  );
};

export default PizzaDetails;
