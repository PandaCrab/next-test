import Image from 'next/image';
import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { RiUser3Line, RiCloseLine, RiCheckFill, RiSettings4Line } from 'react-icons/ri';
import { BsPencil } from 'react-icons/bs';

import { deleteUser, takeSomeProducts, updateUserInfo } from '../api/api';
import { getInfo, logout } from '../../redux/ducks/user';
import { catchSuccess, catchError, catchWarning } from '../../redux/ducks/alerts';
import { addressSchema, phoneSchema } from '../../helpers/validation'
import LoginPage from '../login';

import styles from '../../styles/AccountPage.module.scss';
import { clearOrder } from '../../redux/ducks/stuff';

const AccountPage = () => {
    const [loged, setLoged] = useState(false);
    const [descriptionHide, setDescriptionHide] = useState(true);

    const [likes, setLikes] = useState();
    const [ordersInBucket, setOrders] = useState();

    const [view, setView] = useState({
        inBucket: false,
        likes: false,
        addressForm: false,
        phoneChanging: false,
        settings: false,
        agreeDeletion: false,
        confirmPassword: false
    });
    const [phone, setPhone] = useState({ phone: '' });
    const [confirmPass, setConfirmPass] = useState('');
    const [addressForm, setAddressForm] = useState({
        street: '',
        city: '',
        country: '',
        zip: ''
    });
    const [invalid, setInvalid] = useState({
        path: {},
        isValid: false
    });

    const settingsRef = useRef();

    const router = useRouter();
    const dispatch = useDispatch();

    const token = useSelector(state => state.user.token);
    const user = useSelector(state => state.user.info);
    const order = useSelector(state => state.order.userOrder);

    const catchLikedProducts = async (ids) => {
        const likedProducts = await takeSomeProducts(ids);

        if (likedProducts) {
            setLikes(likedProducts);
        }

        return;
    };
    
    const updateInfo = async (info) => {
        const id = router.query.userAccount;

        if (info.shippingAddress && Object.keys(info.shippingAddress).length === 0) {
            const res = await updateUserInfo(id, info);

            dispatch(catchSuccess(res.message));
            dispatch(getInfo(res.updated));
        }
console.log(info)
        if (info) {
            if (info.phone) {
                await phoneSchema.validate(phone)
                .then(async value => {
                    if (value) {
                        const res = await updateUserInfo(id, info);

                        if (res.message) {
                            dispatch(catchSuccess(res.message));
                            dispatch(getInfo(res.updated));

                            setPhone({ phone: '' });
                            setView({
                                ...view,
                                phoneChanging: false
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
                        isValid: false
                    });
                });
            }

            if (info.shippingAddress === addressForm) {
                await addressSchema.validate(addressForm, { abortEarly: false })
                .then(async value => {
                    if (value) {
                        const res = await updateUserInfo(id, info);

                        if (res.message) {
                            dispatch(catchSuccess(res.message));
                            dispatch(getInfo(res.updated));

                            setAddressForm({
                                street: '',
                                city: '',
                                country: '',
                                zip: ''
                            });

                            setView({
                                ...view,
                                addressForm: false
                            });

                            setInvalid({
                                path: {},
                                isValid: true
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
                        isValid: false
                    });
                });
            }
        }

        return;
    };

    const deleteAccount = async () => {
        const id = router.query.userAccount;

        const deleted = await deleteUser(id, { password: confirmPass });

        if (deleted.error) {
            dispatch(catchError(deleted.error));
        }

        if (deleted.message) {
            dispatch(catchWarning(deleted.message));
            dispatch(logout());
            dispatch(clearOrder());
            await localStorage.removeItem('token');
            router.push('/');
        }
    };

    const clickOutsideSettings = (event) => {
        if (!settingsRef.current.contains(event.target)) {
            setView({
                ...view,
                settings: false
            });
        }
    };

    useEffect(() => {
        if (view.settings) {
            document.addEventListener('click', clickOutsideSettings);
        }

        return () => {
            document.removeEventListener('click', clickOutsideSettings);
        }
    }, [view.settings]);

    useEffect(() => {
        if (user?.likes?.length) {
            catchLikedProducts(user.likes);
        } else {
            return;
        }
    }, [user]);

    useEffect(() => {
        if (order?.length) {
            setOrders(order);
        }
    }, [order]);

    useEffect(() => {
        if (token) {
            setLoged(true);
        }

        if (!token) {
            setLoged(false);
        }
    }, [token]);

    const addressInputChange = (target) => {
        const { name, value } = target;

        setAddressForm({
            ...addressForm,
            [name]: value
        });
    };

    return loged ? user && (
        <div className={styles.accountContainer}>
            <div className={styles.headerWrapper}>
                <div className={styles.greeting}>My account</div>
                {user?.admin && (
                    <div>Admin</div>
                )}
                <div className={styles.settingsWrapper} ref={settingsRef}>
                    <button 
                        className={styles.settingsBtn} 
                        onClick={() => setView({
                            ...view,
                            settings: !view.settings
                        })}
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
                                    settings: false
                                })}
                            >
                                Delete account
                            </div>
                        </div>
                    )}
                </div>
            </div>
            {view.agreeDeletion && (
                <div className={styles.agreeDeletionWrapper}>
                    <div className={styles.agree}>
                        <div>
                            When You delete account, all personal and order information will localStorage
                            forever. Agreed this, You confirm deletion of your account.
                        </div>
                        <div>
                            <button 
                                onClick={() => setView({
                                    ...view,
                                    confirmPassword: true
                                })}
                                className={styles.btns}
                            >
                                Agree
                            </button>
                            <button 
                                onClick={() => setView({
                                    ...view,
                                    agreeDeletion: false
                                })}
                                className={styles.btns}
                            >
                                Close
                            </button>
                        </div>
                        {view.confirmPassword && (
                        <div className={styles.confirm}>
                            <input 
                                className={styles.confirmInput}
                                name='confirmPass'
                                type='password'
                                value={confirmPass}
                                onChange={({ target }) => setConfirmPass(target.value)}
                                placeholder='Please enter your password'
                            />
                            <div>
                                <button 
                                    onClick={() => deleteAccount()}
                                    className={styles.btns}
                                >
                                    Confirm
                                </button>
                                <button 
                                    onClick={() => setView({
                                        ...view,
                                        agreeDeletion: false,
                                        confirmPassword: false
                                    })}
                                    className={styles.btns}
                                >
                                    Decline
                                </button>
                            </div>
                        </div>
                    )}
                    </div>
                </div>
            )}
            {view.addressForm && (
                <div className={styles.addressFormWrapper}>
                    <button
                        onClick={() => setView({
                            ...view,
                            addressForm: false
                        })}
                        className={styles.closeBtn}
                    >
                        <RiCloseLine />
                    </button>
                    <div className={styles.addressForm}>
                        <input
                            className={invalid.path.street ? 
                                `${styles.addressFormInput} ${styles.invalid}`
                                : `${styles.addressFormInput}`}
                            name="street"
                            value={addressForm.street}
                            onChange={({ target }) => addressInputChange(target)}
                            placeholder={invalid.path.street ? invalid.path.street : 'Enter street'}
                        />
                        <input
                            className={invalid.path.city ? 
                                `${styles.addressFormInput} ${styles.invalid}`
                                : `${styles.addressFormInput}`}
                            name="city"
                            value={addressForm.city}
                            onChange={({ target }) => addressInputChange(target)}
                            placeholder={invalid.path.city ? invalid.path.city : 'Enter city'}
                        />
                        <input
                            className={invalid.path.country ? 
                                `${styles.addressFormInput} ${styles.invalid}`
                                : `${styles.addressFormInput}`}
                            name="country"
                            value={addressForm.country}
                            onChange={({ target }) => addressInputChange(target)}
                            placeholder={invalid.path.country ? invalid.path.country : 'Choose country'}
                        />
                        <input
                            className={invalid.path.zip ? 
                                `${styles.addressFormInput} ${styles.invalid}`
                                : `${styles.addressFormInput}`}
                            name="zip"
                            value={addressForm.zip}
                            onChange={({ target }) => addressInputChange(target)}
                            placeholder={invalid.path.zip ? invalid.path.zip : 'Enter ZIP code'}
                        />
                    </div>
                    <button 
                        className={styles.btns}
                        onClick={() => updateInfo({ 
                            shippingAddress: addressForm 
                        })}
                    >
                        Confirm
                    </button>
                </div>
            )}
            <div className={styles.infoWrapper}>
                <div className={styles.userInfoWrapper}>
                    <div className={styles.userProfileHeader}>
                        <div className={styles.userPhotoWrapper}>
                            {user.photo ? 
                                user.photo : (
                                <RiUser3Line />
                            )}
                        </div>
                        <div className={styles.usernameWrapper}>{user.username}</div>
                    </div>
                    <div className={styles.userPhoneWrapper}>
                        {view.phoneChanging ? (
                            <>
                                <input 
                                    className={invalid.path.phone ? 
                                        `${styles.phoneInput} ${styles.invalid}` 
                                        : `${styles.phoneInput}`}
                                    name='phone'
                                    value={phone.phone}
                                    onChange={({ target }) => setPhone({ phone: target.value })}
                                    placeholder={invalid.path.phone ? invalid.path.phone : 'Enter your phone'}
                                />
                                <div
                                    onClick={() => updateInfo(phone)}
                                    className={styles.changeBtn}
                                >
                                    <RiCheckFill />
                                </div>
                                <div
                                    onClick={() => setView({
                                        ...view,
                                        phoneChanging: false
                                    })}
                                    className={styles.changeBtn}
                                >
                                    <RiCloseLine />
                                </div>
                            </>
                        ) : (
                            <>
                                <div>{user.phone}</div>
                                <button 
                                    onClick={() => setView({
                                        ...view,
                                        phoneChanging: true
                                    })}
                                    className={styles.changeBtn}
                                >
                                    <BsPencil />
                                </button>
                            </>
                        )}
                    </div>
                    <div className={styles.addressWrapper}>
                        {user.shippingAddress && Object.keys(user.shippingAddress).length ? (
                            <>
                                <div>
                                    <div className={styles.userAddressInfo}>
                                        {
                                        `${ user.shippingAddress.street }, ${ user.shippingAddress.city }, 
                                        ${ user.shippingAddress.country }, ${ user.shippingAddress.zip }`
                                        }
                                    </div>
                                </div>
                                <div>
                                    <button
                                        className={styles.btns}
                                        onClick={() => updateInfo({
                                            shippingAddress: {}
                                        })}
                                    >
                                        Clear
                                    </button>
                                    <button
                                        className={styles.btns}
                                        onClick={() => setView({
                                            ...view, 
                                            addressForm: true 
                                        })}
                                    >
                                        Change
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className={styles.createAddressWrapper}>
                                <div className={styles.descriptionWrapper}>
                                    <div>Do you want create autocomplete for shipping address?</div>
                                    <div
                                        onMouseEnter={() => setDescriptionHide(false)}
                                        onMouseLeave={() => setDescriptionHide(true)}
                                        onTouchStart={() => setDescriptionHide(false)}
                                        onTouchEnd={() => setDescriptionHide(true)}
                                        className={styles.descriptionOutput}
                                    >
                                        <b>i</b>
                                    </div>
                                    <div hidden={descriptionHide} className={styles.description}>
                                        That information need for autocomplete your shipping address,
                                        when you buying somthing. It`s saves Your time, and do orders 
                                        more easy and fast to fill.
                                    </div>
                                </div>
                                <button 
                                    className={styles.btns}
                                    onClick={() => setView({
                                        ...view,
                                        addressForm: true
                                    })}
                                >
                                    Add address
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                <div className={styles.subInfoWrapper}>
                    <div className={styles.inBucket}>
                            <div 
                                onClick={() => setView({
                                    ...view,
                                    inBucket: !view.inBucket
                                })}
                                className={styles.itemsHeader}
                            >
                                Stuff in bucket
                            </div>
                            <div 
                                style={{
                                    display: view.inBucket ? 'flex' : 'none'
                                }} 
                                className={styles.itemsWrapper}
                            >
                                {ordersInBucket ? ordersInBucket.map(product => (
                                    <div 
                                    key={product._id} 
                                    className={styles.items}
                                    onClick={() => router.push(`/shop/${product._id}`)}
                                >
                                    <div className={styles.imageWrapper}>
                                        {product.imgUrl && (
                                            <Image 
                                                src={product.imgUrl}
                                                alt={product.name}
                                                width={product.width ? `${product.width}px` : '150px'}
                                                height={product.height ? `${product.height}px` : '130px'}
                                            />
                                        )}
                                    </div>
                                    <div>{product.name}</div>
                                    <div>${product.price}</div>
                                </div>
                                )) : (
                                    <div>Your shopping cart is empty</div>
                                )}
                            </div>
                    </div>
                    <div className={styles.likes}>
                        <div 
                            onClick={() => setView({
                                ...view,
                                likes: !view.likes
                            })}
                            className={styles.itemsHeader}
                        >
                            Your liked stuff
                        </div>
                        <div style={{ display: view.likes ? 'flex' : 'none' }} className={styles.itemsWrapper}>
                            {likes ? likes.map(product => (
                                <div 
                                    key={product._id} 
                                    className={styles.items}
                                    onClick={() => router.push(`/shop/${product._id}`)}
                                >
                                    <div className={styles.imageWrapper}>
                                        {product.imgUrl && (
                                            <Image 
                                                src={product.imgUrl}
                                                alt={product.name}
                                                width={product.width ? `${product.width}px` : '150px'}
                                                height={product.height ? `${product.height}px` : '130px'}
                                            />
                                        )}
                                    </div>
                                    <div>{product.name}</div>
                                    <div>${product.price}</div>
                                </div>
                            )) : (
                                <div>You didn`t liked anything yet</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    ) : (
        <LoginPage />
    );
};

export default AccountPage;
