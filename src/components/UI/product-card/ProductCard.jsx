import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { cartActions } from "../../../store/shopping-cart/cartSlice";
import { Link } from "react-router-dom";
import DishOptionsModal from "../../DishOptionsModal/DishOptionsModal";
import SuccessNotification from "../../SuccessNotification/SuccessNotification";
import "../../../styles/product-card.css";

const ProductCard = (props) => {
  const { id, title, image01, price, options, desc, category } = props.item;
  const dispatch = useDispatch();

  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [successDetails, setSuccessDetails] = useState(null);

  // Check if item has options
  const hasOptions = options && Object.keys(options).length > 0;

  // Quick add to cart (no options)
  const quickAddToCart = () => {
    const cartItem = {
      id: String(id), // Ensure ID is string
      title,
      image01,
      price,
      category,
      desc
    };

    dispatch(cartActions.addItem(cartItem));

    // Show success notification
    setSuccessMessage(`"${title}" toegevoegd aan winkelwagen`);
    setSuccessDetails(null);
    setShowSuccessNotification(true);
  };

  // Handle click on add button
  const handleAddClick = () => {
    if (hasOptions) {
      setShowOptionsModal(true);
    } else {
      quickAddToCart();
    }
  };

  // Handle success from options modal
  const handleOptionsSuccess = (dishTitle, selectedOptions) => {
    // Generate success details from selected options
    const details = Object.values(selectedOptions)
      .filter(option => option && option.name)
      .map(option => option.name);

    setSuccessMessage(`"${dishTitle}" toegevoegd aan winkelwagen`);
    setSuccessDetails(details.length > 0 ? details : null);
    setShowSuccessNotification(true);
  };

  // Auto-hide success notification
  React.useEffect(() => {
    if (showSuccessNotification) {
      const timer = setTimeout(() => {
        setShowSuccessNotification(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [showSuccessNotification]);

  // Get category display name
  const getCategoryName = (cat) => {
    const categoryMap = {
      "main-dishes": "Hoofdgerechten",
      "appetizers": "Voorgerechten",
      "soups": "Soepen",
      "beverages": "Dranken",
      "desserts": "Desserts"
    };
    return categoryMap[cat] || cat;
  };

  return (
    <>
      <div className="product__item d-flex flex-column justify-content-between">
        <div className="product__content">
          <div className="product__img-wrapper">
            <img className="product__img" src={image01} alt={title} />
            <div className="product__category">{getCategoryName(category)}</div>
          </div>
          <div className="product__info">
            <h5>
              <Link to={`/menu/${id}`}>{title}</Link>
            </h5>
            <p className="product__desc">{desc}</p>
            {hasOptions && (
              <div className="product__options-hint">
                <i className="ri-settings-3-line"></i>
                <span>Opties beschikbaar</span>
              </div>
            )}
          </div>
        </div>
        <div className="d-flex flex-column align-items-center justify-content-between">
          <span className="product__price mb-2">€{price.toFixed(2)}</span>
          <button className="addTOCART__btn" onClick={handleAddClick}>
            {hasOptions ? "Opties Kiezen" : "Toevoegen"}
          </button>
        </div>
      </div>

      {/* Options Modal */}
      <DishOptionsModal
        isOpen={showOptionsModal}
        toggle={() => setShowOptionsModal(false)}
        dish={props.item}
        onAddSuccess={handleOptionsSuccess}
      />

      {/* Success Notification */}
      <SuccessNotification
        isVisible={showSuccessNotification}
        message={successMessage}
        details={successDetails}
        onClose={() => setShowSuccessNotification(false)}
      />
    </>
  );
};

export default ProductCard;
