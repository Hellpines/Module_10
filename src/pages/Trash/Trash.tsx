import style from './trash.module.css';
import Button from '../../components/UI/Button/Button';
import NoteList from '../../components/NoteList/NoteList';
import { useContext } from 'react';
import { NotesContext } from '../../context/NotesContext';
import Layout from '../../components/Layout/Layout';

function Trash() {
    const { deleteAllFromTrash } = useContext(NotesContext)!;

    return (
        <div>
            <Layout pageStatus='Authorized'>
                <div className={style.wrapperButton}>
                    <Button
                        onClick={deleteAllFromTrash}
                        title='Delete all'
                    />
                </div>
                <NoteList page='Trash' />
            </Layout>
        </div>
    )
}

export default Trash