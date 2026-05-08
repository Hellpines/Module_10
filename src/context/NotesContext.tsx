import { createContext, useEffect, useCallback, useContext, useMemo, useState } from 'react';
import { Note } from '../types/Note';
import { NotesContextParts } from '../types/NotesContextParts';
import { ProviderProps } from '../types/ProviderProps';
import { AuthContext } from './AuthContext';

export const NotesContext = createContext<NotesContextParts | null>(null);

export const NotesProvider = ({ children }: ProviderProps) => {
    const { currentUser, setCurrentUser, setUsers } = useContext(AuthContext)!;

    const notes = useMemo(() => {
        return currentUser?.notes || [];
    }, [currentUser]);

    useEffect(() => {
        localStorage.setItem('notes', JSON.stringify(notes));
    }, [notes]);

    const updateUserNotes = useCallback((updatedNotes: Note[]) => {
        if (!currentUser) return;

        const updatedUser = {
            ...currentUser,
            notes: updatedNotes
        };

        setCurrentUser(updatedUser);

        setUsers(prev =>
            prev.map(user => {
                return user.id === updatedUser.id ? updatedUser : user
            })
        );
    }, [currentUser, setCurrentUser, setUsers]);

    const [checkboxFlags, setCheckboxFlags] = useState<Record<number, boolean>>(() => {
        const saved = localStorage.getItem('note-checkbox-flags');
        return saved ? JSON.parse(saved) : {};
    });

    useEffect(() => {
        localStorage.setItem('note-checkbox-flags', JSON.stringify(checkboxFlags));
    }, [checkboxFlags]);

    const toggleCheckboxVisibility = useCallback((noteId: number) => {
        setCheckboxFlags(prev => {
            return {
                ...prev,
                [noteId]: !prev[noteId]
            }
        });
    }, []);

    const isCheckboxVisible = useCallback((noteId: number) => {
        return Boolean(checkboxFlags[noteId])
    }, [checkboxFlags]);

    const createNote = useCallback((note: Note) => {
        updateUserNotes([...notes, note]);
    }, [notes, updateUserNotes]);

    const editNote = useCallback((updatedNote: Note) => {
        const updated = notes.map(note => {
            return note.id === updatedNote.id ? updatedNote : note
        });

        updateUserNotes(updated);
    }, [notes, updateUserNotes]);

    const moveToTrash = useCallback((id: number) => {
        updateUserNotes(notes.map(note => {
            return note.id === id ? { ...note, status: 'trash' } : note;
        }));
    }, [notes, updateUserNotes])

    const addToArchive = useCallback((id: number) => {
        updateUserNotes(notes.map(note => {
            return note.id === id ? { ...note, status: 'archived' } : note;
        }));
    }, [notes, updateUserNotes])

    const removeFromArchive = useCallback((id: number) => {
        updateUserNotes(notes.map(note => {
            return note.id === id ? { ...note, status: 'active' } : note;
        }));
    }, [notes, updateUserNotes])

    const unarchiveAll = useCallback(() => {
        updateUserNotes(notes.map(note => {
            if (note.status === 'archived') {
                return { ...note, status: 'active' };
            } else {
                return { ...note }
            }
        }));
    }, [notes, updateUserNotes]);

    const deleteForever = useCallback((id: number) => {
        updateUserNotes(notes.filter(note => note.id !== id));
    }, [notes, updateUserNotes]);

    const deleteAllFromTrash = useCallback(() => {
        updateUserNotes(notes.filter(note => note.status !== 'trash'));
    }, [notes, updateUserNotes]);

    const toggleCheckbox = useCallback((noteId: number, itemId: number) => {
        const updated = notes.map(note => {
            if (note.id !== noteId) {
                return note;
            }

            return {
                ...note,
                items: note.items.map(item => {
                    return item.id === itemId ? { ...item, isChosen: !item.isChosen } : item
                })
            };
        });

        updateUserNotes(updated);
    }, [notes, updateUserNotes]);

    const uncheckAll = useCallback((noteId: number) => {
        updateUserNotes(notes.map(note => {
            if (note.id !== noteId) {
                return note;
            }

            return {
                ...note,
                items: note.items.map(item => {
                    return { ...item, isChosen: false }
                })
            };
        }));
    }, [notes, updateUserNotes]);

    return (
        <NotesContext.Provider value={{ notes, createNote, editNote, moveToTrash, addToArchive, removeFromArchive, unarchiveAll, deleteForever, toggleCheckbox, uncheckAll, deleteAllFromTrash, toggleCheckboxVisibility, isCheckboxVisible }}>
            {children}
        </NotesContext.Provider>
    );
};