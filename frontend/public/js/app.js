// I am defining a base URL constant for API calls to the backend.
const API_BASE_URL = 'http://localhost:5000/api';

// I am defining a function to retrieve the JWT token from local storage.
function getToken() {
    // I am returning the token stored under the 'token' key.
    return localStorage.getItem('token');
// I am closing the getToken function.
}

// I am defining a function to retrieve the user object from local storage.
function getUser() {
    // I am parsing the JSON string stored under the 'user' key.
    return JSON.parse(localStorage.getItem('user'));
// I am closing the getUser function.
}

// I am defining a function to handle user logout.
function logout() {
    // I am removing the token from local storage.
    localStorage.removeItem('token');
    // I am removing the user object from local storage.
    localStorage.removeItem('user');
    // I am redirecting the browser to the index (login) page.
    window.location.href = 'index.html';
// I am closing the logout function.
}

// I am setting up an event listener for when the DOM is fully loaded.
document.addEventListener('DOMContentLoaded', () => {
    // I am checking if we are on the dashboard page and if the logout button exists.
    const logoutBtn = document.getElementById('logout-btn');
    // I am verifying if the logout button was found in the DOM.
    if (logoutBtn) {
        // I am attaching a click event listener to the logout button.
        logoutBtn.addEventListener('click', logout);
    // I am closing the if statement.
    }

    // I am getting the current user from local storage.
    const user = getUser();
    // I am finding the element to display the user's name.
    const userDisplayName = document.getElementById('user-display-name');
    // I am checking if both the user exists and the display element exists.
    if (user && userDisplayName) {
        // I am setting the text content of the display element to the user's username.
        userDisplayName.textContent = `Welcome, ${user.username}`;
    // I am closing the if statement.
    }

    // I am protecting the dashboard route by checking for a token.
    if (window.location.pathname.includes('dashboard.html') && !getToken()) {
        // I am redirecting to the login page if no token is found.
        window.location.href = 'index.html';
    // I am closing the if statement.
    }
    
    // I am preventing logged-in users from accessing the login page.
    if (window.location.pathname.includes('index.html') && getToken()) {
        // I am redirecting to the dashboard page if a token is found.
        window.location.href = 'dashboard.html';
    // I am closing the if statement.
    }
// I am closing the DOMContentLoaded listener.
});
