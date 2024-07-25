import { useState } from 'react'

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
        
        const response = await fetch(`https://localhost:3000/users`, {
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
        }

        

    }

    function handleLogIn(event) {

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