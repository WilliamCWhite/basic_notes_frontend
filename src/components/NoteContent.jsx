import { useState, useEffect, useRef, memo } from 'react'

function NoteContent({ selectedNoteIndex, updateNoteInDB, notesArray, sortNotesArray, selectedNoteId }) {
    const selectedNote = notesArray[selectedNoteIndex];
    const [noteBody, setNoteBody] = useState(selectedNote.body);
    console.log(`Note content re-render, selectedNoteId=${selectedNoteId}`)

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

    useEffect(() => {
        setNoteBody(selectedNote.body);
    }, [selectedNote]);

    function handleInput(event) {
        setNoteBody(event.target.value); 
    }

    // const sanitizedHTML = DOMPurify.sanitize(selectedNote.body);


    return (
        <textarea
            id="note-content-input"
            value={noteBody}
            onChange={handleInput}
        />
    ) 
}

// export default NoteContent;

// only re-render if the selectedNoteId changes, or if index changes
export default memo(NoteContent, (prevProps,nextProps) => {
    return (
        prevProps.selectedNoteId === nextProps.selectedNoteId &&
        prevProps.selectedNoteIndex === nextProps.selectedNoteIndex
    );
});
