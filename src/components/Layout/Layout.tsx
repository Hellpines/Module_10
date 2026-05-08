import { LayoutProps } from '../../types/LayoutProps';
import Aside from '../Aside/Aside';
import Footer from '../Footer/Footer';
import Header from '../Header/Header';
import style from './layout.module.css';

function Layout({ pageStatus, children }: LayoutProps) {
    return (
        <div className={style.layout}>
            <Header pageStatus={pageStatus} />
            <div className={style.wrapper}>
                {pageStatus === 'Authorized' && <Aside pageStatus={pageStatus} />}
                <main className={style.main}>
                    {children}
                </main>
            </div>
            <Footer />
        </div>
    )
}

export default Layout