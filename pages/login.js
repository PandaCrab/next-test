import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';

import { loginUser } from './api/api';
import { getInfo, getToken } from '../redux/ducks/user';

import styles from '../styles/Login.module.scss';

const LoginPage = () => {
    const [login, setLogin] = useState({
        username: '',
        password: '',
    });
    const [error, setError] = useState('');

    const dispatch = useDispatch();
    const router = useRouter();

    const setToken = (token) => {
        localStorage.setItem('token', JSON.stringify(token));
    };

    const handleLogin = async () => {
        const token = await loginUser({
            username: String(login.username).toLowerCase(),
            password: login.password,
        });

        if (token.token) {
            dispatch(getToken(token.token));
            dispatch(getInfo(token.user));

            setToken(token.token);

            setLogin({ username: '', password: '' });

            if (router.pathname === '/login') {
                router.push('/');
            }
        } else {
            setError(token.message);
            setLogin({ ...login, password: '' });
        }
    };

    return (
        <div className={styles.loginForm}>
            <input
                className={styles.formInput}
                name="username"
                type="text"
                placeholder="Enter your name"
                value={login.username}
                onChange={({ target }) => setLogin({
                    ...login,
                    username: target.value,
                })}
            />
            <input
                className={styles.formInput}
                name="password"
                type="password"
                placeholder="Enter your password"
                value={login.password}
                onChange={({ target }) => setLogin({
                    ...login,
                    password: target.value,
                })}
            />
            <button onClick={() => handleLogin()} className={styles.logBtn}>Log In</button>
            {error && (
                <div className={styles.errorHendler}>
                    {error}
                </div>
            )}
        </div>
    );
};

export default LoginPage;
