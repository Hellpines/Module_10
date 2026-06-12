'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import style from './aside.module.css';
import { AsideProps } from '../../types/props/AsideProps';
import { usePathname } from 'next/navigation';

function Aside({ pageStatus, className }: AsideProps) {
    const { t } = useTranslation();
    const pathname = usePathname();

    return (
        <aside>
            <nav className={`${style.nav} ${className}`} aria-label={t('aside.navigationLabel')}>
                <ul className={style.navList}>
                    {pageStatus === 'Authorized' ? (
                        <>
                            <li>
                                <Link href='/' className={pathname === '/' ? style.active : ''}>
                                    {t('aside.notes')}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href='/profile'
                                    className={pathname === '/profile' ? style.active : ''}
                                >
                                    {t('aside.profile')}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href='/archived'
                                    className={pathname === '/archived' ? style.active : ''}
                                >
                                    {t('aside.archive')}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href='/trash'
                                    className={pathname === '/trash' ? style.active : ''}
                                >
                                    {t('aside.trash')}
                                </Link>
                            </li>
                        </>
                    ) : (
                        <>
                            <li>
                                <Link
                                    href='/signin'
                                    className={pathname === '/signin' ? style.active : ''}
                                >
                                    {t('aside.signIn')}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href='/signup'
                                    className={pathname === '/signup' ? style.active : ''}
                                >
                                    {t('aside.signUp')}
                                </Link>
                            </li>
                        </>
                    )}
                </ul>
            </nav>
        </aside>
    );
}

export default Aside;
