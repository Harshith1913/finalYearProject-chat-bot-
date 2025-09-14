class AuthManager {
    constructor() {
        this.baseUrl = 'https://www.bmreducation.com/medcare';
        this.initializeEventListeners();
        this.setupNotifications();
    }

    initializeEventListeners() {
        // Login Form
        $('#loginForm').on('submit', (e) => this.handleLogin(e));

        // Signup Form
        $('#signupForm').on('submit', (e) => this.handleSignup(e));

        // Forgot Password Form
        $('#forgotPasswordForm').on('submit', (e) => this.handleForgotPassword(e));

        // Password Toggle
        $('.toggle-password').on('click', function() {
            const input = $(this).siblings('input');
            const icon = $(this).find('i');
            
            input.attr('type', input.attr('type') === 'password' ? 'text' : 'password');
            icon.toggleClass('fa-eye fa-eye-slash');
        });

        // Password Strength Meter
        $('#password').on('input', (e) => this.updatePasswordStrength(e.target.value));

        // Password validation functionality
        $('#password').on('input', function() {
            const password = $(this).val();
            const requirements = {
                length: password.length >= 8,
                uppercase: /[A-Z]/.test(password),
                lowercase: /[a-z]/.test(password),
                number: /[0-9]/.test(password),
                special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
            };

            // Update requirement indicators
            Object.keys(requirements).forEach(req => {
                const li = $(`#${req}`);
                if (requirements[req]) {
                    li.addClass('valid');
                    li.find('i').removeClass('fa-circle').addClass('fa-check-circle');
                } else {
                    li.removeClass('valid');
                    li.find('i').removeClass('fa-check-circle').addClass('fa-circle');
                }
            });

            // Update password strength
            const strength = Object.values(requirements).filter(Boolean).length;
            const strengthBar = $('.password-strength-bar');
            const strengthText = $('.password-strength-text span');
            
            const colors = ['#f44336', '#FF9800', '#FFEB3B', '#4CAF50', '#2E7D32'];
            const texts = ['Very Weak', 'Weak', 'Medium', 'Strong', 'Very Strong'];
            
            strengthBar.css({
                'width': `${(strength / 5) * 100}%`,
                'background-color': colors[strength - 1]
            });
            
            strengthText.text(`Password Strength: ${texts[strength - 1]}`);
        });

        // Form validation
        $('#signupForm').on('submit', function(e) {
            e.preventDefault();
            
            const password = $('#password').val();
            const confirmPassword = $('#confirmPassword').val();
            
            if (password !== confirmPassword) {
                $('#confirmPassword').addClass('is-invalid');
                if (!$('#confirmPassword').next('.invalid-feedback').length) {
                    $('<div class="invalid-feedback">Passwords do not match</div>')
                        .insertAfter('#confirmPassword');
                }
                return;
            }
            
            // Continue with form submission if validation passes
            // Your existing form submission code here
        });
    }

    async handleLogin(e) {
        e.preventDefault();
        const form = $(e.target);
        const submitBtn = form.find('button[type="submit"]');

        try {
            submitBtn.addClass('loading').prop('disabled', true);

            const response = await fetch(`${this.baseUrl}/login.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    email: $('#email').val().trim(),
                    password: $('#password').val()
                })
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                this.showNotification('Login successful! Redirecting...', 'success');
                setTimeout(() => window.location.href = 'dashboard.html', 1500);
            } else {
                switch (response.status) {
                    case 401:
                        this.showNotification(data.message || 'Invalid credentials', 'error');
                        break;
                    case 400:
                        this.showNotification(data.message || 'Please provide all required fields', 'error');
                        break;
                    default:
                        this.showNotification(data.message || 'Login failed', 'error');
                }
            }
        } catch (error) {
            console.error('Login error:', error);
            this.showNotification('Network error. Please try again.', 'error');
        } finally {
            submitBtn.removeClass('loading').prop('disabled', false);
        }
    }

    async handleSignup(e) {
        e.preventDefault();
        const form = $(e.target);
        const submitBtn = form.find('button[type="submit"]');

        if (!this.validateSignupForm()) return;

        try {
            submitBtn.addClass('loading').prop('disabled', true);

            const response = await fetch(`${this.baseUrl}/signup.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                mode: 'cors',
                credentials: 'same-origin',
                body: JSON.stringify({
                    first_name: $('#firstName').val().trim(),
                    last_name: $('#lastName').val().trim(),
                    email: $('#email').val().trim(),
                    password: $('#password').val()
                })
            });

            const data = await response.json();

            if (response.ok) {
                this.showNotification(data.message || 'Account created successfully! Please check your email.', 'success');
                setTimeout(() => window.location.href = 'login.html?registered=true', 2000);
            } else {
                switch (response.status) {
                    case 400:
                        this.showNotification(data.message || 'Invalid input data', 'error');
                        break;
                    case 500:
                        this.showNotification(data.message || 'Server error', 'error');
                        break;
                    default:
                        this.showNotification(data.message || 'An error occurred', 'error');
                }
            }
        } catch (error) {
            console.error('Signup error:', error);
            this.showNotification('Network error. Please try again.', 'error');
        } finally {
            submitBtn.removeClass('loading').prop('disabled', false);
        }
    }

    validateSignupForm() {
        const firstName = $('#firstName').val().trim();
        const lastName = $('#lastName').val().trim();
        const email = $('#email').val().trim();
        const password = $('#password').val();
        const confirmPassword = $('#confirmPassword').val();

        if (!firstName || !lastName) {
            this.showNotification('Please enter your full name', 'error');
            return false;
        }

        if (!email) {
            this.showNotification('Please enter your email', 'error');
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            this.showNotification('Please enter a valid email address', 'error');
            return false;
        }

        if (password !== confirmPassword) {
            this.showNotification('Passwords do not match', 'error');
            return false;
        }

        if (!this.isPasswordStrong(password)) {
            this.showNotification('Password does not meet strength requirements', 'error');
            return false;
        }

        if (!$('input[name="terms"]').is(':checked')) {
            this.showNotification('Please accept the Terms of Service', 'error');
            return false;
        }

        return true;
    }

    setupNotifications() {
        const notificationHtml = `
            <div class="notification">
                <i class="fas"></i>
                <span class="message"></span>
            </div>
        `;
        $('body').append(notificationHtml);
    }

    showNotification(message, type = 'success') {
        const notification = $('.notification');
        notification
            .removeClass('success error')
            .addClass(type)
            .find('.message').text(message);
        notification.addClass('show');
        setTimeout(() => notification.removeClass('show'), 3000);
    }

    isPasswordStrong(password) {
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        return password.length >= minLength && 
               hasUpperCase && hasLowerCase && 
               hasNumbers && hasSpecialChar;
    }

    updatePasswordStrength(password) {
        const strength = this.calculatePasswordStrength(password);
        const strengthBar = $('.password-strength-bar');
        const strengthText = $('.password-strength-text');

        const colors = ['#f44336', '#FF9800', '#FFEB3B', '#4CAF50'];
        const texts = ['Weak', 'Fair', 'Good', 'Strong'];

        strengthBar.css({
            'width': `${strength * 25}%`,
            'background-color': colors[strength - 1]
        });
        strengthText.text(texts[strength - 1]);
    }

    calculatePasswordStrength(password) {
        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[A-Z]/.test(password) && /[a-z]/.test(password)) strength++;
        if (/\d/.test(password)) strength++;
        if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;
        return strength;
    }

    async handleForgotPassword(e) {
        e.preventDefault();
        const form = $(e.target);
        const submitBtn = form.find('button[type="submit"]');
        const email = $('#email').val().trim();

        // Validate email
        if (!email) {
            this.showNotification('Please enter your email address', 'error');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            this.showNotification('Please enter a valid email address', 'error');
            return;
        }

        try {
            submitBtn.addClass('loading').prop('disabled', true);

            const response = await fetch(`${this.baseUrl}/forgot-password.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    email: email
                })
            });

            const data = await response.json();

            if (response.ok) {
                this.showNotification(data.message || 'Password reset instructions sent to your email', 'success');
                // Clear the form
                form[0].reset();
                
                // Optional: Redirect to login page after a delay
                setTimeout(() => window.location.href = 'login.html', 3000);
            } else {
                switch (response.status) {
                    case 400:
                        this.showNotification(data.message || 'Please provide a valid email', 'error');
                        break;
                    case 500:
                        this.showNotification(data.message || 'Server error', 'error');
                        break;
                    default:
                        this.showNotification(data.message || 'An error occurred', 'error');
                }
            }
        } catch (error) {
            console.error('Forgot password error:', error);
            this.showNotification('Network error. Please try again.', 'error');
        } finally {
            submitBtn.removeClass('loading').prop('disabled', false);
        }
    }

    validateLoginForm() {
        const email = $('#email').val().trim();
        const password = $('#password').val();

        if (!email || !password) {
            this.showNotification('Please enter both email and password', 'error');
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            this.showNotification('Please enter a valid email address', 'error');
            return false;
        }

        return true;
    }

    getStoredToken() {
        return localStorage.getItem('token');
    }

    getStoredUser() {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    }

    clearStoredAuth() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }

    isLoggedIn() {
        return !!this.getStoredToken();
    }
}

// Initialize when document is ready
$(document).ready(() => new AuthManager());