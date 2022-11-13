import Link from 'next/link';
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';

import { ProductCard } from '.';
import { takeSomeProducts } from '../pages/api/api';

import type { Stuff } from '../types/types';

import styles from '../styles/CartInfo.module.scss';

interface Props {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    animation: boolean;
    setAnimation: React.Dispatch<React.SetStateAction<boolean>>
}

const CartInfo: React.FC<Props> = ({ open, setOpen, animation, setAnimation }) => {
    const [stuff, setStuff] = useState<Stuff[] | null>(null);

    const router = useRouter();
    const cart = useSelector((state: {
            order: { clientOrder: Array<{id: string; _id: string}> }
        }) => state.order.clientOrder
    );

    const cartContainerStyle = `${styles.cartContainer} ${animation && (open ? styles.open : styles.close)}`;

    const animationEndHandler = ({ animationName }) => {
        if (animationName === 'open-cart') {
            setOpen(true);
            setAnimation(true);
        }

        if (animationName === 'close-cart') {
            setOpen(false);
            setAnimation(false);
        }
    };

    const calculateTotal = (array) => {
        let total = 0;
        
        if (array.length) {
            array.forEach(product => total += product.price * (cart.filter(({ _id }) => _id === product._id).length));
        }

        return total.toFixed(2);
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

    const createOrderHandler = () => {
        setOpen(false);
        router.push(`/order/${Math.floor(Math.random() * 10000000000)}`);
    };

    useEffect(() => {
        if (cart.length) {
            takeOrderedStuff();
        }
    }, [cart]);

    return open && (
        <div 
            className={cartContainerStyle}
            onAnimationEnd={(event) => animationEndHandler(event)}
        >
            {cart.length && stuff && stuff.length ? (
                <>
                    <div className={styles.productWrapper}>
                        {stuff && stuff.map((stuff: Stuff, index: number) => (
                            <ProductCard
                                key={index}
                                product={stuff}
                                inOrder
                            />
                        ))}
                    </div>

                    <div className={styles.totalPrice}>
                        <div className={styles.label}>Total:</div>
                        <div className={styles.total}>${calculateTotal(stuff)}</div>
                    </div>

                    <button
                        className={styles.orderButton}
                        onClick={() => createOrderHandler()}
                    >
                        Create order
                    </button>
                </>
            ) : (
                <>
                    <div className={styles.emptyCart}>
                        Your cart don`t have any stuff
                        <Link href="/shop">
                            <a onClick={() => setOpen(false)}>Buy somhting</a>
                        </Link>
                    </div>
                </>
            )}
        </div>
    );
};

export default CartInfo;
