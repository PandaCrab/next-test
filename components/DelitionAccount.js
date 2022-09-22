import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useRouter } from 'next/router';

import { useDispatch } from 'react-redux';
import { catchError, catchWarning } from '../redux/ducks/alerts.ts';
import { deleteUser } from '../pages/api/api';
import { logout } from '../redux/ducks/user';
import { clearOrder } from '../redux/ducks/order';

import styles from '../styles/DelitionAccount.module.scss';

const DelitionAccount = ({ view, setView }) => {
    const [confirmPass, setConfirmPass] = useState('');

    const router = useRouter();
    const dispatch = useDispatch();

    const deleteAccount = async () => {
        const id = router.query.userAccount;

        const deleted = await deleteUser(id, { password: confirmPass });

        if (deleted.error) {
            dispatch(catchError(deleted.error));
        }

        if (deleted.message) {
            dispatch(catchWarning(deleted.message));
            dispatch(logout());
            dispatch(clearOrder());
            await localStorage.removeItem('token');
            router.push('/');
        }
    };

    return (
        <div className={styles.agreeDeletionWrapper}>
            <div className={styles.agree}>
                <div>
                    When You delete account, all personal and order information will lost forever. Agreed this, You
                    confirm deletion of your account.
                </div>
                <div>
                    <button
                        onClick={() => setView({
                            ...view,
                            confirmPassword: true,
                        })
                        }
                        className="btns"
                    >
                       Agree
                    </button>
                    <button
                        onClick={() => setView({
                            ...view,
                            agreeDeletion: false,
                        })
                        }
                        className="btns"
                    >
                       Close
                    </button>
                </div>
                {view.confirmPassword && (
                    <div className={styles.confirm}>
                        <input
                            className={styles.confirmInput}
                            name="confirmPass"
                            type="password"
                            value={confirmPass}
                            onChange={({ target }) => setConfirmPass(target.value)}
                            placeholder="Please enter your password"
                        />
                        <div>
                            <button
                                onClick={() => deleteAccount()}
                                className="btns"
                            >
                                Confirm
                            </button>
                            <button
                                onClick={() => setView({
                                    ...view,
                                    agreeDeletion: false,
                                    confirmPassword: false,
                                })
                                }
                                className="btns"
                            >
                               Decline
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

DelitionAccount.propTypes = {
    view: PropTypes.object,
    setView: PropTypes.func,
};

export default DelitionAccount;
