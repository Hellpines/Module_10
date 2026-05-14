import { NavLink } from 'react-router-dom';
import style from './aside.module.css';
import { AsideProps } from '../../types/AsideProps';

function Aside({ pageStatus, className }: AsideProps) {
    return (
        <div>
            {pageStatus === 'Authorized' ?
                <aside className={`${style.aside} ${className}`}>
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
                </aside>
                :
                <aside className={`${style.aside} ${className}`}>
                    <NavLink
                        to='/signin'
                        className={({ isActive }) => {
                            return isActive ? style.active : ''
                        }
                    }>
                        Sign In
                    </NavLink>
        
                    <NavLink
                        to='/signup'
                        className={({ isActive }) => {
                            return isActive ? style.active : ''
                        }
                    }>
                        Sign Up
                    </NavLink>
                </aside>
            }
        </div>
    )
}

export default Aside