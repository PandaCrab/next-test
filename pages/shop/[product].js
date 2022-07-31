import React, {useState, useEffect} from 'react';
import { useRouter } from 'next/router';
import { HiArrowNarrowLeft } from 'react-icons/hi';

import { takeOneProduct } from '../api/api';

import styles from '../../styles/ProductPage.module.scss';
import Image from 'next/image';

const SingleProduct = () => {
    const [productId, setProductId] = useState('');
    const [product, setProduct] = useState();

    const router = useRouter();

    const takeProduct = async(id) => {
        try {
        const res = await takeOneProduct(id);

        if (res) {
            setProduct(res)
        }
        } catch (err) {
            console.log(err)
        }        
    };

    useEffect(() => {
        setProductId(router.query.product);
    }, [router]);

    useEffect(() => {
        if (productId) {
            takeProduct(productId);
        }
        return
    }, [productId]);

    return product ? (
        <div className={styles.productContainer}>
            <button onClick={() => router.back()} className={styles.backBtn}>
                <HiArrowNarrowLeft />
            </button>
            <div className={styles.tabsWrapper}>
                <div className={styles.tab}>About</div>
            </div>
            <div className={styles.infoWrapper}>
                <div className={styles.mainInfo}>
                    <div className={styles.imgWrapper}>
                        {product.imgUrl && (
                            <Image 
                                src={product.imgUrl}
                                alt={product.name}
                                width={product.width ?`${product.width}px` : '300px'}
                                height={product.height ? `${product.height}px` : '240px'}
                            />
                        )}
                    </div>
                    <div className={styles.info}>
                        <div><b>{product.name}</b></div>
                        <div>{product.color}</div>
                        <div>${product.price}</div>
                        <div>{product.quantity >= 50 
                            ? 'Available' : product.quantity <= 50 > 0 
                            ? 'Product is running out' : 'Sold'
                        }</div>
                    </div>
                </div>
                <div className={styles.description}>
                    {product?.description}
                </div>
            </div>
        </div>
    ) : (
        <div>Somthing wrong</div>
    )
};

export default SingleProduct;
