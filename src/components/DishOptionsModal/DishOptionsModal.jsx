import React, { useState, useEffect } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Row, Col } from 'reactstrap';
import { useDispatch } from 'react-redux';
import { cartActions } from '../../store/shopping-cart/cartSlice';
import './DishOptionsModal.css';

const DishOptionsModal = ({
    isOpen,
    toggle,
    dish,
    onAddSuccess
}) => {
    const dispatch = useDispatch();
    const [selectedOptions, setSelectedOptions] = useState({});
    const [totalPrice, setTotalPrice] = useState(0);
    const [isAdding, setIsAdding] = useState(false);

    // 重置选项当弹窗打开时
    useEffect(() => {
        if (isOpen && dish) {
            setSelectedOptions({});
            setTotalPrice(dish.price || 0);
        }
    }, [isOpen, dish]);

    // 计算总价格
    useEffect(() => {
        if (!dish) return;

        let total = dish.price || 0;
        Object.values(selectedOptions).forEach(option => {
            if (option && option.price) {
                total += option.price;
            }
        });
        setTotalPrice(total);
    }, [selectedOptions, dish]);

    // 处理选项变更
    const handleOptionChange = (optionType, option) => {
        setSelectedOptions(prev => ({
            ...prev,
            [optionType]: option
        }));
    };

    // 检查是否所有必需选项都已选择
    const isAllRequiredOptionsSelected = () => {
        if (!dish?.options) return true;

        // 假设所有选项都是必需的，除非明确标记为可选
        return Object.keys(dish.options).every(optionType => {
            return selectedOptions[optionType] !== undefined;
        });
    };

    // 添加到购物车
    const handleAddToCart = async () => {
        if (!dish || !isAllRequiredOptionsSelected()) return;

        setIsAdding(true);

        try {
            // 创建唯一ID（包含选项信息）
            const optionsId = Object.entries(selectedOptions)
                .map(([type, option]) => `${type}:${option.name}`)
                .join('|');
            const uniqueId = `${dish.id}_${Date.now()}_${optionsId}`;

            dispatch(cartActions.addItem({
                id: String(uniqueId), // 确保ID是字符串
                title: dish.title,
                price: totalPrice,
                image01: dish.image01,
                category: dish.category,
                selectedOptions: selectedOptions,
                basePrice: dish.price,
                baseDishId: dish.id
            }));

            // 调用成功回调
            if (onAddSuccess) {
                onAddSuccess(dish.title, selectedOptions);
            }

            // 短暂延迟后关闭弹窗
            setTimeout(() => {
                toggle();
                setIsAdding(false);
            }, 500);

        } catch (error) {
            console.error('添加到购物车失败:', error);
            setIsAdding(false);
        }
    };

    // 获取选项类型的中文名称
    const getOptionTypeName = (optionType) => {
        const typeNames = {
            spiciness: "辣度",
            size: "分量",
            cooking: "烹饪方式",
            tofu: "豆腐类型",
            cut: "切法",
            consistency: "汤的浓度",
            temperature: "温度",
            sweetness: "甜度",
            ice: "冰量",
            packaging: "包装方式",
            quantity: "数量",
            filling: "馅料",
            dipping: "蘸料"
        };
        return typeNames[optionType] || optionType;
    };

    if (!dish) return null;

    return (
        <Modal isOpen={isOpen} toggle={toggle} size="lg" className="dish-options-modal">
            <ModalHeader toggle={toggle} className="options-modal-header">
                <div className="d-flex align-items-center">
                    <img
                        src={dish.image01}
                        alt={dish.title}
                        className="dish-thumbnail me-3"
                    />
                    <div>
                        <h5 className="mb-1">{dish.title}</h5>
                        <p className="text-muted mb-0">{dish.desc}</p>
                    </div>
                </div>
            </ModalHeader>

            <ModalBody className="options-modal-body">
                {dish.options && Object.keys(dish.options).length > 0 ? (
                    <div className="options-container">
                        {Object.entries(dish.options).map(([optionType, optionList]) => (
                            <div key={optionType} className="option-group mb-4">
                                <h6 className="option-group-title">
                                    {getOptionTypeName(optionType)}
                                    <span className="required-indicator">*</span>
                                </h6>
                                <div className="option-list">
                                    {Array.isArray(optionList) ? optionList.map((option, index) => (
                                        <label
                                            key={index}
                                            className={`option-item ${selectedOptions[optionType]?.name === option.name ? 'selected' : ''}`}
                                        >
                                            <input
                                                type="radio"
                                                name={optionType}
                                                onChange={() => handleOptionChange(optionType, option)}
                                                checked={selectedOptions[optionType]?.name === option.name}
                                            />
                                            <div className="option-content">
                                                <span className="option-name">{option.name}</span>
                                                {option.price > 0 && (
                                                    <span className="option-price">+€{option.price.toFixed(2)}</span>
                                                )}
                                            </div>
                                        </label>
                                    )) : null}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-4">
                        <p className="text-muted">此菜品暂无可选配置</p>
                    </div>
                )}
            </ModalBody>

            <ModalFooter className="options-modal-footer">
                <div className="w-100 d-flex justify-content-between align-items-center">
                    <div className="price-info">
                        <span className="total-price-label">总价: </span>
                        <span className="total-price">€{totalPrice.toFixed(2)}</span>
                        {totalPrice > dish.price && (
                            <span className="base-price text-muted ms-2">
                                (基础价格: €{dish.price.toFixed(2)})
                            </span>
                        )}
                    </div>
                    <div className="action-buttons">
                        <Button
                            color="secondary"
                            onClick={toggle}
                            disabled={isAdding}
                            className="me-2"
                        >
                            取消
                        </Button>
                        <Button
                            color="primary"
                            onClick={handleAddToCart}
                            disabled={!isAllRequiredOptionsSelected() || isAdding}
                            className="add-to-cart-btn"
                        >
                            {isAdding ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    添加中...
                                </>
                            ) : (
                                `添加到购物车 - €${totalPrice.toFixed(2)}`
                            )}
                        </Button>
                    </div>
                </div>
            </ModalFooter>
        </Modal>
    );
};

export default DishOptionsModal;