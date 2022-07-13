import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';

import Cart from './cart';
import { loginUser } from '../pages/api/api';
import { getToken, getInfo, logout } from '../redux/ducks/user';

import styles from '../styles/SiteLayout.module.scss';

const SiteLayout = ({children}) => {
    const [isOpen, setOpen] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const profileRef = useRef();

    const user = useSelector(state => state.user);
    const dispatch = useDispatch();

    const handleLogin = async () => {
        const token = await loginUser({ username, password });

        if (token.token) {
            dispatch(getToken(token.token));
            dispatch(getInfo(token.user));

            setUsername('');
            setPassword('');
        } else {
            setError(token.message);
            setLogin({...login, password: ''});
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

    const onSubmit = async () => {
        const token = await handleLogin({ username, password });

        console.log(token);
        setOpen(false)
    };

    useEffect(() => {
        setPassword('');
        console.log(isOpen)

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
                    {user.admin && (
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
                                    <div className={styles.dropdownItems}>
                                        Item
                                    </div>
                                    <div className={styles.dropdownItems}>
                                        Item
                                    </div>
                                    <div className={styles.dropdownItems}>
                                        Item
                                    </div>
                                    <button onClick={() => dispatch(logout())} className={styles.logBtn}>Log Out</button>
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
                                        <button 
                                            disabled={username.length && false} 
                                            onClick={() => onSubmit()} 
                                            className={styles.logBtn}
                                        >
                                            Log In
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <main>{children}</main>

            <footer className={styles.footer}>
                Test Next application
            </footer>
        </div>
    );
};

export default SiteLayout;