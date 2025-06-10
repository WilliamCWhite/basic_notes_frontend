import { useState, useEffect, forwardRef, useImperativeHandle } from 'react'

import '../styles/TitleBar.css'

function TitleBar({ selectedNoteTitle, updateNoteTitleInDB }, noteTitleRef) {
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
    }, [selectedNoteTitle]);

    function handleInput(event) {
        setNoteTitle(event.target.value);
    }

    return (
        <div id='title-bar'>
            <button id='display-sidebar-button'></button>
            <input 
                type="text" 
                id="title-input" 
                value={noteTitle} 
                onChange={handleInput}
            />
        </div>
    )
}

export default forwardRef(TitleBar);
