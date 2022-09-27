import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { HiArrowNarrowLeft } from 'react-icons/hi';
import Image from 'next/image';

import { getUserOrder } from '../api/api';
import LoginPage from '../login';

import type { OrderInfo, userObject } from '../../types/types';

import styles from '../../styles/userOrder.module.scss';

const UserOrder = () => {
    const [loged, setLoged] = useState<boolean>(false);
    const [order, setOrder] = useState<OrderInfo>();

    const user = useSelector((state: { user: userObject }) => state.user);
    const router = useRouter();

    const userOrderId = router.query.userOrder;
    const takeUserOrder = async (orderId, userId) => {
        const res: OrderInfo = await getUserOrder(orderId, userId);
        if (res) {
            setOrder(res);
        } else {
            router.push('/myOrders');
        }
    };

    useEffect(() => {
        if (userOrderId) {
            takeUserOrder(userOrderId, { userId: user.info?._id });
        }
    }, [userOrderId]);

    useEffect(() => {
        if (user.token) {
            setLoged(true);
        }

        if (!user.token) {
            setLoged(false);
        }
    }, [user?.token]);

    return (
        <div className={styles.container}>
            {loged ? (
                order && (
                    <>
                        <div onClick={() => router.back()} className={styles.backBtn}>
                            <HiArrowNarrowLeft />
                        </div>
                        <div className={styles.orderedTimeWrapper}>
                            <b>{new Date(order.date).toDateString()}</b>
                            <b>{new Date(order.date).toLocaleTimeString()}</b>
                        </div>
                        <div className={styles.orderWrapper}>
                            <div className={styles.shippingInfo}>
                                <div>{order.username}</div>
                                <div>{order.phone}</div>
                                <div>{`${order.shippingInfo.street},
                                ${order.shippingInfo.city},
                                ${order.shippingInfo.country}`}</div>
                                <div>{order.shippingInfo.zip}</div>
                            </div>
                            <div className={styles.productsList}>
                                {order.orderInfo.products.map((product) => (
                                    <div className={styles.productCard} key={product._id}>
                                        {product.imgUrl && (
                                            <div className={styles.imageWrapper}>
                                                <Image
                                                    src={product.imgUrl}
                                                    alt={product.name}
                                                    width={product.width ? `${product.width}px` : '100px'}
                                                    height={product.height ? `${product.height}px` : '150px'}
                                                />
                                            </div>
                                        )}
                                        <div className={styles.productInfo}>
                                            <div className={styles.productTitle}>{product.name}</div>
                                            <div className={styles.productColor}>{product.color}</div>
                                            <div className={styles.productPrice}>${product.price}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )
            ) : (
                <LoginPage />
            )}
        </div>
    );
};

export default UserOrder;
