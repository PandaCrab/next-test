import Image from 'next/image';
import React, { useState, useEffect, createRef } from 'react';
import { Cropper, ReactCropperElement } from 'react-cropper';
import { RiUser3Line } from 'react-icons/ri';

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
    const [cropped, setCropped] = useState<string | null>(null);

    const cropperRef = createRef<ReactCropperElement>();
    const fileRef = createRef<HTMLInputElement>();

    const onFileInputChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        const file = e.target?.files?.[0];
        if (file) {
            file2Base64(file).then((base64) => {
                setUploaded(base64);
            });
        }
    }

    const onCrop = () => {
        const imageElement: any = cropperRef?.current;
        const cropper: any = imageElement?.cropper;
        setCropped(cropper.getCroppedCanvas().toDataURL())
    }

    return (
        <div className={styles.avatarContainer}>

            {cropped ? (
                <div className={styles.imageWrapper}>
                    <Image
                        src={cropped}
                        alt="user-avatar"
                        width={20}
                        height={20}
                    />
                </div>
            ) : (
                <>
                    <input
                        type="file"
                        hidden={true}
                        ref={fileRef}
                        onChange={(event) => onFileInputChange(event)}
                        accept="image/png,image/jpeg,image/jpg,image/gif"
                    />
                    <RiUser3Line />
                    <button onClick={() => fileRef.current?.click()} className="btns">Load photo</button>
                </>
            )}
            {uploaded && (
                <div className={styles.cropperContainer}>
                    <Cropper
                        src={uploaded}
                        style={{ height: 20, width: 20 }}
                        autoCropArea={1}
                        aspectRatio={1}
                        viewMode={3}
                        guides={true}
                        ref={cropperRef}
                    />
                    <button style={{ zIndex: 1000 }} onClick={() => onCrop()} className="btns">Save</button>

                </div>
            )}
        </div>
    );
};

export default Avatar;
