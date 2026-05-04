// import { useContext } from 'react'
// import Button from '../UI/Button/Button'
// import { AuthContext } from '../../context/AuthContext'
import style from './header.module.css'
import { HeaderProps } from '../../types/HeaderProps'
import { useState } from 'react'
import { NavLink } from 'react-router-dom';
import logo from '../../assets/images/logo.svg'
import avatar from '../../assets/images/avatar.svg'
import burgerMenu from '../../assets/icons/burger-menu.svg'

function Header({ pageType }: HeaderProps) {
    // const authContext = useContext(AuthContext);
    const [isOpenedBurgerMenu, setIsOpenedBurgerMenu] = useState(false);

    const handleBurgerMenu = () => {
        setIsOpenedBurgerMenu(!isOpenedBurgerMenu)
    }

    return (
        <header>
            <img 
                src={logo} 
                className={pageType !== 'Authorized' ? style.mobile_logo : ''}
                alt='logo' 
            />
            {pageType === 'NotAuthorized' && (
                <div className={style.auth_links}>
                    <a href='/signup'>Sign Up</a>
                    <a href='/signin'>Sign In</a>
                </div>
            )}

            {pageType === 'Authorized' && (
                <div className={style.personal_short}>
                    <img src={avatar} alt='avatar'/>
                    <p>Name Surname</p>
                    {/* <Button
                        onClick={() => authContext?.signOut()}
                        title='logout'
                    /> */}
                </div>
            )}

            {pageType !== 'Error' && (
                <button className={style.burgerMenu_toggle} onClick={handleBurgerMenu}>
                    <img src={burgerMenu} alt="burger-menu" />
                </button>
            )}
            {pageType !== 'Error' && isOpenedBurgerMenu && 
                <div className={style.burgerMenu_wrapper} onClick={() => setIsOpenedBurgerMenu(false)}>
                    <div className={style.burger_menu} onClick={(e) => e.stopPropagation()}>
                        <div className={style.burgerMenu_header}>
                            <img 
                                src={logo}
                                className={style.mobile_logo}
                                alt='logo' 
                            />
                            {pageType === 'Authorized' && <img src={avatar} alt='avatar'/>}
                        </div>
                        {pageType === 'Authorized' ? 
                            <div className={style.links}>
                                <NavLink
                                    to='/'
                                    className={({ isActive }) => {
                                        return isActive ? style.active : ''
                                    }
                                }>
                                    Notes
                                </NavLink>

                                <NavLink
                                    to='/profile'
                                    className={({ isActive }) => {
                                        return isActive ? style.active : ''
                                    }
                                }>
                                    Profile
                                </NavLink>

                                <NavLink
                                    to='/archived'
                                    className={({ isActive }) => {
                                        return isActive ? style.active : ''
                                    }
                                }>
                                    Archived
                                </NavLink>

                                <NavLink
                                    to='/trash'
                                    className={({ isActive }) => {
                                        return isActive ? style.active : ''
                                    }
                                }>
                                    Trash
                                </NavLink>
                            </div>
                            :
                            <div className={style.links}>
                                <NavLink
                                    to='/signup'
                                    className={({ isActive }) => {
                                        return isActive ? style.active : ''
                                    }
                                }>
                                    Sign Up
                                </NavLink>

                                <NavLink
                                    to='/signin'
                                    className={({ isActive }) => {
                                        return isActive ? style.active : ''
                                    }
                                }>
                                    Sign In
                                </NavLink>
                            </div>
                        }
                    </div>
                </div>
            }
        </header>
    )
}

export default Header