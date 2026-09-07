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

    // I am creating a helper to clear feedback messages on the forgot password request form.
    const clearAllForgotFeedback = () => {
        // I am hiding and clearing the forgot-section banner.
        clearBanner('forgot-banner');
        // I am clearing feedback on the registered email field.
        clearFieldFeedback('forgot-email-msg', 'forgot-email-group');
    };

    // I am creating a helper to clear feedback messages on the new password reset form.
    const clearAllResetFeedback = () => {
        // I am hiding and clearing the reset-section banner.
        clearBanner('reset-banner');
        // I am clearing feedback on the new password field.
        clearFieldFeedback('reset-password-msg', 'reset-password-group');
        // I am clearing feedback on the confirm password field.
        clearFieldFeedback('reset-confirm-password-msg', 'reset-confirm-password-group');
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

    // I am selecting the forgot password email input for live feedback clearing.
    const forgotEmailInput = document.getElementById('forgot-email');
    if (forgotEmailInput) {
        forgotEmailInput.addEventListener('input', () => {
            clearFieldFeedback('forgot-email-msg', 'forgot-email-group');
            clearBanner('forgot-banner');
        });
    }

    // I am selecting the reset password input elements for live feedback clearing.
    const resetPasswordInput = document.getElementById('reset-password');
    const resetConfirmPasswordInput = document.getElementById('reset-confirm-password');
    if (resetPasswordInput) {
        resetPasswordInput.addEventListener('input', () => {
            clearFieldFeedback('reset-password-msg', 'reset-password-group');
            clearBanner('reset-banner');
        });
    }
    if (resetConfirmPasswordInput) {
        resetConfirmPasswordInput.addEventListener('input', () => {
            clearFieldFeedback('reset-confirm-password-msg', 'reset-confirm-password-group');
            clearBanner('reset-banner');
        });
    }

    // I am creating a helper function to set up password show/hide visibility toggling.
    const setupPasswordToggle = (toggleBtnId, passwordInputId) => {
        // I am querying the toggle button element from the DOM.
        const toggleBtn = document.getElementById(toggleBtnId);
        // I am querying the corresponding password input element from the DOM.
        const passwordInput = document.getElementById(passwordInputId);
        
        // I am verifying that both elements exist before attaching the listener.
        if (!toggleBtn || !passwordInput) return;

        // I am listening for click events on the password toggle button.
        toggleBtn.addEventListener('click', (e) => {
            // I am preventing default button behavior or form submissions.
            e.preventDefault();
            // I am checking if the input is currently masked as a password.
            const isPassword = passwordInput.type === 'password';
            // I am toggling the input type between text and password.
            passwordInput.type = isPassword ? 'text' : 'password';

            // I am selecting the icon element inside the toggle button.
            const icon = toggleBtn.querySelector('i');
            if (icon) {
                if (isPassword) {
                    // I am updating the icon to an eye with a slash when password is shown.
                    icon.className = 'fa-solid fa-eye-slash';
                    // I am updating the accessibility title and aria-label to Hide password.
                    toggleBtn.setAttribute('title', 'Hide password');
                    toggleBtn.setAttribute('aria-label', 'Hide password');
                } else {
                    // I am restoring the eye icon when password is hidden.
                    icon.className = 'fa-solid fa-eye';
                    // I am updating the accessibility title and aria-label to Show password.
                    toggleBtn.setAttribute('title', 'Show password');
                    toggleBtn.setAttribute('aria-label', 'Show password');
                }
            }
        });
    };

    // I am initializing the show/hide password toggle for the login form.
    setupPasswordToggle('toggle-login-password', 'login-password');
    // I am initializing the show/hide password toggle for the signup form.
    setupPasswordToggle('toggle-signup-password', 'signup-password');
    // I am initializing the show/hide password toggle for the new reset password form.
    setupPasswordToggle('toggle-reset-password', 'reset-password');
    // I am initializing the show/hide password toggle for the confirm reset password field.
    setupPasswordToggle('toggle-reset-confirm-password', 'reset-confirm-password');

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

    // I am selecting the forgot password form and submit button elements.
    const forgotForm = document.getElementById('forgot-form');
    const forgotBtn = document.getElementById('forgot-btn');

    // I am setting up the submission listener for the forgot password email request form.
    if (forgotForm) {
        forgotForm.addEventListener('submit', async (e) => {
            // I am preventing the default form reload behavior.
            e.preventDefault();
            // I am clearing existing feedback messages on the forgot form.
            clearAllForgotFeedback();

            // I am extracting and trimming the email input value.
            const email = forgotEmailInput ? forgotEmailInput.value.trim() : '';

            // I am checking if an email was entered.
            if (!email) {
                setFieldFeedback('forgot-email-msg', 'forgot-email-group', 'Please enter your registered email address.', 'error');
                return;
            }

            // I am saving original button HTML and activating the loading state.
            const originalBtnHtml = forgotBtn ? forgotBtn.innerHTML : 'Send Reset Link';
            if (forgotBtn) {
                forgotBtn.disabled = true;
                forgotBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending Link...';
            }

            try {
                // I am sending a POST request to the forgot-password API endpoint.
                const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email })
                });

                const data = await response.json();

                if (response.ok && data.success) {
                    let successMessage = data.message || 'A secure password reset link has been dispatched to your email address.';
                    // I am checking if this was a simulated email (when SMTP credentials are not yet configured on server).
                    if (data.simulated && data.resetUrl) {
                        successMessage += `<div style="margin-top: 10px; font-size: 13px; background: rgba(99,102,241,0.15); padding: 8px 12px; border-radius: 6px; border: 1px dashed rgba(99,102,241,0.4);">
                            <strong>Dev Simulation:</strong> SMTP not configured. <a href="${data.resetUrl}" style="color: #6366f1; text-decoration: underline; font-weight: 600;">Click here to open Reset Password Screen</a>
                        </div>`;
                    }
                    // I am displaying the success feedback banner.
                    setBanner('forgot-banner', successMessage, 'success');
                    // I am clearing the email input.
                    if (forgotEmailInput) forgotEmailInput.value = '';
                } else {
                    if (data.field === 'email') {
                        setFieldFeedback('forgot-email-msg', 'forgot-email-group', data.message || 'No account registered with this email address.', 'error');
                    } else {
                        setBanner('forgot-banner', data.message || 'Failed to dispatch reset link. Please try again.', 'error');
                    }
                }
            } catch (error) {
                console.error('Error dispatching reset link:', error);
                setBanner('forgot-banner', 'Unable to reach server. Please ensure the backend is running.', 'error');
            } finally {
                // I am restoring the button to its active state.
                if (forgotBtn) {
                    forgotBtn.disabled = false;
                    forgotBtn.innerHTML = originalBtnHtml;
                }
            }
        });
    }

    // I am selecting the reset password form and submit button elements.
    const resetForm = document.getElementById('reset-form');
    const resetBtn = document.getElementById('reset-btn');

    // I am setting up the submission listener for the new password reset form.
    if (resetForm) {
        resetForm.addEventListener('submit', async (e) => {
            // I am preventing the default form reload behavior.
            e.preventDefault();
            // I am clearing existing feedback messages on the reset form.
            clearAllResetFeedback();

            // I am extracting the token from URL query parameters.
            const urlParams = new URLSearchParams(window.location.search);
            const token = urlParams.get('resetToken') || urlParams.get('token');

            // I am ensuring a valid reset token is present.
            if (!token) {
                setBanner('reset-banner', 'Password reset token is missing. Please use the link provided in your email.', 'error');
                return;
            }

            // I am reading the new and confirmed password values.
            const newPassword = resetPasswordInput ? resetPasswordInput.value : '';
            const confirmPassword = resetConfirmPasswordInput ? resetConfirmPasswordInput.value : '';

            let hasError = false;
            // I am validating password length requirement.
            if (!newPassword || newPassword.length < 6) {
                setFieldFeedback('reset-password-msg', 'reset-password-group', 'Password must be at least 6 characters.', 'error');
                hasError = true;
            }
            // I am checking if password and confirmation match.
            if (newPassword && newPassword !== confirmPassword) {
                setFieldFeedback('reset-confirm-password-msg', 'reset-confirm-password-group', 'Passwords do not match.', 'error');
                hasError = true;
            }

            if (hasError) return;

            // I am saving original button HTML and activating the loading state.
            const originalBtnHtml = resetBtn ? resetBtn.innerHTML : 'Update Password';
            if (resetBtn) {
                resetBtn.disabled = true;
                resetBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Updating Password...';
            }

            try {
                // I am sending a POST request to update the password with the verified token.
                const response = await fetch(`${API_BASE_URL}/auth/reset-password/${encodeURIComponent(token)}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ newPassword })
                });

                const data = await response.json();

                if (response.ok && data.success) {
                    // I am displaying the success feedback banner.
                    setBanner('reset-banner', data.message || 'Password reset successfully! Redirecting to sign in...', 'success');
                    // I am clearing the reset form inputs.
                    resetForm.reset();

                    // I am clearing the token from the browser address bar cleanly without page reload.
                    if (window.history && window.history.replaceState) {
                        window.history.replaceState({}, document.title, window.location.pathname);
                    }

                    // I am redirecting to the sign in view after a short pause.
                    setTimeout(() => {
                        hideAllAuthSections();
                        if (loginSection) {
                            loginSection.style.display = 'block';
                            setBanner('login-banner', 'Password updated! Please sign in with your new credentials.', 'success');
                        }
                    }, 1800);
                } else {
                    setBanner('reset-banner', data.message || 'This reset link has expired or is invalid. Please request a new one.', 'error');
                }
            } catch (error) {
                console.error('Error resetting password:', error);
                setBanner('reset-banner', 'Unable to reach server. Please ensure the backend is running.', 'error');
            } finally {
                // I am restoring the update password button.
                if (resetBtn) {
                    resetBtn.disabled = false;
                    resetBtn.innerHTML = originalBtnHtml;
                }
            }
        });
    }

    // Toggle between Login, Signup, Forgot Password, and Reset Password views
    const showSignupLink = document.getElementById('show-signup');
    const showLoginLink = document.getElementById('show-login');
    const showForgotLink = document.getElementById('show-forgot');
    const forgotToLoginLink = document.getElementById('forgot-to-login');
    const resetToLoginLink = document.getElementById('reset-to-login');

    const loginSection = document.getElementById('login-section');
    const signupSection = document.getElementById('signup-section');
    const forgotSection = document.getElementById('forgot-section');
    const resetSection = document.getElementById('reset-section');

    // I am defining a helper to hide all auth sections and reset their feedback messages.
    const hideAllAuthSections = () => {
        clearAllLoginFeedback();
        clearAllSignupFeedback();
        clearAllForgotFeedback();
        clearAllResetFeedback();
        if (loginSection) loginSection.style.display = 'none';
        if (signupSection) signupSection.style.display = 'none';
        if (forgotSection) forgotSection.style.display = 'none';
        if (resetSection) resetSection.style.display = 'none';
    };

    if (showSignupLink) {
        showSignupLink.addEventListener('click', (e) => {
            e.preventDefault();
            hideAllAuthSections();
            if (signupSection) signupSection.style.display = 'block';
        });
    }

    if (showLoginLink) {
        showLoginLink.addEventListener('click', (e) => {
            e.preventDefault();
            hideAllAuthSections();
            if (loginSection) loginSection.style.display = 'block';
        });
    }

    if (showForgotLink) {
        showForgotLink.addEventListener('click', (e) => {
            e.preventDefault();
            hideAllAuthSections();
            if (forgotSection) {
                forgotSection.style.display = 'block';
                if (forgotEmailInput && loginEmailInput && loginEmailInput.value) {
                    forgotEmailInput.value = loginEmailInput.value.trim();
                }
            }
        });
    }

    if (forgotToLoginLink) {
        forgotToLoginLink.addEventListener('click', (e) => {
            e.preventDefault();
            hideAllAuthSections();
            if (loginSection) loginSection.style.display = 'block';
        });
    }

    if (resetToLoginLink) {
        resetToLoginLink.addEventListener('click', (e) => {
            e.preventDefault();
            hideAllAuthSections();
            // I am clearing token from the URL if user cancels and goes to login.
            if (window.history && window.history.replaceState) {
                window.history.replaceState({}, document.title, window.location.pathname);
            }
            if (loginSection) loginSection.style.display = 'block';
        });
    }

    // I am checking if a resetToken was passed via the URL query parameters on page load.
    const urlParams = new URLSearchParams(window.location.search);
    const initialResetToken = urlParams.get('resetToken') || urlParams.get('token');
    if (initialResetToken) {
        // I am hiding all standard sections and displaying the password reset form.
        hideAllAuthSections();
        if (resetSection) {
            resetSection.style.display = 'block';
            setBanner('reset-banner', 'Secure reset link verified! Please enter your new password below.', 'info');
        }
    }
});

