import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import styles from '../../../styles/CategoriesPage.module.scss';

const CategoriesPage = () => {
    const router = useRouter();

    return (
        <div className={styles.categoriesContainer}>
            <div className={styles.categoryWrapper}>
                <div className={styles.categoryHeader} onClick={() => router.push('/shop/categories/devices')}>
                    Devices
                </div>
                <Link href="/shop/categories/devices/phones">
                    <a>Phones</a>
                </Link>
                <Link href="/shop/categories/devices/laptops">
                    <a>Laptops</a>
                </Link>
                <Link href="/shop/categories/devices/watches">
                    <a>Watches</a>
                </Link>
            </div>
            <div className={styles.categoryWrapper}>
                <div
                    className={styles.categoryHeader}
                    onClick={() => {
                        router.push('/shop/categories/Clothes');
                    }}
                >
                    Clothes
                </div>
                <Link href="/shop/categories/devices/shirts">
                    <a>Shirts</a>
                </Link>
                <Link href="/shop/categories/devices/sneakers">
                    <a>Sneackers</a>
                </Link>
                <Link href="/shop/categories/devices/bags">
                    <a>Bags</a>
                </Link>
            </div>
        </div>
    );
};

export default CategoriesPage;
