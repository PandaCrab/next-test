import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { CountrySelect, ErrorTooltip, OrderList } from '../../components';
import { fillShipping, getOrderId } from '../../redux/ducks/order';
import { addressSchema, userInfoSchema } from '../../helpers/validation';

import type { AddressInfo, ShippingInfo, userObject } from '../../types/types';

import styles from '../../styles/OrderPage.module.scss';

interface AddressInvalid {
    path: {
        street?: string;
        city?: string;
        country?: string;
        zip?: string;
    };
    isValid: boolean;
};

interface ShippingInvalid {
    path: {
        name?: string;
        phone?: string;
        address?: AddressInvalid;
    };
    isValid: boolean;
};

const OrderForm = () => {
    const [address, setAddress] = useState<AddressInfo>({
        street: '',
        city: '',
        country: '',
        zip: '',
    });
    const [invalidAddress, setInvalidAddress] = useState<AddressInvalid>({
        path: {},
        isValid: false,
    });

    const [shipping, setShipping] = useState<ShippingInfo>({
        name: '',
        phone: '',
        optional: '',
        address,
    });
    const [invalidUserInfo, setInvalidUserInfo] = useState<ShippingInvalid>({
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

    const userAddress = useSelector((state: { user: userObject }) => state.user.info?.shippingAddress);

    const handleChange = (target) => {
        const { name, value } = target;
        if (Object.keys(shipping).includes(name)) {
            setInvalidUserInfo({
                ...invalidUserInfo,
                path: {
                    ...invalidUserInfo.path,
                    [name]: '',
                }
            });

            setShipping({
                ...shipping,
                [name]: value,
            });
        }

        if (Object.keys(address).includes(name)) {
            setInvalidAddress({
                ...invalidAddress,
                path: {
                    ...invalidAddress.path,
                    [name]: ''
                }
            });

            setAddress({
                ...address,
                [name]: value
            });
        }
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
                    setInvalidUserInfo({
                        path: {},
                        isValid: true,
                    });

                    dispatch(getOrderId(router.query));
                    dispatch(fillShipping(shipping));

                    router.push('/order/payment');
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
            address,
        }));
    }, [address]);

    return (
        <div className={styles.orderContainer}>
            <div className={styles.orderForm}>
                <div className={styles.inputWrapper}>
                    <label className={styles.formLabel}>Full Name</label>
                    <input
                        className={
                            invalidUserInfo.path?.name ? `${styles.formInput} ${styles.invalid}` : `${styles.formInput}`
                        }
                        name="name"
                        placeholder="John Doe"
                        value={shipping.name}
                        onChange={({ target }) => handleChange(target)}
                    />
                    {invalidUserInfo.path.name && (
                        <ErrorTooltip message={invalidUserInfo.path.name} />
                    )}
                </div>
                <div className={styles.inputWrapper}>
                    <label className={styles.formLabel}>Contact phone</label>
                    <input
                        className={
                            invalidUserInfo.path?.phone ? `${styles.formInput} ${styles.invalid}` : `${styles.formInput}`
                        }
                        name="phone"
                        placeholder="+380*********"
                        value={shipping.phone}
                        onChange={({ target }) => handleChange(target)}
                    />
                    {invalidUserInfo.path.phone && (
                        <ErrorTooltip message={invalidUserInfo.path.phone} />
                    )}
                </div>
                <div className={styles.inputWrapper}>
                    <label className={styles.formLabel}>
                        <div>Street</div>
                        <button
                            className={styles.autocompleteBtn}
                            disabled={userAddress && !Object.keys(userAddress).length}
                            onClick={() => addShippingAddress()}
                        >
                            Autocomplete
                        </button>
                    </label>
                    <input
                        className={
                            invalidAddress.path?.street ? `${styles.formInput} ${styles.invalid}` : `${styles.formInput}`
                        }
                        name="street"
                        placeholder="1 Khreshchatyk street"
                        value={address.street}
                        onChange={({ target }) => handleChange(target)
                        }
                    />
                    {invalidAddress.path.street && (
                        <ErrorTooltip message={invalidAddress.path.street} />
                    )}
                </div>
                <div className={styles.inputWrapper}>
                    <label className={styles.formLabel}>optional</label>
                    <input
                        className={styles.formInput}
                        name="optional"
                        placeholder="Door code, gate code, etc."
                        value={shipping.optional}
                        onChange={({ target }) => handleChange(target)}
                    />
                </div>
                <div className={styles.inputWrapper}>
                    <label className={styles.formLabel}>City</label>
                    <input
                        className={
                            invalidAddress.path?.city ? `${styles.formInput} ${styles.invalid}` : `${styles.formInput}`
                        }
                        name="city"
                        placeholder="Kiev"
                        value={address.city}
                        onChange={({ target }) => handleChange(target)
                        }
                    />
                    {invalidAddress.path.city && (
                        <ErrorTooltip message={invalidAddress.path.city} />
                    )}
                </div>
                <div className={styles.row}>
                    <div className={styles.inputWrapper}>
                        <CountrySelect
                            value={address.country}
                            setValue={(item) => setAddress({
                                ...address,
                                country: item
                            })}
                            invalid={invalidAddress.path?.country}
                            setInvalid={() => setInvalidAddress({
                                ...invalidAddress,
                                path: {
                                    ...invalidAddress.path,
                                    country: ''
                                }
                            })}
                        />
                    </div>
                    <div className={styles.inputWrapper}>
                        <label className={styles.formLabel}>ZIP</label>
                        <input
                            className={
                                invalidAddress.path?.zip
                                    ? `${styles.formInput} ${styles.invalid}`
                                    : `${styles.formInput}`
                            }
                            name="zip"
                            placeholder="01001"
                            value={address.zip}
                            onChange={({ target }) => handleChange(target)
                            }
                        />
                        {invalidAddress.path.zip && (
                            <ErrorTooltip message={invalidAddress.path.zip} />
                        )}
                    </div>
                </div>
                <button
                    className={styles.submitBtn}
                    onClick={() => onOrderSuccess()}
                >
                    Go to Payment
                </button>
            </div>
            <OrderList />
        </div>
    );
};

export default OrderForm;
