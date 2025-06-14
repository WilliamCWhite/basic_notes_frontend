import { useState, useEffect, forwardRef, useImperativeHandle } from 'react'

import '../styles/NoteContent.css'

const autosaveMS = 2500;

function NoteContent({ selectedNoteId, selectedNoteBody, updateNoteBodyInDB }, noteContentRef) {
    const [noteBody, setNoteBody] = useState(selectedNoteBody);

    useImperativeHandle(noteContentRef, () => ({
        getNoteBody: () => {
            if (selectedNoteBody === noteBody) {
                return null;
            }
            return noteBody;
        },
    }));

    useEffect(() => {
        const timeoutID = setTimeout(() => {
            if (selectedNoteBody !== noteBody) {
                console.log("We're updating a note in the database woah");
                updateNoteBodyInDB(noteBody);
            }
        }, autosaveMS);

        return (() => clearTimeout(timeoutID));
    }, [noteBody])

    useEffect(() => {
        setNoteBody(selectedNoteBody);
    }, [selectedNoteBody, selectedNoteId]); //important to keep id

    function handleInput(event) {
        setNoteBody(event.target.value); 
    }

    return (
        <div id="note-content-container">
            <textarea
                id="note-content-input"
                value={noteBody}
                onChange={handleInput}
            />
        </div>
    ) 
}

export default forwardRef(NoteContent);
