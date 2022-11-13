import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { inOrder, deleteItem } from '../redux/ducks/order';

import type { Stuff } from '../types/types';

import styles from '../styles/QuantityReiser.module.scss';

interface Props {
    product: Stuff;
};

const QuantityReiser: React.FC<Props> = ({ product }) => {
    const clientOrder = useSelector((state: { order: { clientOrder: Stuff[] } }) => state.order.clientOrder);
    const dispatch = useDispatch();

    const pushToOrder = (stuff) => {
        const idInOrder = clientOrder.length;
        const { _id } = stuff;

        dispatch(
            inOrder({
                id: idInOrder,
                _id,
            }),
        );
    };

    const removeFromOrder = (id) => {
        const itemToRemove = clientOrder.filter(item => item._id === id).pop();

        dispatch(deleteItem(itemToRemove));
    };

    const disableDecreaseBtn = (id) => {
        const itemQuantity = clientOrder.filter(item => item._id === id).length;

        if (itemQuantity <= 1) {
            return true;
        }

        if (itemQuantity > 1) {
            return false;
        }
    };

    const disableIncreaseBtn = (product) => {
        const { _id, quantity } = product;
        const quantityInOrder = clientOrder.filter(item => item._id === _id).length;

        if (quantityInOrder === quantity) {
            return true;
        }

        if (quantityInOrder <= quantity) {
            return false
        }
    }

    const orderedQuantity = (productId) => clientOrder.filter(product => product._id === productId).length;

    return (
        <div className={styles.quantityRaiser}>
            <button 
                className={styles.minus}
                disabled={disableDecreaseBtn(product._id)}
                onClick={() => removeFromOrder(product._id)}
            >
                -
            </button>
            <div className={styles.quantity}>{orderedQuantity(product._id)}</div>
            <button 
                className={styles.plus}
                disabled={disableIncreaseBtn(product)}
                onClick={() => pushToOrder(product)}
            >
                +
            </button>
        </div>
    )
};

export default QuantityReiser;
