import { useState, useEffect, forwardRef, useImperativeHandle } from 'react'

import '../styles/TitleBar.css'

const autosaveMS = 2500;

function TitleBar({ selectedNoteId, selectedNoteTitle, updateNoteTitleInDB }, noteTitleRef) {
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
        }, autosaveMS);

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
