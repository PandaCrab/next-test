import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { HiArrowNarrowLeft } from 'react-icons/hi';
import { useDispatch, useSelector } from 'react-redux';

import Image from 'next/image';
import { takeOneProduct } from '../api/api';
import { ProductComments } from '../../components';
import { inOrder } from '../../redux/ducks/order';

import type { Stuff } from '../../types/types';

import styles from '../../styles/ProductPage.module.scss';
import { catchSuccess } from '../../redux/ducks/alerts';
import { setViewedStuff } from '../../helpers/setToSessionStorage';

const SingleProduct = () => {
    const [productId, setProductId] = useState<string | string[]>('');
    const [product, setProduct] = useState<Stuff>();
    const [tab, setTab] = useState<string>('about');

    const router = useRouter();
    const dispatch = useDispatch();

    const clientOrder = useSelector((state: { order: { clientOrder: Stuff[] } }) => state.order.clientOrder);

    const takeProduct = async (id) => {
        try {
            const res = await takeOneProduct(id);

            if (res) {
                setProduct(res);
            }
        } catch (err) {
            console.log(err);
        }
    };

    const pushToOrder = (stuff) => {
        const idInOrder = clientOrder.length;
        const {
            _id, name, price, imgUrl, color, quantity, width, height,
        } = stuff;

        dispatch(
            inOrder({
                id: idInOrder,
                _id,
                name,
                price,
                imgUrl,
                color,
                quantity,
                width,
                height,
            }),
        );

        dispatch(catchSuccess('Product has been added into your bucket'));
    };

    useEffect(() => {
        setProductId(router.query.product);
    }, [router]);

    const availability = () => {
        if (product.quantity >= 50) {
            return 'Available';
        } if (product.quantity <= 50 && product.quantity !== 0) {
            return 'Product is running out';
        }
        return 'Sold';
    };

    useEffect(() => {
        if (productId) {
            setViewedStuff(productId);
        }
    }, [productId]);

    useEffect(() => {
        if (productId) {
            takeProduct(productId);
        }
    }, [productId]);

    return (
        <div className={styles.productContainer}>
            <button
                onClick={() => router.back()}
                className={styles.backBtn}
            >
                <HiArrowNarrowLeft />
            </button>
            <div className={styles.tabsWrapper}>
                <div
                    className={styles.tab}
                    onClick={() => setTab('about')}
                >
                    About
                </div>
                <div
                    className={styles.tab}
                    onClick={() => setTab('comments')}
                >
                    comments
                </div>
            </div>
            {tab === 'about' ? (
                product && (
                    <div className={styles.infoWrapper}>
                        <div className={styles.mainInfo}>
                            <div className={styles.imageWrapper}>
                                {product.imgUrl && (
                                    <Image
                                        src={product.imgUrl}
                                        alt={product.name}
                                        width={product.width ? `${product.width}px` : '300px'}
                                        height={product.height ? `${product.height}px` : '240px'}
                                    />
                                )}
                            </div>
                            <div className={styles.info}>
                                <div>
                                    <b>{product.name}</b>
                                </div>
                                <div>{product.color}</div>
                                <div>${product.price}</div>
                                <div>
                                    { availability() }
                                </div>
                            </div>
                        </div>
                        <div className={styles.description}>{product?.description}</div>
                        <button 
                            onClick={() => pushToOrder(product)}
                            className="btns"
                        >
                            Buy
                        </button>
                    </div>
                )
            ) : (
                tab === 'comments' && (
                    <ProductComments
                        product={product}
                        setProduct={setProduct}
                        productId={productId.toString()}
                    />
                )
            )}
        </div>
    );
};

export default SingleProduct;
