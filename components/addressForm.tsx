import React, { useState, useEffect, useRef } from 'react';
import { RiCloseLine } from 'react-icons/ri';
import { useSelector } from 'react-redux';

import { CountrySelect, ErrorTooltip } from '../components';
import { useClickOutside } from '../hooks';

import type { AddressInfo, userObject, InvalidAddressForm, AccountViews } from '../types/types';

import styles from '../styles/AddressForm.module.scss';
interface Props {
    updateInfo: (
        arg0: { shippingAddress: AddressInfo },
        arg1: null,
        arg2: React.Dispatch<React.SetStateAction<AddressInfo>>
    ) => void;
    view: AccountViews;
    setView: React.Dispatch<React.SetStateAction<AccountViews>>;
    invalid: InvalidAddressForm;
    setInvalid: React.Dispatch<React.SetStateAction<InvalidAddressForm>>;
};

const AddressForm: React.FC<Props> = ({
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
                <div className={styles.inputWrapper}>
                    <CountrySelect
                        value={addressForm.country}
                        setValue={(item) => setAddressForm({
                            ...addressForm,
                            country: item
                        })}
                        invalid={invalid.path?.country}
                        setInvalid={() => setInvalid({
                            ...invalid,
                            path: {
                                ...invalid.path,
                                country: ''
                            }
                        })}
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

export default AddressForm;
