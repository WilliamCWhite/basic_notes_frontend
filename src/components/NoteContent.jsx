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

    // NOTE: I'm just note sure this is necessary anymore
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

// only re-render if the selectedNoteId changes, or if index changes
export default memo(NoteContent, (prevProps,nextProps) => {
    return prevProps.selectedNoteBody === nextProps.selectedNoteBody;
});
