document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    
    if (!contactForm) {
        console.error('Contact form not found');
        return;
    }

    // Add this to debug form submission
    console.log('Contact form found:', contactForm);

    class ContactManager {
        static showMessage(message, type = 'success') {
            const messageContainer = document.createElement('div');
            messageContainer.className = `alert alert-${type}`;
            messageContainer.innerHTML = `
                <div class="alert-content">
                    ${message}
                </div>
                <button type="button" class="alert-close" onclick="this.parentElement.remove()">×</button>
            `;
            
            // Insert before form
            contactForm.parentElement.insertBefore(messageContainer, contactForm);
            
            // Remove after 5 seconds
            setTimeout(() => messageContainer.remove(), 5000);
        }

        static validateForm(formData) {
            const name = formData.get('name');
            const email = formData.get('email');
            const phone = formData.get('phone');
            const subject = formData.get('subject');
            const message = formData.get('message');

            if (!name || !email || !phone || !subject || !message) {
                throw new Error('Please fill in all required fields');
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                throw new Error('Please enter a valid email address');
            }

            // Phone validation (allows international formats)
            const phoneRegex = /^[\d\s\-+()]{10,}$/;
            if (!phoneRegex.test(phone)) {
                throw new Error('Please enter a valid phone number');
            }

            return true;
        }
    }

    contactForm.addEventListener('submit', async function(e) {
        // Prevent form submission immediately
        e.preventDefault();
        console.log('Form submission intercepted');
        
        const submitButton = this.querySelector('button[type="submit"]');
        if (!submitButton) {
            console.error('Submit button not found');
            return;
        }
        
        const originalButtonText = submitButton.innerHTML;
        
        try {
            const formData = new FormData(this);
            
            // Debug form data
            console.log('Form data collected:');
            for (let pair of formData.entries()) {
                console.log(pair[0] + ': ' + pair[1]);
            }
            
            // Validate form
            ContactManager.validateForm(formData);
            
            // Update button state
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            
            // Convert FormData to JSON
            const formJson = Object.fromEntries(formData.entries());
            
            // Send to backend
            const response = await fetch('https://www.bmreducation.com/medcare/contact.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(formJson)
            });
            
            // Log response for debugging
            console.log('Response status:', response.status);
            
            const result = await response.json();
            console.log('Response data:', result);
            
            if (result.success) {
                ContactManager.showMessage(`
                    <i class="fas fa-check-circle"></i>
                    Thank you for your message! We'll get back to you soon.
                    ${result.emailSent ? '<br>A confirmation email has been sent to your address.' : ''}
                `, 'success');
                
                this.reset();
            } else {
                throw new Error(result.message || 'Failed to send message');
            }
            
        } catch (error) {
            console.error('Contact Form Error:', error);
            
            ContactManager.showMessage(`
                <i class="fas fa-exclamation-circle"></i>
                ${error.message || 'Failed to send message. Please try again later.'}
            `, 'error');
            
        } finally {
            submitButton.disabled = false;
            submitButton.innerHTML = originalButtonText;
        }
        
        // Prevent form submission again just to be safe
        return false;
    });

    // Add input validation feedback
    const inputs = contactForm.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            if (this.value.trim()) {
                this.classList.remove('is-invalid');
                this.classList.add('is-valid');
            } else {
                this.classList.remove('is-valid');
                this.classList.add('is-invalid');
            }
        });
    });
}); 