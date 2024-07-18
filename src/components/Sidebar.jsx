import { useState } from 'react'

import NoteListItem from './NoteListItem.jsx'

import '../styles/Sidebar.css'

function Sidebar({ notesArray, selectedNotesIndex, switchNote }) { 

    const noteListItems = notesArray.map((note, index) => {
        return <NoteListItem key={note.id} note={note} switchNote={switchNote} noteIndex={index}/>
    })

    return (
        <nav id='sidebar'>
            <div className='sidebar-button-bar'>
                <button id='sort-button' className='sidebar-button'></button>
                <button id='order-button' className='sidebar-button'></button>
                <button id='create-note-button' className='sidebar-button'></button>
            </div>
            <div id='note-list-container'>
                {noteListItems}
            </div>
        </nav>
    )
}

export default Sidebar