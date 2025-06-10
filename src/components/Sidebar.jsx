import { useState, useEffect } from 'react'

import NoteListItem from './NoteListItem.jsx'

import '../styles/Sidebar.css'

function Sidebar({ notesArray, selectedNoteId, switchNote, sortNotesArray, sortProperty, setSortProperty, sortMethod, setSortMethod, createNewNote, deleteNote }) { 

    const [sortedNotesArray, setSortedNotesArray] = useState([]);

    // Re-sort notes upon certain changes
    useEffect(() => {
        const newSortedNotesArray = sortNotesArray([...notesArray]); 
        setSortedNotesArray(newSortedNotesArray);
    }, [notesArray, sortProperty, sortMethod]);

    function sortNotesArray(tempNotesArray) {
        function compareFunction(a, b) {
            let result = 0;
            if (a[sortProperty] < b[sortProperty]) result = -1;
            else if (a[sortProperty] > b[sortProperty]) result = 1;

            if (sortMethod === "DESC") result *= -1;
            if (sortProperty === "title") result *= -1;
            return result;
        }
        return tempNotesArray.toSorted(compareFunction);
    }

    function getSelectedNoteSortedIndex() {
        return sortedNotesArray.findIndex(note => note.note_id === selectedNoteId);
    }
    
    const noteListItems = sortedNotesArray.map((note, index) => {
        let isSelected = false;
        if (index === getSelectedNoteSortedIndex()) {
            isSelected = true;
        }

        return (
            <NoteListItem 
                key={note.note_id} 
                note={note} 
                switchNote={switchNote} 
                deleteNote={deleteNote}
                isSelected={isSelected}
            />
        );
    });

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
    );
}

export default Sidebar
