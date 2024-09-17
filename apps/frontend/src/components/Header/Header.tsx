'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Header.module.scss';

interface HeaderLink {
  id: number;
  name: string;
  path: string;
}

const links: HeaderLink[] = [
  {
    id: 1,
    name: 'Home',
    path: '/',
  },
  {
    id: 2,
    name: 'Pets',
    path: '/pets',
  },
  {
    id: 3,
    name: 'Login',
    path: '/login',
  },
  {
    id: 4,
    name: 'Account',
    path: '/account',
  },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <>
      <header className={styles.header}>
        <div className={styles.container}>
          <Link href="/" className={styles.logo}>
            Pets
          </Link>
          <nav className={styles.nav}>
            <ol className={styles.links}>
              {links &&
                links.map(link => (
                  <li
                    key={link.id}
                    className={
                      pathname === link.path ? styles.linkActive : styles.link
                    }
                  >
                    <Link href={link.path}>{link.name}</Link>
                  </li>
                ))}
            </ol>
          </nav>
        </div>
      </header>
      <div className={styles.spacer} />
    </>
  );
}
