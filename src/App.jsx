import { useState, useEffect } from 'react'

import './styles/App.css'
import Sidebar from './components/Sidebar.jsx'
import TitleBar from './components/TitleBar.jsx'
import NoteContent from './components/NoteContent.jsx'
import LoginScreen from './components/LoginScreen.jsx'

const serverURL = 'http://localhost:3000/'

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

        let ignore = false;

        async function fetchData() {
            try {
                const response = await fetch(`http://localhost:3000/notes/${username}`,  {
                    method: 'GET',
                    headers: {
                        'userauthenticationkey': userKey
                    }
                }); 
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
    }, [userKey]);

    // POST function
    async function createNewNote() {
        console.log("Attempting to create a new note");
        try {
            const response = await fetch(`http://localhost:3000/notes/${username}`, {
                method: "POST",
                body: JSON.stringify({
                    title: "New Note",
                    body: "This is the body of the new note"
                }),
                headers: {
                    "Content-type": "application/json",
                    "userauthenticationkey": userKey
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

    // PUT
    async function updateNoteInDB(note_id, title, body, time_modified) {
        console.log(`Attempting to update note with id: ${note_id}`)
        console.log('Our stringified JSON will look like this:');
        console.log({title: title, body: body, time_modified: time_modified});
        try {
            const response = await fetch(`http://localhost:3000/notes/${username}/${note_id}`, {
                method: "PUT",
                body: JSON.stringify({
                    title: title,
                    body: body,
                    time_modified: time_modified
                }),
                headers: {
                    "Content-type": "application/json",
                    "userauthenticationkey": userKey
                }
            });
        } catch (error) {
            console.error(error);
        }
    }

    // DELETE
    async function deleteNote(note_id) {

        if (notesArray.length === 1) {
            alert("You need to have at least 1 note!");
            return;
        }

        console.log("called delete note")
        try {
            const response = await fetch(`http://localhost:3000/notes/${username}/${note_id}`, {
                method: 'DELETE',
                headers: {
                    "userauthenticationkey": userKey
                }
            })
            // const data = await response.json();
            // data[0] is the note object just deleted
        } catch (error) {
            console.error(error);
        }

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
                    />
                </main>
            </div>
        </div>    
    )
    
}

export default App
