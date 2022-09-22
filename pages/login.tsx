import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';

import { loginUser } from './api/api';
import { getInfo, getToken } from '../redux/ducks/user';

import type {
    UserInfoResponse
} from '../types/types';

import styles from '../styles/Login.module.scss';

interface Login {
    username: string;
    password: string;
};

const LoginPage = () => {
    const [login, setLogin] = useState<Login>({
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
        const userInfo: UserInfoResponse = await loginUser({
            username: String(login.username).toLowerCase(),
            password: login.password,
        });

        if (userInfo.token) {
            dispatch(getToken(userInfo.token));
            dispatch(getInfo(userInfo.user));

            setToken(userInfo.token);

            setLogin({ username: '', password: '' });

            if (router.pathname === '/login') {
                router.push('/');
            }
        } else {
            setError(userInfo.message);
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
