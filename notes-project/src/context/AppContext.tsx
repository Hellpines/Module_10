import { createContext, useState, useEffect } from 'react';
import { notesMock as initialNotes }  from '../mocks/notesMock';
import { Note } from '../types/Note';
import { AppContextParts } from '../types/AppContextParts';
import { AppProviderProps } from '../types/AppProviderProps';

export const AppContext = createContext<AppContextParts | null>(null);

export const AppProvider = ({ children }: AppProviderProps) => {
    const [notes, setNotes] = useState<Note[]>(() => {
        const savedNotes = localStorage.getItem('notes');
        return savedNotes ? JSON.parse(savedNotes) : initialNotes;
    });

    const [theme, setTheme] = useState<string>(() => {
        const savedTheme = localStorage.getItem('app-theme');
        return savedTheme ? savedTheme : 'light';
    });

    useEffect(() => {
        localStorage.setItem('app-theme', theme);
        document.body.setAttribute('data-theme', theme);
    }, [theme]);

    useEffect(() => {
        localStorage.setItem('notes', JSON.stringify(notes));
    }, [notes]);

    const createNote = (note: Note) => {
        setNotes(prev => {
            return [...prev, note];
        });
    }

    const editNote = (updatedNote: Note) => {
        setNotes(prev => {
            return prev.map(note => {
                return note.id === updatedNote.id ? updatedNote : note;
            })
        }
    );
    };
    
    const moveToTrash = (id: number) => {
        setNotes(prev => {
            return prev.map(note => {
                return note.id === id ? { ...note, status: 'trash' } : note;
            })
        })
    };

    const addToArchive = (id: number) => {
        setNotes(prev => {
            return prev.map(note => {
                return note.id === id ? { ...note, status: 'archived' } : note;
            })
        })
    }

    const removeFromArchive = (id: number) => {
        setNotes(prev => {
            return prev.map(note => {
                return note.id === id ? { ...note, status: 'active' } : note;
            })
        })
    }

    const unarchiveAll = () => {
        setNotes(prev => {
            return prev.map(note => {
                return { ...note, status: 'active' };
            });
        });
    };

    const deleteForever = (id: number) => {
        setNotes(prev => {
            return prev.filter(note => note.id !== id);
        })
    }

    const deleteAllFromTrash = () => {
        setNotes(prev => {
            return prev.filter(note => note.status !== 'trash');
        });
    };

    const toggleTheme = () => {
        setTheme(prevTheme => {
            return prevTheme === 'light' ? 'dark' : 'light';
        });
    };

    const toggleCheckbox = (noteId: number, itemId: number) => {
        setNotes(prev => {
            return prev.map(note => {
                if (note.id !== noteId) {
                    return note;
                }

                return {
                    ...note,
                    items: note.items.map(item => {
                        if (item.id !== itemId) {
                            return item;
                        }

                        return {
                            ...item,
                            isChosen: !item.isChosen
                        };
                    })
                };
            });
        });
    };

    const uncheckAll = (noteId: number) => {
        setNotes(prev => {
            return prev.map(note => {
                if (note.id !== noteId) {
                    return note;
                }

                return {
                    ...note,
                    items: note.items.map(item => ({
                        ...item,
                        isChosen: false
                    }))
                };
            });
        });
    };

    return (
        <AppContext.Provider value={{ notes, theme, toggleTheme, createNote, editNote, moveToTrash, addToArchive, removeFromArchive, unarchiveAll, deleteForever, toggleCheckbox, uncheckAll, deleteAllFromTrash }}>
            {children}
        </AppContext.Provider>
    );
};