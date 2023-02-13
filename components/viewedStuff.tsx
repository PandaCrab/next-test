import Image from 'next/image';
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';

import type { AccountViews, Stuff } from '../types/types';

import styles from '../styles/viewedStuff.module.scss';
import { takeSomeProducts } from '../pages/api/api';
import { useClickOutside } from '../hooks';

interface Props {
    view: AccountViews;
    setView: React.Dispatch<React.SetStateAction<AccountViews>>;
};

const ViewedStuff: React.FC<Props> = ({ view, setView }) => {
    const [stuff, setStuff] = useState<Stuff[] | null>(null);
    const [animation, setAnimation] = useState<boolean>(false);

    const router = useRouter();

    const ref: React.MutableRefObject<HTMLDivElement> | null = useRef(null);

    const dropdownStyles = `
        ${styles.itemsWrapper}
        ${animation && (view.viewedStuff ? styles.openDropdown : styles.closeDropdown)}
    `;

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

    useClickOutside(ref, view.viewedStuff, () => setView({ ...view, viewedStuff: false }));

    useEffect(() => {
        const stuffIds = JSON.parse(sessionStorage.getItem('viewed'));

        if (stuffIds && stuffIds.length) {
            catchViewedStuff(stuffIds);
        }
    }, []);

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

export default ViewedStuff;
