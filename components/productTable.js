import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { AiOutlineDelete } from 'react-icons/ai';
import { BsPencil } from 'react-icons/bs';
import { useDispatch } from 'react-redux';

import { deleteProduct, updateProductInStorage } from '../pages/api/api';
import { catchSuccess, catchWarning } from '../redux/ducks/alerts';

import styles from '../styles/ProductTable.module.scss';

const ProductTable = () => {
    const [allProducts, setAllProducts] = useState();
    const [deleteItem, setDeleteItem] = useState({
        item: null,
        onSubmit: false,
    });
    const [inUpdate, setUpdate] = useState({
        updating: false,
        updateItem: {
            _id: '',
            name: '',
            price: '',
            color: '',
            quantity: '',
        },
    });

    const dispatch = useDispatch();

    const takeProducts = async () => {
        try {
            const allStorage = await fetch('http://localhost:4000/storage');
            const catchRes = await allStorage.json();

            if (allStorage.ok) {
                setAllProducts(catchRes);
            }
        } catch (err) {
            console.log(err);
        }
    };

    const deleteFromStorage = async (id) => {
        try {
            const res = await deleteProduct(id);
            const { message } = await res.json();

            if (res.ok) {
                dispatch(catchWarning(message));
                takeProducts();

                setDeleteItem({
                    item: null,
                    onSubmit: false,
                });
            }
        } catch (err) {
            console.log(err);
        }
    };

    const updateProduct = async (product) => {
        try {
            const res = await updateProductInStorage(product);

            dispatch(catchSuccess(res.message));
            takeProducts();
            setUpdate({
                updating: false,
                updateItem: {},
            });
        } catch (err) {
            console.log(err);
        }
    };

    const updateInputChange = (target) => {
        const { name, value } = target;
        setUpdate({
            ...inUpdate,
            updateItem: {
                ...inUpdate.updateItem,
                [name]: value,
            },
        });
    };

    useEffect(() => {
        takeProducts();
    }, []);

    return (
        <div className={styles.productsTable}>
            <div className={styles.productsWrapper}>
                <div className={`${styles.productRow} ${styles.header}`}>
                    <div className={`${styles.rowItems} ${styles.header}`}>Name</div>
                    <div className={`${styles.rowItems} ${styles.header}`}>Price</div>
                    <div className={`${styles.rowItems} ${styles.header}`}>Color</div>
                    <div className={`${styles.rowItems} ${styles.header}`}>Quantity</div>
                </div>
                {allProducts ? (
                    allProducts.map((product) => (
                        <div className={styles.productRow} key={product._id}>
                            <div className={styles.imageWrapper}>
                                <Image
                                    src={product.imgUrl}
                                    alt={product.name}
                                    width={product.width ? `${product.width}px` : '50px'}
                                    height={product.height ? `${product.height}px` : '80px'}
                                />
                            </div>
                            <div className={styles.rowItems}>{product.name}</div>
                            <div className={styles.rowItems}>{product.price}$</div>
                            <div className={styles.rowItems}>
                                {product.color ? product.color : 'none'}
                            </div>
                            <div className={styles.rowItems}>{product.quantity}</div>
                            <div className={styles.rowItems}>
                                <button
                                    className={`${styles.rowBtn} ${styles.delete}`}
                                    onClick={() => setDeleteItem({
                                        item: {
                                            id: product._id,
                                            name: product.name,
                                        },
                                        onSubmit: true,
                                    })
                                    }
                                >
                                    <AiOutlineDelete />
                                </button>
                                <button
                                    className={`${styles.rowBtn} ${styles.update}`}
                                    onClick={() => {
                                        setUpdate({
                                            updating: true,
                                            updateItem: {
                                                _id: product._id,
                                                imgUrl: product?.imgUrl,
                                                name: product?.name,
                                                price: product?.price,
                                                color: product?.color,
                                                quantity: product?.quantity,
                                            },
                                        });
                                    }}
                                >
                                    <BsPencil />
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div>
                        Seems site doesn`t have any products, please add somthing for your clients
                    </div>
                )}
            </div>
            {inUpdate.updating ? (
                <div className={styles.updateContainer}>
                    <div className={styles.formContainer}>
                        <div className={styles.imageFormWrapper}>
                            <div className={styles.updateForm}>
                                <label>Name</label>
                                <input
                                    className={styles.updateInput}
                                    name="name"
                                    placeholder="Enter name of product"
                                    value={inUpdate.updateItem.name}
                                    onChange={({ target }) => updateInputChange(target)}
                                />
                                <label>Price</label>
                                <input
                                    className={styles.updateInput}
                                    name="price"
                                    placeholder="Enter product price"
                                    value={inUpdate.updateItem.price}
                                    onChange={({ target }) => updateInputChange(target)}
                                />
                                <label>Color</label>
                                <input
                                    className={styles.updateInput}
                                    name="color"
                                    placeholder="Enter product color"
                                    value={inUpdate.updateItem.color}
                                    onChange={({ target }) => updateInputChange(target)}
                                />
                                <label>quantity</label>
                                <input
                                    className={styles.updateInput}
                                    name="quantity"
                                    placeholder="Enter product quantity"
                                    value={inUpdate.updateItem.quantity}
                                    onChange={({ target }) => updateInputChange(target)}
                                />
                            </div>
                        </div>
                        <div className={styles.updateBtnWrapper}>
                            <button
                                className={styles.saveBtn}
                                onClick={() => updateProduct(inUpdate.updateItem)}
                            >
                                Save
                            </button>
                            <button
                                className={styles.saveBtn}
                                onClick={() => setUpdate({
                                    ...inUpdate,
                                    updating: false,
                                })
                                }
                            >
                                close
                            </button>
                        </div>
                    </div>
                </div>
            ) : null}
            {deleteItem.onSubmit && (
                <div className={styles.deletionContainer}>
                    <div className={styles.agreeItemDeletion}>
                        <div>Are You agree to delete {deleteItem.item.name} </div>
                        <div className={styles.updateBtnWrapper}>
                            <button
                                onClick={() => deleteFromStorage({
                                    _id: deleteItem.item.id,
                                })
                                }
                                className={styles.deletionBtn}
                            >
                                Yes
                            </button>
                            <button
                                onClick={() => setDeleteItem({
                                    item: null,
                                    onSubmit: false,
                                })
                                }
                                className={styles.deletionBtn}
                            >
                                No
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductTable;
