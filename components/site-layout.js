import React from 'react';
import Link from 'next/link';

import Cart from './cart';

import styles from '../styles/SiteLayout.module.scss';

const SiteLayout = ({children}) => {
    return (
        <div className='layout'>
            <div className={styles.header}>
                <div className={styles.title}>Some logo and name of company</div>
                <Link href="/">
                    <a className={styles.homeLink}>Home</a>
                </Link>
                <Link href="/admin">
                    <a className={styles.homeLink}>Admin</a>
                </Link>
                <Cart />
            </div>

            <main>{children}</main>

            <footer className={styles.footer}>
                Test Next application
            </footer>
        </div>
    );
};

export default SiteLayout;