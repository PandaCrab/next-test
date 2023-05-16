import React, { useState, useEffect } from 'react';
import Input from 'react-phone-number-input/input';

import ErrorTooltip from './errorTooltip';
import { phoneCode } from '../helpers/phoneCountryCode';

import styles from '../styles/PhoneInput.module.scss';

interface Props {
    phone: string;
    setPhone: (val?) => void;
    country?: string;
    invalid?: string;
};
const PhoneInput: React.FC<Props> = ({ phone, setPhone, country, invalid }) => {
    console.log(phone)
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
