import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import styles from '../../styles/myOrder.module.scss';
import { getUserOrders } from '../api/api';
import LoginPage from '../login';

const UserOrdersPage = () => {
    const [loged, setloged] = useState(false);
    const [orders, setOrders] = useState();

    const user = useSelector(state => state.user);
    const router = useRouter();

    const takeOrders = async (id) => {
        const catchResponse = await getUserOrders(id);
        if (catchResponse.length) {
            setOrders(catchResponse);
        }
    };

    useEffect(() => {
        if (user.info?.id) {
            takeOrders({ userId: user.info.id });
        }
    }, [user.info?.id]);

    useEffect(() => {
        if (user.token) {
            setloged(true);
        }

        if (!user.token) {
            setloged(false);
        }
    }, [user?.token]);

    return (
        <div className={styles.ordersContainer}>
            {loged ? orders ? (
                <div className={styles.ordersWrapper}>
                    <div style={{ marginBottom: 20 }}>Welcome, that your orders:</div>
                    {orders && orders.map(order => (
                        <div 
                            className={styles.orderWrapper} 
                            key={order.orderId}
                            onClick={() => router.push(`/myOrders/${order.orderId}`)}
                        >
                            <div className={styles.statusSection}>
                                <div>Status: {order.status || 'Unknown'}</div>
                                <div>Order №{order.orderId}</div>
                                <div>
                                    {`Shipping address: 
                                        ${order.shippingInfo.street}, 
                                        ${order.shippingInfo.city}, 
                                        ${order.shippingInfo.country}`
                                    }
                                </div>
                            </div>
                            <div className={styles.orderSection}>
                                Items in order: {order.orderInfo.products.map(items => (
                                    <div key={items._id}>{items.name}</div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div>Seems, you didn&rsquo;t buy anything</div>
            ) : (
                <LoginPage />
            )}
        </div>
    );
};

export default UserOrdersPage;
