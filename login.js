document.getElementById('loginForm').addEventListener('submit', handleLogin);

function handleLogin(e) {
    e.preventDefault();

    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const button = e.target.querySelector('button');

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    
    if (!email || !password) {
        showMessage('Please fill in all fields.', 'error');
        return;
    }

    if (!validateEmail(email)) {
        showMessage('Please enter a valid email address.', 'error');
        return;
    }

    button.disabled = true;
    button.textContent = 'Logging in...';

    fetch('http://127.0.0.1:8000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    })

    .then(async response => {
        const data = await response.json();

        if (!response.ok) {
            showMessage(data.message || 'Invalid credentials.', 'error');
            throw new Error('Login failed');
        }

        localStorage.setItem('userId',data.user.id);
        
        showMessage(data.message, 'success');

        // Redirect after 1 second
        setTimeout(() => {
            window.location.href = 'home.html';
        }, 1000);
    })
    .catch(error => {
        console.error('Error', error);
        showMessage('Something went wrong. Please try again later.', 'error');
    })
    .finally(() => {
        button.disabled = false;
        button.textContent = 'Login';
        e.target.reset();
    });
}


function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}


function showMessage(message, type) {
    let existingMessage = document.querySelector('.form-message');

    if (!existingMessage) {
        existingMessage = document.createElement('div');
        existingMessage.className = 'form-message';
        document.getElementById('loginForm').prepend(existingMessage);
    }

    existingMessage.textContent = message;
    existingMessage.style.color = type === 'error' ? 'red' : 'green';
    existingMessage.style.marginBottom = '15px';
}
