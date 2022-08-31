import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { RiCloseLine } from 'react-icons/ri';
import { BsCart } from 'react-icons/bs';
import { useDispatch } from 'react-redux';

import { catchSuccess } from '../redux/ducks/alerts';
import { postProduct } from '../pages/api/api';
import { addProductSchema } from '../helpers/validation';
import { devicesSubcategories, clothesSubcategories, categories } from '../helpers/categoriesArrays';
import useWindowSize from '../hooks/windowSize';

import styles from '../styles/AddProductForm.module.scss';

const AddProductForm = () => {
    const [productPriview, setPreview] = useState(false);
    const [dropdownCategories, setCategories] = useState({
        category: false,
        subcategory: false,
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

    const dispatch = useDispatch();

    const size = useWindowSize();

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
                        category: '',
                        subcategory: '',
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

    useEffect(() => {
        if (size.width < 767) {
            setPreview(false);
        } else {
            setPreview(true);
        }
    }, [size]);

    return (
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
                    placeholder={invalidProductInfo.path.name ? invalidProductInfo.path.name : 'Name of product'}
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
                    placeholder={invalidProductInfo.path.price ? invalidProductInfo.path.price : 'Enter product price'}
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
                    placeholder={invalidProductInfo.path.imgUrl ? invalidProductInfo.path.imgUrl : 'Image path'}
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
                            {dropdownCategories.subcategory ? (
                                <div className={styles.dropdown}>
                                    {addProduct.category === 'devices' ?
                                        devicesSubcategories.map((subcategory, index) => (
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
                                            )
                                        )
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
                                        )
                                    )}
                                </div>
                            ) : null}
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
                        <button className={styles.previewBtn} onClick={() => setPreview(!productPriview)}>
                            Preview
                        </button>
                    )}
                    <button onClick={() => onPostProduct(addProduct)} className={styles.submitButton}>
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
                                src={addProduct.imgUrl.length > 10 ? addProduct.imgUrl : ''}
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
    );
};

export default AddProductForm;
