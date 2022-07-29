import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import Image from 'next/image';

import { getUserOrder } from '../api/api';
import LoginPage from '../login';

import styles from '../../styles/userOrder.module.scss';

const UserOrder = () => {
    const [loged, setLoged] = useState(false);
    const [order, setOrder] = useState();

    const user = useSelector(state => state.user);
    const router = useRouter();

    const takeUserOrder = async (ids) => {
        const res = await getUserOrder(ids);
        if (res.length) {
            setOrder(res[0]);
        } else {
            router.push('/myOrders');
        }
    };

    useEffect(() => {
        const orderId = router.query.userOrder;
        const userId = user.info?.id
        if (userId) {
            takeUserOrder({ orderId, userId });
        }
    }, [user.info?.id]);

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
            {loged ? order ? (
                <>
                    <div className={styles.orderedTimeWrapper}>
                        <b>{new Date(order.date).toDateString()}</b>  
                        <b>{new Date(order.date).toLocaleTimeString()}</b>
                    </div>                  
                    <div className={styles.orderWrapper}>
                        <div className={styles.shippingInfo}>
                            <div>{ order.username }</div>
                            <div>{ order.phone }</div>
                            <div>{`${order.shippingInfo.street},
                                ${order.shippingInfo.city},
                                ${order.shippingInfo.country}`}</div>
                            <div>{ order.shippingInfo.zip }</div>
                        </div>
                        <div className={styles.productsList}>
                            {order.orderInfo.products.map(product => (
                                <div className={styles.productCard} key={ product.id }>
                                    <div className={styles.cardContentWrapper}>
                                        {product.imgUrl && (
                                            <Image 
                                                src={product.imgUrl} 
                                                alt={product.name}
                                                width='150px'
                                                height='155px' 
                                            />
                                        )}
                                        <div className={styles.cardInfo}>
                                            <div className={styles.productTitle}>
                                                { product.name }
                                            </div>
                                            <div className={styles.productColor}>{ product.color }</div>
                                            <div className={styles.productPrice}>${ product.price }</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>                    
                </>
            ) : (
                <div>Somthing wrong</div>
            ) : (
                <LoginPage />
            )}
        </div>
    );
};

export default UserOrder;
