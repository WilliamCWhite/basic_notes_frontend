import { useState } from 'react'

import NoteListItem from './NoteListItem.jsx'

import '../styles/Sidebar.css'

function Sidebar({ notesArray, selectedNotesIndex, switchNote, sortNotesArray, sortProperty, setSortProperty, sortMethod, setSortMethod, createNewNote, deleteNote }) { 

    const noteListItems = notesArray.map((note, index) => {
        return <NoteListItem key={note.note_id} note={note} switchNote={switchNote} noteIndex={index} deleteNote={deleteNote}/>
    })

    function handleSortPropertyButton() {
        if (sortProperty === "time_modified") {
            setSortProperty("time_created");
        } else if (sortProperty === "time_created") {
            setSortProperty("title");
        } else {
            setSortProperty("time_modified");
        }
        sortNotesArray(notesArray);
    }

    function handleSortMethodButton() {
        if (sortMethod === "DESC") {
            setSortMethod("ASC");
        }
        else {
            setSortMethod("DESC");
        }
        sortNotesArray(notesArray);
    }

    return (
        <nav id='sidebar'>
            <div className='sidebar-button-bar'>
                <button id='sort-property-button' onClick={handleSortPropertyButton} className='sidebar-button'>PROP</button>
                <button id='sort-method-button' onClick={handleSortMethodButton} className='sidebar-button'>ORDER</button>
                <button id='create-note-button' onClick={createNewNote} className='sidebar-button'>+</button>
            </div>
            <div id='note-list-container'>
                {noteListItems}
            </div>
        </nav>
    )
}

export default Sidebar