import { useState, useEffect } from 'react'

import './styles/App.css'
import Sidebar from './components/Sidebar.jsx'
import TitleBar from './components/TitleBar.jsx'
import NoteContent from './components/NoteContent.jsx'

import baseNoteData from './assets/temp_notes.json'

const serverURL = 'http://localhost:3000/'

function App() {
    const [notesArray, setNotesArray] = useState(undefined);
    const [selectedNoteIndex, setSelectedNoteIndex] = useState(0);
    const [searchProperty, setSearchProperty] = useState('time_modified');
    const [sortMethod, setSortMethod] = useState('DESC');

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch(`http://localhost:3000/notes?${searchProperty}=${sortMethod}`);
                const data = await response.json();
                setNotesArray(data);
            } catch (error) {
                console.log(error);
            }
        }
        fetchData();
    }, [searchProperty, sortMethod])

    async function createNewNote() {
        console.log("Entered createNewNote")

        try {
            const response = await fetch('http://localhost:3000/notes', {
                method: "POST",
                body: JSON.stringify({
                    title: "Hello! This is a new note",
                    body: "This is the body of the new note"
                }),
                headers: {
                    "Content-type": "application/json"
                }
            });
            console.log(response);
            const data = await response.json();
            console.log(data);
        } catch (error) {
            console.error(error);
        }
    }

    function switchNote(indexSelected) {
        setSelectedNoteIndex(indexSelected);
    }

    function changeSearchProperty(propertyName) {
        setSearchProperty(propertyName);
    }

    function changeSortMethod(method) {
        setSortMethod(method);
    }

    if (notesArray === undefined) {
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
                    searchProperty={searchProperty}
                    changeSearchProperty={changeSearchProperty}
                    sortMethod={sortMethod}
                    changeSortMethod={changeSortMethod}
                    createNewNote={createNewNote}
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
