
import '../styles/NoteListItem.css'

function NoteListItem({ note, switchNote, noteIndex, deleteNote, isSelected }) {
    let classes = "note-list-item";
    if (isSelected) {
        classes = "note-list-item selected-note-list-item"
    }

    return (
        <div className={classes}>
            <h3 onClick={() => { switchNote(note.note_id) }}>{note.title}</h3>
            <p>{note.time_created}</p>
            <p>{note.time_modified}</p>
            <button onClick={() => deleteNote(note.note_id)}>DELETE</button>
        </div>
    )
}

export default NoteListItem
