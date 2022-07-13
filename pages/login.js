import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import { loginUser } from './api/api';

import styles from '../styles/Login.module.scss';
import { getInfo, getToken } from '../redux/ducks/user';
import { useRouter } from 'next/router';

const LoginPage = () => {
    const [login, setLogin] = useState({
        username: '',
        password: ''
    });
    const [error, setError] = useState('');

    const dispatch = useDispatch();
    const router = useRouter();

    const handleLogin = async () => {
        const token = await loginUser(login);

        if (token.token) {
            dispatch(getToken(token.token));
            dispatch(getInfo(token.user));

            setLogin({ username: '', password: '' });
            
            router.push('/');
        } else {
            setError(token.message);
            setLogin({...login, password: ''});
        }

        console.log(token);
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
                    username: target.value
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
                    password: target.value
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
