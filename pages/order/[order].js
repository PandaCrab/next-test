import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Image from 'next/image';

import { clearOrder, getOrderId } from '../../redux/ducks/stuff';
import { catchSuccess } from '../../redux/ducks/alerts';
import { createOrder } from '../api/api';
import { addressSchema, userInfoSchema } from '../../helpers/validation';

import styles from '../../styles/OrderPage.module.scss';

const OrderForm = () => {
    const [address, setAddress] = useState({
        street: '',
        city: '',
        country: '',
        zip: '',
    });
    const [invalidAddress, setInvalidAddress] = useState({
        path: {},
        isValid: false,
    });

    const [shipping, setShipping] = useState({
        name: '',
        phone: '',
        optional: '',
        address: address,
    });
    const [invalidUserInfo, setInvalidUserInfo] = useState({
        path: {},
        isValid: false,
    });

    const validateAddress = async () => {
        await addressSchema
            .validate(address, { abortEarly: false })
            .then(async (value) => {
                if (value) {
                    setInvalidAddress({
                        path: {},
                        isValid: true,
                    });
                }
            })
            .catch((error) => {
                const validationError = {};

                error.inner.forEach((err) => {
                    if (err.path) {
                        validationError[err.path] = err.message;
                    }
                });

                setInvalidAddress({
                    path: validationError,
                    isValid: false,
                });
            });
    };

    const router = useRouter();
    const dispatch = useDispatch();

    const clientOrder = useSelector((state) => state.order.clientOrder);
    const userId = useSelector((state) => state.user.info._id);
    const userAddress = useSelector((state) => state.user.info.shippingAddress);

    const handleChange = (target) => {
        const { name, value } = target;
        setShipping({
            ...shipping,
            [name]: value,
        });
    };

    const addShippingAddress = () => {
        setAddress(userAddress);
    };

    const onOrderSuccess = async () => {
        validateAddress();

        await userInfoSchema
            .validate(shipping, { abortEarly: false })
            .then(async (value) => {
                if (value) {
                    const response = await createOrder({
                        date: new Date(),
                        userId: userId ? userId : 'not logined',
                        orderId: router.query.order,
                        username: shipping.name,
                        phone: shipping.phone,
                        optional: shipping.optional,
                        shippingInfo: address,
                        orderInfo: {
                            products: clientOrder,
                        },
                    });

                    if (response) {
                        dispatch(catchSuccess('Order success'));
                        console.log('response ok');
                        setInvalidUserInfo({
                            path: {},
                            isValid: true,
                        });

                        dispatch(getOrderId(router.query));
                        dispatch(clearOrder());

                        router.push('/order/success');
                    }
                }
            })
            .catch((error) => {
                const validationError = {};

                error.inner.forEach((err) => {
                    if (err.path) {
                        validationError[err.path] = err.message;
                    }
                });

                setInvalidUserInfo({
                    path: validationError,
                    isValid: false,
                });
            });
    };

    useEffect(() => {
        setShipping((prev) => ({
            ...prev,
            address: address,
        }));
    }, [address]);

    return (
        <div className={styles.orderContainer}>
            <div className={styles.orderForm}>
                <label className={styles.formLabel}>Full Name</label>
                <input
                    className={
                        invalidUserInfo.path.name ? `${styles.formInput} ${styles.invalid}` : `${styles.formInput}`
                    }
                    name="name"
                    value={shipping.name}
                    onChange={({ target }) => handleChange(target)}
                />

                <label className={styles.formLabel}>Contact phone</label>
                <input
                    className={
                        invalidUserInfo.path.phone ? `${styles.formInput} ${styles.invalid}` : `${styles.formInput}`
                    }
                    name="phone"
                    value={shipping.phone}
                    onChange={({ target }) => handleChange(target)}
                />

                <label className={styles.formLabel}>
                    <div>Street</div>
                    {userAddress && Object.keys(userAddress).length && (
                        <div className={styles.autocompleteBtn} onClick={() => addShippingAddress()}>
                            Autocomplete
                        </div>
                    )}
                </label>
                <input
                    className={
                        invalidAddress.path.street ? `${styles.formInput} ${styles.invalid}` : `${styles.formInput}`
                    }
                    name="street"
                    value={address.street}
                    onChange={({ target }) =>
                        setAddress({
                            ...address,
                            street: target.value,
                        })
                    }
                />

                <label className={styles.formLabel}>optional</label>
                <input
                    className={
                        invalidUserInfo.path.optional ? `${styles.formInput} ${styles.invalid}` : `${styles.formInput}`
                    }
                    name="optional"
                    value={shipping.optional}
                    onChange={({ target }) => handleChange(target)}
                />

                <label className={styles.formLabel}>City</label>
                <input
                    className={
                        invalidAddress.path.city ? `${styles.formInput} ${styles.invalid}` : `${styles.formInput}`
                    }
                    name="city"
                    value={address.city}
                    onChange={({ target }) =>
                        setAddress({
                            ...address,
                            city: target.value,
                        })
                    }
                />

                <div className={styles.row}>
                    <div className={styles.inputWrapper}>
                        <label className={styles.formLabel}>Country</label>
                        <input
                            className={
                                invalidAddress.path.country
                                    ? `${styles.formInput} ${styles.invalid}`
                                    : `${styles.formInput}`
                            }
                            name="country"
                            value={address.country}
                            onChange={({ target }) =>
                                setAddress({
                                    ...address,
                                    country: target.value,
                                })
                            }
                        />
                    </div>
                    <div className={styles.inputWrapper}>
                        <label className={styles.formLabel}>ZIP</label>
                        <input
                            className={
                                invalidAddress.path.zip
                                    ? `${styles.formInput} ${styles.invalid}`
                                    : `${styles.formInput}`
                            }
                            name="zip"
                            value={address.zip}
                            onChange={({ target }) =>
                                setAddress({
                                    ...address,
                                    zip: target.value,
                                })
                            }
                        />
                    </div>
                </div>

                <button className={styles.submitBtn} onClick={() => onOrderSuccess()}>
                    Submit
                </button>
            </div>
            <div className={styles.stuffWrapper}>
                {clientOrder.length &&
                    clientOrder.map((stuff) => (
                        <div className={styles.productCard} key={stuff._id}>
                            <div className={styles.cardContentWrapper}>
                                <Image
                                    src={stuff.imgUrl}
                                    alt={stuff.name}
                                    width={stuff.width ? `${stuff.width}px` : '150px'}
                                    height={stuff.height ? `${stuff.height}px` : '200px'}
                                />
                                <div className={styles.cardInfo}>
                                    <div className={styles.stuffTitle}>{stuff.name}</div>
                                    <div className={styles.stuffColor}>{stuff.color}</div>
                                    <div className={styles.stuffPrice}>${stuff.price}</div>
                                </div>
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );
};

export default OrderForm;
