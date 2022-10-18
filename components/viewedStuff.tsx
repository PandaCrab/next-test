import Image from 'next/image';
import PropTypes from 'prop-types';
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';

import type { Stuff } from '../types/types';

import styles from '../styles/viewedStuff.module.scss';
import { takeSomeProducts } from '../pages/api/api';

const ViewedStuff = ({ view, setView }) => {
    const [stuff, setStuff] = useState<Stuff[] | null>(null);
    const [animation, setAnimation] = useState<boolean>(false);

    const router = useRouter();

    const ref: React.MutableRefObject<HTMLDivElement> | null = useRef(null);

    const dropdownStyles = animation ? (view.viewedStuff ?
        `${styles.itemsWrapper} ${styles.openDropdown}`
        : `${styles.itemsWrapper} ${styles.closeDropdown}`
        ) : `${styles.itemsWrapper}`;

    const catchViewedStuff = async (ids) => {
        const viewedStuff = await takeSomeProducts(ids);

        if (viewedStuff) {
            setStuff(viewedStuff)
        }
    }

    const toggleDropdown = () => {
        setAnimation(true);

        setView((prev) => ({
            ...prev,
            viewedStuff: !prev.viewedStuff
        }));
    };

    const animationEndHandler = ({ animationName }) => {
        if (animationName === 'open-dropdown') {
            setView({
                ...view,
                viewedStuff: true
            });
            setAnimation(true);
        }

        if (animationName === 'close-dropdown') {
            setView({
                ...view,
                viewedStuff: false
            });
            setAnimation(false);
        }
    };

    const clickOutside = (event) => {
        if (ref.current && !ref.current.contains(event.target)) {
            setView({
                ...view,
                viewedStuff: false
            });
        }
    }

    useEffect(() => {
        const stuffIds = JSON.parse(sessionStorage.getItem('viewed'));

        if (stuffIds && stuffIds.length) {
            catchViewedStuff(stuffIds);
        }
    }, []);

    useEffect(() => {
        if (view.viewedStuff) {
            document.addEventListener('mousedown', clickOutside);
        }

        return () => document.removeEventListener('mousedown', clickOutside);
    }, [view]);

    return (
        <div className={styles.viewedStuff} ref={ref}>
            <div
                onClick={() => toggleDropdown()}
                className={styles.itemsHeader}
            >
                Viewed products
            </div>
            <div
                className={dropdownStyles}
                onAnimationEnd={(event) => animationEndHandler(event)}
            >
                {stuff ? (
                    stuff.map((product) => (
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
                    ))
                ) : (
                    <div>You didn't view any product</div>
                )}
            </div>
        </div>
    );
};

ViewedStuff.propTypes = {
    view: PropTypes.object,
    setView: PropTypes.func,
};

export default ViewedStuff;
