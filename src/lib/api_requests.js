const serverURL = import.meta.env.VITE_API_URL;

export async function getUserNotes(username, userKey) {
    try {
        const response = await fetch(`${serverURL}/notes/${username}`, {
            method: 'GET',
            headers: {
                'userauthenticationkey': userKey
            }
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
    }
}

export async function postNewNote(username, userKey) {
    try {
        const currentTime = new Date(Date.now()).toISOString();
        const response = await fetch(`${serverURL}/notes/${username}`, {
            method: "POST",
            body: JSON.stringify({
                title: "New Note",
                body: "This is the body of the new note",
                time_modified: currentTime,
                time_created: currentTime
            }),
            headers: {
                "Content-type": "application/json",
                "userauthenticationkey": userKey
            }
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
    }
}

export async function putUpdatedNote(note_id, title, body, time_modified) {
    console.log(`Attempting to update note with id: ${note_id}`)
    console.log('Our stringified JSON will look like this:');
    console.log({title: title, body: body, time_modified: time_modified});
    try {
        const response = await fetch(`${serverURL}/notes/${username}/${note_id}`, {
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
        await response.json();
    } catch (error) {
        console.error(error);
    }
}

export async function deleteNoteRequest(username, userKey, note_id) {
    try {
        const response = await fetch(`${serverURL}/notes/${username}/${note_id}`, {
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
}
