import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { getUserOrders } from '../api/api';
import LoginPage from '../login';

import type { OrderInfo, userObject } from '../../types/types';

import styles from '../../styles/myOrder.module.scss';

const UserOrdersPage = () => {
    const [loged, setloged] = useState(false);
    const [orders, setOrders] = useState<OrderInfo[]>();

    const user = useSelector((state: { user: userObject }) => state.user);
    const router = useRouter();

    const takeOrders = async (id) => {
        const catchResponse: OrderInfo[] = await getUserOrders(id);
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

    if (!loged) {
        return <LoginPage />;
    }

    return (
        <div className={styles.ordersContainer}>
            {orders ? (
                <div className={styles.ordersWrapper}>
                    <div style={{ marginBottom: 20 }}>Welcome, that your orders:</div>
                    {orders
                        && orders.map((order) => (
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
            )}
        </div>
    );
};

export default UserOrdersPage;
