import { useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import style from './header.module.css';
import Aside from '../Aside/Aside';
import { useAuth } from '../../hooks/useAuth';
import { HeaderProps } from '../../types/props/HeaderProps';
import { ReactComponent as Logo } from '../../assets/images/logo.svg';
import { ReactComponent as BurgerMenuIcon } from '../../assets/icons/burger-menu.svg';
import { useFocusTrap } from '../../hooks/useFocus';

function Header({ pageStatus }: HeaderProps) {
    const { t } = useTranslation();
    const { currentUser } = useAuth();
    const [isOpenedBurgerMenu, setIsOpenedBurgerMenu] = useState(false);

    const burgerMenuRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);

    const handleOpenBurgerMenu = () => {
        setIsOpenedBurgerMenu(true);
    };

    const handleCloseBurgerMenu = () => {
        setIsOpenedBurgerMenu(false);
        triggerRef.current?.focus();
    };

    useFocusTrap(burgerMenuRef, isOpenedBurgerMenu, handleCloseBurgerMenu);

    return (
        <header className={style.header}>
            <NavLink to='/' aria-label={t('header.homeLink')}>
                <Logo
                    className={`${style.logo} ${pageStatus !== 'Authorized' ? style.mobileLogo : ''}`}
                    aria-hidden='true'
                />
            </NavLink>

            {pageStatus === 'NotAuthorized' && (
                <nav className={style.authLinks} aria-label={t('header.authNavigation')}>
                    <NavLink to='/signup'>{t('header.signUp')}</NavLink>
                    <NavLink to='/signin'>{t('header.signIn')}</NavLink>
                </nav>
            )}

            {pageStatus === 'Authorized' && (
                <div className={style.personalShort}>
                    <img
                        src={`./${currentUser?.profileImage}`}
                        alt={t('header.userAvatar', { username: currentUser?.username })}
                    />
                    <p>{currentUser?.username}</p>
                </div>
            )}

            {pageStatus !== 'Error' && (
                <button
                    ref={triggerRef}
                    className={style.burgerMenuToggle}
                    onClick={handleOpenBurgerMenu}
                    aria-label={t('header.burgerLabel')}
                    aria-expanded={isOpenedBurgerMenu}
                    aria-controls='mobile-navigation'
                >
                    <BurgerMenuIcon className={style.burgerMenuIcon} aria-hidden='true' />
                </button>
            )}

            {pageStatus !== 'Error' && isOpenedBurgerMenu && (
                <div
                    id='mobile-navigation'
                    ref={burgerMenuRef}
                    className={style.burgerMenuWrapper}
                    onClick={handleCloseBurgerMenu}
                    role='dialog'
                    aria-modal='true'
                    aria-label={t('header.mobileMenuTitle')}
                >
                    <div className={style.burgerMenu} onClick={(e) => e.stopPropagation()}>
                        <div className={style.burgerMenuHeader}>
                            <Logo className={style.mobileLogo} aria-hidden='true' />
                            {pageStatus === 'Authorized' && (
                                <img src={currentUser?.profileImage} alt={t('header.avatar')} />
                            )}
                        </div>
                        <div className={style.burgerMenuLinks}>
                            <Aside pageStatus={pageStatus} className={style.burgerMenuAside} />
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}

export default Header;
