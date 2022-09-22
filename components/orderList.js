import Image from 'next/image';
import React from 'react';
import { useSelector } from 'react-redux';

import styles from '../styles/OrderList.module.scss';

const OrderList = () => {
    const clientOrder = useSelector((state) => state.order.clientOrder);

    return clientOrder.length ? (
        <div className={styles.stuffWrapper}>
            {clientOrder.length
                && clientOrder.map((stuff) => (
                    <div
                        className={styles.productCard}
                        key={stuff._id}
                    >
                        <div className={styles.cardContentWrapper}>
                            <Image
                                src={stuff.imgUrl}
                                alt={stuff.name}
                                width={stuff.width ? `${stuff.width}px` : '150px'}
                                height={stuff.height ? `${stuff.height}px` : '200px'}
                            />
                            <div className={styles.cardInfo}>
                                <div className={styles.stuffTitle}>{stuff.name}</div>
                                <div className={styles.stuffColor}>{stuff.color}</div>
                                <div className={styles.stuffPrice}>${stuff.price}</div>
                            </div>
                        </div>
                    </div>
                ))}
        </div>
    ) : null;
};

export default OrderList;
