import React, { useState, useEffect } from "react";
import { ListGroupItem } from "reactstrap";
import { useNavigate } from "react-router-dom";

import "../../../styles/cart-item.css";

import { useDispatch } from "react-redux";
import { cartActions } from "../../../store/shopping-cart/cartSlice";
import { categoryService } from "../../../services/CategoryService";

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
    optionsText,
    category
  } = item;

  const [categoryName, setCategoryName] = useState(category);

  // 调试：显示CartItem收到的完整item数据
  console.log('=== CartItem调试信息 ===');
  console.log('CartItem - 完整item数据:', item);
  console.log('CartItem - optionsText:', optionsText, '类型:', typeof optionsText);
  console.log('CartItem - selectedOptions:', selectedOptions);
  console.log('CartItem - category:', category);
  console.log('========================');

  let navigate = useNavigate();
  const dispatch = useDispatch();

  // 获取分类名称
  useEffect(() => {
    const fetchCategoryName = async () => {
      if (category) {
        try {
          const categoryData = await categoryService.getCategoryById(category);
          if (categoryData && categoryData.name) {
            setCategoryName(categoryData.name);
          } else {
            // 如果找不到分类数据，保持原始category值
            setCategoryName(category);
          }
        } catch (error) {
          console.error('获取分类名称失败:', error);
          setCategoryName(category);
        }
      }
    };

    fetchCategoryName();
  }, [category]);

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
        optionsText,
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
    if (onClose) onClose();
  };

  // Generate options display text
  const getOptionsDisplay = () => {
    console.log('调试 CartItem - optionsText:', optionsText);
    console.log('调试 CartItem - selectedOptions:', selectedOptions);
    console.log('调试 CartItem - optionsText类型:', typeof optionsText);

    // 优先使用 optionsText（来自 DishOptionsModal）
    if (optionsText && Array.isArray(optionsText) && optionsText.length > 0) {
      console.log('使用数组形式的 optionsText:', optionsText);
      return optionsText;
    }

    // 如果有字符串形式的 optionsText，分割成数组
    if (typeof optionsText === 'string' && optionsText.trim()) {
      console.log('使用字符串形式的 optionsText:', optionsText);
      // 如果字符串包含逗号，按逗号分割
      if (optionsText.includes(',')) {
        return optionsText.split(',').map(text => text.trim()).filter(text => text);
      }
      return [optionsText];
    }

    // 如果没有 optionsText，但有 selectedOptions，尝试从中提取信息
    if (selectedOptions && Object.keys(selectedOptions).length > 0) {
      console.log('从selectedOptions提取选项信息');
      const optionsList = [];

      Object.entries(selectedOptions).forEach(([key, value]) => {
        if (value && typeof value === 'object' && value.name) {
          // 如果value是对象且有name属性
          optionsList.push(value.name);
        } else if (typeof value === 'string' && value.trim()) {
          // 如果value是非空字符串
          optionsList.push(value);
        } else if (Array.isArray(value)) {
          // 如果value是数组
          value.forEach(item => {
            if (typeof item === 'string' && item.trim()) {
              optionsList.push(item);
            } else if (item && typeof item === 'object' && item.name) {
              optionsList.push(item.name);
            }
          });
        }
      });

      console.log('提取到的选项列表:', optionsList);
      return optionsList.length > 0 ? optionsList : null;
    }

    console.log('没有选项数据');
    return null;
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
            <span className="cart__category-badge">{categoryName}</span>

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
              {quantity}x <span className="price">€{price.toFixed(2)}</span>
              {basePrice && price !== basePrice && (
                <span className="base-price">（基础价：€{basePrice.toFixed(2)}）</span>
              )}
            </p>

            {/* Quantity Controls Container - 添加父级容器确保对齐 */}
            <div className="cart__controls-wrapper">
              <div className="cart__quantity-controls">
                <button className="quantity__btn decrease__btn" onClick={event => decreaseItem(event)}>
                  <i className="ri-subtract-line"></i>
                </button>
                <span className="quantity__display">{quantity}</span>
                <button className="quantity__btn increase__btn" onClick={event => incrementItem(event)}>
                  <i className="ri-add-line"></i>
                </button>
              </div>
            </div>
          </div>

          {/* Cart Item Actions - 只保留总价和删除按钮 */}
          <div className="cart__item-actions">
            <div className="cart__total-price">
              €{(price * quantity).toFixed(2)}
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
