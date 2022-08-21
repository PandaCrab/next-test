import React, { useState } from 'react';
import Link from 'next/link';

import styles from '../styles/CategoriesDropdown.module.scss';

const CategoriesDropdown = () => {
    const [show, setShow] = useState(false);

    return (
        <div className={styles.categories}>
            <div className={styles.mainCategories}>
                <div 
                    className={styles.categoriesItems}
                    onMouseEnter={() => setShow({
                        devices: true
                    })}
                >
                    <Link href="/categories/devices">
                        <a>Devices</a>
                    </Link>
                </div>
                <div 
                    className={styles.categoriesItems}
                    onMouseEnter={() => setShow({
                        clothes: true
                    })}
                >
                    <Link href="/categories/clothes">
                        <a>Clothes</a>
                    </Link>
                </div>
            </div>
            {show && (
                <div 
                    className={styles.subCategories}
                    onMouseLeave={() => setShow(false)}
                >
                    {show?.devices ? (
                        <>
                            <Link href="/categories/devices/phones">
                                <a className={styles.categoriesItems}>Phones</a>
                            </Link>
                            <Link href="/categories/devices/laptops">
                                <a className={styles.categoriesItems}>Laptops</a>
                            </Link>
                            <Link href="/categories/devices/watches">
                                <a className={styles.categoriesItems}>Watches</a>
                            </Link>
                        </>
                    ) : show?.clothes ? (
                        <>
                            <Link href="/categories/clothes/shirts">
                                <a className={styles.categoriesItems}>Shirts</a>
                            </Link>
                            <Link href="/categories/clothes/sneakers">
                                <a className={styles.categoriesItems}>Sneackers</a>
                            </Link>
                            <Link href="/categories/clothes/bags">
                                <a className={styles.categoriesItems}>Bags</a>
                            </Link>
                        </>
                    ) : null}
                </div>
            )}
        </div>
    );
};

export default CategoriesDropdown;
