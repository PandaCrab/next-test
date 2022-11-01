import React, { useState, useEffect } from 'react';
import Input from 'react-phone-number-input/input';

import ErrorTooltip from './errorTooltip';
import { phoneCode } from '../helpers/phoneCountryCode';

import styles from '../styles/PhoneInput.module.scss';

interface PropTypes {
    phone: string;
    setPhone: (val?) => void;
    country?: string;
    invalid?: string;
};

const PhoneInput = ({ phone, setPhone, country, invalid }: PropTypes) => {
    const [value, setValue] = useState('');

    useEffect(() => {
        setPhone({target: {
            name: 'phone',
            value: value,
        }});
    }, [value]);
    return (
        <div className={styles.container}>
            <Input
                className={`${styles.phoneInput} ${invalid && styles.invalid}`}
                placeholder="+38 (0**) ***-****"
                smartCaret={false}
                value={phone}
                onChange={setPhone}
            />
            {invalid && (
                <ErrorTooltip message={invalid} />
            )}
        </div>
    )
};

export default PhoneInput;
