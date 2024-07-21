import { useState, useEffect } from 'react'

import './styles/App.css'
import Sidebar from './components/Sidebar.jsx'
import TitleBar from './components/TitleBar.jsx'
import NoteContent from './components/NoteContent.jsx'

const serverURL = 'http://localhost:3000/'

function App() {
    const [notesArray, setNotesArray] = useState();
    const [selectedNoteIndex, setSelectedNoteIndex] = useState();
    const [selectedNoteId, setSelectedNoteId] = useState();
    const [sortProperty, setSortProperty] = useState('time_modified');
    const [sortMethod, setSortMethod] = useState('DESC');
    const [createNoteTrigger, setCreateNoteTrigger] = useState(false);

    // GET fetching useEffect
    useEffect(() => {
        let ignore = false;

        async function fetchData() {
            try {
                const response = await fetch(`http://localhost:3000/notes`);
                const data = await response.json();
                if (!ignore) {
                    sortNotesArray(data);
                    setSelectedNoteId(data[0].note_id);
                }
            } catch (error) {
                console.error(error);
            }
        }

        fetchData();
        return () => { ignore = true }
    }, []);

    // POST fetching useEffect
    useEffect(() => {
        if (createNoteTrigger) {
            setCreateNoteTrigger(false);

            async function createNewNote() {
                console.log("Attempting to create a new note");
                try {
                    const response = await fetch('http://localhost:3000/notes', {
                        method: "POST",
                        body: JSON.stringify({
                            title: "New Note",
                            body: "This is the body of the new note"
                        }),
                        headers: {
                            "Content-type": "application/json"
                        }
                    });
                    const data = await response.json();
                    const newNotesArray = [...notesArray, ...data]
                    sortNotesArray(newNotesArray);
                    setSelectedNoteId(data[0].note_id);
                } catch (error) {
                    console.error(error);
                }
            }
            createNewNote();
        }
    }, [createNoteTrigger]);

    // Sort Property or Method triggers notesArray change
    useEffect(() => {
        if (!notesArray) return;
        const tempNotesArray = [...notesArray];
        sortNotesArray(tempNotesArray);
    }, [sortMethod, sortProperty]);

    // selectedNoteIndex resets itself when selectedNoteId changes
    useEffect(() => {
        if (!notesArray) return;
        setIndexFromId();
    }, [selectedNoteId]);

    // selectedNoteIndex resets itself to match the id when the notesArray gets changed (for when it gets re-sorted)
    useEffect(() => {
        if (!notesArray) return;
        setIndexFromId();
    }, [notesArray]);

    function sortNotesArray(tempNotesArray) {
        function compareFunction(a, b) {
            let result = 0;
            if (a[sortProperty] < b[sortProperty]) result = -1;
            else if (a[sortProperty] > b[sortProperty]) result = 1;

            if (sortMethod === "DESC") result *= -1;
            return result;
        }
        const toSet = tempNotesArray.toSorted(compareFunction);
        setNotesArray(toSet);
        //setNotesArray(tempNotesArray.toSorted(compareFunction))
    }

    function setIndexFromId() {
        const index = notesArray.findIndex((element, index) => {
            if (element.note_id === selectedNoteId) {
                return true;
            }
            else return false;
        })
        setSelectedNoteIndex(index);
    }

    function switchNote(indexSelected) {
        setSelectedNoteId(notesArray[indexSelected].note_id);
    }

    //! RENDERING STARTS HERE

    if (!notesArray || !selectedNoteId || (selectedNoteIndex !== 0 && !selectedNoteIndex)) {
        return (
            <h1>LOADING...</h1>
        );
    }

    return (
        
        <div id='full-screen'>
            <div id='app-container'>
                <Sidebar 
                    notesArray={notesArray} 
                    selectedNoteIndex={selectedNoteIndex} 
                    switchNote={switchNote}
                    sortNotesArray={sortNotesArray}
                    sortProperty={sortProperty}
                    setSortProperty={setSortProperty}
                    sortMethod={sortMethod}
                    setSortMethod={setSortMethod}
                    setCreateNoteTrigger={setCreateNoteTrigger}
                />  
                <main id='main-section'>
                    <TitleBar selectedNote={notesArray[selectedNoteIndex]}/>
                    <NoteContent selectedNote={notesArray[selectedNoteIndex]}/>
                </main>
            </div>
        </div>    
    )
    
}

export default App
