import React, { useState, useEffect } from 'react';
import Api from '../../../api/axios';
import { FaBell, FaBox, FaTag, FaInfoCircle, FaExclamationTriangle } from 'react-icons/fa';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNotifications();
        window.scrollTo(0, 0);
    }, []);

    const fetchNotifications = async () => {
        try {
            const response = await Api.get('/notifications');
            // Since your response shows "notifications" as a single object, 
            // we wrap it in an array so .map() doesn't crash.
            const data = response.data.notifications;
            const notificationList = Array.isArray(data) ? data : (data ? [data] : []);
            
            setNotifications(notificationList);
        } catch (error) {
            console.error("Error fetching notifications:", error);
        } finally {
            setLoading(false);
        }
    };

    const getIcon = (title) => {
        const t = title?.toLowerCase() || "";
        if (t.includes('stock')) return <FaExclamationTriangle className="text-danger" />;
        if (t.includes('order')) return <FaBox className="text-primary" />;
        if (t.includes('offer')) return <FaTag className="text-success" />;
        return <FaBell className="text-secondary" />;
    };

    if (loading) return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="spinner-border text-primary" role="status"></div>
        </div>
    );

    return (
        <div style={{ backgroundColor: '#f1f3f6', minHeight: '100vh', paddingBottom: '50px' }}>
            <div className="container pt-4" style={{ maxWidth: '800px' }}>
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="fw-bold mb-0 text-dark">
                        Notifications {notifications.length > 0 && `(${notifications.length})`}
                    </h5>
                </div>

                {notifications.length === 0 ? (
                    <div className="bg-white p-5 text-center shadow-sm rounded-3">
                        <FaBell size={50} className="text-muted mb-3 opacity-25" />
                        <p className="text-muted fw-semibold">No notifications yet</p>
                        <small className="text-muted">We'll let you know when something arrives!</small>
                    </div>
                ) : (
                    notifications.map((notification) => (
                        <div 
                            key={notification._id} 
                            className="bg-white p-3 d-flex gap-3 border-bottom shadow-sm mb-2 rounded-1"
                            style={{ transition: '0.2s' }}
                        >
                            {/* Visual Indicator for Important Alerts */}
                            <div className="rounded-circle bg-light d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px', flexShrink: 0 }}>
                                {getIcon(notification.title)}
                            </div>

                            <div className="flex-grow-1">
                                <div className="d-flex justify-content-between align-items-start">
                                    <h6 className="mb-1 fw-bold text-dark" style={{ fontSize: '15px' }}>
                                        {notification.title}
                                    </h6>
                                    <small className="text-muted" style={{ fontSize: '11px' }}>
                                        {new Date(notification.createdAt).toLocaleDateString(undefined, { 
                                            month: 'short', 
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </small>
                                </div>
                                <p className="mb-0 text-secondary" style={{ fontSize: '13.5px', lineHeight: '1.4' }}>
                                    {notification.message}
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Notifications;