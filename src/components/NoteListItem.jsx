
import '../styles/NoteListItem.css'

function NoteListItem({ note, switchNote, noteIndex, deleteNote }) {
    return (
        <div className="note-list-item" onClick={() => { switchNote(noteIndex) }}>
            <h3>{note.title}</h3>
            <p>{note.time_created}</p>
            <p>{note.time_modified}</p>
            <button onClick={() => deleteNote(note.note_id)}>DELETE</button>
        </div>
    )
}

export default NoteListItem