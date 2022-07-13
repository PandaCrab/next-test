import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Image from 'next/image';

import styles from '../../styles/OrderPage.module.scss';
import { getOrderId } from '../../redux/ducks/stuff';

const OrderForm = () => {
    const [success, setSuccess] = useState({});
    const router = useRouter();

    const dispatch = useDispatch();
    const selector = useSelector((state) => state.order.clientOrder);

    const handleChange = ({ target }) => {
        const { name, value } = target;
        setSuccess({
            ...success,
            [name]: value
        });
    };

    console.log(router.query);
    return (
        <div className={styles.orderContainer}>
            <form className={styles.orderForm} onSubmit={(e) => {
                e.preventDefault();
                dispatch(getOrderId(router.query));
                router.push(`/order/success`);
            }}>
                <label className={styles.formLabel}>Full Name</label>
                <input
                    className={styles.formInput} 
                    name='name'
                    value={success.name}
                    onChange={() => handleChange}
                />

                <label className={styles.formLabel}>Contact phone</label>
                <input
                    className={styles.formInput} 
                    name='phone'
                    value={success.phone}
                    onChange={() => handleChange}
                />

                <label className={styles.formLabel}>Delivery address</label>
                <input
                    className={styles.formInput} 
                    name='address'
                    value={success.address}
                    onChange={() => handleChange}
                />

                <label className={styles.formLabel}>optional</label>
                <input
                    className={styles.formInput} 
                    name='optional'
                    value={success.optional}
                    onChange={() => handleChange}
                />

                <label className={styles.formLabel}>City</label>
                <input
                    className={styles.formInput} 
                    name='city'
                    value={success.city}
                    onChange={() => handleChange}
                />

                <label className={styles.formLabel}>Country</label>
                <input
                    className={styles.formInput} 
                    name='country'
                    value={success.country}
                    onChange={() => handleChange}
                />

                <label className={styles.formLabel}>ZIP</label>
                <input
                    className={styles.formInput} 
                    name='zip'
                    value={success.zip}
                    onChange={() => handleChange}
                />

                <button type="submit">
                    Confirm Indormation
                </button>
            </form>
            <div className={styles.stuffWrapper}>
                    {
                        selector.length && selector.map(stuff => (
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