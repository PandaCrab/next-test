import React, { useState } from 'react';
import { RiCloseLine } from 'react-icons/ri';
import PropTypes from 'prop-types';

import styles from '../styles/AddressForm.module.scss';

const AddressForm = ({
    updateInfo, view, setView, invalid,
}) => {
    const [addressForm, setAddressForm] = useState({
        street: '',
        city: '',
        country: '',
        zip: '',
    });

    const addressInputChange = (target) => {
        const { name, value } = target;

        setAddressForm({
            ...addressForm,
            [name]: value,
        });
    };

    return (
        <div className={styles.addressFormWrapper}>
            <button
                onClick={() => setView({
                    ...view,
                    addressForm: false,
                })
                }
                className={styles.closeBtn}
            >
                <RiCloseLine />
            </button>
            <div className={styles.addressForm}>
                <input
                    className={
                        invalid.path.street
                            ? `${styles.addressFormInput} ${styles.invalid}`
                            : `${styles.addressFormInput}`
                    }
                    name="street"
                    value={addressForm.street}
                    onChange={({ target }) => addressInputChange(target)}
                    placeholder={invalid.path.street ? invalid.path.street : 'Enter street'}
                />
                <input
                    className={
                        invalid.path.city
                            ? `${styles.addressFormInput} ${styles.invalid}`
                            : `${styles.addressFormInput}`
                    }
                    name="city"
                    value={addressForm.city}
                    onChange={({ target }) => addressInputChange(target)}
                    placeholder={invalid.path.city ? invalid.path.city : 'Enter city'}
                />
                <input
                    className={
                        invalid.path.country
                            ? `${styles.addressFormInput} ${styles.invalid}`
                            : `${styles.addressFormInput}`
                    }
                    name="country"
                    value={addressForm.country}
                    onChange={({ target }) => addressInputChange(target)}
                    placeholder={invalid.path.country ? invalid.path.country : 'Choose country'}
                />
                <input
                    className={
                        invalid.path.zip ? `${styles.addressFormInput} ${styles.invalid}` : `${styles.addressFormInput}`
                    }
                    name="zip"
                    value={addressForm.zip}
                    onChange={({ target }) => addressInputChange(target)}
                    placeholder={invalid.path.zip ? invalid.path.zip : 'Enter ZIP code'}
                />
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
};

export default AddressForm;
