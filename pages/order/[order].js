import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Image from 'next/image';

import styles from '../../styles/OrderPage.module.scss';
import { clearOrder, getOrderId } from '../../redux/ducks/stuff';
import { createOrder } from '../api/api';

const OrderForm = () => {
    const [address, setAddress] = useState({
        street: '',
        city: '',
        country: '',
        zip: ''
    });
    const [shipping, setShipping] = useState({
        name: '',
        phone: '',
        optional: '',
        address: address
    });

    useEffect(() => {
        setShipping({
            ...shipping,
            address: address
        })
    }, [address])

    const router = useRouter();
    const dispatch = useDispatch();
    const clientOrder = useSelector((state) => state.order.clientOrder);
    const userId = useSelector(state => state.user._id);

    const handleChange = (target) => {
        const { name, value } = target;
        setShipping({
            ...shipping,
            [name]: value
        });
    };

    console.log(shipping)

    const onOrderSuccess = async () => {
        const response = await createOrder({
            userId: userId ? userId : 'not logined',
            orderId: router.query.order,
            shippingInfo: shipping,
            orderInfo: {
                products: clientOrder
            }
        });
        if (response) {
            console.log('ok');

            dispatch(getOrderId(router.query));
            dispatch(clearOrder());

            router.push('/order/success')
        }

    };

    return (
        <div className={styles.orderContainer}>
            <div className={styles.orderForm}>
                <label className={styles.formLabel}>Full Name</label>
                <input
                    className={styles.formInput} 
                    name='name'
                    value={shipping.name}
                    onChange={({ target }) => handleChange(target)}
                />

                <label className={styles.formLabel}>Contact phone</label>
                <input
                    className={styles.formInput} 
                    name='phone'
                    value={shipping.phone}
                    onChange={({ target }) => handleChange(target)}
                />

                <label className={styles.formLabel}>Delivery address</label>
                <input
                    className={styles.formInput} 
                    name='address'
                    value={address.street}
                    onChange={({ target }) => setAddress({
                        ...address,
                        street: target.value
                    })}
                />

                <label className={styles.formLabel}>optional</label>
                <input
                    className={styles.formInput} 
                    name='optional'
                    value={shipping.optional}
                    onChange={({ target }) => handleChange(target)}
                />

                <label className={styles.formLabel}>City</label>
                <input
                    className={styles.formInput} 
                    name='city'
                    value={address.city}
                    onChange={({ target  }) => setAddress({
                            ...address,
                            city: target.value
                        })}
                />

                <label className={styles.formLabel}>Country</label>
                <input
                    className={styles.formInput} 
                    name='country'
                    value={address.country}
                    onChange={({ target }) => setAddress({
                            ...address,
                            country: target.value
                    })}
                />

                <label className={styles.formLabel}>ZIP</label>
                <input
                    className={styles.formInput} 
                    name='zip'
                    value={address.zip}
                    onChange={({ target }) => setAddress({
                            ...address,
                            zip: target.value
                    })}
                />

                <button className={styles.submitBtn} onClick={() => onOrderSuccess()}>
                    Confirm Indormation
                </button>
            </div>
            <div className={styles.stuffWrapper}>
                    {
                        clientOrder.length && clientOrder.map(stuff => (
                            <div className={styles.productCard} key={ stuff.id }>
                                <div className={styles.cardContentWrapper}>
                                    <Image 
                                        src={stuff.imgUrl} 
                                        alt={stuff.name}
                                        width={stuff.width ? `${stuff.width}px` : '150px'}
                                        height={stuff.height ? `${stuff.height}px` : '200px'} />
                                    <div className={styles.cardInfo}>
                                        <div className={styles.stuffTitle}>
                                            { stuff.name }
                                        </div>
                                        <div className={styles.stuffColor}>{ stuff.color }</div>
                                        <div className={styles.stuffPrice}>${ stuff.price }</div>
                                    </div>
                                </div>
                            </div>
                        ))
                    }
            </div>
        </div>
    );
};

export default OrderForm;