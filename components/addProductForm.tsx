import Image from 'next/image';
import React, { useState, useEffect, useRef, MutableRefObject } from 'react';
import { RiCloseLine } from 'react-icons/ri';
import { BsCart } from 'react-icons/bs';
import { useDispatch } from 'react-redux';

import { catchSuccess } from '../redux/ducks/alerts';
import { postProduct } from '../pages/api/api';
import { addProductSchema } from '../helpers/validation';
import { ErrorTooltip } from '../components';
import { devicesSubcategories, clothesSubcategories, categories } from '../helpers/categoriesArrays';
import { useClickOutside, useWindowSize } from '../hooks';

import type { Stuff } from '../types/types';

import styles from '../styles/AddProductForm.module.scss';

interface InvalidState {
    path: Stuff;
    isValid: boolean;
};

interface Dropdown {
    category?: boolean;
    subcategory?: boolean;
};

const AddProductForm = () => {
    const [productPriview, setPreview] = useState<boolean>(false);
    const [dropdownCategories, setCategories] = useState<Dropdown | false>({
        category: false,
        subcategory: false,
    });
    const [addProduct, setProduct] = useState<Stuff>({
        name: '',
        price: 0,
        imgUrl: '',
        color: '',
        quantity: 0,
        category: '',
        width: 0,
        height: 0,
        description: '',
    });
    const [invalidInfo, setInvalidInfo] = useState<InvalidState>({
        path: null,
        isValid: false,
    });

    const dispatch = useDispatch();

    const size = useWindowSize();
    const dropdownRef: MutableRefObject<HTMLDivElement> = useRef();

    const handleChange = (target: { name: string, value: string | number }) => {
        const { name, value } = target;

        setInvalidInfo({
            ...invalidInfo,
            path: {
                ...invalidInfo.path,
                [name]: ''
            }
        });

        setProduct({
            ...addProduct,
            [name]: value,
        });
    };

    const onPostProduct = async (info) => {
        await addProductSchema
            .validate(addProduct, { abortEarly: false })
            .then(async (value) => {
                if (value) {
                    await postProduct(info);

                    setProduct({
                        name: '',
                        price: 0,
                        imgUrl: '',
                        color: '',
                        quantity: 0,
                        category: '',
                        subcategory: '',
                        width: 0,
                        height: 0,
                        description: '',
                    });

                    if (size.width < 767) {
                        setPreview(false);
                    }

                    dispatch(catchSuccess('Product added'));
                }
            })
            .catch((error) => {
                const validationError = {};

                error.inner.forEach((err) => {
                    if (err.path) {
                        validationError[err.path] = err.message;
                    }
                });

                setInvalidInfo({
                    path: validationError,
                    isValid: false,
                });
            });
    };

    const closeDropdown = () => {
        if (dropdownCategories && (dropdownCategories.category || dropdownCategories.subcategory)) {
            setCategories(false);
        }
    }

    useClickOutside(dropdownRef, dropdownCategories, closeDropdown);

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
                <div className={styles.inputWrapper}>
                    <input
                        id="name"
                        className={
                            invalidInfo.path?.name
                                ? `${styles.addProductInput} ${styles.invalid}`
                                : `${styles.addProductInput}`
                        }
                        name="name"
                        placeholder="Name of product"
                        value={addProduct.name}
                        onChange={({ target }) => handleChange(target)}
                    />
                    {invalidInfo.path?.name && (
                        <ErrorTooltip message={invalidInfo.path?.name} />
                    )}
                </div>
                <div className={styles.inputWrapper}>
                    <input
                        id="price"
                        className={
                            invalidInfo.path?.price
                                ? `${styles.addProductInput} ${styles.invalid}`
                                : `${styles.addProductInput}`
                        }
                        name="price"
                        placeholder="Enter product price"
                        value={addProduct.price === 0 ? '' : addProduct.price}
                        onChange={({ target }) => handleChange(target)}
                    />
                    {invalidInfo.path?.price && (
                        <ErrorTooltip message={invalidInfo.path?.price} />
                    )}
                </div>
                <div className={styles.inputWrapper}>
                    <input
                        id="imgUrl"
                        className={
                            invalidInfo.path?.imgUrl
                                ? `${styles.addProductInput} ${styles.invalid}`
                                : `${styles.addProductInput}`
                        }
                        name="imgUrl"
                        placeholder="Image path?"
                        value={addProduct.imgUrl}
                        onChange={({ target }) => handleChange(target)}
                    />
                    {invalidInfo.path?.imgUrl && (
                        <ErrorTooltip message={invalidInfo.path?.imgUrl} />
                    )}
                </div>
                <div className={styles.inputWrapper}>
                    <input
                        id="color"
                        className={
                            invalidInfo.path?.color
                                ? `${styles.addProductInput} ${styles.invalid}`
                                : `${styles.addProductInput}`
                        }
                        name="color"
                        placeholder="Enter product color (optional)"
                        value={addProduct.color}
                        onChange={({ target }) => handleChange(target)}
                    />
                    {invalidInfo.path?.color && (
                        <ErrorTooltip message={invalidInfo.path?.color} />
                    )}
                </div>
                <div className={styles.inputWrapper}>
                    <input
                        id="quantity"
                        className={
                            invalidInfo.path?.quantity
                                ? `${styles.addProductInput} ${styles.invalid}`
                                : `${styles.addProductInput}`
                        }
                        name="quantity"
                        placeholder="Enter quantity of available products"
                        value={addProduct.quantity === 0 ? '' : addProduct.quantity}
                        onChange={({ target }) => handleChange(target)}
                    />
                    {invalidInfo.path?.quantity && (
                        <ErrorTooltip message={invalidInfo.path?.quantity} />
                    )}
                </div>
                <div className={styles.row}>
                    <div className={styles.inputWrapper}>
                        <div className={
                            invalidInfo.path?.category
                                ? `${styles.dropdownCategories} ${styles.invalid}`
                                : `${styles.dropdownCategories}`
                            } 
                            ref={dropdownRef}
                        >
                            <div
                                onClick={() => setCategories({ category: true })
                                }
                            >
                                {addProduct.category ? addProduct.category : 'category'}
                            </div>
                            {dropdownCategories && dropdownCategories.category && (
                                <div className={styles.dropdown}>
                                    {categories.map((category, index) => (
                                        <div
                                            key={index}
                                            className={styles.dropdownItems}
                                            onClick={() => {
                                                setProduct({
                                                    ...addProduct,
                                                    category,
                                                    subcategory: ''
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
                        {invalidInfo.path?.category && (
                            <ErrorTooltip message={invalidInfo.path?.category} />
                        )}
                    </div>
                    <div className={styles.inputWrapper}>
                        {addProduct.category && (
                            <div className={styles.dropdownCategories} ref={dropdownRef}>
                                <div
                                    onClick={() => setCategories((prev) => ({
                                        ...prev,
                                        subcategory: true,
                                    }))
                                    }
                                >
                                    {addProduct.subcategory ? addProduct.subcategory : 'subcategory'}
                                </div>
                                {dropdownCategories && dropdownCategories.subcategory ? (
                                        <div className={styles.dropdown}>
                                            {addProduct.category === 'devices'
                                                ? devicesSubcategories.map((subcategory, index) => (
                                                    <div
                                                        className={styles.dropdownItems}
                                                        key={index}
                                                        onClick={() => {
                                                            setProduct({
                                                                ...addProduct,
                                                                subcategory
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
                                                : addProduct.category === 'clothes'
                                            && clothesSubcategories.map((subcategory, index) => (
                                                <div
                                                    className={styles.dropdownItems}
                                                    key={index}
                                                    onClick={() => {
                                                        setProduct({
                                                            ...addProduct,
                                                            subcategory
                                                        });
                                                        setCategories((prev) => ({
                                                            ...prev,
                                                            sybcategory: false,
                                                        }));
                                                    }}
                                                >
                                                    {subcategory}
                                                </div>
                                            ))}
                                        </div>
                                    )
                                    : null}
                            </div>
                        )}
                    </div>
                </div>
                <div className={styles.row}>
                    <div className={styles.inputWrapper}>
                        <input
                            id="width"
                            className={
                                invalidInfo.path?.width
                                    ? `${styles.addProductInput} ${styles.invalid}`
                                    : `${styles.addProductInput}`
                            }
                            name="width"
                            placeholder="Enter width of product image"
                            value={addProduct.width === 0 ? '' : addProduct.width}
                            onChange={({ target }) => handleChange(target)}
                        />
                        {invalidInfo.path?.width && (
                            <ErrorTooltip message={invalidInfo.path?.width} />
                        )}
                    </div>
                    <div className={styles.inputWrapper}>
                        <input
                            id="height"
                            className={
                                invalidInfo.path?.height
                                    ? `${styles.addProductInput} ${styles.invalid}`
                                    : `${styles.addProductInput}`
                            }
                            name="height"
                            placeholder="Enter height of product image"
                            value={addProduct.height === 0 ? '' : addProduct.height}
                            onChange={({ target }) => handleChange(target)}
                        />
                        {invalidInfo.path?.height && (
                            <ErrorTooltip message={invalidInfo.path?.height} />
                        )}
                    </div>
                </div>
                <div className={styles.inputWrapper}>
                    <textarea
                        id="description"
                        className={
                            invalidInfo.path?.description
                                ? `${styles.addProductInput} ${styles.description} ${styles.invalid}`
                                : `${styles.addProductInput} ${styles.description}`
                        }
                        name="description"
                        rows={20}
                        cols={200}
                        placeholder="Add description (optional)"
                        value={addProduct.description}
                        onChange={({ target }) => handleChange(target)}
                    />
                    {invalidInfo.path?.description && (
                        <ErrorTooltip message={invalidInfo.path?.description} />
                    )}
                </div>
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
                <div className={styles.productCard} key={addProduct._id}>
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
