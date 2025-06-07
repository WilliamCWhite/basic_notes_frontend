import { useState, useEffect, useRef } from 'react'
import DOMPurify from 'dompurify'

function NoteContent({ selectedNoteIndex, updateNoteInDB, notesArray, sortNotesArray }) {
    const selectedNote = notesArray[selectedNoteIndex];
    const [noteBody, setNoteBody] = useState(selectedNote.body);

    useEffect(() => {
        const timeoutID = setTimeout(() => {
            if (selectedNote.body !== noteBody) {
                console.log("We're updating a note in the database woah");
                const timeModified = new Date(Date.now()).toISOString();
                updateNoteInDB(selectedNote.note_id, selectedNote.title, noteBody, timeModified);

                const tempNotesArray = [...notesArray];
                tempNotesArray[selectedNoteIndex].body = noteBody;
                tempNotesArray[selectedNoteIndex].time_modified = timeModified;
                sortNotesArray(tempNotesArray);
            }
        }, 3000);

        return (() => clearTimeout(timeoutID));
    }, [noteBody])

    function handleInput(event) {
        setNoteBody(event.target.innerHTML); 
    }

    const sanitizedHTML = DOMPurify.sanitize(selectedNote.body);

    return (
        <div 
            id='note-content' 
            contentEditable='true'
            onInput={handleInput}
            suppressContentEditableWarning
            dangerouslySetInnerHTML={{__html: sanitizedHTML}}
        >
        </div>
    ) 
}

export default NoteContent;
