import Image from 'next/image';
import React, { useState, useEffect, createRef } from 'react';
import { Cropper, ReactCropperElement } from 'react-cropper';
import { RiUser3Line } from 'react-icons/ri';
import { BsPencil } from 'react-icons/bs';
import { AiOutlineDelete } from 'react-icons/ai';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';

import { setUserAvatar } from '../pages/api/api';
import { catchError, catchSuccess, catchWarning } from '../redux/ducks/alerts';

import type { UserInfo } from '../types/types';

import styles from '../styles/Avatar.module.scss';
import 'cropperjs/dist/cropper.css';

const file2Base64 = (file: File): Promise<string> => {
    return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result?.toString() || '');
        reader.onerror = (error) => reject(error);
    });
};

const Avatar = () => {
    const [uploaded, setUploaded] = useState<string | null>(null);
    const [photo, setPhoto] = useState<string | null>(null);

    const userAvatar = useSelector((state: { user: { info: UserInfo }}) => state.user.info.photo );

    const router = useRouter();
    const dispatch = useDispatch();

    const updateAvatar = async (avatar: string | null) => {
        const res =  await setUserAvatar((router.query.userAccount).toString(), { avatar });

        if (res) {
            if (res.status === 400) {
                dispatch(catchError(res.message));
            }

            if (avatar) {
                dispatch(catchSuccess(res.message));
            }

            if (!avatar) {
                dispatch(catchWarning('Avatar was deleted'));
                setPhoto(null);
            }
        }
    };

    useEffect(() => {
        if (userAvatar) {
            setPhoto(userAvatar);
        }
    }, []);

    const cropperRef = createRef<ReactCropperElement>();
    const fileRef = createRef<HTMLInputElement>();

    const onFileInputChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        const file = e.target?.files?.[0];
        if (file) {
            file2Base64(file).then((base64) => {
                setUploaded(base64);
            });
        }
    };

    const onSave = async () => {
        const imageElement: any = cropperRef?.current;
        const cropper: any = imageElement?.cropper;

        setPhoto(cropper.getCroppedCanvas().toDataURL());
        setUploaded(null);

        updateAvatar(cropper.getCroppedCanvas().toDataURL());
    };

    return (
        <div className={styles.container}>
            <input
                type="file"
                hidden={true}
                ref={fileRef}
                onChange={(event) => onFileInputChange(event)}
                accept="image/png,image/jpeg,image/jpg,image/gif"
            />
            <div>
                {photo ? (
                    <>
                        <div className={styles.imageWrapper}>
                            <Image
                                src={photo}
                                alt="user-avatar"
                                width="200px"
                                height="200px"
                            />
                        </div>
                        <button
                            className={`${styles.photoBtn} ${styles.delete}`}
                            onClick={() => updateAvatar(null)}
                        >
                            <AiOutlineDelete />
                        </button>
                        <button
                            className={`${styles.photoBtn} ${styles.change}`}
                            onClick={() => fileRef.current?.click()}
                        >
                            <BsPencil />
                        </button>
                    </>
                ) : (
                    <>
                        <div className={styles.defaultAvatar}>
                            <RiUser3Line />
                        </div>
                        <button onClick={() => fileRef.current?.click()} className={styles.photoBtn}>+</button>
                    </>
                )}
            </div>
            {uploaded && (
                <div className={styles.cropperContainer}>
                    <Cropper
                        src={uploaded}
                        style={{ width: 250, height: 250, position: 'relative' }}
                        autoCropArea={1}
                        aspectRatio={1}
                        viewMode={3}
                        guides={false}
                        ref={cropperRef}
                    />
                    <button onClick={() => onSave()} className={styles.saveBtn}>Save</button>
                </div>
            )}
        </div>
    );
};

export default Avatar;
