import Link from 'next/link';
import React, {useState, useRef} from 'react';
import { RiCloseLine, RiMenuFill } from 'react-icons/ri';
import { useClickOutside } from '../hooks';

import styles from '../styles/LeftMenu.module.scss';

const LeftMenu: React.FC<{ admin: boolean }> = ({ admin }) => {
    const [isOpen, setOpen] = useState<boolean>(false);
    const [animation, setAnimation] = useState<boolean>(false);

    const menuDropdownRef: React.MutableRefObject<HTMLDivElement> | null = useRef(null);

    useClickOutside(menuDropdownRef, isOpen, () => setOpen(false));

    const setClassName = `${styles.menuDropdown} ${animation && (isOpen ? styles.openMenu :  styles.closeMenu)}`;

    const animationEndHandler: (arg0: React.AnimationEvent) => void = ({ animationName }) => {
        if (animationName === 'open-menu') {
            setOpen(true);
            setAnimation(true);
        }

        if (animationName === 'close-menu') {
            setOpen(false);
            setAnimation(false);
        }
    };

    const toggleMenu = () => {
        setAnimation(true);

        setOpen(!isOpen);

        if (isOpen) {
            setAnimation(false);
        }
    };

    return (
        <div 
            className={styles.menuWrapper}
            ref={menuDropdownRef}
        >
            <div
                onClick={() => toggleMenu()}
                className={styles.menuBtn}
            >
                <RiMenuFill />
            </div>
            <div 
                className={setClassName}
                onAnimationEnd={(event) => animationEndHandler(event)}
            >
                <div 
                    className={styles.closeBtn}
                    onClick={() => setOpen(false)}
                >
                    <RiCloseLine />
                </div>
                <Link href="/">
                    <a
                        onClick={() => setOpen(false)}
                        className={styles.menuItems}
                    >
                        Home
                    </a>
                </Link>
                <Link href="/shop">
                    <a
                        onClick={() => setOpen(false)}
                        className={styles.menuItems}
                    >
                        Shop
                    </a>
                </Link>
                {admin && (
                    <Link href="/admin">
                        <a
                            onClick={() => setOpen(false)}
                            className={styles.menuItems}
                        >
                            Admin
                        </a>
                    </Link>
                )}
                <Link href="/shop/categories">
                    <a
                        onClick={() => setOpen(false)}
                        className={styles.menuItems}
                    >
                        Categories
                    </a>
                </Link>
            </div>
        </div>
    );
};

export default LeftMenu;
