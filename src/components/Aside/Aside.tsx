import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import style from './aside.module.css';
import { AsideProps } from '../../types/props/AsideProps';

function Aside({ pageStatus, className }: AsideProps) {
    const { t } = useTranslation();

    return (
        <aside>
            <nav className={`${style.nav} ${className}`} aria-label={t('aside.navigationLabel')}>
                <ul className={style.navList}>
                    {pageStatus === 'Authorized' ? (
                        <>
                            <li>
                                <NavLink
                                    to='/'
                                    className={({ isActive }) => (isActive ? style.active : '')}
                                >
                                    {t('aside.notes')}
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to='/profile'
                                    className={({ isActive }) => (isActive ? style.active : '')}
                                >
                                    {t('aside.profile')}
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to='/archived'
                                    className={({ isActive }) => (isActive ? style.active : '')}
                                >
                                    {t('aside.archive')}
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to='/trash'
                                    className={({ isActive }) => (isActive ? style.active : '')}
                                >
                                    {t('aside.trash')}
                                </NavLink>
                            </li>
                        </>
                    ) : (
                        <>
                            <li>
                                <NavLink
                                    to='/signin'
                                    className={({ isActive }) => (isActive ? style.active : '')}
                                >
                                    {t('aside.signIn')}
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to='/signup'
                                    className={({ isActive }) => (isActive ? style.active : '')}
                                >
                                    {t('aside.signUp')}
                                </NavLink>
                            </li>
                        </>
                    )}
                </ul>
            </nav>
        </aside>
    );
}

export default Aside;
