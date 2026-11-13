const helper = require('./helper.js');
const React = require('react');
const { createRoot } = require('react-dom/client');

// ----- EVENT HANDLERS -----
const handleLogin = (e) => {
    e.preventDefault();
    helper.hideError();

    const username = e.target.querySelector('#user').value;
    const pass = e.target.querySelector('#pass').value;

    if (!username || !pass) {
        helper.handleError('Username or password is empty!');
        return false;
    }

    helper.sendPost(e.target.action, { username, pass });
    return false;
}

// Handle clicks to the signup button
const handleSignup = (e) => {
    e.preventDefault();
    helper.hideError(); // Hides any existing errors

    const username = e.target.querySelector('#user').value;
    const pass = e.target.querySelector('#pass').value;
    const pass2 = e.target.querySelector('#pass2').value;

    // Check if all fields are filled
    if (!username || !pass || !pass2) {
        helper.handleError('All fields are required!');
        return false;
    }

    // Check if passwords match
    if (pass !== pass2) {
        helper.handleError('Passwords do not match!')
        return false;
    }

    // Send a post with the targets action(url), and data
    helper.sendPost(e.target.action, { username, pass, pass2 });

    return false;
}

// ----- REACT COMPONENTS -----

// "Functional stateless component (FSC)" 
// The react component does not update when user types into it
const LoginWindow = (props) => {
    return (
        <form id="loginForm"
            name="loginForm"
            onSubmit={handleLogin} // Link handleLogin event function to onSubmit
            action="/login"
            method="POST"
            className="mainForm"
        >
            <label htmlFor="username">Username: </label>
            <input id="user" type="text" name="username" placeholder="username" />
            <label htmlFor="pass">Password: </label>
            <input id="pass" type="password" name="pass" placeholder="password" />
            <input className="formSubmit" type="submit" value="Sign in" />
        </form>
    );
};

const SignupWindow = (props) => {
    return (
        <form id="signupForm"
            name="signupForm"
            onSubmit={handleSignup}
            action="/signup"
            method="POST"
            className="mainForm"
        >
            <label htmlFor="username">Username: </label>
            <input id="user" type="text" name="username" placeholder="username" />
            <label htmlFor="pass">Password: </label>
            <input id="pass" type="password" name="pass" placeholder="password" />

            <label htmlFor="pass2">Password: </label>
            <input id="pass2" type="password" name="pass2" placeholder="retype password" />
            <input className="formSubmit" type="submit" value="Sign up" />
        </form>
    );
};

const init = () => {
    const loginButton = document.getElementById('loginButton');
    const signupButton = document.getElementById('signupButton');

    const root = createRoot(document.getElementById('content')); // Create a react root to render into

    loginButton.addEventListener('click', (e) => {
        e.preventDefault();
        root.render(<LoginWindow />); // Render the login window component
        return false;
    });

    signupButton.addEventListener('click', (e) => {
        e.preventDefault();
        root.render(<SignupWindow />); // Render the signup window component
        return false;
    });

    root.render(<LoginWindow />) // Default to render the login window
};

window.onload = init;