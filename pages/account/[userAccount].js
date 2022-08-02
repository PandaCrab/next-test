import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { RiUser3Line, RiCloseLine, RiCheckFill } from 'react-icons/ri';
import { BsPencil } from 'react-icons/bs';

import { takeSomeProducts, updateUserInfo } from '../api/api';
import { getInfo } from '../../redux/ducks/user';
import { catchSuccess, catchError } from '../../redux/ducks/alerts';
import LoginPage from '../login';

import styles from '../../styles/AccountPage.module.scss';

const AccountPage = () => {
    const [loged, setLoged] = useState(false);
    const [descriptionHide, setDescriptionHide] = useState(true);

    const [likes, setLikes] = useState();
    const [ordersInBucket, setOrders] = useState();

    const [view, setView] = useState({
        inBucket: false,
        likes: false,
        addressForm: false,
        phoneChanging: false
    });
    const [phone, setPhone] = useState({ phone: '' })
    const [addressForm, setaddressForm] = useState({
        street: '',
        city: '',
        country: '',
        zip: ''
    });

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
    
    const confirmUpdates = async (info) => {
        const id = router.query.userAccount;
        if (info) {
            const feedback = await updateUserInfo(id, info)

            if (feedback.message) {
                dispatch(catchSuccess(feedback.message));
                dispatch(getInfo(feedback.updated));

                if (info.phone) {
                    setPhone({ phone: '' });
                    setView({
                        ...view,
                        phoneChanging: false
                    });
                }

                if (info === addressForm) {
                    setaddressForm({
                        street: '',
                        city: '',
                        country: '',
                        zip: ''
                    });
                    setView({
                        ...view,
                        addressForm: false
                    });
                }
            }

            if (feedback.error) {
                dispatch(catchError(feedback.error))
            }
        }

        return;
    };

    useEffect(() => {
        if (user?.likes?.length) {
            catchLikedProducts(user.likes)
        } else {
            return
        }
    }, [user]);

    useEffect(() => {
        if (order?.length) {
            setOrders(order)
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

        setaddressForm({
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
            </div>
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
                                    className={styles.phoneInput}
                                    name='phone'
                                    value={phone.phone}
                                    onChange={({ target }) => setPhone({ phone: target.value })}
                                />
                                <div
                                    onClick={() => confirmUpdates(phone)}
                                    className={styles.changePhoneBtn}
                                >
                                    <RiCheckFill />
                                </div>
                                <div
                                    onClick={() => setView({
                                        ...view,
                                        phoneChanging: false
                                    })}
                                    className={styles.changePhoneBtn}
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
                                    className={styles.changePhoneBtn}
                                ><BsPencil /></button>
                            </>
                        )}
                    </div>
                    <div className={styles.addressWrapper}>
                        {user.shippingAddress ? (
                            <>
                                <div>
                                    <div className={styles.addressItems}>{user.shippingAddress.street}</div>
                                    <div className={styles.addressItems}>{user.shippingAddress.city}</div>
                                    <div className={styles.addressItems}>{user.shippingAddress.country}</div>
                                    <div className={styles.addressItems}>{user.shippingAddress.zip}</div>
                                </div>
                                <div>
                                    <button>Clear</button>
                                    <button>Change</button>
                                </div>
                            </>
                        ) : (
                            <>
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
                                    <button onClick={() => setView({
                                        ...view,
                                        addressForm: true
                                    })}>
                                        Add address
                                    </button>
                                </div>
                                <div 
                                    style={{ display: view.addressForm ? 'flex' : 'none' }} 
                                    className={styles.addressFormWrapper}
                                >
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
                                            className={styles.addressFormInput}
                                            name="street"
                                            value={addressForm.street}
                                            onChange={({ target }) => addressInputChange(target)}
                                            placeholder={!addressForm.street && 'Enter street'}
                                        />
                                        <input
                                            className={styles.addressFormInput}
                                            name="city"
                                            value={addressForm.city}
                                            onChange={({ target }) => addressInputChange(target)}
                                            placeholder={!addressForm.city && 'Enter city'}
                                        />
                                        <input
                                            className={styles.addressFormInput}
                                            name="country"
                                            value={addressForm.country}
                                            onChange={({ target }) => addressInputChange(target)}
                                            placeholder={!addressForm.country && 'Choose country'}
                                        />
                                        <input
                                            className={styles.addressFormInput}
                                            name="zip"
                                            value={addressForm.zip}
                                            onChange={({ target }) => addressInputChange(target)}
                                            placeholder={!addressForm.zip && 'Enter ZIP code'}
                                        />
                                    </div>
                                    <button 
                                        onClick={() => confirmUpdates({ 
                                            shippingAddress: addressForm 
                                        })}
                                    >
                                        Confirm
                                    </button>
                                </div>
                            </>
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
                                    <div>Your bucket is empty</div>
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
