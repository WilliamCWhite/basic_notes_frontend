import { useState, useEffect, useRef } from 'react'

import './styles/App.css'
import Sidebar from './components/Sidebar.jsx'
import TitleBar from './components/TitleBar.jsx'
import NoteContent from './components/NoteContent.jsx'
import LoginScreen from './components/LoginScreen.jsx'

import { getUserNotes, postNewNote, putUpdatedNote, deleteNoteRequest } from './lib/api_requests.js'

function App() {
    const [notesArray, setNotesArray] = useState();
    const [selectedNoteId, setSelectedNoteId] = useState();

    const [sortProperty, setSortProperty] = useState('time_modified');
    const [sortMethod, setSortMethod] = useState('DESC');

    const [userKey, setUserKey] = useState();
    const [username, setUsername] = useState();

    const noteTitleRef = useRef();
    const noteContentRef = useRef();
    
    // GET fetching useEffect
    useEffect(() => {
        if (!userKey) {
            console.log(userKey)
            return
        }
        console.log(userKey);

        const fetchData = async () => {
            const data = await getUserNotes(username, userKey);
            console.log(data);
            setNotesArray(data);
            setSelectedNoteId(data[0].note_id);
        };
        fetchData();
    }, [userKey]);

    // POST function
    async function createNewNote() {
        console.log("Attempting to create new note");
        const data = await postNewNote(username, userKey); //await cuz need note_id
        const newNotesArray = [...notesArray, ...data];
        setNotesArray(newNotesArray);
        switchNote(data[0].note_id);
    }

    // PUT
    async function updateNoteInDB(noteId, title, body) {
        const timeModified = new Date(Date.now()).toISOString();
        putUpdatedNote(username, userKey, noteId, title, body, timeModified);

        const tempNotesArray = [...notesArray];
        const selectedNoteIndex = getSelectedNoteIndex();
        tempNotesArray[selectedNoteIndex].title = title;
        tempNotesArray[selectedNoteIndex].body = body;
        tempNotesArray[selectedNoteIndex].time_modified = timeModified;
        setNotesArray(tempNotesArray);
    }

    // DELETE
    async function deleteNote(noteId) {

        if (notesArray.length === 1) {
            alert("You need to have at least 1 note!");
            return;
        }

        console.log("called delete note")
        deleteNoteRequest(username, userKey, noteId);

        const indexOfId = notesArray.findIndex(note => note.note_id === noteId);
        const newNotesArray = notesArray.slice(0, indexOfId).concat(notesArray.slice(indexOfId + 1));
        setNotesArray(newNotesArray);

        // ensure a deleted note is never selected
        if (selectedNoteId === noteId) {
            selectLastModifiedNote(newNotesArray); // since notesArray isn't updated yet

        }
    }

    function getSelectedNote() {
        console.log(`call to getSelectedNote, id=${selectedNoteId}`);
        const note = notesArray.find(note => note.note_id === selectedNoteId); 
        console.log(note);
        return note;
    }

    function getSelectedNoteIndex() {
        return notesArray.findIndex(note => note.note_id === selectedNoteId);
    }

    function selectLastModifiedNote(newNotesArray) {
        let mostRecentTime = new Date(newNotesArray[0].time_modified);
        let mostRecentId = newNotesArray[0].note_id;
        
        for (let i = 0; i < newNotesArray.length; i++) {
            const entryTime = new Date(newNotesArray[i].time_modified);
            if (entryTime > mostRecentTime) {
                mostRecentTime = entryTime;
                mostRecentId = newNotesArray[i].note_id;
            }
        }

        setSelectedNoteId(mostRecentId);
    }

    function updateNoteBodyInDB(body) {
        updateNoteInDB(selectedNoteId, getSelectedNote(selectedNoteId).title, body);
    }

    function updateNoteTitleInDB(title) {
        updateNoteInDB(selectedNoteId, title, getSelectedNote(selectedNoteId).body);
    }

    function switchNote(newNoteId) {
        const autosaveTitle = noteTitleRef.current.getNoteTitle();
        const autosaveBody = noteContentRef.current.getNoteBody();

        // Only update if necessary, prevents many unnecessary put requests
        if (autosaveTitle !== null && autosaveBody !== null) {
            updateNoteInDB(selectedNoteId, autosaveTitle, autosaveBody);
        } 
        else if (autosaveTitle !== null && autosaveBody === null) {
            updateNoteTitleInDB(autosaveTitle);
        } 
        else if (autosaveTitle === null && autosaveBody !== null) {
            updateNoteBodyInDB(autosaveBody);
        }

        setSelectedNoteId(newNoteId);
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

    if (!notesArray || !selectedNoteId) {
        return (
            <h1>LOADING...</h1>
        );
    }

    return (
        
        <div id='full-screen'>
            <div id='app-container'>
                <Sidebar 
                    notesArray={notesArray} 
                    selectedNoteId={selectedNoteId}
                    switchNote={switchNote}
                    sortProperty={sortProperty}
                    setSortProperty={setSortProperty}
                    sortMethod={sortMethod}
                    setSortMethod={setSortMethod}
                    createNewNote={createNewNote}
                    deleteNote={deleteNote}
                />  
                <main id='main-section'>
                    <TitleBar 
                        ref={noteTitleRef}
                        selectedNoteTitle={getSelectedNote(selectedNoteId).title}
                        updateNoteTitleInDB={updateNoteTitleInDB}
                    />
                    <NoteContent 
                        ref={noteContentRef}
                        selectedNoteBody={getSelectedNote(selectedNoteId).body}
                        updateNoteBodyInDB={updateNoteBodyInDB}
                    />
                </main>
            </div>
        </div>    
    )
    
}

export default App
