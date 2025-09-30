import React, { useState } from "react";
import { Modal, ModalBody, Button } from "reactstrap";
import { useDispatch } from "react-redux";
import { cartActions } from "../../../store/shopping-cart/cartSlice";
import { Link } from "react-router-dom";
import "../../../styles/product-card.css";

const ProductCard = (props) => {
  const { id, title, image01, price, options, desc, category } = props.item;
  const dispatch = useDispatch();

  const [modal, setModal] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [totalPrice, setTotalPrice] = useState(price);

  const toggle = () => setModal(!modal);

  // Check if item has options
  const hasOptions = options && Object.keys(options).length > 0;

  // Handle option selection
  const handleOptionChange = (optionType, selectedOption) => {
    const newSelectedOptions = {
      ...selectedOptions,
      [optionType]: selectedOption
    };
    setSelectedOptions(newSelectedOptions);

    // Calculate new total price
    let newPrice = price;
    Object.values(newSelectedOptions).forEach(option => {
      if (option && option.price) {
        newPrice += option.price;
      }
    });
    setTotalPrice(newPrice);
  };

  // Add to cart with options
  const addToCart = () => {
    const cartItem = {
      id: hasOptions ? `${String(id)}_${Date.now()}` : String(id), // Ensure ID is string
      title,
      image01,
      price: totalPrice,
      basePrice: price,
      selectedOptions: hasOptions ? selectedOptions : {},
      category,
      desc
    };

    dispatch(cartActions.addItem(cartItem));

    if (hasOptions) {
      setModal(false);
      setSelectedOptions({});
      setTotalPrice(price);
    }
  };

  // Quick add to cart (no options or direct add)
  const quickAddToCart = () => {
    if (hasOptions) {
      toggle();
    } else {
      addToCart();
    }
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
                <span>可选配置</span>
              </div>
            )}
          </div>
        </div>
        <div className="d-flex flex-column align-items-center justify-content-between">
          <span className="product__price mb-2">￥{price}</span>
          <button className="addTOCART__btn" onClick={quickAddToCart}>
            {hasOptions ? "选择配置" : "加入购物车"}
          </button>
        </div>
      </div>

      {/* Options Modal */}
      <Modal isOpen={modal} toggle={toggle} className="options__modal">
        <ModalBody>
          <div className="options__header">
            <img src={image01} alt={title} className="options__img" />
            <div className="options__info">
              <h4>{title}</h4>
              <p>{desc}</p>
              <span className="options__base-price">基础价格: ￥{price}</span>
            </div>
          </div>

          <div className="options__content">
            {hasOptions && Object.entries(options).map(([optionType, optionList]) => {
              const optionTypeNames = {
                spiciness: "辣度",
                size: "分量",
                cooking: "烹饪方式",
                tofu: "豆腐类型",
                cut: "切法",
                consistency: "汤的浓度",
                temperature: "温度",
                sweetness: "甜度",
                ice: "冰量",
                packaging: "包装方式"
              };

              return (
                <div key={optionType} className="option__group">
                  <h6 className="option__title">{optionTypeNames[optionType] || optionType}</h6>
                  <div className="option__list">
                    {optionList.map((option, index) => (
                      <label key={index} className="option__item">
                        <input
                          type="radio"
                          name={optionType}
                          onChange={() => handleOptionChange(optionType, option)}
                          checked={selectedOptions[optionType]?.name === option.name}
                        />
                        <span className="option__label">
                          {option.name}
                          {option.price > 0 && <span className="option__price"> (+￥{option.price})</span>}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="options__footer">
            <div className="options__total">
              <span>总价: ￥{totalPrice}</span>
            </div>
            <div className="options__actions">
              <Button color="secondary" onClick={toggle}>取消</Button>
              <Button color="primary" onClick={addToCart}>加入购物车</Button>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
};

export default ProductCard;
