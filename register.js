document.getElementById('registerForm').addEventListener('submit', handleRegister);

function handleRegister(e) {
    e.preventDefault();

    const usernameInput = document.getElementById('username');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const button = e.target.querySelector('button');

    const username = usernameInput.value.trim();
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    // Validation
    if (!username || !name || !email || !password) {
        showMessage('Please fill in all fields.', 'error');
        return;
    }

    if (!validateEmail(email)) {
        showMessage('Please enter a valid email address.', 'error');
        return;
    }

    if (password.length < 6) {
        showMessage('Password must be at least 6 characters.', 'error');
        return;
    }

    button.disabled = true;
    button.textContent = 'Registering...';

    fetch('http://127.0.0.1:8000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, name, email, password })
    })
    .then(async response => {
        const data = await response.json();

        if (!response.ok) {
            // Laravel validation error handling
            if (data.errors && data.errors.email) {
                showMessage(data.errors.email[0], 'error');
            } else {
                showMessage(data.message || 'Something went wrong.', 'error');
            }
            throw new Error('Validation failed');
        }

        // Success
        showMessage(data.message, 'success');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    })
    .catch(error => {
        console.error('Error:', error);
    })
    .finally(() => {
        button.disabled = false;
        button.textContent = 'Register';
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
        document.getElementById('registerForm').prepend(existingMessage);
    }

    existingMessage.textContent = message;
    existingMessage.style.color = type === 'error' ? 'red' : 'green';
    existingMessage.style.marginBottom = '15px';
}
