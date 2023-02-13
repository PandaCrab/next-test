import React, { useState, useRef } from 'react';
import { RiCheckFill, RiCloseLine } from 'react-icons/ri';
import { BsPencil } from 'react-icons/bs';
import { useSelector } from 'react-redux';

import LikedProducts from './likedProducts';
import ViewedStuff from './viewedStuff';
import Avatar from './Avatar';
import ErrorTooltip from './errorTooltip';
import { useClickOutside } from '../hooks';

import type { AccountViews, AddressInfo, InvalidAddressForm, userObject } from '../types/types';

import styles from '../styles/UserInfoSection.module.scss';

interface Props {
    updateInfo: (
        arg0: { shippingAddress: AddressInfo | {} } | { phone: string },
        arg1?: React.Dispatch<React.SetStateAction<string>>
    ) => void;
    view: AccountViews;
    setView: React.Dispatch<React.SetStateAction<AccountViews>>;
    invalid: InvalidAddressForm;
    setInvalid: React.Dispatch<React.SetStateAction<InvalidAddressForm>>;
};

const UserInfoSection: React.FC<Props> = ({
    updateInfo, view, setView, invalid, setInvalid
}) => {
    const [descriptionHide, setDescriptionHide] = useState<boolean>(true);
    const [phone, setPhone] = useState<string>('');

    const user = useSelector((state: { user: userObject }) => state.user.info);

    const ref: React.MutableRefObject<HTMLDivElement> | null = useRef(null);

    const phoneChangeHandler = ({ target }) => {
        setPhone(target.value);

        setInvalid({
            ...invalid,
            path: {
                ...invalid.path,
                phone: ''
            }
        });
    };

    const closePhoneChanging = () => {
        setView({
            ...view,
            phoneChanging: false
        });

        setPhone('');

        setInvalid({
            ...invalid,
            path: {
                ...invalid.path,
                phone: ''
            }
        });
    };

    useClickOutside(ref, view.phoneChanging, closePhoneChanging);

    return (
        <div className={styles.infoWrapper}>
            <div className={styles.userInfoWrapper}>
                <div className={styles.userProfileHeader}>
                    <Avatar />
                    <div className={styles.usernameWrapper}>{user.username}</div>
                </div>
                <div className={styles.userPhoneWrapper} ref={ref}>
                    {view.phoneChanging ? (
                        <>
                            <div className={styles.inputWrapper}>
                                <input
                                    className={
                                        invalid.path?.phone
                                            ? `${styles.phoneInput} ${styles.invalid}`
                                            : `${styles.phoneInput}`
                                    }
                                    name="phone"
                                    value={phone}
                                    onChange={(event) => phoneChangeHandler(event)}
                                    placeholder="Enter your phone"
                                />
                                {invalid.path?.phone && (
                                    <ErrorTooltip message={invalid.path?.phone} />
                                )}
                            </div>
                            <div
                                onClick={() => updateInfo({ phone }, setPhone)}
                                className={styles.changeBtn}
                            >
                                <RiCheckFill />
                            </div>
                            <div
                                onClick={() => closePhoneChanging()}
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
                                    {`${user.shippingAddress.street}, `}
                                    {`${user.shippingAddress.city}`}<br/>
                                    {`${user.shippingAddress.country}, `}
                                    {`${user.shippingAddress.zip}`}
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
                <ViewedStuff
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

export default UserInfoSection;
