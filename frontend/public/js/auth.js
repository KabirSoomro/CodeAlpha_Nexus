// I am setting up an event listener for when the DOM is fully loaded.
document.addEventListener('DOMContentLoaded', () => {
    // Form elements
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const loginBtn = document.getElementById('login-btn');
    const signupBtn = document.getElementById('signup-btn');

    // UI Feedback Helpers
    const setFieldFeedback = (msgElementId, groupElementId, message, type = 'error') => {
        const msgEl = document.getElementById(msgElementId);
        const groupEl = document.getElementById(groupElementId);
        if (!msgEl) return;

        let iconClass = 'fa-circle-exclamation';
        if (type === 'success') iconClass = 'fa-circle-check';
        if (type === 'info') iconClass = 'fa-circle-info';

        msgEl.className = `field-feedback active ${type}`;
        msgEl.innerHTML = `<i class="fa-solid ${iconClass}"></i> <span>${message}</span>`;

        if (groupEl) {
            groupEl.classList.remove('has-error', 'has-success');
            groupEl.classList.add(type === 'success' ? 'has-success' : 'has-error');
        }
    };

    const clearFieldFeedback = (msgElementId, groupElementId) => {
        const msgEl = document.getElementById(msgElementId);
        const groupEl = document.getElementById(groupElementId);
        if (msgEl) {
            msgEl.className = 'field-feedback';
            msgEl.innerHTML = '';
        }
        if (groupEl) {
            groupEl.classList.remove('has-error', 'has-success');
        }
    };

    const setBanner = (bannerId, message, type = 'warning') => {
        const banner = document.getElementById(bannerId);
        if (!banner) return;
        let iconClass = 'fa-triangle-exclamation';
        if (type === 'error') iconClass = 'fa-circle-xmark';
        if (type === 'success') iconClass = 'fa-circle-check';

        banner.className = `form-banner ${type}`;
        banner.style.display = 'flex';
        banner.innerHTML = `<i class="fa-solid ${iconClass}" style="margin-top: 2px;"></i> <div>${message}</div>`;
    };

    const clearBanner = (bannerId) => {
        const banner = document.getElementById(bannerId);
        if (banner) {
            banner.style.display = 'none';
            banner.innerHTML = '';
            banner.className = 'form-banner';
        }
    };

    const clearAllLoginFeedback = () => {
        clearBanner('login-banner');
        clearFieldFeedback('login-email-msg', 'login-email-group');
        clearFieldFeedback('login-password-msg', 'login-password-group');
    };

    const clearAllSignupFeedback = () => {
        clearBanner('signup-banner');
        clearFieldFeedback('signup-username-msg', 'signup-username-group');
        clearFieldFeedback('signup-email-msg', 'signup-email-group');
        clearFieldFeedback('signup-password-msg', 'signup-password-group');
    };

    // Live typing listeners to immediately clear errors
    const loginEmailInput = document.getElementById('login-email');
    const loginPasswordInput = document.getElementById('login-password');
    if (loginEmailInput) {
        loginEmailInput.addEventListener('input', () => {
            clearFieldFeedback('login-email-msg', 'login-email-group');
            clearBanner('login-banner');
        });
    }
    if (loginPasswordInput) {
        loginPasswordInput.addEventListener('input', () => {
            clearFieldFeedback('login-password-msg', 'login-password-group');
            clearBanner('login-banner');
        });
    }

    const signupUserInput = document.getElementById('signup-username');
    const signupEmailInput = document.getElementById('signup-email');
    const signupPasswordInput = document.getElementById('signup-password');
    if (signupUserInput) {
        signupUserInput.addEventListener('input', () => {
            clearFieldFeedback('signup-username-msg', 'signup-username-group');
            clearBanner('signup-banner');
        });
    }
    if (signupEmailInput) {
        signupEmailInput.addEventListener('input', () => {
            clearFieldFeedback('signup-email-msg', 'signup-email-group');
            clearBanner('signup-banner');
        });
    }
    if (signupPasswordInput) {
        signupPasswordInput.addEventListener('input', () => {
            clearFieldFeedback('signup-password-msg', 'signup-password-group');
            clearBanner('signup-banner');
        });
    }

    // Handle Login Form Submission
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            clearAllLoginFeedback();

            const email = loginEmailInput ? loginEmailInput.value.trim() : '';
            const password = loginPasswordInput ? loginPasswordInput.value : '';

            // Client-side quick check
            let hasClientError = false;
            if (!email) {
                setFieldFeedback('login-email-msg', 'login-email-group', 'Please enter your email address.', 'error');
                hasClientError = true;
            }
            if (!password) {
                setFieldFeedback('login-password-msg', 'login-password-group', 'Please enter your password.', 'error');
                hasClientError = true;
            }
            if (hasClientError) return;

            // Show loading state on button
            const originalBtnHtml = loginBtn ? loginBtn.innerHTML : 'Sign In';
            if (loginBtn) {
                loginBtn.disabled = true;
                loginBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Signing In...`;
            }

            try {
                const response = await fetch(`${API_BASE_URL}/auth/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();

                if (response.ok) {
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('user', JSON.stringify({ _id: data._id, username: data.username, email: data.email }));
                    window.location.href = 'dashboard.html';
                } else {
                    // Specific field feedback as requested
                    if (data.field === 'email') {
                        // Email does not exist
                        setFieldFeedback(
                            'login-email-msg',
                            'login-email-group',
                            data.message || 'No account registered with this email.',
                            'error'
                        );
                    } else if (data.field === 'password') {
                        // Email exists! Show green confirmation under email and error under password
                        setFieldFeedback(
                            'login-email-msg',
                            'login-email-group',
                            'Account found with this email.',
                            'success'
                        );
                        setFieldFeedback(
                            'login-password-msg',
                            'login-password-group',
                            data.message || 'Incorrect password. Please try again.',
                            'error'
                        );
                    } else {
                        // Database connection or general server issue
                        const isDbIssue = data.message && data.message.toLowerCase().includes('database');
                        setBanner('login-banner', data.message || 'Login failed. Please try again.', isDbIssue ? 'warning' : 'error');
                    }
                }
            } catch (error) {
                console.error('Error logging in:', error);
                setBanner('login-banner', 'Unable to reach server. Please ensure the backend is running.', 'error');
            } finally {
                if (loginBtn) {
                    loginBtn.disabled = false;
                    loginBtn.innerHTML = originalBtnHtml;
                }
            }
        });
    }

    // Handle Signup Form Submission
    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            clearAllSignupFeedback();

            const username = signupUserInput ? signupUserInput.value.trim() : '';
            const email = signupEmailInput ? signupEmailInput.value.trim() : '';
            const password = signupPasswordInput ? signupPasswordInput.value : '';

            let hasClientError = false;
            if (!username) {
                setFieldFeedback('signup-username-msg', 'signup-username-group', 'Please enter a username.', 'error');
                hasClientError = true;
            }
            if (!email) {
                setFieldFeedback('signup-email-msg', 'signup-email-group', 'Please enter your email.', 'error');
                hasClientError = true;
            }
            if (!password || password.length < 6) {
                setFieldFeedback('signup-password-msg', 'signup-password-group', 'Password must be at least 6 characters.', 'error');
                hasClientError = true;
            }
            if (hasClientError) return;

            const originalBtnHtml = signupBtn ? signupBtn.innerHTML : 'Create Account';
            if (signupBtn) {
                signupBtn.disabled = true;
                signupBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Creating Account...`;
            }

            try {
                const response = await fetch(`${API_BASE_URL}/auth/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, email, password })
                });

                const data = await response.json();

                if (response.ok) {
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('user', JSON.stringify({ _id: data._id, username: data.username, email: data.email }));
                    window.location.href = 'dashboard.html';
                } else {
                    if (data.field === 'email') {
                        setFieldFeedback(
                            'signup-email-msg',
                            'signup-email-group',
                            data.message || 'An account already exists with this email.',
                            'error'
                        );
                    } else if (data.field === 'username') {
                        setFieldFeedback(
                            'signup-username-msg',
                            'signup-username-group',
                            data.message || 'This username is taken.',
                            'error'
                        );
                    } else {
                        const isDbIssue = data.message && data.message.toLowerCase().includes('database');
                        setBanner('signup-banner', data.message || 'Registration failed. Please try again.', isDbIssue ? 'warning' : 'error');
                    }
                }
            } catch (error) {
                console.error('Error signing up:', error);
                setBanner('signup-banner', 'Unable to reach server. Please ensure the backend is running.', 'error');
            } finally {
                if (signupBtn) {
                    signupBtn.disabled = false;
                    signupBtn.innerHTML = originalBtnHtml;
                }
            }
        });
    }

    // Toggle between Login and Signup forms
    const showSignupLink = document.getElementById('show-signup');
    const showLoginLink = document.getElementById('show-login');
    const loginSection = document.getElementById('login-section');
    const signupSection = document.getElementById('signup-section');

    if (showSignupLink && showLoginLink) {
        showSignupLink.addEventListener('click', (e) => {
            e.preventDefault();
            clearAllLoginFeedback();
            clearAllSignupFeedback();
            loginSection.style.display = 'none';
            signupSection.style.display = 'block';
        });

        showLoginLink.addEventListener('click', (e) => {
            e.preventDefault();
            clearAllLoginFeedback();
            clearAllSignupFeedback();
            signupSection.style.display = 'none';
            loginSection.style.display = 'block';
        });
    }
});

