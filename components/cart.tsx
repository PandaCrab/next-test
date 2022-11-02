import React, { useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { BsCart } from 'react-icons/bs';

import type { Stuff } from '../types/types';

import styles from '../styles/Cart.module.scss';
import { useClickOutside } from '../hooks';
import CartInfo from './cartInfo';

const Cart = () => {
    const [open, setOpen] = useState<boolean>(false);
    const [animation, setAnimation] = useState<boolean>(false);

    const ordered = useSelector((state: { order: { clientOrder: Stuff[] } }) => state.order.clientOrder);

    const ref: React.MutableRefObject<HTMLDivElement> | null = useRef(null);

    useClickOutside(ref, open, () => setOpen(false));

    const toggleCartInfo = () => {
        setAnimation(true);

        setOpen(!open);
    }

    return (
        <div
            className={styles.cartContainer}
            ref={ref}
        >
            <div className={styles.cart} onClick={() => toggleCartInfo()}>
                <BsCart />
            </div>
            {ordered && ordered.length ? <div className={styles.badge}>{ordered.length}</div> : null}
            <CartInfo
                state={open}
                setState={setOpen}
                animation={animation}
                setAnimation={setAnimation}
                ref={ref}
            />
        </div>
    );
};

export default Cart;
