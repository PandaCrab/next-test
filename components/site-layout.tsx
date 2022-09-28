import Link from 'next/link';
import PropTypes from 'prop-types';
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { RiUser3Line, RiMenuFill } from 'react-icons/ri';

import PopupAlert from './popup';
import Cart from './cart';
import CategoriesDropdown from './categotiesDropdown';
import { getUserInfo, loginUser } from '../pages/api/api';
import { getToken, getInfo, logout } from '../redux/ducks/user';

import type { userObject } from '../types/types';

import styles from '../styles/SiteLayout.module.scss';

const SiteLayout = ({ children }) => {
    const [isOpen, setOpen] = useState<boolean>(false);
    const [menuDropdown, setMenuDropdown] = useState<boolean>(false);
    const [admin, setAdmin] = useState<boolean>(false);
    const [showCategories, setShowCategories] = useState<boolean>(false);
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string>('');

    const profileRef: React.MutableRefObject<HTMLDivElement> | null = useRef();
    const router = useRouter();

    const dispatch = useDispatch();
    const user = useSelector((state: { user: userObject }) => state.user);

    const setToken = (token) => {
        localStorage.setItem('token', JSON.stringify(token));
    };

    const takeUserInfo = async (id: string) => {
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
    };

    useEffect(() => {
        if (!user.token) {
            const token: string = getTokenFromStorage();

            if (token) {
                dispatch(getToken(token));
                takeUserInfo(token);
            }
        }
    }, []);

    useEffect(() => {
        if (user.info?.admin) {
            setAdmin(true);
        } else {
            setAdmin(false);
        }
    }, [user.info?.admin]);

    const onLogin = async () => {
        const token = await loginUser({ username: String(username).toLowerCase(), password });

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

    const displayFirstName = (name) => {
        const nameArr = name.split(' ');

        return nameArr[0];
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
                    <div
                        onClick={() => setMenuDropdown(!menuDropdown)}
                        className={styles.menuBtn}
                    >
                        <RiMenuFill />
                    </div>
                    {menuDropdown && (
                        <div className={styles.menuDropdown}>
                            <Link href="/">
                                <a
                                    onClick={() => setMenuDropdown(false)}
                                    className={styles.menuItems}
                                >
                                    Home
                                </a>
                            </Link>
                            <Link href="/shop">
                                <a
                                    onClick={() => setMenuDropdown(false)}
                                    className={styles.menuItems}
                                >
                                    Shop
                                </a>
                            </Link>
                            {admin && (
                                <Link href="/admin">
                                    <a
                                        onClick={() => setMenuDropdown(false)}
                                        className={styles.menuItems}
                                    >
                                        Admin
                                    </a>
                                </Link>
                            )}
                            <Link href="/shop/categories">
                                <a
                                    onClick={() => setMenuDropdown(false)}
                                    className={styles.menuItems}
                                >
                                    Categories
                                </a>
                            </Link>
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
                        <Link href="/shop/categories">
                            <a className={styles.homeLink}>Categories</a>
                        </Link>
                        {showCategories && <CategoriesDropdown />}
                    </div>
                </div>
                <div className={styles.loginCartWrapper}>
                    <Cart />
                    <div
                        className={styles.profile}
                        ref={profileRef}
                    >
                        {user.token ? (
                            <div
                                onClick={() => toggleDropdown()}
                                className={styles.accountBtn}
                            >
                                <RiUser3Line />
                            </div>
                        ) : (
                            <div
                                onClick={() => toggleDropdown()}
                                className={styles.logBtn}
                            >
                                Log In
                            </div>
                        )}
                        {user.token ? (
                            <>
                                <div
                                    style={{ display: isOpen ? 'flex' : 'none' }}
                                    className={styles.dropdown}
                                >
                                    <div className={styles.greeting}>
                                        Welcom <b>{user.info?.username && displayFirstName(user.info?.username)}</b>
                                    </div>
                                    <div
                                        onClick={() => {
                                            router.push('/myOrders/');
                                            setOpen(false);
                                        }}
                                        className={styles.dropdownItems}
                                    >
                                        Order history
                                    </div>
                                    <div
                                        onClick={() => {
                                            router.push(`/account/${user.info._id}`);
                                            setOpen(false);
                                        }}
                                        className={styles.dropdownItems}
                                    >
                                        My account
                                    </div>
                                    <div className={styles.dropdownItems}>Item</div>
                                    <button
                                        onClick={() => onLogout()}
                                        className={styles.logBtn}
                                    >
                                        Log Out
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <div
                                    style={{ display: isOpen ? 'flex' : 'none' }}
                                    className={styles.dropdown}
                                >
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
                                        {errorMessage && <div className={styles.errorMessage}>{errorMessage}</div>}
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

SiteLayout.propTypes = {
    children: PropTypes.element,
};

export default SiteLayout;