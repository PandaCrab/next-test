import React, { useState } from 'react';
import { useRouter } from 'next/router';

import { useDispatch, useSelector } from 'react-redux';
import { paymentValidation } from '../../helpers/validation';
import { catchSuccess } from '../../redux/ducks/alerts';
import { clearOrder } from '../../redux/ducks/order';
import { createOrder } from '../api/api';

import type { ShippingInfo, Stuff, userObject } from '../../types/types';

import styles from '../../styles/PaymentForm.module.scss';
import { ErrorTooltip } from '../../components';

interface PaymentState {
    cardholder: string;
    cardNum: number;
    expiry: string;
    cvv: number
}

interface OnChangeValues {
    value: string | number;
    name: string;
}

const PaymentForm = () => {
    const [paymentType, setPaymentType] = useState<string>('online');
    const [payment, setPayment] = useState<PaymentState>({
        cardholder: '',
        cardNum: 0,
        expiry: '',
        cvv: 0,
    });
    const [invalid, setInvalid] = useState({
        path: null,
        isValid: false,
    });

    const router = useRouter();
    const dispatch = useDispatch();

    const clientOrder = useSelector((state: { order: { clientOrder: Stuff[] } }) => state.order.clientOrder);
    const userId = useSelector((state: { user: userObject }) => state.user.info?._id);
    const orderId = useSelector((state: {order: {orderId: {order: string}}}) => state.order.orderId.order);
    const shipping = useSelector((state: { order: { shippingInfo: ShippingInfo } }) => state.order.shippingInfo);

    const onSubmit = async () => {
        const payed = paymentType === 'online';

        if (paymentType === 'online') {
            paymentValidation
                .validate(payment, { abortEarly: false })
                .then(async (value) => {
                    if (value) {
                        const response = await createOrder({
                            date: new Date(),
                            userId: userId || 'not logined',
                            orderId,
                            username: shipping.name,
                            phone: shipping.phone,
                            optional: shipping.optional,
                            shippingInfo: shipping.address,
                            orderInfo: {
                                products: clientOrder,
                            },
                            payment: {
                                payed,
                                paymentType,
                            },
                        });

                        if (response) {
                            setInvalid({
                                path: {},
                                isValid: true,
                            });

                            dispatch(clearOrder());
                            dispatch(catchSuccess('Order cteated'));

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

                    setInvalid({
                        path: validationError,
                        isValid: false,
                    });
                });
        }

        if (paymentType === ('toCourier' || 'onPostOffice')) {
            const response = await createOrder({
                date: new Date(),
                userId: userId || 'not logined',
                orderId,
                username: shipping.name,
                phone: shipping.phone,
                optional: shipping.optional,
                shippingInfo: shipping.address,
                orderInfo: {
                    products: clientOrder,
                },
                payment: {
                    payed,
                    paymentType,
                },
            });

            if (response) {
                setInvalid({
                    path: {},
                    isValid: true,
                });

                dispatch(clearOrder());
                dispatch(catchSuccess('Order cteated'));

                router.push('/order/success');
            }
        }
    };

    const changeHandler = ({ target }) => {
        const { value, name }: OnChangeValues = target;

        setInvalid({
            ...invalid,
            path: {
                ...invalid.path,
                [name]: ''
            }
        });

        setPayment({
            ...payment,
            [name]: value,
        });
    };

    return orderId ? (
        <div className={styles.container}>
            <div className={styles.checkboxesContainer}>
                <div className={styles.paymentTypeHeader}>How you want to pay?</div>
                <div className={styles.checkboxWrapper}>
                    <div
                        className={
                            paymentType === 'online' ? `${styles.checkbox} ${styles.checked}` : `${styles.checkbox}`
                        }
                        onClick={() => setPaymentType('online')}
                    />
                    <label>Online with card</label>
                </div>
                <div className={styles.checkboxWrapper}>
                    <div
                        className={
                            paymentType === 'toCourier' ? `${styles.checkbox} ${styles.checked}` : `${styles.checkbox}`
                        }
                        onClick={() => setPaymentType('toCourier')}
                    />
                    <label>With cash to courier</label>
                </div>
                <div className={styles.checkboxWrapper}>
                    <div
                        className={
                            paymentType === 'onPostOffice'
                                ? `${styles.checkbox} ${styles.checked}`
                                : `${styles.checkbox}`
                        }
                        onClick={() => setPaymentType('onPostOffice')}
                    />
                    <label>With cash on post office</label>
                </div>
            </div>
            {paymentType === 'online' && (
                <div className={styles.paymentForm}>
                    <div className={styles.header}>Fill payment information</div>
                    <div className={styles.inputWrapper}>
                        <input
                            id="cardholder"
                            className={
                                `${styles.paymentInput} ${invalid.path?.cardholder && styles.invalid}`
                            }
                            name="cardholder"
                            placeholder="Enter cardholder name"
                            value={payment.cardholder}
                            onChange={(value) => changeHandler(value)}
                        />
                        {invalid.path?.cardholder && (
                            <ErrorTooltip message={invalid.path?.cardholder} />
                        )}
                    </div>
                    <div className={styles.inputWrapper}>
                        <input
                            id="cardNum"
                            className={
                                `${styles.paymentInput} ${invalid.path?.cardNum && styles.invalid}`
                            }
                            name="cardNum"
                            placeholder="Enter card number"
                            value={payment.cardNum === 0 ? '' : payment.cardNum}
                            onChange={(value) => changeHandler(value)}
                        />
                        {invalid.path?.cardNum && (
                            <ErrorTooltip message={invalid.path?.cardNum} />
                        )}
                    </div>
                    <div className={styles.row}>
                        <div className={styles.inputWrapper}>
                            <input
                                id="expiry"
                                className={
                                    `${styles.paymentInput} ${invalid.path?.expiry && styles.invalid}`
                                }
                                name="expiry"
                                placeholder="MM/YY"
                                value={payment.expiry}
                                onChange={(value) => changeHandler(value)}
                            />
                            {invalid.path?.expiry && (
                                <ErrorTooltip message={invalid.path?.expiry} />
                            )}
                        </div>
                        <div className={styles.inputWrapper}>
                            <input
                                id="cvv"
                                className={
                                    `${styles.paymentInput} ${invalid.path?.cvv && styles.invalid}`
                                }
                                name="cvv"
                                placeholder="Enter cvv code"
                                value={payment.cvv === 0 ? '' : payment.cvv}
                                onChange={(value) => changeHandler(value)}
                            />
                            {invalid.path?.cvv && (
                                <ErrorTooltip message={invalid.path?.cvv} />
                            )}
                        </div>
                    </div>
                </div>
            )}
            <button
                className={styles.submitBtn}
                onClick={() => onSubmit()}
            >
                Submit
            </button>
        </div>
    ) : (
        <div>You haven't for what pay</div>
    );
};

export default PaymentForm;
