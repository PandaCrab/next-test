import Link from 'next/link';
import Image from 'next/image';
import PropTypes from 'prop-types';
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { RiUser3Line } from 'react-icons/ri';

import PopupAlert from './popup';
import Cart from './cart';
import CategoriesDropdown from './categotiesDropdown';
import LeftMenu from './leftMenu';
import ErrorTooltip from './errorTooltip';
import { getUserInfo, loginUser } from '../pages/api/api';
import { getToken, getInfo, logout } from '../redux/ducks/user';
import { useClickOutside } from '../hooks';

import type { userObject } from '../types/types';

import styles from '../styles/SiteLayout.module.scss';
import SearchBar from './searchBar';

const SiteLayout = ({ children }) => {
    const [isOpen, setOpen] = useState<boolean>(false);
    const [searchOpen, setSearchOpen] = useState<boolean>(false);
    const [admin, setAdmin] = useState<boolean>(false);
    const [showCategories, setShowCategories] = useState<boolean>(false);
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string>('');

    const profileRef: React.MutableRefObject<HTMLDivElement> | null = useRef(null);

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

    const closeProfile = () => {
        setPassword('');
        setOpen(false);
    };

    useClickOutside(profileRef, isOpen, closeProfile);

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

    return (
        <div className="layout">
            <PopupAlert />
            <div className={styles.header}>
                <LeftMenu admin={admin} />
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
                    <SearchBar isOpen={searchOpen} setOpen={setSearchOpen} />
                    <Cart />
                    <div
                        className={styles.profile}
                        ref={profileRef}
                    >
                        {user.token ? (
                            <div
                                onClick={() => setOpen(!isOpen)}
                                className={styles.accountBtn}
                            >
                                {user.info?.photo ? (
                                    <div className={`${styles.imageWrapper} ${styles.withAvatar}`}>
                                        <Image 
                                            src={user.info.photo}
                                            alt="user-avatar"
                                            style={{ borderRadius: '50%' }}
                                            width="50px"
                                            height="50px"
                                        />
                                    </div>
                                ) : (
                                    <div className={styles.imageWrapper}>
                                        <RiUser3Line />
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div
                                onClick={() => setOpen(!isOpen)}
                                className={styles.logBtn}
                            >
                                Log In
                            </div>
                        )}
                        {isOpen && (
                            <div>
                                {user.token ? (
                                    <>
                                        <div className={styles.dropdown}>
                                            <div className={styles.greeting}>
                                                Welcom <b>
                                                    {user.info?.username && displayFirstName(user.info?.username)}
                                                </b>
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
                                        <div className={styles.dropdown}>
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
                                                {errorMessage && (
                                                    <ErrorTooltip message={errorMessage} />
                                                )}
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
