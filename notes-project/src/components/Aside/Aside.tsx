import { NavLink } from 'react-router-dom'
import style from './aside.module.css'

function Aside() {
    return (
        <aside className={style.aside}>
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
    )
}

export default Aside