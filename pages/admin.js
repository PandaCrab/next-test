import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { BsCart } from 'react-icons/bs';
import { AiOutlineDelete } from 'react-icons/ai';
import { BsPencil } from 'react-icons/bs';
import { RiCloseLine } from 'react-icons/ri';
import Image from 'next/image';

import { deleteProduct, postProduct, updateProductInStorage } from './api/api';
import { catchSuccess, catchWarning } from '../redux/ducks/alerts';
import LoginPage from './login';
import useWindowSize from '../hooks/windowSize';

import styles from '../styles/Admin.module.scss';

const AdminPage = () => {
    const [show, setShow] = useState('addProduct');
    const [productPriview, setPreview] = useState(false);
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
    const [addProduct, setProduct] = useState({
        name: '',
        price: '',
        imgUrl: '',
        color: '',
        quantity: '',
        width: '',
        height: '',
    });
    const [permission, setPermission] = useState(false);
    const [loged, setloged] = useState(false);
    const [allProducts, setAllProducts] = useState();

    const size = useWindowSize();

    const user = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const router = useRouter();

    const deleteFromStorage = async (id) => {
        const res = await deleteProduct(id);
        const { message } = await res.json();

        if (res.ok) {
            dispatch(catchWarning(message));
            takeProducts();
        }
    };

    const onPostProduct = (info) => {
        if (info) {
            const { message } = postProduct(info);

            setProduct({
                name: '',
                price: '',
                imgUrl: '',
                color: '',
                quantity: '',
                width: '',
                height: '',
            });
            setPreview(false);

            dispatch(catchSuccess(message));
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
        const allProducts = await fetch('http://localhost:4000/storage');
        const catchRes = await allProducts.json();

        console.log(catchRes);

        if (allProducts.ok) {
            setAllProducts(catchRes);
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
        if (size.width < 767) {
            setPreview(false);
        } else {
            setPreview(true);
        }
    }, [size]);

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
                            <div className={styles.addProductForm}>
                                <div className={styles.formWrapper}>
                                    <input
                                        id="name"
                                        className={styles.addProductInput}
                                        name="name"
                                        placeholder="Name of product"
                                        value={addProduct.name}
                                        onChange={({ target }) =>
                                            setProduct({
                                                ...addProduct,
                                                name: target.value,
                                            })
                                        }
                                    />
                                    <input
                                        id="price"
                                        className={styles.addProductInput}
                                        name="price"
                                        placeholder="Enter product price"
                                        value={addProduct.price}
                                        onChange={({ target }) =>
                                            setProduct({
                                                ...addProduct,
                                                price: target.value,
                                            })
                                        }
                                    />
                                    <input
                                        id="imgUrl"
                                        className={styles.addProductInput}
                                        name="imgUrl"
                                        placeholder="Image path"
                                        value={addProduct.imgUrl}
                                        onChange={({ target }) =>
                                            setProduct({
                                                ...addProduct,
                                                imgUrl: target.value,
                                            })
                                        }
                                    />
                                    <input
                                        id="color"
                                        className={styles.addProductInput}
                                        name="color"
                                        placeholder="Enter product color (optional)"
                                        value={addProduct.color}
                                        onChange={({ target }) =>
                                            setProduct({
                                                ...addProduct,
                                                color: target.value,
                                            })
                                        }
                                    />
                                    <input
                                        id="quantity"
                                        className={styles.addProductInput}
                                        name="quantity"
                                        placeholder="Enter quantity of available products"
                                        value={addProduct.quantity}
                                        onChange={({ target }) =>
                                            setProduct({
                                                ...addProduct,
                                                quantity: target.value,
                                            })
                                        }
                                    />
                                    <input
                                        id="width"
                                        className={styles.addProductInput}
                                        name="width"
                                        placeholder="Enter width of product image"
                                        value={addProduct.width}
                                        onChange={({ target }) =>
                                            setProduct({
                                                ...addProduct,
                                                width: target.value,
                                            })
                                        }
                                    />
                                    <input
                                        id="height"
                                        className={styles.addProductInput}
                                        name="height"
                                        placeholder="Enter height of product image"
                                        value={addProduct.height}
                                        onChange={({ target }) =>
                                            setProduct({
                                                ...addProduct,
                                                height: target.value,
                                            })
                                        }
                                    />
                                    <div className={styles.btnsWrapper}>
                                        {size.width < 767 && (
                                            <button
                                                className={styles.previewBtn}
                                                onClick={() => setPreview(!productPriview)}
                                            >
                                                Preview
                                            </button>
                                        )}
                                        <button
                                            onClick={() => onPostProduct(addProduct)}
                                            className={styles.submitButton}
                                        >
                                            Add product
                                        </button>
                                    </div>
                                </div>
                                <div
                                    className={styles.previewCard}
                                    style={{
                                        display: productPriview ? 'flex' : 'none',
                                    }}
                                >
                                    <div className={styles.productCard} key={addProduct.id}>
                                        <div
                                            onClick={() => {
                                                setPreview(false);
                                            }}
                                            className={styles.closeBtn}
                                        >
                                            <RiCloseLine />
                                        </div>
                                        <div className={styles.cardContentWrapper}>
                                            {addProduct.imgUrl && (
                                                <Image
                                                    src={addProduct.imgUrl}
                                                    alt={addProduct.name}
                                                    width={addProduct.width ? `${addProduct.width}px` : '100px'}
                                                    height={addProduct.height ? `${addProduct.height}px` : '100px'}
                                                />
                                            )}
                                            <div className={styles.cardInfo}>
                                                <div className={styles.stuffTitle}>{addProduct.name}</div>
                                                <div className={styles.stuffColor}>{addProduct.color}</div>
                                                <div className={styles.stuffPrice}>${addProduct.price}</div>
                                            </div>
                                        </div>
                                        <div className={styles.cardButtons}>
                                            <button className={styles.cartButton}>
                                                <BsCart />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
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
                                                        width="80px"
                                                        height="70px"
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
                                                            deleteFromStorage({
                                                                _id: product._id,
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
                                                <Image
                                                    src={inUpdate.updateItem.imgUrl}
                                                    alt={inUpdate.updateItem.name}
                                                    width="200ox"
                                                    height="180px"
                                                />
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
