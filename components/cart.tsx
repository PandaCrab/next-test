import React from 'react';
import { useSelector } from 'react-redux';
import { BsCart } from 'react-icons/bs';
import { useRouter } from 'next/router';

import type { Stuff } from '../types/types';

import styles from '../styles/Cart.module.scss';

const Cart = () => {
    const ordered = useSelector((state: { order: { clientOrder: Stuff[] } }) => state.order.clientOrder);
    const route = useRouter();

    return (
        <div
            className={styles.cartContainer}
            onClick={() => route.push('/cartPage')}
        >
            <div className={styles.cart}>
                <BsCart />
            </div>
            {ordered && ordered.length ? <div className={styles.badge}>{ordered.length}</div> : null}
        </div>
    );
};

export default Cart;