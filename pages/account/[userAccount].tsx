import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { RiSettings4Line } from 'react-icons/ri';

import LoginPage from '../login';
import { updateUserInfo } from '../api/api';
import { getInfo } from '../../redux/ducks/user';
import { catchSuccess, catchError } from '../../redux/ducks/alerts';
import { addressSchema, phoneSchema } from '../../helpers/validation';
import { UserInfoSection, DelitionAccount, AddressForm, Loader } from '../../components';

import type { UserInfo } from '../../types/types';

import styles from '../../styles/AccountPage.module.scss';
import { useClickOutside } from '../../hooks';

interface ViewState {
    viewedStuff: boolean;
    likes: boolean;
    addressForm: boolean;
    phoneChanging: boolean;
    settings: boolean;
    agreeDeletion: boolean;
    confirmPassword: boolean;
};

interface InvalidState {
    path: {
        phone?: string;
        street?: string;
        city?: string;
        country?: string;
        zip?:string;
    } | {};
    isValid: boolean;
};

const AccountPage = () => {
    const [logout, setLogout] = useState<boolean | null>(false);
    const [isLoad, setLoad] = useState<boolean>(true);
    const [invalid, setInvalid] = useState<InvalidState>({
        path: {},
        isValid: false,
    });
    const [view, setView] = useState<ViewState>({
        viewedStuff: false,
        likes: false,
        addressForm: false,
        phoneChanging: false,
        settings: false,
        agreeDeletion: false,
        confirmPassword: false,
    });

    const settingsRef: React.MutableRefObject<HTMLDivElement> | undefined = useRef();

    const router = useRouter();
    const dispatch = useDispatch();

    const token = useSelector((state: { user: { token: string } }) => state.user.token);;
    const user = useSelector((state: { user: { info: UserInfo } }) => state.user.info);

    const updateInfo = async (info, setPhone, setAddressForm) => {
        const id = router.query.userAccount;

        if (info.shippingAddress && Object.keys(info.shippingAddress).length === 0) {
            const res = await updateUserInfo(id.toString(), info);

            dispatch(catchSuccess(res.message));
            dispatch(getInfo(res.updated));
        }

        if (info) {
            if (Object.keys(info).includes('phone')) {
                await phoneSchema
                    .validate(info, { abortEarly: false })
                    .then(async (value) => {
                        if (value) {
                            const res = await updateUserInfo(id.toString(), info);

                            if (res.message) {
                                dispatch(catchSuccess(res.message));
                                dispatch(getInfo(res.updated));

                                setPhone({ phone: '' });
                                setView({
                                    ...view,
                                    phoneChanging: false,
                                });
                            }

                            if (res.error) {
                                dispatch(catchError(res.error));
                            }
                        }
                    })
                    .catch((error) => {
                        const validationError = {};

                        error.inner.forEach((err) => {
                            if (err.path) {
                                validationError[err.path] = err.message;
                            }
                        });

                        setInvalid({
                            path: validationError,
                            isValid: false,
                        });
                    });
            }

            if (info.shippingAddress) {
                await addressSchema
                    .validate(info.shippingAddress, { abortEarly: false })
                    .then(async (value) => {
                        if (value) {
                            const res = await updateUserInfo(id.toString(), info);

                            if (res.message) {
                                dispatch(catchSuccess(res.message));
                                dispatch(getInfo(res.updated));

                                setAddressForm({
                                    street: '',
                                    city: '',
                                    country: '',
                                    zip: '',
                                });

                                setView({
                                    ...view,
                                    addressForm: false,
                                });

                                setInvalid({
                                    path: {},
                                    isValid: true,
                                });
                            }

                            if (res.error) {
                                dispatch(catchError(res.error));
                            }
                        }
                    })
                    .catch((error) => {
                        const validationError = {};

                        error.inner.forEach((err) => {
                            if (err.path) {
                                validationError[err.path] = err.message;
                            }
                        });

                        setInvalid({
                            path: validationError,
                            isValid: false,
                        });
                    });
            }
        }
    };

    useClickOutside(settingsRef, view.settings, () => setView({ ...view, settings: false }));

    useEffect(() => {
        if (token) {
            setLogout(false);
            setLoad(false);
        }

        if (!token) {
            setLogout(true);
            setLoad(false);
        }
    }, [token]);

    if (logout) {
        return ( <LoginPage /> )
    }

    if (isLoad) {
        return (<Loader />);
    }

    return user && (
        <div className={styles.accountContainer}>
            <div className={styles.headerWrapper}>
                <div className={styles.greeting}>My account</div>
                {user?.admin && <div>Admin</div>}
                <div
                    className={styles.settingsWrapper}
                    ref={settingsRef}
                >
                    <button
                        className={styles.settingsBtn}
                        onClick={() => setView({
                            ...view,
                            settings: !view.settings,
                        })
                        }
                    >
                        <RiSettings4Line />
                    </button>
                    {view.settings && (
                        <div className={styles.settings}>
                            <div
                                className={styles.settingsItem}
                                onClick={() => setView({
                                    ...view,
                                    agreeDeletion: true,
                                    settings: false,
                                })
                                }
                            >
                                Delete account
                            </div>
                        </div>
                    )}
                </div>
            </div>
            {view.agreeDeletion && (
                <DelitionAccount
                    view={view}
                    setView={setView}
                />
            )}
            <AddressForm
                updateInfo={updateInfo}
                view={view}
                setView={setView}
                invalid={invalid}
                setInvalid={setInvalid}
            />
            <UserInfoSection
                updateInfo={updateInfo}
                view={view}
                setView={setView}
                invalid={invalid}
                setInvalid={setInvalid}
            />
        </div>
    );
};

export default AccountPage;
