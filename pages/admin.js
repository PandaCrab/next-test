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
import { addProductSchema } from '../helpers/validation';
import { devicesSubcategories, clothesSubcategories, categories } from '../helpers/categoriesArrays';

import styles from '../styles/Admin.module.scss';

const AdminPage = () => {
    const [loged, setloged] = useState(false);
    const [permission, setPermission] = useState(false);
    const [productPriview, setPreview] = useState(false);
    const [dropdownCategories, setCategories] = useState({
        category: false,
        subcategory: false,
    });
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
    const [addProduct, setProduct] = useState({
        name: '',
        price: '',
        imgUrl: '',
        color: '',
        quantity: '',
        category: '',
        sybcategory: '',
        width: '',
        height: '',
        description: '',
    });
    const [invalidProductInfo, setProductInfo] = useState({
        path: {},
        isValid: false,
    });

    const size = useWindowSize();

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

    const onPostProduct = async (info) => {
        await addProductSchema
            .validate(addProduct, { abortEarly: false })
            .then(async (value) => {
                if (value) {
                    const { message } = await postProduct(info);

                    setProduct({
                        name: '',
                        price: '',
                        imgUrl: '',
                        color: '',
                        quantity: '',
                        width: '',
                        height: '',
                        description: '',
                    });

                    if (size.width < 767) {
                        setPreview(false);
                    }

                    dispatch(catchSuccess(message));
                }
            })
            .catch((error) => {
                const validationError = {};

                error.inner.forEach((err) => {
                    if (err.path) {
                        validationError[err.path] = err.message;
                    }
                });

                setProductInfo({
                    path: validationError,
                    isValid: false,
                });
            });
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
                                        className={
                                            invalidProductInfo.path.name
                                                ? `${styles.addProductInput} ${styles.invalid}`
                                                : `${styles.addProductInput}`
                                        }
                                        name="name"
                                        placeholder={
                                            invalidProductInfo.path.name
                                                ? invalidProductInfo.path.name
                                                : 'Name of product'
                                        }
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
                                        className={
                                            invalidProductInfo.path.price
                                                ? `${styles.addProductInput} ${styles.invalid}`
                                                : `${styles.addProductInput}`
                                        }
                                        name="price"
                                        placeholder={
                                            invalidProductInfo.path.price
                                                ? invalidProductInfo.path.price
                                                : 'Enter product price'
                                        }
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
                                        className={
                                            invalidProductInfo.path.imgUrl
                                                ? `${styles.addProductInput} ${styles.invalid}`
                                                : `${styles.addProductInput}`
                                        }
                                        name="imgUrl"
                                        placeholder={
                                            invalidProductInfo.path.imgUrl
                                                ? invalidProductInfo.path.imgUrl
                                                : 'Image path'
                                        }
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
                                        className={
                                            invalidProductInfo.path.color
                                                ? `${styles.addProductInput} ${styles.invalid}`
                                                : `${styles.addProductInput}`
                                        }
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
                                        className={
                                            invalidProductInfo.path.quantity
                                                ? `${styles.addProductInput} ${styles.invalid}`
                                                : `${styles.addProductInput}`
                                        }
                                        name="quantity"
                                        placeholder={
                                            invalidProductInfo.path.quantity
                                                ? invalidProductInfo.path.quantity
                                                : 'Enter quantity of available products'
                                        }
                                        value={addProduct.quantity}
                                        onChange={({ target }) =>
                                            setProduct({
                                                ...addProduct,
                                                quantity: target.value,
                                            })
                                        }
                                    />
                                    <div className={styles.row}>
                                        <div className={styles.dropdownCategories}>
                                            <div
                                                onClick={() =>
                                                    setCategories((prev) => ({
                                                        ...prev,
                                                        category: true,
                                                    }))
                                                }
                                            >
                                                {addProduct.category ? addProduct.category : 'category'}
                                            </div>
                                            {dropdownCategories.category && (
                                                <div className={styles.dropdown}>
                                                    {categories.map((category, index) => (
                                                        <div
                                                            key={index}
                                                            className={styles.dropdownItems}
                                                            onClick={() => {
                                                                setProduct({
                                                                    ...addProduct,
                                                                    category,
                                                                    subcategory: '',
                                                                });
                                                                setCategories({
                                                                    category: false,
                                                                    subcategory: false,
                                                                });
                                                            }}
                                                        >
                                                            {category}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        {addProduct.category && (
                                            <div className={styles.dropdownCategories}>
                                                <div
                                                    onClick={() =>
                                                        setCategories((prev) => ({
                                                            ...prev,
                                                            subcategory: true,
                                                        }))
                                                    }
                                                >
                                                    {addProduct.subcategory ? addProduct.subcategory : 'subcategory'}
                                                </div>
                                                <div className={styles.dropdown}>
                                                    {dropdownCategories.subcategory
                                                        ? addProduct.category === 'devices'
                                                            ? devicesSubcategories.map((subcategory, index) => (
                                                                  <div
                                                                      className={styles.dropdownItems}
                                                                      key={index}
                                                                      onClick={() => {
                                                                          setProduct({
                                                                              ...addProduct,
                                                                              subcategory,
                                                                          });
                                                                          setCategories((prev) => ({
                                                                              ...prev,
                                                                              subcategory: false,
                                                                          }));
                                                                      }}
                                                                  >
                                                                      {subcategory}
                                                                  </div>
                                                              ))
                                                            : addProduct.category === 'clothes' &&
                                                              clothesSubcategories.map((subcategory, index) => (
                                                                  <div
                                                                      className={styles.dropdownItems}
                                                                      key={index}
                                                                      onClick={() => {
                                                                          setProduct({
                                                                              ...addProduct,
                                                                              subcategory,
                                                                          });
                                                                          setCategories((prev) => ({
                                                                              ...prev,
                                                                              sybcategory: false,
                                                                          }));
                                                                      }}
                                                                  >
                                                                      {subcategory}
                                                                  </div>
                                                              ))
                                                        : null}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div className={styles.row}>
                                        <input
                                            id="width"
                                            className={
                                                invalidProductInfo.path.width
                                                    ? `${styles.addProductInput} ${styles.invalid}`
                                                    : `${styles.addProductInput}`
                                            }
                                            name="width"
                                            placeholder={
                                                invalidProductInfo.path.width
                                                    ? invalidProductInfo.path.width
                                                    : 'Enter width of product image'
                                            }
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
                                            className={
                                                invalidProductInfo.path.height
                                                    ? `${styles.addProductInput} ${styles.invalid}`
                                                    : `${styles.addProductInput}`
                                            }
                                            name="height"
                                            placeholder={
                                                invalidProductInfo.path.height
                                                    ? invalidProductInfo.path.height
                                                    : 'Enter height of product image'
                                            }
                                            value={addProduct.height}
                                            onChange={({ target }) =>
                                                setProduct({
                                                    ...addProduct,
                                                    height: target.value,
                                                })
                                            }
                                        />
                                    </div>
                                    <textarea
                                        type="textarea"
                                        id="description"
                                        className={
                                            invalidProductInfo.path.description
                                                ? `${styles.addProductInput} ${styles.description} ${styles.invalid}`
                                                : `${styles.addProductInput} ${styles.description}`
                                        }
                                        name="description"
                                        rows="20"
                                        cols="200"
                                        placeholder="Add description (optional)"
                                        value={addProduct.description}
                                        onChange={({ target }) =>
                                            setProduct({
                                                ...addProduct,
                                                description: target.value,
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
                                        {size.width < 767 && (
                                            <div
                                                onClick={() => {
                                                    setPreview(false);
                                                }}
                                                className={styles.closeBtn}
                                            >
                                                <RiCloseLine />
                                            </div>
                                        )}
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
