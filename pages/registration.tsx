import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';

import { registrateUser } from './api/api';
import { getToken, getInfo } from '../redux/ducks/user';
import { registrationSchema } from '../helpers/validation';
import { catchError, catchSuccess } from '../redux/ducks/alerts';

import styles from '../styles/Registration.module.scss';

interface RegState {
    username: string;
    email: string;
    password: string;
    phone: string;
    age: number;
}

interface Invalid {
    path: {
        username?: string;
        email?: string;
        password?: string;
        phone?: string;
        age?: string
    } | null;
    isInvalid: boolean;
}

const RegistrationPage = () => {
    const [reg, setReg] = useState<RegState>({
        username: '',
        email: '',
        password: '',
        phone: '',
        age: 0,
    });

    const [invalid, setInvalid] = useState<Invalid>({
        path: {},
        isInvalid: true,
    });

    const dispatch = useDispatch();
    const router = useRouter();

    useEffect(() => {
        const takeToken: string = localStorage.getItem('token');
        const token: string = JSON.parse(takeToken);

        if (token) {
            router.push('/');
        }
    }, []);

    const handleChange = (target: {name: string, value: string | number}) => {
        const { name, value } = target;
        setReg({
            ...reg,
            [name]: value,
        });
    };

    const handleSubmit = async () => {
        await registrationSchema
            .validate(reg, { abortEarly: false })
            .then(async (value) => {
                if (value) {
                    const newUser = await registrateUser({
                        username: String(reg.username).toLowerCase(),
                        email: reg.email,
                        password: reg.password,
                        phone: reg.phone,
                        age: reg.age,
                    });

                    if (newUser && newUser.message === 'ok') {
                        dispatch(getToken(newUser.token));
                        dispatch(getInfo(newUser.user));

                        setInvalid({
                            path: null,
                            isInvalid: false,
                        });

                        setReg({
                            username: '',
                            email: '',
                            password: '',
                            phone: '',
                            age: 0,
                        });

                        dispatch(catchSuccess('Account created'));
                        localStorage.setItem('token', JSON.stringify(newUser.token));
                        router.push('/');
                    }

                    if (newUser.duplicate) {
                        dispatch(catchError(newUser.duplicate));
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
                    isInvalid: true,
                });

                dispatch(catchError('Form is Invalid'));
            });
    };

    return (
        <div className={styles.regForm}>
            <div className={styles.regTitle}>Registration information</div>
            <input
                className={invalid.path.email ? `${styles.regInput} ${styles.invalid}` : `${styles.regInput}`}
                name="email"
                type="email"
                placeholder={invalid.path.email || 'Enter your email'}
                value={reg.email}
                onChange={({ target }) => handleChange(target)}
            />
            <input
                className={invalid.path.username ? `${styles.regInput} ${styles.invalid}` : `${styles.regInput}`}
                name="username"
                type="text"
                placeholder={invalid.path.username || 'Enter your full Name'}
                value={reg.username}
                onChange={({ target }) => handleChange(target)}
            />
            <input
                className={invalid.path.password ? `${styles.regInput} ${styles.invalid}` : `${styles.regInput}`}
                name="password"
                type="password"
                placeholder={invalid.path.password || 'Enter strong password'}
                value={reg.password}
                onChange={({ target }) => handleChange(target)}
            />
            <input
                className={invalid.path.phone ? `${styles.regInput} ${styles.invalid}` : `${styles.regInput}`}
                name="phone"
                type="text"
                placeholder={invalid.path.phone || 'Enter your phone'}
                value={reg.phone}
                onChange={({ target }) => handleChange(target)}
            />
            <input
                className={invalid.path.age ? `${styles.regInput} ${styles.invalid}` : `${styles.regInput}`}
                name="age"
                type="text"
                placeholder={invalid.path.age || 'Enter your age'}
                value={reg.age === 0 ? '' : reg.age}
                onChange={({ target }) => handleChange(target)}
            />
            <button
                onClick={() => handleSubmit()}
                className={styles.regBtn}
            >
                Sign in
            </button>
        </div>
    );
};

export default RegistrationPage;
