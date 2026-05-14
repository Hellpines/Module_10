import { useContext } from 'react';
import style from './archived.module.css';
import { NotesContext } from '../../context/NotesContext';
import Layout from '../../components/Layout/Layout';
import Button from '../../components/UI/Button/Button';
import NoteList from '../../components/NoteList/NoteList';

function Archived() {
    const { unarchiveAll } = useContext(NotesContext)!

    return (
        <div>
            <Layout pageStatus='Authorized'>
                <div className={style.wrapperButton}>
                    <Button
                        onClick={unarchiveAll}
                        title='Unarchive all'
                    />
                </div>
                <NoteList page='Archived' />
            </Layout>
        </div>
    )
}

export default Archived