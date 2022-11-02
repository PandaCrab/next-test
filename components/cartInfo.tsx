import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';

import { ProductCard } from '.';

import type { Stuff } from '../types/types';

import styles from '../styles/CartInfo.module.scss';
import { takeSomeProducts } from '../pages/api/api';

const CartInfo = ({ ref, state, setState, animation, setAnimation }) => {
    const [stuff, setStuff] = useState<Stuff[] | null>(null);

    const router = useRouter();
    const cart = useSelector((state: {
            order: { 
                clientOrder: Array<{id: string; _id: string}> 
            }
        }) => state.order.clientOrder
    );

    const cartContainerStyle = `${styles.cartContainer} ${animation && (state ? styles.open : styles.close)}`;

    const animationEndHandler = ({ animationName }) => {
        if (animationName === 'open-cart') {
            setState(true);
            setAnimation(true);
        }

        if (animationName === 'close-cart') {
            setState(false);
            setAnimation(false);
        }
    };

    const takeOrderedStuff = async () => {
        let arrayIds: { _id: string }[] = [];

        cart.forEach(product => arrayIds.push({ _id: product._id }));

        if (arrayIds.length === cart.length) {
            const orderedStuff = await takeSomeProducts(arrayIds);

            if (orderedStuff) {
                setStuff(orderedStuff);
            }
        }
    }

    useEffect(() => {
        if (cart.length) {
            takeOrderedStuff();
        }
    }, [cart]);

    return (
        <div 
            className={cartContainerStyle}
            onAnimationEnd={(event) => animationEndHandler(event)}
            ref={ref}
        >
            <div className={styles.productWrapper}>
                {stuff && stuff.map((stuff: Stuff, index: number) => (
                    <ProductCard
                        key={index}
                        product={stuff}
                    />
                ))}
            </div>
            {stuff && stuff.length ? (
                <button
                    className={styles.orderButton}
                    onClick={() => router.push(`/order/${Math.floor(Math.random() * 10000000)}`)}
                >
                    Create order
                </button>
            ) : (
                <>
                    <div className={styles.emptyCart}>
                        Your cart don`t have any stuff
                        <Link href="/shop">
                            <a>Buy somhting</a>
                        </Link>
                    </div>
                </>
            )}
        </div>
    );
};

export default CartInfo;
