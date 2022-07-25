import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';

import { registrateUser } from './api/api';
import { getToken, getInfo } from '../redux/ducks/user';
import { registrationSchema } from '../helpers/validation';

import styles from '../styles/Registration.module.scss';
import { catchError, catchSuccess } from '../redux/ducks/alerts';

const RegistrationPage = () => {
    const [reg, setReg] = useState({
        username: '',
        email: '',
        password: '',
        phone: '',
        age: ''
    });

    const [invalid, setInvalid] = useState({
        path: {},
        isInvalid: true
    })

    const dispatch = useDispatch();
    const router = useRouter();

    const handleChange = target => {
        const { name, value } = target;
        setReg({
            ...reg,
            [name]: value
        });
    };
  
    const handleSubmit = async () => {
        await registrationSchema
            .validate(reg)
            .then(async (value) => {
                if (value) {
                    const newUser = await registrateUser(reg);

                    if (newUser && newUser.message === 'ok') {
                        dispatch(getToken(newUser.token));
                        dispatch(getInfo(newUser.user));
                        router.push('/');
                    }

                    setReg({
                        username: '',
                        email: '',
                        password: '',
                        phone: '',
                        age: ''
                    });
                }

                setInvalid({
                    path: {},
                    isInvalid: false
                });

                catchSuccess('Submited');
            })
            .catch(error => {
                const validationError = {};

                error.inner.forEach(err => {
                    if (err.path) {
                        validationError[err.path] = err.message
                    }
                });

                setInvalid({
                    path: validationError,
                    isInvalid: true
                });

                catchError('Form is Invalid');
            });        
    };

    return (
        <div className={styles.regForm}>
            <div className={styles.regTitle}>Registration information</div>
            <input
                className={styles.regInput}
                name="email"
                type="email"
                placeholder="Enter your email"
                value={reg.email}
                onChange={({ target }) => handleChange(target)}
            />
            <input
                className={styles.regInput}
                name="username"
                type="text"
                placeholder="Enter your full Name"
                value={reg.username}
                onChange={({ target }) => handleChange(target)}
            />
            <input
                className={styles.regInput}
                name="password"
                type="password"
                placeholder="Enter strong password"
                value={reg.password}
                onChange={({ target }) => handleChange(target)}
            />
            <input
                className={styles.regInput}
                name="phone"
                type="text"
                placeholder="Enter your phone"
                value={reg.phone}
                onChange={({ target }) => handleChange(target)}
            />
            <input
                className={styles.regInput}
                name="age"
                type="text"
                placeholder="Enter your age"
                value={reg.age}
                onChange={({ target }) => handleChange(target)}
            />
            <button onClick={() => handleSubmit()} className={styles.regBtn}>Sign in</button>
        </div>
    );
};

export default RegistrationPage;
