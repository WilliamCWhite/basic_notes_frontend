import { useState, useEffect, useRef, memo } from 'react'

function NoteContent({ selectedNoteBody, updateNoteBodyInDB }) {
    const [noteBody, setNoteBody] = useState(selectedNoteBody);

    useEffect(() => {
        const timeoutID = setTimeout(() => {
            if (selectedNoteBody !== noteBody) {
                console.log("We're updating a note in the database woah");
                updateNoteBodyInDB(noteBody);
            }
        }, 3000);

        return (() => clearTimeout(timeoutID));
    }, [noteBody])

    useEffect(() => {
        setNoteBody(selectedNoteBody);
    }, [selectedNoteBody]);

    function handleInput(event) {
        setNoteBody(event.target.value); 
    }

    return (
        <textarea
            id="note-content-input"
            value={noteBody}
            onChange={handleInput}
        />
    ) 
}

export default NoteContent
