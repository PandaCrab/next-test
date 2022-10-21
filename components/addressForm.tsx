import PropTypes from 'prop-types';
import React, { useState, useEffect, useRef } from 'react';
import { RiCloseLine } from 'react-icons/ri';
import { useSelector } from 'react-redux';

import { CountrySelect, ErrorTooltip } from '../components';
import { useClickOutside } from '../hooks';

import type { AddressInfo, userObject } from '../types/types';

import styles from '../styles/AddressForm.module.scss';

const AddressForm = ({
    updateInfo, view, setView, invalid, setInvalid
}) => {
    const [animation, setAnimation] = useState<boolean>(false);
    const [addressForm, setAddressForm] = useState<AddressInfo>({
        street: '',
        city: '',
        country: '',
        zip: '',
    });

    const userAddress = useSelector((state: { user: userObject }) => state.user.info?.shippingAddress);

    const formRef: React.MutableRefObject<HTMLDivElement> = useRef(null);

    const formClassName = animation ? (view.addressForm ? 
        `${styles.addressFormWrapper} ${styles.openForm}` 
        : `${styles.addressFormWrapper} ${styles.closeForm}`
        ) : `${styles.addressFormWrapper}`

    const closeHandler = () => {
        setView({
            ...view,
            addressForm: false
        });

        setAddressForm({
            street: '',
            city: '',
            country: '',
            zip: ''
        });

        setInvalid({
            ...invalid,
            path: null
        });
    };

    const animationEndHandler = ({ animationName }) => {
        if (animationName === 'open-form') {
            setView({
                ...view,
                addressForm: true
            });
            setAnimation (true);
        }

        if (animationName === 'close-form') {
            setView({
                ...view,
                addressForm: false
            });
            setAnimation(false);
        }
    };

    const addressInputChange = (target: { name: string, value: string }) => {
        const { name, value } = target;

        setInvalid({
            ...invalid,
            path: {
                ...invalid.path,
                [name]: ''
            }
        });

        setAddressForm({
            ...addressForm,
            [name]: value,
        });
    };

    useEffect(() => {
        if (userAddress && Object.keys(userAddress).length) {
            setAddressForm(userAddress);
        }
    }, [view.addressForm]);

    useClickOutside(formRef, view.addressForm, closeHandler);

    useEffect(() => {
        if (view.addressForm) {
            setAnimation(true);
        }
    }, [view.addressForm]);

    return (
        <div 
            className={formClassName} 
            ref={formRef}
            onAnimationEnd={(event) => animationEndHandler(event)}
        >
            <button
                onClick={() => closeHandler()}
                className={styles.closeBtn}
            >
                <RiCloseLine />
            </button>
            <div className={styles.addressForm}>
                <div className={styles.inputWrapper}>
                    <input
                        className={
                            invalid.path?.street
                                ? `${styles.addressFormInput} ${styles.invalid}`
                                : `${styles.addressFormInput}`
                        }
                        name="street"
                        value={addressForm.street}
                        onChange={({ target }) => addressInputChange(target)}
                        placeholder='Enter street'
                    />
                    {invalid.path?.street && (
                        <ErrorTooltip message={invalid.path?.street} />
                    )}
                </div>
                <div className={styles.inputWrapper}>
                    <input
                        className={
                            invalid.path?.city
                                ? `${styles.addressFormInput} ${styles.invalid}`
                                : `${styles.addressFormInput}`
                        }
                        name="city"
                        value={addressForm.city}
                        onChange={({ target }) => addressInputChange(target)}
                        placeholder='Enter city'
                    />
                    {invalid.path?.city && (
                        <ErrorTooltip message={invalid.path?.city} />
                    )}
                </div>
                {/* <<div className={styles.inputWrapper}>
                    <input
                        className={
                            invalid.path?.country
                                ? `${styles.addressFormInput} ${styles.invalid}`
                                : `${styles.addressFormInput}`
                        }
                        name="country"
                        value={addressForm.country}
                        onChange={({ target }) => addressInputChange(target)}
                        placeholder='Choose country'
                    />
                    {invalid.path?.country && (
                        <ErrorTooltip message={invalid.path?.country} />
                    )}
                </div>> */}
                <div className={styles.inputWrapper}>
                    <CountrySelect
                        value={addressForm.country}
                        setValue={(item) => addressInputChange(item)}
                    />
                </div>
                <div className={styles.inputWrapper}>
                    <input
                        className={
                            invalid.path?.zip ? `${styles.addressFormInput} ${styles.invalid}` : `${styles.addressFormInput}`
                        }
                        name="zip"
                        value={addressForm.zip}
                        onChange={({ target }) => addressInputChange(target)}
                        placeholder='Enter ZIP code'
                    />
                    {invalid.path?.zip && (
                        <ErrorTooltip message={invalid.path?.zip} />
                    )}
                </div>
            </div>
            <button
                className="btns"
                onClick={() => updateInfo({
                    shippingAddress: addressForm,
                }, null, setAddressForm)
                }
            >
                Confirm
            </button>
        </div>
    );
};

AddressForm.propTypes = {
    updateInfo: PropTypes.func,
    view: PropTypes.object,
    setView: PropTypes.func,
    invalid: PropTypes.object,
    setInvalid: PropTypes.func,
};

export default AddressForm;
