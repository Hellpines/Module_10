import Footer from '../../components/Footer/Footer'
import Header from '../../components/Header/Header'
import style from './noauthpage.module.css'

function NotAuthPage() {
    return (
        <div>
            <Header pageType='NotAuthorized'/>
            <main className={style.main}>
                <h1>You need to <a href='/signin'>sign in</a> to be able to create notes.</h1>
                <p>Still don’t have an account? <a href='/signup'>Sign up</a></p>
            </main>
            <Footer/>
        </div>
    )
}

export default NotAuthPage