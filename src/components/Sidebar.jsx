import { useState } from 'react'

import NoteListItem from './NoteListItem.jsx'

import '../styles/Sidebar.css'

function Sidebar({ notesArray, selectedNotesIndex, switchNote, searchProperty, changeSearchProperty, sortMethod, changeSortMethod, createNewNote }) { 

    const noteListItems = notesArray.map((note, index) => {
        return <NoteListItem key={note.note_id} note={note} switchNote={switchNote} noteIndex={index}/>
    })

    function handleSearchButton() {
        console.log("Search Button Pressed");
    }

    function handleSortButton() {
        console.log("Sort button pressed");
        console.log(sortMethod);
        if (sortMethod === "DESC") {
            changeSortMethod("ASC");
        }
        else {
            changeSortMethod("DESC");
        }
    }

    return (
        <nav id='sidebar'>
            <div className='sidebar-button-bar'>
                <button id='search-button' onClick={handleSearchButton} className='sidebar-button'>ORDER</button>
                <button id='sort-button' onClick={handleSortButton} className='sidebar-button'>SORT</button>
                <button id='create-note-button' onClick={createNewNote} className='sidebar-button'>+</button>
            </div>
            <div id='note-list-container'>
                {noteListItems}
            </div>
        </nav>
    )
}

export default Sidebar