import Image from 'next/image';
import PropTypes from 'prop-types';
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';

import type { Stuff } from '../types/types';

import styles from '../styles/StuffInBucket.module.scss';

const StuffinBucket = ({ view, setView }) => {
    const [ordersInBucket, setOrders] = useState<Stuff[]>();
    const [animation, setAnimation] = useState<boolean>(false);

    const router = useRouter();

    const order = useSelector((state: { order: { clientOrder: Stuff[] } }) => state.order.clientOrder);

    const ref: React.MutableRefObject<HTMLDivElement> | null = useRef(null);

    const dropdownStyles = animation ? (view.inBucket ?
        `${styles.itemsWrapper} ${styles.openDropdown}`
        : `${styles.itemsWrapper} ${styles.closeDropdown}`
        ) : `${styles.itemsWrapper}`;

    const toggleDropdown = () => {
        setAnimation(true);

        setView((prev) => ({
            ...prev,
            inBucket: !prev.inBucket
        }));
    };

    const animationEndHandler = ({ animationName }) => {
        if (animationName === 'open-dropdown') {
            setView({
                ...view,
                inBucket: true
            });
            setAnimation(true);
        }

        if (animationName === 'close-dropdown') {
            setView({
                ...view,
                inBucket: false
            });
            setAnimation(false);
        }
    };

    const clickOutside = (event) => {
        if (ref.current && !ref.current.contains(event.target)) {
            setView({
                ...view,
                inBucket: false
            });
        }
    }

    useEffect(() => {
        if (view.inBucket) {
            document.addEventListener('mousedown', clickOutside);
        }

        return () => document.removeEventListener('mousedown', clickOutside);
    }, [view]);

    useEffect(() => {
        if (order?.length) {
            setOrders(order);
        }
    }, [order]);

    return (
        <div className={styles.inBucket} ref={ref}>
            <div
                onClick={() => toggleDropdown()}
                className={styles.itemsHeader}
            >
                Stuff in bucket
            </div>
            <div
                className={dropdownStyles}
                onAnimationEnd={(event) => animationEndHandler(event)}
            >
                {ordersInBucket ? (
                    ordersInBucket.map((product) => (
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
                    <div>Your bucket is empty</div>
                )}
            </div>
        </div>
    );
};

StuffinBucket.propTypes = {
    view: PropTypes.object,
    setView: PropTypes.func,
};

export default StuffinBucket;
