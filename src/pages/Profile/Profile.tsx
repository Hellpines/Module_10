import { useContext } from 'react';
import style from './profile.module.css';
import Layout from '../../components/Layout/Layout';
import Button from '../../components/UI/Button/Button';
import { ThemeToggle } from '../../components/ThemeToggle/ThemeToggle';
import { AuthContext } from '../../context/AuthContext';
import { ReactComponent as ArrowIcon } from '../../assets/icons/arrow-icon.svg';

function Profile() {
    const authContext = useContext(AuthContext);

    return (
        <Layout pageStatus='Authorized'>
            <div className={style.expandContainer}>
                <p>Profile info</p>
                <button>
                    <ArrowIcon className={style.arrowIcon} />
                </button>
            </div>

            <div className={style.profileInfo}>
                <Button
                    onClick={() => authContext?.signOut()}
                    title='logout'
                />
            </div>

            <div className={style.expandContainer}>
                <p>Settings</p>
                <button>
                    <ArrowIcon className={style.arrowIcon} />
                </button>
            </div>

            <div className={style.settings}>
                <ThemeToggle />
            </div>
        </Layout>
    )
}

export default Profile