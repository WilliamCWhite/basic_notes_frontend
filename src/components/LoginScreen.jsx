import { useState } from 'react'

import config from '../config.js';
const serverURL = config.SERVER_URL;
// const serverURL = "http://localhost:3000/api";

console.log(serverURL);
function LoginScreen({ userKey, setUserKey, username, setUsername }) {
    const [formUsername, setFormUsername] = useState('');
    const [formPassword, setFormPassword] = useState('');

    function handleUsernameInput(event) {
        setFormUsername(event.target.value);
    }

    function handlePasswordInput(event) {
        setFormPassword(event.target.value);
    }

    async function handleSignUp(event) {
        if (!formUsername || !formPassword) {
            console.log("username or password field is empty");
            return
        }
        try {
            const response = await fetch(`${serverURL}/users?action=createUser`, {
                method: 'POST',
                body: JSON.stringify({
                    username: formUsername,
                    password: formPassword
                }),
                headers: {
                    'Content-type': 'application/json'
                }
            })
    
            if (!response.ok) {
                console.error("HTTP error, the code wasn't ok");
                console.log(response.status);
                return;
            }

            const data = await response.json();

            console.log("This is the data we received from the sign up request:");
            console.log(data); 

            setUsername(data.username);
            setUserKey(data.user_key);

        } catch (error) {
            console.error(error);
        }
    }

    async function handleLogIn(event) {
        if (!formUsername || !formPassword) {
            console.log("username or password field is empty");
            return
        }
        try {
            const response = await fetch(`${serverURL}/users?action=fetchUser`, {
                method: 'POST',
                body: JSON.stringify({
                    username: formUsername,
                    password: formPassword
                }),
                headers: {
                    'Content-type': 'application/json'
                }
            })
    
            if (!response.ok) {
                console.error("HTTP error, the code wasn't ok");
                console.log(response.status);
                return;
            }

            const data = await response.json();

            console.log("This is the data we received from the log in request:");
            console.log(data); 

            setUsername(data.username);
            setUserKey(data.user_key);

        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div id="login-container">
            <label htmlFor="username-input">Username</label>
            <input type="text" id="username-input" value={formUsername} onChange={handleUsernameInput}/>
            <label htmlFor="password-input">Password</label>
            <input type="text" id="password-input" value={formPassword} onChange={handlePasswordInput}/>
            <button onClick={handleSignUp}>Sign Up</button>
            <button onClick={handleLogIn}>Log In</button>
        </div>
    );
}

export default LoginScreen;
