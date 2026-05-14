import { useContext, useState } from 'react';
import { NavLink } from 'react-router-dom';
import style from './header.module.css';
import Aside from '../Aside/Aside';
import { AuthContext } from '../../context/AuthContext';
import { HeaderProps } from '../../types/HeaderProps';
import avatar from '../../assets/images/avatar.png';
import { ReactComponent as Logo } from '../../assets/images/logo.svg';
import { ReactComponent as BurgerMenuIcon } from '../../assets/icons/burger-menu.svg';

function Header({ pageStatus }: HeaderProps) {
    const authContext = useContext(AuthContext);
    const [isOpenedBurgerMenu, setIsOpenedBurgerMenu] = useState(false);

    const handleBurgerMenu = () => {
        setIsOpenedBurgerMenu(!isOpenedBurgerMenu)
    }

    return (
        <header className={style.header}>
            <Logo className={`${style.logo} ${pageStatus !== 'Authorized' ? style.mobileLogo : ''}`} />

            {pageStatus === 'NotAuthorized' && (
                <div className={style.authLinks}>
                    <NavLink to='/signup'>Sign Up</NavLink>
                    <NavLink to='/signin'>Sign In</NavLink>
                </div>
            )}

            {pageStatus === 'Authorized' && (
                <div className={style.personalShort}>
                    <img src={avatar} alt='avatar' />
                    <p>{authContext?.currentUser?.username}</p>
                </div>
            )}

            {pageStatus !== 'Error' && (
                <button className={style.burgerMenuToggle} onClick={handleBurgerMenu}>
                    <BurgerMenuIcon className={style.burgerMenuIcon} />
                </button>
            )}

            {pageStatus !== 'Error' && isOpenedBurgerMenu &&
                <div className={style.burgerMenuWrapper} onClick={() => setIsOpenedBurgerMenu(false)}>
                    <div className={style.burgerMenu} onClick={(e) => e.stopPropagation()}>
                        <div className={style.burgerMenuHeader}>
                            <Logo className={style.mobileLogo} />
                            {pageStatus === 'Authorized' && <img src={avatar} alt='avatar' />}
                        </div>
                        <div className={style.burgerMenuLinks}>
                            <Aside
                                pageStatus={pageStatus}
                                className={style.burgerMenuAside}
                            />
                        </div>
                    </div>
                </div>
            }
        </header>
    )
}

export default Header