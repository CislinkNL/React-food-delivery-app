import React from 'react';
import './SuccessNotification.css';

const SuccessNotification = ({
    isVisible,
    message,
    details = null,
    onClose
}) => {
    if (!isVisible) return null;

    return (
        <div className="success-notification-toast">
            <div className="toast-content">
                <div className="toast-icon">
                    <i className="ri-check-line"></i>
                </div>

                <div className="toast-text">
                    <span className="toast-message">{message}</span>
                    {details && details.length > 0 && (
                        <div className="toast-details">
                            {details.map((detail, index) => (
                                <span key={index} className="detail-badge">
                                    {detail}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                <button
                    className="toast-close"
                    onClick={onClose}
                    aria-label="关闭"
                >
                    <i className="ri-close-line"></i>
                </button>
            </div>
        </div>
    );
};

export default SuccessNotification;