import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';

import { ProductCard } from '../components';

import type { Stuff } from '../types/types';

import styles from '../styles/CartPage.module.scss';

const CartPage = () => {
    const router = useRouter();
    const cart: Array<object> = useSelector((state: {order: { clientOrder: Array<object> }}) => state.order.clientOrder);

    return (
        <div className={styles.cartContainer}>
            <div className={styles.productWrapper}>
                {cart.length && cart.map((stuff: Stuff, index: number) => (
                    <ProductCard
                        key={index}
                        product={stuff}
                    />
                ))}
            </div>
            {cart.length ? (
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

export default CartPage;
