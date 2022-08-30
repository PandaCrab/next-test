import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { AiOutlineDelete } from 'react-icons/ai';
import { BsPencil } from 'react-icons/bs';
import Image from 'next/image';

import { deleteProduct, updateProductInStorage } from './api/api';
import { catchSuccess, catchWarning } from '../redux/ducks/alerts';
import LoginPage from './login';
import AddProductForm from '../components/addProductForm';

import styles from '../styles/Admin.module.scss';

const AdminPage = () => {
    const [loged, setloged] = useState(false);
    const [permission, setPermission] = useState(false);
    const [show, setShow] = useState('addProduct');
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

    const user = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const router = useRouter();

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

    const takeProducts = async () => {
        try {
            const allProducts = await fetch('http://localhost:4000/storage');
            const catchRes = await allProducts.json();

            if (allProducts.ok) {
                setAllProducts(catchRes);
            }
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

    return (
        <div className={styles.adminPageContainer}>
            {!loged ? (
                <div className={styles.logFormWrapper}>
                    <LoginPage />
                </div>
            ) : loged && permission ? (
                <>
                    <div className={styles.welcomWrapper}>
                        <div>Hello in admin panel</div>
                        <button className={styles.homeBtn} onClick={() => router.push('/')}>
                            Home
                        </button>
                    </div>
                    <div className={styles.adminPanel}>
                        <div className={styles.adminPanelHeader}>
                            <div onClick={() => setShow('addProduct')} className={styles.menuButton}>
                                Add product
                            </div>
                            <div onClick={() => setShow('products')} className={styles.menuButton}>
                                Products
                            </div>
                        </div>
                        {show === 'addProduct' ? (
                            <AddProductForm />
                        ) : show === 'products' ? (
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
                                                        onClick={() =>
                                                            setDeleteItem({
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
                                                    onClick={() =>
                                                        setUpdate({
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
                                                    onClick={() =>
                                                        deleteFromStorage({
                                                            _id: deleteItem.item.id,
                                                        })
                                                    }
                                                    className={styles.deletionBtn}
                                                >
                                                    Yes
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        setDeleteItem({
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
                        ) : null}
                    </div>
                </>
            ) : (
                <div>You don`t have the permission for this page</div>
            )}
        </div>
    );
};

export default AdminPage;
