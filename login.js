document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission
    
    login();
});

function login() {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    
    // Clear previous messages
    document.getElementById('message').textContent = '';

    if (username === '' || password === '') {
        document.getElementById('message').textContent = 'Please enter both username and password.';
        return;
    }

    // Check credentials
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(user => user.username === username && user.password === password);

    if (user) {
        // Store the username and redirect
        localStorage.setItem('username', username);
        window.location.href = 'attendance.html'; // Update with your actual tracker page URL
    } else {
        document.getElementById('message').textContent = 'Invalid username or password.';
    }
}
