import { useState, useEffect } from 'react'

import './styles/App.css'
import Sidebar from './components/Sidebar.jsx'
import TitleBar from './components/TitleBar.jsx'
import NoteContent from './components/NoteContent.jsx'
import LoginScreen from './components/LoginScreen.jsx'

import { getUserNotes, postNewNote, putUpdatedNote, deleteNoteRequest } from './lib/api_requests.js'

const serverURL = import.meta.env.VITE_API_URL;

function App() {
    const [notesArray, setNotesArray] = useState();
    const [selectedNoteIndex, setSelectedNoteIndex] = useState();
    const [selectedNoteId, setSelectedNoteId] = useState();
    const [sortProperty, setSortProperty] = useState('time_modified');
    const [sortMethod, setSortMethod] = useState('DESC');

    const [userKey, setUserKey] = useState();
    const [username, setUsername] = useState();

    // GET fetching useEffect
    useEffect(() => {
        if (!userKey) {
            console.log(userKey)
            return
        }
        console.log(userKey);

        const fetchData = async () => {
            console.log("running get logic");
            const data = await getUserNotes(username, userKey);
            console.log(data);
            sortNotesArray(data);
            setSelectedNoteId(data[0].note_id);
        };
        fetchData();
    }, [userKey]);

    // POST function
    async function createNewNote() {
        console.log("Attempting to create new note");
        const data = await postNewNote(username, userKey); //await cuz need note_id
        const newNotesArray = [...notesArray, ...data];
        sortNotesArray(newNotesArray);
        setSelectedNoteId(data[0].note_id);
    }

    // PUT
    //WARN: probably need to move notesArray update logic from noteContent to here
    async function updateNoteInDB(note_id, title, body, time_modified) {
        putUpdatedNote(username, userKey, note_id, title, body, time_modified);
    }

    // DELETE
    // FIX: Right now deleting current note breaks it
    async function deleteNote(note_id) {

        if (notesArray.length === 1) {
            alert("You need to have at least 1 note!");
            return;
        }

        console.log("called delete note")
        deleteNoteRequest(username, userKey, note_id);

        if (selectedNoteId === note_id) {
            selectOtherNote();
        }

        const indexOfId = getIndexFromId(selectedNoteId);
        const newNotesArray = notesArray.slice(0, indexOfId).concat(notesArray.slice(indexOfId + 1));
        setNotesArray(newNotesArray);
    }

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

    function getIndexFromId(note_id) {
        const index = notesArray.findIndex((element) => {
            if (element.note_id === note_id) {
                return true;
            }
            else return false;
        })
        return index;
    }

    function setIndexFromId() {
        const index = getIndexFromId(selectedNoteId);
        setSelectedNoteIndex(index);
    }

    function switchNote(indexSelected) {
        // SAMPLE CODE FOR SAVING WHEN SWITCHING, NOTE I HAVE TO USE REFS
        // const selectedNote = notesArray[selectedNoteIndex];
        // const currentTime = new Date(Date.now()).toISOString();
        // updateNoteInDB(selectedNoteId, selectedNote.title, selectedNote.body, currentTime);
        setSelectedNoteId(notesArray[indexSelected].note_id);
    }

    function selectOtherNote() {
        if (selectedNoteIndex === notesArray.length - 1) {
            setSelectedNoteId(notesArray[selectedNoteIndex - 1].note_id);
        } else {
            setSelectedNoteId(notesArray[selectedNoteIndex + 1].note_id);
        }
    }

    //! RENDERING STARTS HERE

    if (!userKey) {
        return (
            <LoginScreen 
                userKey={userKey}
                setUserKey={setUserKey}
                username={username}
                setUsername={setUsername}
            />
        );
    }

    if (!notesArray || !selectedNoteId || (selectedNoteIndex !== 0 && !selectedNoteIndex)) {
        return (
            <h1>LOADING...</h1>
        );
    }
    console.log(`App.jsx re-render, selectedNoteId=${selectedNoteId}`);

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
                    createNewNote={createNewNote}
                    deleteNote={deleteNote}
                />  
                <main id='main-section'>
                    <TitleBar 
                        selectedNoteIndex={selectedNoteIndex} 
                        updateNoteInDB={updateNoteInDB}
                        notesArray={notesArray}
                        sortNotesArray={sortNotesArray}
                    />
                    <NoteContent 
                        selectedNoteIndex={selectedNoteIndex} 
                        updateNoteInDB={updateNoteInDB}
                        notesArray={notesArray}
                        sortNotesArray={sortNotesArray}
                        selectedNoteId={selectedNoteId}
                    />
                </main>
            </div>
        </div>    
    )
    
}

export default App
