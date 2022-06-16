import React from 'react';
import { useSelector } from 'react-redux';
import { BsCart } from 'react-icons/bs';

import Link from 'next/link';
import styles from '../styles/Cart.module.scss';

const Cart = () => {
    const ordered = useSelector(state => state.order.clientOrder);

    return (
        <Link href='/cartPage'>
            <div className={styles.cartContainer}>
                <div calssName={styles.cart}><BsCart /></div>
                { ordered && ordered.length ? (
                    <div className={styles.badge}>{ordered.length}</div>
                ) : null }
            </div>
        </Link>
    );
};

export default Cart;
