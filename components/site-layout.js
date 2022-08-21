import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { RiUser3Line, RiMenuFill } from 'react-icons/ri';

import Cart from './cart';
import PopupAlert from './popup';
import { getUserInfo, loginUser } from '../pages/api/api';
import { getToken, getInfo, logout } from '../redux/ducks/user';

import styles from '../styles/SiteLayout.module.scss';
import CategoriesDropdown from './categotiesDropdown';

const SiteLayout = ({ children }) => {
    const [isOpen, setOpen] = useState(false);
    const [menuDropdown, setMenuDropdown] = useState(false);
    const [admin, setAdmin] = useState(false);
    const [showCategories, setShowCategories] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const profileRef = useRef();
    const router = useRouter();

    const dispatch = useDispatch();
    const user = useSelector((state) => state.user);

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

        if (userToken) {
            return userToken;
        }

        return;
    };

    useEffect(() => {
        if (!user.token) {
            const token = getTokenFromStorage();

            if (token) {
                dispatch(getToken(token));
                takeUserInfo(token);
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
            setErrorMessage('');

            setOpen(false);
        } else {
            setErrorMessage(token.message);
            setPassword('');
        }
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
        };
    }, [isOpen]);

    return (
        <div className="layout">
            <PopupAlert />
            <div />
            <div className={styles.header}>
                <div className={styles.menuWrapper}>
                    <div onClick={() => setMenuDropdown(!menuDropdown)} className={styles.menuBtn}>
                        <RiMenuFill />
                    </div>
                    {menuDropdown && (
                        <div className={styles.menuDropdown}>
                            <Link href="/">
                                <a onClick={() => setMenuDropdown(false)} className={styles.menuItems}>
                                    Home
                                </a>
                            </Link>
                            <Link href="/shop">
                                <a onClick={() => setMenuDropdown(false)} className={styles.menuItems}>
                                    Shop
                                </a>
                            </Link>
                            {admin && (
                                <Link href="/admin">
                                    <a onClick={() => setMenuDropdown(false)} className={styles.menuItems}>
                                        Admin
                                    </a>
                                </Link>
                            )}
                        </div>
                    )}
                </div>
                <div className={styles.logoWrapper}>
                    <div className={styles.logoNameWrapper}>
                        <div className={styles.logo} />
                        <div className={styles.siteName}>Some site name</div>
                    </div>
                    <Link href="/">
                        <a className={styles.homeLink}>Home</a>
                    </Link>
                    <Link href="/shop">
                        <a className={styles.homeLink}>Shop</a>
                    </Link>
                    {admin && (
                        <Link href="/admin">
                            <a className={styles.homeLink}>Admin</a>
                        </Link>
                    )}
                    <div 
                        className={styles.categoriesLinkWrapper}
                        onMouseEnter={() => setShowCategories(true)}
                        onMouseLeave={() => setShowCategories(false)}
                    >
                        <Link href="/categories">
                            <a className={styles.homeLink}>Categories</a>
                        </Link>
                        {showCategories && (
                            <CategoriesDropdown />
                        )}
                    </div>
                </div>
                <div className={styles.loginCartWrapper}>
                    <Cart />
                    <div className={styles.profile} ref={profileRef}>
                        {user.token ? (
                            <div onClick={() => toggleDropdown()} className={styles.accountBtn}>
                                <RiUser3Line />
                            </div>
                        ) : (
                            <div onClick={() => toggleDropdown()} className={styles.logBtn}>
                                Log In
                            </div>
                        )}
                        {user.token ? (
                            <>
                                <div style={{ display: isOpen ? 'flex' : 'none' }} className={styles.dropdown}>
                                    <div className={styles.greeting}>
                                        Welcome <b>{user.info?.username}</b>
                                    </div>
                                    <div
                                        onClick={() => {
                                            router.push(`/myOrders/`);
                                            setOpen(false);
                                        }}
                                        className={styles.dropdownItems}
                                    >
                                        Order history
                                    </div>
                                    <div
                                        onClick={() => {
                                            router.push(`/account/${user.info.id}`);
                                            setOpen(false);
                                        }}
                                        className={styles.dropdownItems}
                                    >
                                        My account
                                    </div>
                                    <div className={styles.dropdownItems}>Item</div>
                                    <button onClick={() => onLogout()} className={styles.logBtn}>
                                        Log Out
                                    </button>
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
                                                onClick={() => {
                                                    setOpen(false);
                                                    router.push('/registration');
                                                }}
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
                                        {errorMessage && <div>{errorMessage}</div>}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
            <div className={styles.mainFooterWrapper}>
                <main className={styles.main}>{children}</main>

                <footer className={styles.footer}>Test Next application</footer>
            </div>
        </div>
    );
};

export default SiteLayout;
