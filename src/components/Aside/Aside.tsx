'use client';

import { useTranslation } from 'react-i18next';
import { AppLink } from '@/components/Navigation/AppLink';
import { APP_ROUTES, isActiveRoute } from '@/lib/navigation/app-routes';
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
                                <AppLink
                                    href={APP_ROUTES.home}
                                    className={
                                        isActiveRoute(pathname, APP_ROUTES.home) ? style.active : ''
                                    }
                                >
                                    {t('aside.notes')}
                                </AppLink>
                            </li>
                            <li>
                                <AppLink
                                    href={APP_ROUTES.profile}
                                    className={
                                        isActiveRoute(pathname, APP_ROUTES.profile)
                                            ? style.active
                                            : ''
                                    }
                                >
                                    {t('aside.profile')}
                                </AppLink>
                            </li>
                            <li>
                                <AppLink
                                    href={APP_ROUTES.archived}
                                    className={
                                        isActiveRoute(pathname, APP_ROUTES.archived)
                                            ? style.active
                                            : ''
                                    }
                                >
                                    {t('aside.archive')}
                                </AppLink>
                            </li>
                            <li>
                                <AppLink
                                    href={APP_ROUTES.trash}
                                    className={
                                        isActiveRoute(pathname, APP_ROUTES.trash)
                                            ? style.active
                                            : ''
                                    }
                                >
                                    {t('aside.trash')}
                                </AppLink>
                            </li>
                        </>
                    ) : (
                        <>
                            <li>
                                <AppLink
                                    href={APP_ROUTES.signIn}
                                    className={
                                        isActiveRoute(pathname, APP_ROUTES.signIn)
                                            ? style.active
                                            : ''
                                    }
                                >
                                    {t('aside.signIn')}
                                </AppLink>
                            </li>
                            <li>
                                <AppLink
                                    href={APP_ROUTES.signUp}
                                    className={
                                        isActiveRoute(pathname, APP_ROUTES.signUp)
                                            ? style.active
                                            : ''
                                    }
                                >
                                    {t('aside.signUp')}
                                </AppLink>
                            </li>
                        </>
                    )}
                </ul>
            </nav>
        </aside>
    );
}

export default Aside;
