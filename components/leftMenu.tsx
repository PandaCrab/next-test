import Link from 'next/link';
import React, {useState, useEffect, useRef} from 'react';
import { RiCloseLine, RiMenuFill } from 'react-icons/ri';

import styles from '../styles/LeftMenu.module.scss';

const LeftMenu = (props) => {
    const [isOpen, setOpen] = useState<boolean>(false);
    const [animation, setAnimation] = useState(false);

    const menuDropdownRef: React.MutableRefObject<HTMLDivElement> | null = useRef(null);

    const clickOutside = (event) => {
        const target = event.target

        if (menuDropdownRef.current && !menuDropdownRef.current.contains(target)) {
            setOpen(false);
        }
    };

    const setClassName = animation && isOpen ? 
        `${styles.menuDropdown} ${styles.openMenu}` 
        : `${styles.menuDropdown} ${styles.closeMenu}`;

    const animationEndHandler = ({ animationName }) => {
        if (animationName === 'open-menu') {
            setOpen(true);
        }

        if (animationName === 'close-menu') {
            setOpen(false);
        }
    };

    

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('mousedown', clickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', clickOutside);
        };
    }, [isOpen]);

    return (
        <div 
            className={styles.menuWrapper}
            ref={menuDropdownRef}
        >
            <div
                onClick={() => setOpen(!isOpen)}
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
                {props?.admin && (
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
    )
};

export default LeftMenu;
