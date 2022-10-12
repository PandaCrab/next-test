import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { RiCheckFill, RiCloseLine } from 'react-icons/ri';
import { BsPencil } from 'react-icons/bs';
import { useSelector } from 'react-redux';

import LikedProducts from './likedProducts';
import StuffInBucket from './stuffInBucket';
import Avatar from './Avatar';

import type { userObject } from '../types/types';

import styles from '../styles/UserInfoSection.module.scss';

const UserInfoSection = ({
    updateInfo, view, setView, invalid,
}) => {
    const [descriptionHide, setDescriptionHide] = useState<boolean>(true);

    const [phone, setPhone] = useState<{ phone: string }>({ phone: '' });

    const user = useSelector((state: { user: userObject }) => state.user.info);

    return (
        <div className={styles.infoWrapper}>
            <div className={styles.userInfoWrapper}>
                <div className={styles.userProfileHeader}>
                    <Avatar />
                    {/* <div className={styles.userPhotoWrapper}>{user.photo ? user.photo : <RiUser3Line />}</div> */}
                    <div className={styles.usernameWrapper}>{user.username}</div>
                </div>
                <div className={styles.userPhoneWrapper}>
                    {view.phoneChanging ? (
                        <>
                            <input
                                className={
                                    invalid.path?.phone
                                        ? `${styles.phoneInput} ${styles.invalid}`
                                        : `${styles.phoneInput}`
                                }
                                name="phone"
                                value={phone.phone}
                                onChange={({ target }) => setPhone({ phone: target.value })}
                                placeholder={invalid.path?.phone ? invalid.path?.phone : 'Enter your phone'}
                            />
                            <div
                                onClick={() => updateInfo(phone, setPhone)}
                                className={styles.changeBtn}
                            >
                                <RiCheckFill />
                            </div>
                            <div
                                onClick={() => setView({
                                    ...view,
                                    phoneChanging: false,
                                })
                                }
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
                                    phoneChanging: true,
                                })
                                }
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
                                    {`${user.shippingAddress.street}, ${user.shippingAddress.city}, 
                                        ${user.shippingAddress.country}, ${user.shippingAddress.zip}`}
                                </div>
                            </div>
                            <div>
                                <button
                                    className="btns"
                                    onClick={() => updateInfo({
                                        shippingAddress: {},
                                    })
                                    }
                                >
                                    Clear
                                </button>
                                <button
                                    className="btns"
                                    onClick={() => setView({
                                        ...view,
                                        addressForm: true,
                                    })
                                    }
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
                                <div
                                    hidden={descriptionHide}
                                    className={styles.description}
                                >
                                    That information need for autocomplete your shipping address, when you buying
                                    somthing. It`s saves Your time, and do orders more easy and fast to fill.
                                </div>
                            </div>
                            <button
                                className="btns"
                                onClick={() => setView({
                                    ...view,
                                    addressForm: true,
                                })
                                }
                            >
                                Add address
                            </button>
                        </div>
                    )}
                </div>
            </div>
            <div className={styles.subInfoWrapper}>
                <StuffInBucket
                    view={view}
                    setView={setView}
                />
                <LikedProducts
                    view={view}
                    setView={setView}
                />
            </div>
        </div>
    );
};

UserInfoSection.propTypes = {
    view: PropTypes.object,
    setView: PropTypes.func,
    updateInfo: PropTypes.func,
    invalid: PropTypes.object,
};

export default UserInfoSection;
