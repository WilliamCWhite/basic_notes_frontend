import { useState, useEffect } from 'react'

import NoteListItem from './NoteListItem.jsx'

import '../styles/Sidebar.css'

function Sidebar({ notesArray, selectedNoteId, switchNote, sortNotesArray, sortMethod, setSortMethod, createNewNote, deleteNote }) { 

    const [sortedNotesArray, setSortedNotesArray] = useState([]);

    // Re-sort notes upon certain changes
    useEffect(() => {
        const newSortedNotesArray = sortNotesArray([...notesArray]); 
        setSortedNotesArray(newSortedNotesArray);
    }, [notesArray, sortMethod]);

    function sortNotesArray(tempNotesArray) {
        function compareFunction(a, b) {
            const [sortProperty, sortOrder] = sortMethod.split("-")

            let result = 0;
            if (a[sortProperty] < b[sortProperty]) result = -1;
            else if (a[sortProperty] > b[sortProperty]) result = 1;

            if (sortOrder === "DESC") result *= -1;
            return result;
        }
        return tempNotesArray.toSorted(compareFunction);
    }

    function getSelectedNoteSortedIndex() {
        return sortedNotesArray.findIndex(note => note.note_id === selectedNoteId);
    }
    
    function handleMethodChange(event) {
        setSortMethod(event.target.value);
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
                isSelected={isSelected}
            />
        );
    });

    return (
        <nav id='sidebar'>
            <div className='sidebar-button-bar'>
                <button id='create-note-button' onClick={createNewNote} className='sidebar-button'>
                    <svg className="create-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" data-name="Layer 1">
                        <path fill="currentColor" d="m12 0a12 12 0 1 0 12 12 12.013 12.013 0 0 0 -12-12zm0 22a10 10 0 1 1 10-10 10.011 10.011 0 0 1 -10 10zm5-10a1 1 0 0 1 -1 1h-3v3a1 1 0 0 1 -2 0v-3h-3a1 1 0 0 1 0-2h3v-3a1 1 0 0 1 2 0v3h3a1 1 0 0 1 1 1z"/>
                    </svg>
                </button>
                <div className='filter-wrapper'>
                    <svg className="filter-icon" xmlns="http://www.w3.org/2000/svg" data-name="Layer 1" viewBox="0 0 24 24">
                        <path fill="currentColor" d="m18,5c0-1.654-1.346-3-3-3H3c-1.654,0-3,1.346-3,3v2.37l6,7v4.13l6,4.5v-8.63l6-7v-2.37Zm-2,1.63l-6,7v5.37l-2-1.5v-3.87L2,6.63v-1.63c0-.551.449-1,1-1h12c.551,0,1,.449,1,1v1.63Zm-2,12.37h10v2h-10v-2Zm0-4h10v2h-10v-2Zm10-4v2h-8.192l1.714-2h6.477Z"/>
                    </svg>
                    <select id='sort-method-select' name="sortMethodSelect" defaultValue={sortMethod} onChange={handleMethodChange}>
                        <option value="time_modified-DESC">Time Modified (new to old)</option>
                        <option value="time_modified-ASC">Time Modified (old to new)</option>
                        <option value="time_created-DESC">Time Created (new to old)</option>
                        <option value="time_created-ASC">Time Created (old to new)</option>
                        <option value="title-ASC">Title (A to Z)</option>
                        <option value="title-DESC">Title (Z to A)</option>
                    </select>
                </div>
                <button id='delete-note-button' onClick={() => deleteNote(selectedNoteId)} className='sidebar-button'>
                    <svg className="delete-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="512" height="512">
                        <path fill="currentColor" d="M21,4H17.9A5.009,5.009,0,0,0,13,0H11A5.009,5.009,0,0,0,6.1,4H3A1,1,0,0,0,3,6H4V19a5.006,5.006,0,0,0,5,5h6a5.006,5.006,0,0,0,5-5V6h1a1,1,0,0,0,0-2ZM11,2h2a3.006,3.006,0,0,1,2.829,2H8.171A3.006,3.006,0,0,1,11,2Zm7,17a3,3,0,0,1-3,3H9a3,3,0,0,1-3-3V6H18Z"/>
                        <path fill="currentColor" d="M10,18a1,1,0,0,0,1-1V11a1,1,0,0,0-2,0v6A1,1,0,0,0,10,18Z"/>
                        <path fill="currentColor" d="M14,18a1,1,0,0,0,1-1V11a1,1,0,0,0-2,0v6A1,1,0,0,0,14,18Z"/>
                    </svg>
                </button>
            </div>
            <div id='note-list-container'>
                {noteListItems}
            </div>
        </nav>
    );
}

export default Sidebar
