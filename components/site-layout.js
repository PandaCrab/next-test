import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';

import Cart from './cart';
import { getUserInfo, loginUser } from '../pages/api/api';
import { getToken, getInfo, logout } from '../redux/ducks/user';

import styles from '../styles/SiteLayout.module.scss';

const SiteLayout = ({children}) => {
    const [isOpen, setOpen] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [admin, setAdmin] = useState(false);
    const [error, setError] = useState('')

    const profileRef = useRef();

    const user = useSelector(state => state.user);
    const dispatch = useDispatch();
    const router = useRouter();

    const setToken = (token) => {
        localStorage.setItem('token', JSON.stringify(token));
    };

    const takeUserInfo = async (id) => {
        const info = await getUserInfo(id);
        dispatch(getInfo(info));
    };

    const onLogout = () => {
        localStorage.removeItem('token');

        dispatch(logout());
    };

    const getTokenFromStorage = () => {
        const fromStorage = localStorage.getItem('token');
        const userToken = JSON.parse(fromStorage);

        if(userToken) {
            return userToken;
        }

        return;
    };

    useEffect(() => {
        if (!user.token) {
            const token = getTokenFromStorage();
            if (token) {
                dispatch(getToken(token));
                takeUserInfo({_id: token});
            }

            return;
        }

        return;
    }, []);

    useEffect(() => {
        if (user.info?.admin) {
            setAdmin(true);
        } else {
            setAdmin(false);
        }
    }, [user.info?.admin]);

    const onLogin = async () => {
        const token = await loginUser({ username, password });

        if (token.token) {
            dispatch(getToken(token.token));
            dispatch(getInfo(token.user));

            setToken(token.token);

            setUsername('');
            setPassword('');
            setError('');

            setOpen(false)
        } else {
            setError(token.message);
            setPassword('');
        }

        console.log(token);
    };

    const toggleDropdown = () => {
        setOpen(!isOpen);
    };

    const clickOutside = (event) => {
        if (!profileRef.current.contains(event.target)) {
            setOpen(false);
        }
    };

    useEffect(() => {
        setPassword('');

        if (isOpen) {
            document.addEventListener('click', clickOutside);
        }

        return () => {
            document.removeEventListener('click', clickOutside);
        }
    }, [isOpen]);

    return (
        <div className='layout'>
            <div className={styles.header}>
                <div className={styles.menuLogoWrapper}>
                    <div className={styles.title}>Some logo and name of company</div>
                    <Link href="/">
                        <a className={styles.homeLink}>Home</a>
                    </Link>
                    {admin && (
                        <Link href="/admin">
                            <a className={styles.homeLink}>Admin</a>
                        </Link>
                    )}
                </div>
                <div className={styles.loginCartWrapper}>
                    <Cart />
                    <div className={styles.profile} ref={profileRef}>
                        {user.token ? (
                            <div onClick={() => toggleDropdown()} className={styles.accountBtn}>
                                {user.info.username}
                            </div>
                        ) : (
                            <div onClick={() => toggleDropdown()} className={styles.logBtn}>
                                Log In
                            </div>
                                
                        )}
                        {user.token ? (
                            <>
                                <div style={{ display: isOpen ? 'flex' : 'none' }} className={styles.dropdown}>
                                    <div 
                                        onClick={() => {
                                            router.push(`/myOrders/`);
                                            setOpen(false);
                                        }} 
                                        className={styles.dropdownItems}
                                    >
                                        Order history
                                    </div>
                                    <div className={styles.dropdownItems}>
                                        My account
                                    </div>
                                    <div className={styles.dropdownItems}>
                                        Item
                                    </div>
                                    <button onClick={() => onLogout()} className={styles.logBtn}>Log Out</button>
                                </div>
                            </>
                        ) : (
                            <>
                                <div style={{ display: isOpen ? 'flex' : 'none' }} className={styles.dropdown}>
                                    <div className={styles.formTitle}>Welcome</div>
                                    <div className={styles.loginForm}>
                                        <input 
                                            className={styles.logInput}
                                            id="username"
                                            name="username"
                                            type="text"
                                            placeholder="Enter your name"
                                            value={username}
                                            onChange={({ target }) => setUsername(target.value)}
                                        />
                                        <input 
                                            className={styles.logInput}
                                            id="password"
                                            name="password"
                                            type="password"
                                            placeholder="Enter your password"
                                            value={password}
                                            onChange={({ target }) => setPassword(target.value)}
                                        />
                                        <div className={styles.dropdownBtnWrapper}>
                                            <button 
                                                onClick={() => router.push('/registration')} 
                                                className={styles.logBtn}
                                            >
                                                Sign In
                                            </button>
                                            <button 
                                                disabled={username.length && false} 
                                                onClick={() => onLogin()} 
                                                className={styles.logBtn}
                                            >
                                                Log In
                                            </button>
                                        </div>
                                        {error && (
                                            <div>{error}</div>
                                        )}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <main className={styles.main}>{children}</main>

            <footer className={styles.footer}>
                Test Next application
            </footer>
        </div>
    );
};

export default SiteLayout;