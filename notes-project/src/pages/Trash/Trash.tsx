import Aside from '../../components/Aside/Aside'
import Header from '../../components/Header/Header'
import style from './trash.module.css'
import Button from '../../components/UI/Button/Button'
import Footer from '../../components/Footer/Footer'
import NoteList from '../../components/NoteList/NoteList'
import { useContext } from 'react'
import { AppContext } from '../../context/AppContext'

function Trash() {
    const { deleteAllFromTrash } = useContext(AppContext)!;

    return (
        <div>
            <Header pageType='Authorized' />
            <div className={style.wrapper}>
                <Aside/>
                <main>
                    <div className={style.wrapper_button}>
                        <Button 
                            className={style.unarchive_button}
                            onClick={deleteAllFromTrash}
                            title='Delete all'
                        />
                    </div>
                    <NoteList pageType='Trash' />
                </main>
            </div>
            <Footer/>
        </div>
    )
}

export default Trash