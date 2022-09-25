import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';

import LoginPage from './login';
import { AddProductForm, ProductTable } from '../components';

import styles from '../styles/Admin.module.scss';
import { userObject } from '../types/types';

const AdminPage = () => {
    const [loged, setloged] = useState<boolean>(false);
    const [permission, setPermission] = useState<boolean>(false);
    const [show, setShow] = useState<string>('addProduct');

    const user: userObject = useSelector((state: { user: userObject }) => state.user);
    const router = useRouter();

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

    if (!loged) {
        return (
            <div className={styles.logFormWrapper}>
                <LoginPage />
            </div>
        );
    }

    return (
        <div className={styles.adminPageContainer}>
            {loged && permission ? (
                <>
                    <div className={styles.welcomWrapper}>
                        <div>Hello in admin panel</div>
                        <button
                            className={styles.homeBtn}
                            onClick={() => router.push('/')}
                        >
                            Home
                        </button>
                    </div>
                    <div className={styles.adminPanel}>
                        <div className={styles.adminPanelHeader}>
                            <div
                                onClick={() => setShow('addProduct')}
                                className={styles.menuButton}
                            >
                                Add product
                            </div>
                            <div
                                onClick={() => setShow('products')}
                                className={styles.menuButton}
                            >
                                 Products
                            </div>
                        </div>
                        {show === 'addProduct' ? <AddProductForm /> : show === 'products' && <ProductTable />}
                    </div>
                </>
            ) : (
                <div>You don`t have the permission for this page</div>
            )}
        </div>
    );
};

export default AdminPage;
