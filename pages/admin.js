import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';

import { data$, postProduct } from './api/api';
import { storeStuff } from '../redux/ducks/stuff';

import styles from '../styles/Admin.module.scss';

const AdminPage = () => {
    const [dropdown, setDropdown] = useState(false);
    const [addProduct, setProduct] = useState({
        id: '',
        name: '',
        price: 0,
        imgUrl: '',
        color: '',
        quantity: 0
    });
    
    const select = useSelector(state => state.order.stuff)
    const dispatch = useDispatch()
    
    useEffect(() => {
        data$ && data$.subscribe({
            next: result => {
                dispatch(storeStuff(result.data));
            },
            complete: () => {
                console.log('data compare');
            }
        });
        data$.unsubscribe;
        setProduct({
            ...addProduct,
            id: (select.length + 1)
        });
    }, []);

    const router = useRouter();

    return (
        <div className={styles.adminPageContainer}>
            <div className={styles.welcomWrapper}>
                <div>Hello in admin panel</div>
                <button onClick={() => router.push('/')}>Home</button>
            </div>
            <div className={styles.adminPanel}>
                <div className={styles.adminPanelHeader}>
                    <div onClick={() => setDropdown(!dropdown)} className={styles.menuButton}>Add product</div>
                </div>
                {dropdown ? (
                    <div className={styles.addProductForm}>
                        <form onSubmit={() => postProduct(addProduct)}>
                            <input
                                id="id"
                                className={styles.addProductInput}
                                name="id"
                                value={addProduct.id}
                                onChange={({target}) => setProduct({
                                    ...addProduct,
                                    id: target.value
                                })}
                            />
                            <input
                                id="name"
                                className={styles.addProductInput}
                                name="name"
                                placeholder="Name of product"
                                value={addProduct.name}
                                onChange={({target}) => setProduct({
                                    ...addProduct,
                                    name: target.value
                                })}
                            />
                            <input
                                id="price"
                                className={styles.addProductInput}
                                name="price"
                                placeholder="Enter product price"
                                value={addProduct.price}
                                onChange={({target}) => setProduct({
                                    ...addProduct,
                                    price: target.value
                                })}
                            />
                            <input
                                id="imgUrl"
                                className={styles.addProductInput}
                                name="imgUrl"
                                placeholder="Image path"
                                value={addProduct.imgUrl}
                                onChange={({target}) => setProduct({
                                    ...addProduct,
                                    imgUrl: target.value
                                })}
                            />
                            <input
                                id="color"
                                className={styles.addProductInput}
                                name="color"
                                placeholder="Enter product color (optional)"
                                value={addProduct.color}
                                onChange={({target}) => setProduct({
                                    ...addProduct,
                                    color: target.value
                                })}
                            />
                            <input
                                id="quantity"
                                className={styles.addProductInput}
                                name="quantity"
                                placeholder="Enter quantity of available products"
                                value={addProduct.quantity}
                                onChange={({target}) => setProduct({
                                    ...addProduct,
                                    quantity: target.value
                                })}
                            />
                            <button type="submit" className={styles.submitButton}>
                                Add product
                            </button>
                        </form>
                    </div>
                ) : null}
            </div>
        </div>
    )
};

export default AdminPage;