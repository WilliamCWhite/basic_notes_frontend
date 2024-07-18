import { useState } from 'react'

import '../styles/TitleBar.css'

function TitleBar({ selectedNote }) {
    return (
        <div id='title-bar'>
            <button id='display-sidebar-button'></button>
            <h1>{selectedNote.title}</h1>
        </div>
    )
}

export default TitleBar