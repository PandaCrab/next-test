import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import styles from '../styles/userOrder.module.scss';
import { getUserOrders } from './api/api';
import LoginPage from './login';

const UserOrdersPage = () => {
    const [loged, setloged] = useState(false);
    const [orders, setOrders] = useState();

    const user = useSelector(state => state.user);

    const takeOrders = async (id) => {
        const catchResponse = await getUserOrders(id);
        console.log(catchResponse)
        if (catchResponse) {
            setOrders(catchResponse);
        }
    };

    useEffect(() => {
        const id = user.info.id;
        if (id) {
            takeOrders({ userId: id });

            console.log(orders);
        }
    }, []);

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
                    <div>Welcom, that your orders:</div>
                    {orders && orders.map(order => (
                        <div className={styles.orderWrapper} key={order._id}>
                            <div className={styles.shippingSection}>
                                shipping info
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
