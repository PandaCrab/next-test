import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import styles from '../../styles/myOrder.module.scss';
import { getUserOrders } from '../api/api';
import LoginPage from '../login';

const UserOrdersPage = () => {
    const [loged, setloged] = useState(false);
    const [orders, setOrders] = useState();

    const user = useSelector((state) => state.user);
    const router = useRouter();

    const takeOrders = async (id) => {
        const catchResponse = await getUserOrders(id);
        if (catchResponse.length) {
            setOrders(catchResponse);
        }
    };

    useEffect(() => {
        if (user.info?._id) {
            takeOrders({ userId: user.info._id });
        }
    }, [user.info?._id]);

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
            {loged ? (
                orders ? (
                    <div className={styles.ordersWrapper}>
                        <div style={{ marginBottom: 20 }}>Welcome, that your orders:</div>
                        {orders &&
                            orders.map((order) => (
                                <div
                                    className={styles.orderWrapper}
                                    key={order._id}
                                    onClick={() => router.push(`/myOrders/${order.orderId}`)}
                                >
                                    <div className={styles.statusSection}>
                                        <div>
                                            <b>Status:</b> {order.status || 'Unknown'}
                                        </div>
                                        <div>
                                            <b>Order:</b> №{order.orderId}
                                        </div>
                                        <div>
                                            <b>Shipping address:</b> <br />
                                            {` 
                                        ${order.shippingInfo.street}, 
                                        ${order.shippingInfo.city}, 
                                        ${order.shippingInfo.country}`}
                                        </div>
                                    </div>
                                    <ul className={styles.orderItems}>
                                        Items in order:{' '}
                                        {order.orderInfo.products.map((items) => (
                                            <li key={items._id}>{`-${items.name}`}</li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                    </div>
                ) : (
                    <div>Seems, you didn`t ordered anything</div>
                )
            ) : (
                <LoginPage />
            )}
        </div>
    );
};

export default UserOrdersPage;
