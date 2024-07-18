import { useState } from 'react'

function NoteContent({ selectedNote }) {
    return (
        <div id='note-content'>
            {selectedNote.body}
        </div>
    )
}

export default NoteContent;