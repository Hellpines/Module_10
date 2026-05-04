import Aside from '../../components/Aside/Aside'
import Header from '../../components/Header/Header'
import style from './archived.module.css'
import Button from '../../components/UI/Button/Button'
import Footer from '../../components/Footer/Footer'
import NoteList from '../../components/NoteList/NoteList'
import { useContext } from 'react'
import { AppContext } from '../../context/AppContext'

function Archived() {
    const { unarchiveAll } = useContext(AppContext)!

    return (
        <div>
            <Header pageType='Authorized' />
            <div className={style.wrapper}>
                <Aside/>
                <main>
                    <div className={style.wrapper_button}>
                        <Button 
                            className={style.unarchive_button}
                            onClick={unarchiveAll}
                            title='Unarchive all'
                        />
                    </div>
                    <NoteList 
                        pageType='Archived'
                    />
                </main>
            </div>
            <Footer/>
        </div>
    )
}

export default Archived