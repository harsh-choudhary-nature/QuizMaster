import React, { useState } from 'react';
import styles from '../styles/Navbar.module.css';
import { Link } from 'react-router-dom';

const links = ["Games", "Blogs", "Login", "Register"];
const navRoutes = ["/games", "/blogs", "/auth/login", "/auth/register"];

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <nav className={styles.navbar}>
                <div className={styles.navbarBrand}>WittyWhiz</div>
                <ul className={styles.navbarLinks}>
                    {links.map((link, index) => (
                        <li key={link}>
                            {/* Use Link for proper routing */}
                            <Link to={navRoutes[index]} className={styles.navbarLink}>
                                {link}
                            </Link>
                        </li>
                    ))}
                </ul>
                <button className={styles.hamburger} onClick={() => setIsOpen(!isOpen)}>
                    &#9776;
                </button>
            </nav>

            {isOpen && (
                <>
                    <div className={styles.overlay} onClick={() => setIsOpen(false)}></div>
                    <div className={styles.sidebar}>
                        <div className={styles.sidebarHeader}>
                            <span>Menu</span>
                            <button className={styles.closeBtn} onClick={() => setIsOpen(false)}>&times;</button>
                        </div>
                        <ul className={styles.sidebarLinks}>
                            {links.map((link, index) => (
                                <li key={link}>
                                    {/* Use Link for proper routing */}
                                    <Link to={navRoutes[index]} className={styles.navbarLink}>
                                        {link}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </>
            )}
        </>
    );
}
