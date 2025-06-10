
import '../styles/NoteListItem.css'

function NoteListItem({ note, switchNote, isSelected }) {
    let classes = "note-list-item";
    if (isSelected) {
        classes = "note-list-item selected-note-list-item"
    }

    return (
        <div className={classes} onClick={() => { switchNote(note.note_id) }}>
            <h3>{note.title}</h3>
            <p>{note.time_created}</p>
            <p>{note.time_modified}</p>
        </div>
    )
}

export default NoteListItem
