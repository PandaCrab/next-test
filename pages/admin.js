import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { BsCart } from 'react-icons/bs';
import Image from 'next/image';

import { postProduct } from './api/api';

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
        </div>
    );
};

export default AdminPage;