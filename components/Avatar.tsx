import Image from 'next/image';
import React, { useState, useEffect, createRef, useRef } from 'react';
import { CircleStencil, Cropper, CropperRef } from 'react-advanced-cropper';
import { RiUser3Line } from 'react-icons/ri';
import { BsPencil } from 'react-icons/bs';
import { AiOutlineDelete } from 'react-icons/ai';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';

import { getUserInfo, setUserAvatar } from '../pages/api/api';
import { catchError, catchSuccess, catchWarning } from '../redux/ducks/alerts';

import type { UserInfo } from '../types/types';

import styles from '../styles/Avatar.module.scss';
import 'react-advanced-cropper/dist/style.css';
import { getInfo } from '../redux/ducks/user';

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

    const router = useRouter();
    const dispatch = useDispatch();

    const userAvatar = useSelector((state: { user: { info: UserInfo }}) => state.user.info.photo );
    const userId = (router.query?.userAccount).toString();

    const resizeImage = (base64Str, maxWidth = 200, maxHeight = 150): Promise<string> => {
        return new Promise((resolve) => {
            let img: HTMLImageElement = document.createElement('img');
            img.src = base64Str;
            img.onload = () => {    
            let canvas = document.createElement('canvas');
            const MAX_WIDTH = maxWidth;
            const MAX_HEIGHT = maxHeight;
            let width = img.width;
            let height = img.height;
        
            if (width > height) {
                if (width > MAX_WIDTH) {
                height *= MAX_WIDTH / width;
                width = MAX_WIDTH;
                }
            } else {
                if (height > MAX_HEIGHT) {
                width *= MAX_HEIGHT / height;
                height = MAX_HEIGHT;
                }
            }
            canvas.width = width;
            canvas.height = height;
            let ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL());
            }
        });
    };

    const updateAvatar = async (avatar: string | null) => {
        const res =  await setUserAvatar((userId).toString(), { avatar });

        if (res) {
            if (res.status === 400) {
                dispatch(catchError(res.message));
            }

            if (avatar) {
                const updatedInfo = await getUserInfo(userId);
                dispatch(catchSuccess(res.message));
                dispatch(getInfo(updatedInfo));
            }

            if (!avatar) {
                dispatch(catchWarning('Avatar have been deleted'));
                setPhoto(null);
            }
        }
    };

    useEffect(() => {
        if (userAvatar) {
            setPhoto(userAvatar);
        }
    }, []);

    const fileRef = createRef<HTMLInputElement>();
    const cropperRef = useRef<CropperRef>();

    const onFileInputChange: React.ChangeEventHandler<HTMLInputElement> = (element) => {
        const file = element.target?.files?.[0];
        if (file) {
            file2Base64(file).then((base64) => {
                setUploaded(base64);
            });
        }
    }

    const onSave = async () => {
        const imageElement: CropperRef = cropperRef?.current;

        setPhoto(imageElement.getCanvas()?.toDataURL());
        setUploaded(null);

        const result = await resizeImage(imageElement.getCanvas()?.toDataURL())

        updateAvatar(result);
    };

    return (
        <div className={styles.container}>
            <input
                type="file"
                hidden={true}
                ref={fileRef}
                onChange={(event) => onFileInputChange(event)}
                accept="image/*"
            />
            <div>
                {photo ? (
                    <>
                        <div className={styles.imageWrapper}>
                            <Image
                                src={photo}
                                style={{ borderRadius: '50%' }}
                                alt="user-avatar"
                                width="150px"
                                height="150px"
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
                        ref={cropperRef}
                        src={uploaded}
                        stencilComponent={CircleStencil}
                    />
                    <button onClick={() => onSave()} className={styles.saveBtn}>Save</button>
                </div>
            )}
        </div>
    );
};

export default Avatar;
