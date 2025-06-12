import '../styles/NoteListItem.css'

import { formatTimeModified } from '../lib/timeFormatting.js'

function NoteListItem({ note, switchNote, isSelected }) {
    let classes = "note-list-item";
    if (isSelected) {
        classes = "note-list-item selected-note-list-item"
    }

    const formattedTimeModified = formatTimeModified(note.time_modified);

    return (
        <div className={classes} onClick={() => { switchNote(note.note_id) }}>
            <h3>{note.title}</h3>
            <p>{formattedTimeModified}</p>
        </div>
    )
}

export default NoteListItem
