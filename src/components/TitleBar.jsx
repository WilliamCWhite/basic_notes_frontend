import { useState, useEffect, forwardRef, useImperativeHandle } from 'react'

import '../styles/TitleBar.css'

function TitleBar({ selectedNoteId, selectedNoteTitle, updateNoteTitleInDB, deleteNote, toggleSidebar }, noteTitleRef) {
    const [noteTitle, setNoteTitle] = useState(selectedNoteTitle);

    useImperativeHandle(noteTitleRef, () => ({
        getNoteTitle: () => {
            if (selectedNoteTitle === noteTitle) {
                return null;
            }
            return noteTitle;
        },
    }));

    useEffect(() => {
        const timeoutID = setTimeout(() => {
            if (selectedNoteTitle !== noteTitle) {
                console.log("We're updating a note in the database");
                updateNoteTitleInDB(noteTitle);
            }
        }, 3000);

        return (() => clearTimeout(timeoutID));
    }, [noteTitle]);

    useEffect(() => {
        setNoteTitle(selectedNoteTitle);
    }, [selectedNoteTitle, selectedNoteId]);

    function handleInput(event) {
        setNoteTitle(event.target.value);
    }

    return (
        <div id='title-bar'>
            <div className="left-align">
                <button 
                    id='display-sidebar-button'
                    onClick={() => toggleSidebar()}
                >Toggle</button>
                <input 
                    type="text" 
                    id="title-input" 
                    value={noteTitle} 
                    onChange={handleInput}
                />
            </div>
            <div className="right-align">
                <button 
                    id='delete-note-button' 
                    onClick={() => deleteNote(selectedNoteId)}
                >Delete</button>
            </div>
        </div>
    )
}

export default forwardRef(TitleBar);
