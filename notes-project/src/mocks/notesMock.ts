import { Note } from '../types/Note'

export const notesMock: Note[] = [
    { 
        id: 1, 
        title: 'Homework', 
        items: [
            { id: 1, title: '1. write a code', isChosen: false }, 
            { id: 2, title: '2. review', isChosen: false }
        ],
        status: 'active'
    },
    { 
        id: 2, 
        title: 'Housework', 
        items: [
            { id: 3, title: '1. take a vacuum', isChosen: false },
            { id: 4, title: '2. start ironing', isChosen: false },
            { id: 5, title: '3. start wash a dishes', isChosen: false }
        ],
        status: 'active'
    },
    { 
        id: 3, 
        title: '', 
        items: [
            { id: 6, title: 'for test 1', isChosen: false },
            { id: 7, title: 'for test 2', isChosen: false }
        ],
        status: 'active'
    },
]