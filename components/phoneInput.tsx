import React, { useState, useEffect, useRef } from 'react';

import ErrorTooltip from './errorTooltip';
import { phoneCode } from '../helpers/phoneCountryCode';

import styles from '../styles/PhoneInput.module.scss';

interface PropTypes {
    phone: string;
    setPhone: (val) => void;
    country?: string;
    invalid?: string;
};

const PhoneInput = ({ phone, setPhone, country, invalid }: PropTypes) => {
    const [mask, setMask] = useState<string>('');

    const inputRef: React.MutableRefObject<HTMLInputElement> | null = useRef();

    const setPhoneMask = () => {
        const regexp = /^(\d|)?(\d{0,3})(\d{0,3})(\d{0,4})&/;
        let maskedPhone = inputRef.current.value.replace(/\D/g, '').match(regexp);
        
        // const dialCode = phoneCode.filter(code => code.dialCode.match(maskedPhone[1]) && code.dialCode);

        const masked = !maskedPhone[2] ? maskedPhone[1] : `+${maskedPhone[1]} (${maskedPhone[2]}) ${maskedPhone[3]}-${maskedPhone[4]}`;

        setMask(masked);
    };

    useEffect(() => {
        if (country && !phone) {
            const countryCode = phoneCode.filter(item => {
                if (item.name === country) {
                    return item.dialCode;
                }
            });

            setPhone({
                target: {
                    name: 'phone',
                    value: Number(countryCode)
                }
            });
        }
    }, [country]);

    console.log(phone)

    return (
        <div className={styles.container}>
            <input
                className={`${styles.phoneInput} ${invalid && styles.invalid}`}
                placeholder="+38 (0**) ***-****"
                ref={inputRef}
                value={mask}
                onChange={({target}) => {
                    setPhoneMask();
                    setPhone(target)
                }}
            />
            {invalid && (
                <ErrorTooltip message={invalid} />
            )}
        </div>
    )
};

export default PhoneInput;
