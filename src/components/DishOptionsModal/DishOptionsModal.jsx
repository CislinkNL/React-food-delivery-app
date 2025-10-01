import React, { useState, useEffect } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Row, Col } from 'reactstrap';
import { useDispatch } from 'react-redux';
import { cartActions } from '../../store/shopping-cart/cartSlice';
import KeuzeMenuService from '../../services/KeuzeMenuService';
import './DishOptionsModal.css';

const DishOptionsModal = ({
    isOpen,
    toggle,
    dish,
    onAddSuccess
}) => {
    const dispatch = useDispatch();
    const [selectedOptions, setSelectedOptions] = useState({});
    const [keuzeMenus, setKeuzeMenus] = useState({});
    const [totalPrice, setTotalPrice] = useState(0);
    const [isAdding, setIsAdding] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [validationErrors, setValidationErrors] = useState([]);

    // 加载选择菜单数据
    useEffect(() => {
        const loadKeuzeMenus = async () => {
            if (!isOpen || !dish?.keuzeMenus || dish.keuzeMenus.length === 0) {
                setKeuzeMenus({});
                return;
            }

            setIsLoading(true);
            try {
                const menuData = await KeuzeMenuService.getKeuzeMenusByIds(dish.keuzeMenus);
                setKeuzeMenus(menuData);

                // 设置默认选项
                const defaultOptions = {};
                Object.entries(menuData).forEach(([menuId, menu]) => {
                    if (menu.required && menu.options) {
                        const defaultOption = menu.options.find(opt => opt.default);
                        if (defaultOption) {
                            if (menu.type === 'multiple_choice') {
                                defaultOptions[menuId] = [defaultOption.id];
                            } else {
                                defaultOptions[menuId] = defaultOption.id;
                            }
                        }
                    }
                });
                setSelectedOptions(defaultOptions);
            } catch (error) {
                console.error('Error loading keuzeMenus:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadKeuzeMenus();
    }, [isOpen, dish]);

    // 计算总价格
    useEffect(() => {
        if (!dish || !keuzeMenus) return;

        let total = dish.price || 0;
        const optionsPrice = KeuzeMenuService.calculateOptionsPrice(keuzeMenus, selectedOptions);
        total += optionsPrice;
        setTotalPrice(total);

        // 验证选项
        const validation = KeuzeMenuService.validateOptionsSelection(keuzeMenus, selectedOptions);
        setValidationErrors(validation.errors);
    }, [selectedOptions, dish, keuzeMenus]);

    // 处理单选选项变更
    const handleSingleOptionChange = (keuzeMenuId, optionId) => {
        setSelectedOptions(prev => ({
            ...prev,
            [keuzeMenuId]: optionId
        }));
    };

    // 处理多选选项变更
    const handleMultipleOptionChange = (keuzeMenuId, optionId, isChecked) => {
        setSelectedOptions(prev => {
            const currentSelections = prev[keuzeMenuId] || [];
            let newSelections;

            if (isChecked) {
                newSelections = [...currentSelections, optionId];
            } else {
                newSelections = currentSelections.filter(id => id !== optionId);
            }

            return {
                ...prev,
                [keuzeMenuId]: newSelections
            };
        });
    };

    // 检查是否可以添加到购物车
    const canAddToCart = () => {
        return validationErrors.length === 0 && Object.keys(keuzeMenus).length > 0;
    };

    // 添加到购物车
    const handleAddToCart = async () => {
        if (!dish || !canAddToCart()) return;

        setIsAdding(true);

        try {
            // 生成选项显示文本
            const optionsText = KeuzeMenuService.generateOptionsDisplayText(keuzeMenus, selectedOptions);
            console.log('=== DishOptionsModal调试 ===');
            console.log('生成的optionsText:', optionsText);
            console.log('selectedOptions:', selectedOptions);
            console.log('keuzeMenus:', keuzeMenus);
            console.log('========================');

            // 创建唯一ID（包含选项信息）
            const optionsId = Object.entries(selectedOptions)
                .map(([menuId, selection]) => {
                    if (Array.isArray(selection)) {
                        return `${menuId}:${selection.join(',')}`;
                    }
                    return `${menuId}:${selection}`;
                })
                .join('|');
            const uniqueId = `${dish.id}_${Date.now()}_${optionsId}`;

            dispatch(cartActions.addItem({
                id: String(uniqueId), // 确保ID是字符串
                title: dish.title,
                price: totalPrice,
                image01: dish.image01,
                category: dish.categoryTakeAway || dish.category, // 使用正确的分类字段
                selectedOptions: selectedOptions,
                optionsText: optionsText,
                basePrice: dish.price,
                baseDishId: dish.id
            }));

            // 调用成功回调
            if (onAddSuccess) {
                onAddSuccess(dish.title, optionsText);
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

    // 获取选项详情
    const getOptionDetails = (keuzeMenu, optionId) => {
        return keuzeMenu.options?.find(opt => opt.id === optionId);
    };

    if (!dish) return null;

    return (
        <Modal
            isOpen={isOpen}
            toggle={toggle}
            size="lg"
            className="dish-options-modal"
            fade={false}
            unmountOnClose={true}
        >
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
                {isLoading ? (
                    <div className="text-center py-4">
                        <div className="spinner-border" role="status">
                            <span className="visually-hidden">Laden...</span>
                        </div>
                        <p className="mt-2">Opties laden...</p>
                    </div>
                ) : Object.keys(keuzeMenus).length > 0 ? (
                    <div className="options-container">
                        {Object.entries(keuzeMenus)
                            .sort(([, a], [, b]) => (a.displayOrder || 0) - (b.displayOrder || 0))
                            .map(([keuzeMenuId, keuzeMenu]) => (
                                <div key={keuzeMenuId} className="option-group mb-4">
                                    <h6 className="option-group-title">
                                        {keuzeMenu.name}
                                        {keuzeMenu.required && <span className="required-indicator">*</span>}
                                        {keuzeMenu.type === 'multiple_choice' && keuzeMenu.maxSelections && (
                                            <span className="max-selections-info">
                                                (Max {keuzeMenu.maxSelections})
                                            </span>
                                        )}
                                    </h6>
                                    <div className="option-list">
                                        {keuzeMenu.options?.map((option) => (
                                            <label
                                                key={option.id}
                                                className={`option-item ${keuzeMenu.type === 'single_choice'
                                                    ? (selectedOptions[keuzeMenuId] === option.id ? 'selected' : '')
                                                    : (selectedOptions[keuzeMenuId]?.includes(option.id) ? 'selected' : '')
                                                    } ${!option.available ? 'disabled' : ''}`}
                                            >
                                                <input
                                                    type={keuzeMenu.type === 'single_choice' ? 'radio' : 'checkbox'}
                                                    name={keuzeMenu.type === 'single_choice' ? keuzeMenuId : undefined}
                                                    disabled={!option.available}
                                                    onChange={(e) => {
                                                        if (keuzeMenu.type === 'single_choice') {
                                                            handleSingleOptionChange(keuzeMenuId, option.id);
                                                        } else {
                                                            handleMultipleOptionChange(keuzeMenuId, option.id, e.target.checked);
                                                        }
                                                    }}
                                                    checked={
                                                        keuzeMenu.type === 'single_choice'
                                                            ? selectedOptions[keuzeMenuId] === option.id
                                                            : selectedOptions[keuzeMenuId]?.includes(option.id) || false
                                                    }
                                                />
                                                <div className="option-content">
                                                    <span className="option-name">{option.name}</span>
                                                    {option.price !== undefined && option.price !== 0 && (
                                                        <span className={`option-price ${option.price < 0 ? 'discount' : ''}`}>
                                                            {option.price > 0 ? '+' : ''}€{option.price.toFixed(2)}
                                                        </span>
                                                    )}
                                                    {!option.available && (
                                                        <span className="not-available-badge">Niet beschikbaar</span>
                                                    )}
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            ))}

                        {validationErrors.length > 0 && (
                            <div className="validation-errors mt-3">
                                {validationErrors.map((error, index) => (
                                    <div key={index} className="alert alert-warning small py-2">
                                        {error}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-center py-4">
                        <p className="text-muted">Dit gerecht heeft geen opties</p>
                    </div>
                )}
            </ModalBody>

            <ModalFooter className="options-modal-footer">
                <div className="w-100 d-flex justify-content-between align-items-center">
                    <div className="price-info">
                        <span className="total-price-label">Totaal: </span>
                        <span className="total-price">€{totalPrice.toFixed(2)}</span>
                        {totalPrice > dish.price && (
                            <span className="base-price text-muted ms-2">
                                (Basisprijs: €{dish.price.toFixed(2)})
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
                            Annuleren
                        </Button>
                        <Button
                            color="primary"
                            onClick={handleAddToCart}
                            disabled={!canAddToCart() || isAdding}
                            className="add-to-cart-btn"
                        >
                            {isAdding ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    Toevoegen...
                                </>
                            ) : (
                                `Toevoegen aan winkelwagen - €${totalPrice.toFixed(2)}`
                            )}
                        </Button>
                    </div>
                </div>
            </ModalFooter>
        </Modal>
    );
};

export default DishOptionsModal;