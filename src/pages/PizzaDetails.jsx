import React, { useState, useEffect } from "react";
import products from "../assets/fake-data/products";
import { useParams } from "react-router-dom";
import Helmet from "../components/Helmet/Helmet";
import CommonSection from "../components/UI/common-section/CommonSection";
import { Container, Row, Col } from "reactstrap";
import ExtraIngredient from '../components/ExtraIngredient/ExtraIngredient.jsx';
import { useDispatch } from "react-redux";
import { cartActions } from "../store/shopping-cart/cartSlice";
import { useSelector } from "react-redux";
import DishOptionsModal from "../components/DishOptionsModal/DishOptionsModal";
import SuccessNotification from "../components/SuccessNotification/SuccessNotification";
import "../styles/product-details.css";
import "../styles/product-card.css";
import ProductCard from "../components/UI/product-card/ProductCard";

const ExtraIngredients = {
  MUSHROOMS: "Mushrooms",
  ONION: "Onion",
  PEPPER: "Pepper",
  PINAPPLE: "Pinapple",
  TUNA: "Tuna",
  MEAT: "Meat",
  CHEESE: "Cheese",
  HOTSAUCE: "Hot Sauce",
  CORN: "Corn"
};

const PizzaDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  // All useState hooks must be at the top
  const [extraIngredients, setExtraIngredients] = useState([]);
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [successDetails, setSuccessDetails] = useState(null);
  const [previewImg, setPreviewImg] = useState("");

  const cartProducts = useSelector((state) => state.cart.cartItems);
  const product = products.find((product) => product.id === id);

  // All useEffect hooks must be before any early returns
  useEffect(() => {
    if (product && product.image01) {
      setPreviewImg(product.image01);
    }
  }, [product]);

  useEffect(() => {
    const existingPizza = cartProducts.find(item => item.id === id);
    if (existingPizza) {
      setExtraIngredients(existingPizza.extraIngredients || []);
    } else {
      setExtraIngredients([]);
    }
  }, [cartProducts, id]);

  useEffect(() => {
    if (showSuccessNotification) {
      const timer = setTimeout(() => {
        setShowSuccessNotification(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [showSuccessNotification]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [product]);

  // Early return if product not found
  if (!product) {
    return (
      <Helmet title="Product Niet Gevonden">
        <CommonSection title="Product Niet Gevonden" />
        <Container>
          <Row>
            <Col lg="12" className="text-center">
              <h4>Product niet gevonden</h4>
              <p>Het product dat u zoekt bestaat niet.</p>
            </Col>
          </Row>
        </Container>
      </Helmet>
    );
  }

  const { title, price, category, desc, image01, options } = product;
  const relatedProduct = products.filter((item) => category === item.category);
  const hasOptions = options && Object.keys(options).length > 0;

  const quickAddToCart = () => {
    const cartItem = {
      id: String(id),
      title,
      price,
      image01,
      category,
      extraIngredients
    };
    dispatch(cartActions.addItem(cartItem));
    setSuccessMessage(`"${title}" toegevoegd aan winkelwagen`);
    setSuccessDetails(null);
    setShowSuccessNotification(true);
  };

  const addItem = () => {
    if (hasOptions) {
      setShowOptionsModal(true);
    } else {
      quickAddToCart();
    }
  };

  const handleOptionsSuccess = (dishTitle, selectedOptions) => {
    const details = Object.values(selectedOptions)
      .filter(option => option && option.name)
      .map(option => option.name);
    setSuccessMessage(`"${dishTitle}" toegevoegd aan winkelwagen`);
    setSuccessDetails(details.length > 0 ? details : null);
    setShowSuccessNotification(true);
  };

  function updateExtraIngredients(ingredient) {
    if (extraIngredients.includes(ingredient)) {
      setExtraIngredients(extraIngredients.filter(item => item !== ingredient));
    } else {
      setExtraIngredients(previousState => [...previousState, ingredient]);
    }
  }

  return (
    <Helmet title="Product-details">
      <CommonSection title={title} />
      <section>
        <Container>
          <Row>
            <Col lg="2" md="2">
              <div className="product__images">
                <div className="img__item mb-3" onClick={() => setPreviewImg(product.image01)}>
                  <img src={product.image01 || ""} alt="" className="w-50" />
                </div>
                <div className="img__item mb-3" onClick={() => setPreviewImg(product.image02)}>
                  <img src={product.image02 || ""} alt="" className="w-50" />
                </div>
                <div className="img__item" onClick={() => setPreviewImg(product.image03)}>
                  <img src={product.image03 || ""} alt="" className="w-50" />
                </div>
              </div>
            </Col>
            <Col lg="4" md="4">
              <div className="product__main-img">
                <img src={previewImg} alt="" className="w-100" />
              </div>
            </Col>
            <Col lg="6" md="6">
              <div className="single__product-content">
                <h2 className="product__title mb-3">{title}</h2>
                <p className="product__price">Prijs: <span>€{price.toFixed(2)}</span></p>
                <p className="category mb-5">Categorie: <span>{category}</span></p>
                <button onClick={addItem} className="addTOCART__btn">
                  {cartProducts.find(item => item.id === id) ? 'Winkelwagen Bijwerken' :
                    hasOptions ? 'Opties Kiezen' : 'Toevoegen'}
                </button>
              </div>
            </Col>
            <Col lg='12'>
              <div className="extraIngredientsGrid">
                {(Object.values(ExtraIngredients)).map((ingredient) => {
                  return (
                    <ExtraIngredient
                      isChecked={extraIngredients.includes(ingredient)}
                      key={ingredient}
                      onSelect={ingredient => updateExtraIngredients(ingredient)}
                      ingredient={ingredient}
                    />
                  );
                })}
              </div>
            </Col>
            <Col lg="12">
              <h6 className="description">Beschrijving</h6>
              <div className="description__content">
                <p>{desc}</p>
              </div>
            </Col>
            <Col lg="12" className="mb-5 mt-4">
              <h2 className="related__Product-title">Misschien vindt u dit ook leuk</h2>
            </Col>
            {relatedProduct.map((item) => (
              <Col lg="3" md="4" sm="6" xs="6" className="mb-4" key={item.id}>
                <ProductCard item={item} />
              </Col>
            ))}
          </Row>
        </Container>
      </section>
      <DishOptionsModal
        isOpen={showOptionsModal}
        toggle={() => setShowOptionsModal(false)}
        dish={product}
        onAddSuccess={handleOptionsSuccess}
      />
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
