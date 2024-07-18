import { useState, useEffect } from 'react'

import './styles/App.css'
import Sidebar from './components/Sidebar.jsx'
import TitleBar from './components/TitleBar.jsx'
import NoteContent from './components/NoteContent.jsx'

import baseNoteData from './assets/temp_notes.json'

function App() {
    const [notesArray, setNotesArray] = useState(baseNoteData);
    const [selectedNoteIndex, setSelectedNoteIndex] = useState(0);

    function switchNote(indexSelected) {
        setSelectedNoteIndex(indexSelected);
    }

    return (
        <div id='full-screen'>
            <div id='app-container'>
                <Sidebar notesArray={notesArray} selectedNoteIndex={selectedNoteIndex} switchNote={switchNote}/>
                <main id='main-section'>
                    <TitleBar selectedNote={notesArray[selectedNoteIndex]}/>
                    <NoteContent selectedNote={notesArray[selectedNoteIndex]}/>
                </main>
            </div>
        </div>    
    )
    
}

export default App
