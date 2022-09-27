import React, { useState } from 'react';
import Link from 'next/link';

import styles from '../styles/CategoriesDropdown.module.scss';

interface DropdownState {
    devices?: boolean;
    clothes?: boolean;
};

const CategoriesDropdown = () => {
    const [show, setShow] = useState<DropdownState | false>(false);

    return (
        <div className={styles.categories}>
            <div className={styles.mainCategories}>
                <div
                    className={styles.categoriesItems}
                    onMouseEnter={() => setShow({
                        devices: true,
                    })
                    }
                >
                    <Link href="/shop/categories/devices">
                        <a>Devices</a>
                    </Link>
                </div>
                <div
                    className={styles.categoriesItems}
                    onMouseEnter={() => setShow({
                        clothes: true,
                    })
                    }
                >
                    <Link href="/shop/categories/clothes">
                        <a>Clothes</a>
                    </Link>
                </div>
            </div>
            {show && (
                <div className={styles.subcategories} onMouseLeave={() => setShow(false)}>
                    {show?.devices ? (
                        <>
                            <Link href="/shop/categories/devices/phones">
                                <a className={styles.categoriesItems}>Phones</a>
                            </Link>
                            <Link href="/shop/categories/devices/laptops">
                                <a className={styles.categoriesItems}>Laptops</a>
                            </Link>
                            <Link href="/shop/categories/devices/watches">
                                <a className={styles.categoriesItems}>Watches</a>
                            </Link>
                        </>
                    ) : show?.clothes && (
                        <>
                            <Link href="/shop/categories/clothes/shirts">
                                <a className={styles.categoriesItems}>Shirts</a>
                            </Link>
                            <Link href="/shop/categories/clothes/sneakers">
                                <a className={styles.categoriesItems}>Sneackers</a>
                            </Link>
                            <Link href="/shop/categories/clothes/bags">
                                <a className={styles.categoriesItems}>Bags</a>
                            </Link>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default CategoriesDropdown;
