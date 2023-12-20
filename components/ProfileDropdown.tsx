import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';

import ErrorTooltip from './errorTooltip';
import { logout } from '../redux/ducks/user';
import { getToken, getInfo } from '../redux/ducks/user';
import { userObject } from '../types/types';
import { loginUser } from '../pages/api/api';
import { useClickOutside } from '../hooks';

import styles from '../styles/ProfileDropdownStyles.module.scss';

interface Props{
    isOpen: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    user: userObject;
    animation: boolean;
    setAnimation: React.Dispatch<React.SetStateAction<boolean>>;
    profileRef: React.MutableRefObject<HTMLDivElement>;
};

const ProfileDropdown: React.FC<Props> = ({ 
    isOpen,
    setOpen,
    user,
    animation,
    setAnimation,
    profileRef
}) => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string>('');

    const dispatch = useDispatch();
    const router = useRouter();

    const setToken = (token) => {
        localStorage.setItem('token', JSON.stringify(token));
    };

    const onLogout = () => {
        localStorage.removeItem('token');

        dispatch(logout());
    };

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

    const closeProfile = () => {
        setPassword('');
        setOpen(false);
    };

    useClickOutside(profileRef, isOpen, closeProfile);


    const animationEndHandler: (arg0: React.AnimationEvent) => void = ({ animationName }) => {
        if (animationName === 'profile-dropdown-open') {
            setOpen(true);
            setAnimation(true);
        }

        if (animationName === 'profile-dropdown-close') {
            setOpen(false);
            setAnimation(false);
        }
    };

    const setProfDropClass = `${styles.dropdown} ${animation && (isOpen ? styles.openDropdown : styles.closeDropdown)}`;

    return (
        <div>
            {user.token ? (
                <div 
                    className={setProfDropClass}
                    onAnimationEnd={(event) => animationEndHandler(event)}
                >
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
            ) : (
                <div 
                    className={setProfDropClass}
                    onAnimationEnd={(event) => animationEndHandler(event)}
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
            )}
        </div>
    );
};

export default ProfileDropdown;
