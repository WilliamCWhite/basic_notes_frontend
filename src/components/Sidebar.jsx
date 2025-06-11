import { useState, useEffect } from 'react'

import NoteListItem from './NoteListItem.jsx'

import '../styles/Sidebar.css'

function Sidebar({ notesArray, selectedNoteId, switchNote, sortNotesArray, sortMethod, setSortMethod, createNewNote }) { 

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
                <select name="sortMethodSelect" defaultValue={sortMethod} onChange={handleMethodChange}>
                    <option value="time_modified-DESC">Time Modified (new to old)</option>
                    <option value="time_modified-ASC">Time Modified (old to new)</option>
                    <option value="time_created-DESC">Time Created (new to old)</option>
                    <option value="time_created-ASC">Time Created (old to new)</option>
                    <option value="title-ASC">Title (A to Z)</option>
                    <option value="title-DESC">Title (Z to A)</option>
                </select>
                <button id='create-note-button' onClick={createNewNote} className='sidebar-button'>+</button>
            </div>
            <div id='note-list-container'>
                {noteListItems}
            </div>
        </nav>
    );
}

export default Sidebar
