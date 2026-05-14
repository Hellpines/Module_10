import style from './layout.module.css';
import { LayoutProps } from '../../types/LayoutProps';
import Header from '../Header/Header';
import Aside from '../Aside/Aside';
import Footer from '../Footer/Footer';

function Layout({ pageStatus, children }: LayoutProps) {
    return (
        <div className={style.layout}>
            <Header pageStatus={pageStatus} />
            {pageStatus === 'Authorized' ?
                <div className={style.wrapper}>
                    <Aside pageStatus={pageStatus} />
                    <main className={style.main}>
                        {children}
                    </main>
                </div>
                :
                children
            }
            <Footer />
        </div>
    )
}

export default Layout