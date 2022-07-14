import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { BsCart } from 'react-icons/bs';
import Image from 'next/image';

import { postProduct } from './api/api';
import LoginPage from './login';

import styles from '../styles/Admin.module.scss';

const AdminPage = () => {
    const [dropdown, setDropdown] = useState(false);
    const [addProduct, setProduct] = useState({
        name: '',
        price: '',
        imgUrl: '',
        color: '',
        quantity: '',
        width: '',
        height: ''
    });
    const [permission, setPermission] = useState(false);
    const [loged, setloged] = useState(false);

    const user = useSelector(state => state.user)

    useEffect(() => {
        if (user.info?.admin) {
            setPermission(true);
        }

        if (!user.info?.admin) {
            setPermission(false);
        }
    }, [user.info?.admin]);

    useEffect(() => {
        if (user.token) {
            setloged(true);
        }

        if (!user.token) {
            setloged(false);
        }
    }, [user?.token]);

    const router = useRouter();

    return (
        <div className={styles.adminPageContainer}>
            { !loged ? (
                <div className={styles.logFormWrapper}>
                    <LoginPage />
                </div>
            ) : loged && permission ? (
                <>
                <div className={styles.welcomWrapper}>
                    <div>Hello in admin panel</div>
                    <button className={styles.homeBtn} onClick={() => router.push('/')}>Home</button>
                </div>
                <div className={styles.adminPanel}>
                    <div className={styles.adminPanelHeader}>
                        <div onClick={() => setDropdown(!dropdown)} className={styles.menuButton}>Add product</div>
                    </div>
                    {dropdown ? (
                        <div className={styles.addProductForm}>
                            <form className={styles.formWrapper} onSubmit={() => postProduct(addProduct)}>
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
                                <input
                                    id="width"
                                    className={styles.addProductInput}
                                    name="width"
                                    placeholder="Enter width of product image"
                                    value={addProduct.width}
                                    onChange={({target}) => setProduct({
                                        ...addProduct,
                                        width: target.value
                                    })}
                                />
                                <input
                                    id="height"
                                    className={styles.addProductInput}
                                    name="height"
                                    placeholder="Enter height of product image"
                                    value={addProduct.height}
                                    onChange={({target}) => setProduct({
                                        ...addProduct,
                                        height: target.value
                                    })}
                                />
                                <button type="submit" className={styles.submitButton}>
                                    Add product
                                </button>
                            </form>
                            <div className={styles.previewCard}>
                                <div 
                                    className={styles.productCard} 
                                    key={ addProduct.id }>
                                    <div className={styles.cardContentWrapper}>
                                        { addProduct.imgUrl && <Image 
                                            src={addProduct.imgUrl} 
                                            alt={addProduct.name}
                                            width={addProduct.width ? `${addProduct.width}px` : '100px'}
                                            height={addProduct.height ? `${addProduct.height}px` : '100px'} />
                                        }
                                        <div className={styles.cardInfo}>
                                            <div className={styles.stuffTitle}>
                                                { addProduct.name }
                                            </div>
                                            <div className={styles.stuffColor}>{ addProduct.color }</div>
                                            <div className={styles.stuffPrice}>${ addProduct.price }</div>
                                        </div>
                                    </div>
                                    <div className={styles.cardButtons}>
                                        <button 
                                            onClick={() => dispatch(inOrder(addProduct))}
                                            className={styles.cartButton}>
                                            <BsCart />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : null}
                </div>
                </>
            ) : (
                <div>You don&rsquo;t have the permission for this page</div>
            )}
        </div>
    );
};

export default AdminPage;