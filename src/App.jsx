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

    const [isSidebarShown, setIsSidebarShown] = useState(true);

    const [userKey, setUserKey] = useState();
    const [username, setUsername] = useState();

    const noteTitleRef = useRef();
    const noteContentRef = useRef();

    const [followUpSwitch, setFollowUpSwitch] = useState(false);
    
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
            setSelectedNoteId(data?.[0]?.note_id);
        };
        fetchData();
    }, [userKey]);

    // POST function
    async function createNewNote() {
        console.log("Attempting to create new note");
        const data = await postNewNote(username, userKey); //await cuz need note_id
        const newNotesArray = [...notesArray, ...data];
        if (notesArray === undefined || notesArray.length === 0) {
            setNotesArray(newNotesArray);
            setSelectedNoteId(data[0].note_id);
            return;
        }
        setNotesArray(newNotesArray);
        console.log("set notes array called")
        setFollowUpSwitch(data[0].note_id);
    }

    // prevents selectedNoteId changing to a newly posted note not seen in notesArray yet
    useEffect(() => {
        if (followUpSwitch !== false) {
            console.log("Noticed follow up switch");
            console.log(`notesArray: ${notesArray}`);
            console.log(`selectedNoteId(Pre): ${selectedNoteId}`);
            const equivalent = followUpSwitch
            switchNote(equivalent);
            console.log(`selectedNotesId(Post): ${selectedNoteId}`);
            setFollowUpSwitch(false);
        }
    }, [followUpSwitch]);

    // PUT
    async function updateNoteInDB(noteId, title, body) {
        const timeModified = new Date(Date.now()).toISOString();
        console.log(`updating note in db, id=${noteId}, title=${title}, body=${body}`);
        putUpdatedNote(username, userKey, noteId, title, body, timeModified);

        const tempNotesArray = [...notesArray];
        const selectedNoteIndex = getSelectedNoteIndex();
        tempNotesArray[selectedNoteIndex].title = title;
        tempNotesArray[selectedNoteIndex].body = body;
        tempNotesArray[selectedNoteIndex].time_modified = timeModified;
        setNotesArray(tempNotesArray);
    }

    // DELETE
    // WARN: Seems like there's some error where a note will delete but it's put request will still occur
    // very hard to replicate though
    async function deleteNote(noteId) {
        console.log("called delete note")
        deleteNoteRequest(username, userKey, noteId);

        // handle moving to 0 notes
        if (notesArray.length === 1) {
            setNotesArray([]);
            setSelectedNoteId(undefined);
            return;
        }

        const indexOfId = notesArray.findIndex(note => note.note_id === noteId);
        const newNotesArray = notesArray.slice(0, indexOfId).concat(notesArray.slice(indexOfId + 1));
        setNotesArray(newNotesArray);

        // ensure a deleted note is never selected
        if (selectedNoteId === noteId) {
            selectLastModifiedNote(newNotesArray); // since notesArray isn't updated yet
        }
    }

    function getSelectedNote() {
        const note = notesArray.find(note => note.note_id === selectedNoteId); 
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
    
    function toggleSidebar() {
        console.log("toggling sidebar");
        if (isSidebarShown) {
            setIsSidebarShown(false);
        }
        else {
            setIsSidebarShown(true);
        }
    }

    //! RENDERING STARTS HERE
    let appContainerContent;

    if (!userKey) {
        appContainerContent = (
            <LoginScreen 
                userKey={userKey}
                setUserKey={setUserKey}
                username={username}
                setUsername={setUsername}
            />
        );
    } else if (notesArray === undefined) {
        appContainerContent = (
            <div>
                <h1>Loading...</h1>
            </div>
        );
    } else if (!notesArray || !selectedNoteId) {
        appContainerContent = (
            <div>
                <h1>no notes yet</h1>
                <button onClick={createNewNote}>Create New Note!</button>
            </div>
        );
    } else {
        appContainerContent = (
            <>
                {isSidebarShown &&
                    <Sidebar 
                        notesArray={notesArray} 
                        selectedNoteId={selectedNoteId}
                        switchNote={switchNote}
                        sortProperty={sortProperty}
                        setSortProperty={setSortProperty}
                        sortMethod={sortMethod}
                        setSortMethod={setSortMethod}
                        createNewNote={createNewNote}
                    />  
                }
                <main id='main-section'>
                    <TitleBar 
                        ref={noteTitleRef}
                        selectedNoteId={selectedNoteId}
                        selectedNoteTitle={getSelectedNote().title}
                        updateNoteTitleInDB={updateNoteTitleInDB}
                        deleteNote={deleteNote}
                        toggleSidebar={toggleSidebar}
                    />
                    <NoteContent 
                        ref={noteContentRef}
                        selectedNoteId={selectedNoteId}
                        selectedNoteBody={getSelectedNote().body}
                        updateNoteBodyInDB={updateNoteBodyInDB}
                    />
                </main>
            </>
        );
    }

    return (
        
        <div id='full-screen'>
            <div id='app-container'>
                {appContainerContent}
            </div>
        </div>    
    )
    
}

export default App
