import React from "react";
import { ListGroupItem } from "reactstrap";
import { useNavigate } from "react-router-dom";

import "../../../styles/cart-item.css";

import { useDispatch } from "react-redux";
import { cartActions } from "../../../store/shopping-cart/cartSlice";

const CartItem = ({ item, onClose }) => {
  const {
    id,
    title,
    displayTitle,
    price,
    basePrice,
    image01,
    quantity,
    selectedOptions,
    category
  } = item;

  let navigate = useNavigate();
  const dispatch = useDispatch();

  const incrementItem = (event) => {
    dispatch(
      cartActions.addItem({
        id,
        title,
        displayTitle,
        price,
        basePrice,
        image01,
        selectedOptions,
        category
      })
    );
    event.stopPropagation();
  };

  const decreaseItem = (event) => {
    dispatch(cartActions.removeItem(id));
    event.stopPropagation();
  };

  const deleteItem = (event) => {
    dispatch(cartActions.deleteItem(id));
    event.stopPropagation();
  };

  const handleItemSelection = () => {
    const baseId = id.split('_')[0]; // Get base ID without timestamp
    navigate(`/menu/${baseId}`);
    onClose();
  };

  // Get category display name
  const getCategoryName = (cat) => {
    const categoryMap = {
      "main-dishes": "主食",
      "appetizers": "开胃菜",
      "soups": "汤类",
      "beverages": "饮料",
      "desserts": "甜品"
    };
    return categoryMap[cat] || cat;
  };

  // Generate options display text
  const getOptionsDisplay = () => {
    if (!selectedOptions || Object.keys(selectedOptions).length === 0) {
      return null;
    }

    const optionTexts = [];
    Object.entries(selectedOptions).forEach(([key, value]) => {
      if (value && value.name) {
        optionTexts.push(value.name);
      }
    });

    return optionTexts.length > 0 ? optionTexts : null;
  };

  const optionsDisplay = getOptionsDisplay();

  return (
    <ListGroupItem className="border-0 cart__item">
      <div className="cart__item-info d-flex gap-4">
        <img src={image01} alt="product-img" className="cart__item-img" />

        <div className="cart__product-info w-100 d-flex align-items-center gap-4 justify-content-between">
          <div className="cart__product-details">
            <h6 
              className="cart__product-title" 
              onClick={handleItemSelection}
              style={{ cursor: 'pointer', color: '#df2020' }}
              title="点击查看产品详情"
            >
              {title}
            </h6>

            {/* Category Badge */}
            <span className="cart__category-badge">{getCategoryName(category)}</span>

            {/* Selected Options */}
            {optionsDisplay && (
              <div className="cart__options">
                {optionsDisplay.map((option, index) => (
                  <span key={index} className="cart__option-tag">
                    {option}
                  </span>
                ))}
              </div>
            )}

            {/* Price Information */}
            <p className="cart__product-price d-flex align-items-center gap-2">
              {quantity}x <span className="price">￥{price}</span>
              {basePrice && price !== basePrice && (
                <span className="base-price">（基础价：￥{basePrice}）</span>
              )}
            </p>

            {/* Quantity Controls */}
            <div className="quantity__controls d-flex align-items-center gap-2">
              <span className="quantity__btn decrease__btn" onClick={event => decreaseItem(event)}>
                <i className="ri-subtract-line"></i>
              </span>
              <span className="quantity__display">{quantity}</span>
              <span className="quantity__btn increase__btn" onClick={event => incrementItem(event)}>
                <i className="ri-add-line"></i>
              </span>
            </div>
          </div>

          <div className="cart__item-actions">
            <div className="cart__total-price">
              ￥{(price * quantity).toFixed(2)}
            </div>
            <span className="delete__btn" onClick={event => deleteItem(event)}>
              <i className="ri-close-line"></i>
            </span>
          </div>
        </div>
      </div>
    </ListGroupItem>
  );
};

export default CartItem;
