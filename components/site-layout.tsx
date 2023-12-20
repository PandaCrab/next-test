import Link from 'next/link';
import Image from 'next/image';
import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RiUser3Line } from 'react-icons/ri';

import PopupAlert from './popup';
import SearchBar from './searchBar';
import Cart from './cart';
import CategoriesDropdown from './categotiesDropdown';
import LeftMenu from './leftMenu';
import { data$, getUserInfo } from '../pages/api/api';
import { getToken, getInfo } from '../redux/ducks/user';
import { storeStuff } from '../redux/ducks/stuff';
import { catchError } from '../redux/ducks/alerts';
import { ProfileDropdown } from './index';

import type { userObject } from '../types/types';

import styles from '../styles/SiteLayout.module.scss';

interface Props {
    children: React.ReactElement;
};

const SiteLayout: React.FC<Props> = ({ children }) => {
    const [isOpen, setOpen] = useState<boolean>(false);
    const [searchOpen, setSearchOpen] = useState<boolean>(false);
    const [admin, setAdmin] = useState<boolean>(false);
    const [showCategories, setShowCategories] = useState<boolean>(false);
    const [animation, setAnimation] = useState<boolean>();

    const profileRef: React.MutableRefObject<HTMLDivElement> | null = useRef(null);

    const dispatch = useDispatch();
    const user = useSelector((state: { user: userObject }) => state.user);

    const takeUserInfo = async (id: string) => {
        const info = await getUserInfo(id);

        dispatch(getInfo(info));
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

    useEffect(() => {
        data$.subscribe({
            next: async (result) => {
                try {
                    if (result) {
                        if (result.length) {
                            dispatch(storeStuff(result));
                        }
                    }

                    if (result.error) {
                        dispatch(catchError( result.message ))
                    }
                } catch (err) {
                    console.log(err.message);
                }
            }
        });
    }, []);

    const toggleDropdown = () => {
        setAnimation(true);

        setOpen(!isOpen);

        if (isOpen) {
            setAnimation(true)
        }
    }

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
                        <Link href={process.env.NEXT_PUBLIC_ADMIN_PORTAL ?? '/admin'}>
                            <a target="_blank" className={styles.homeLink}>Admin</a>
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
                                onClick={() => toggleDropdown()}
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
                        <ProfileDropdown 
                            isOpen={isOpen}
                            setOpen={setOpen} 
                            user={user}
                            animation={animation}
                            setAnimation={setAnimation}
                            profileRef={profileRef}
                        />
                    </div>
                </div>
            </div>
            <div className={styles.mainFooterWrapper}>
                <main className={styles.main}>{children}</main>

                <footer className={styles.footer}>
                    <div>
                        <h5>Test Next application</h5>
                        <p>&#169;Company name. All Rights Reserved</p>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default SiteLayout;
