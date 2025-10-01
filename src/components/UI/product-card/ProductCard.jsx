import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { cartActions } from "../../../store/shopping-cart/cartSlice";
import { Link } from "react-router-dom";
import DishOptionsModal from "../../DishOptionsModal/DishOptionsModal";
import SuccessNotification from "../../SuccessNotification/SuccessNotification";
import "../../../styles/product-card.css";

const ProductCard = (props) => {
  const { id, title, image01, price, options, desc, category, categoryTakeAway, keuzeMenus } = props.item;
  const dispatch = useDispatch();

  // 获取购物车状态
  const cartItems = useSelector(state => state.cart.cartItems);

  // 使用 categoryTakeAway 作为主要分类，如果没有则使用 category 作为后备
  const actualCategory = categoryTakeAway || category;

  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [successDetails, setSuccessDetails] = useState(null);

  // Check if item has options (支持新旧两种格式)
  const hasKeuzeMenus = keuzeMenus && Array.isArray(keuzeMenus) && keuzeMenus.length > 0;
  const hasLegacyOptions = options && Object.keys(options).length > 0;
  const hasOptions = hasKeuzeMenus || hasLegacyOptions;

  // 计算当前商品在购物车中的总数量（包括所有变体）
  const getItemQuantityInCart = () => {
    return cartItems
      .filter(cartItem => {
        const cartItemBaseId = String(cartItem.id).split('_')[0];
        return cartItemBaseId === String(id);
      })
      .reduce((total, item) => total + item.quantity, 0);
  };

  const itemQuantityInCart = getItemQuantityInCart();

  // Quick add to cart (no options)
  const quickAddToCart = () => {
    const cartItem = {
      id: String(id), // Ensure ID is string
      title,
      image01,
      price,
      category: actualCategory, // 使用正确的分类字段
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
  };  // Handle success from options modal
  const handleOptionsSuccess = (dishTitle, selectedOptions) => {
    // Generate success details from selected options
    const details = Object.values(selectedOptions)
      .filter(option => option && option.name)
      .map(option => option.name);

    setSuccessMessage(`"${dishTitle}" toegevoegd aan winkelwagen`);
    setSuccessDetails(details.length > 0 ? details : null);
    setShowSuccessNotification(true);
  };

  // 增加数量（仅适用于无选项商品）
  const increaseQuantity = () => {
    if (!hasOptions) {
      quickAddToCart();
    }
  };

  // 减少数量
  const decreaseQuantity = () => {
    // 找到购物车中该商品的最后一个实例（基于baseId匹配）
    const matchingItems = cartItems.filter(cartItem => {
      const cartItemBaseId = String(cartItem.id).split('_')[0];
      return cartItemBaseId === String(id);
    });

    const lastItem = matchingItems[matchingItems.length - 1];

    if (lastItem) {
      // removeItem只需要ID字符串
      dispatch(cartActions.removeItem(lastItem.id));

      // 显示移除通知
      setSuccessMessage(`"${title}" 数量已减少`);
      setSuccessDetails(null);
      setShowSuccessNotification(true);
    }
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

          {/* 根据商品状态显示不同的控件 */}
          {itemQuantityInCart > 0 && !hasOptions ? (
            // 显示数量控制器（仅适用于无选项商品）
            <div className="product__quantity-controls d-flex align-items-center gap-2">
              <button
                className="quantity__btn decrease__btn"
                onClick={decreaseQuantity}
              >
                <i className="ri-subtract-line"></i>
              </button>
              <span className="quantity__display">{itemQuantityInCart}</span>
              <button
                className="quantity__btn increase__btn"
                onClick={increaseQuantity}
              >
                <i className="ri-add-line"></i>
              </button>
            </div>
          ) : itemQuantityInCart > 0 && hasOptions ? (
            // 显示有选项商品的管理界面
            <div className="product__options-management d-flex flex-column align-items-center gap-2">
              <div className="options-quantity-info">
                <span className="quantity__display">{itemQuantityInCart}</span>
                <span className="quantity__label">in winkelwagen</span>
              </div>
              <div className="options-actions-container">
                <div className="options-actions">
                  <button
                    className="quantity__btn decrease__btn"
                    onClick={decreaseQuantity}
                    title="Verwijder laatste item"
                  >
                    <i className="ri-subtract-line"></i>
                  </button>
                  <button
                    className="addTOCART__btn compact"
                    onClick={handleAddClick}
                    title="Voeg meer toe met opties"
                  >
                    <i className="ri-add-line"></i>
                  </button>
                </div>
              </div>
              <div className="options-hint">
                <span className="hint-text">Klik + voor nieuwe keuze</span>
              </div>
            </div>
          ) : (
            // 显示添加按钮
            <button className="addTOCART__btn" onClick={handleAddClick}>
              {hasOptions ? "Opties Kiezen" : "Toevoegen"}
            </button>
          )}
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
