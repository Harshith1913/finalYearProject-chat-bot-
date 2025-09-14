document.addEventListener('DOMContentLoaded', function() {
    // Check if required data is available
    if (typeof departments === 'undefined' || typeof doctors === 'undefined') {
        console.error('Required data is not loaded. Please check data.js inclusion');
        return;
    }

    // Get form elements
    const appointmentForm = document.getElementById('appointmentForm');
    const departmentSelect = document.getElementById('department');
    const doctorSelect = document.getElementById('doctor');
    const dateInput = document.getElementById('appointmentDate');
    const timeSelect = document.getElementById('appointmentTime');
    const messageContainer = document.getElementById('appointmentMessage');
    const submitButton = document.querySelector('#appointmentForm button[type="submit"]');

    // Error handling class
    class AppointmentError extends Error {
        constructor(message, field = null) {
            super(message);
            this.name = 'AppointmentError';
            this.field = field;
        }
    }

    // Appointment Manager
    const AppointmentManager = {
        showError(message, field = null) {
            if (field) {
                const errorElement = document.getElementById(`${field}Error`);
                if (errorElement) {
                    errorElement.textContent = message;
                    errorElement.style.display = 'block';
                    document.getElementById(field)?.classList.add('is-invalid');
                }
            } else {
                // Show general error message
                const errorDiv = document.createElement('div');
                errorDiv.className = 'alert alert-danger';
                errorDiv.role = 'alert';
                errorDiv.textContent = message;
                appointmentForm.insertBefore(errorDiv, appointmentForm.firstChild);
                
                // Remove error after 5 seconds
                setTimeout(() => errorDiv.remove(), 5000);
            }
        },

        clearErrors() {
            // Clear all error messages
            document.querySelectorAll('.invalid-feedback').forEach(el => el.textContent = '');
            document.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
            document.querySelectorAll('.alert').forEach(el => el.remove());
        },

        validateForm(formData) {
            for (const [field, value] of formData.entries()) {
                const schema = validationSchemas.appointment[field];
                if (!schema) continue;

                if (schema.required && !value) {
                    throw new AppointmentError(schema.message, field);
                }

                if (schema.pattern && !schema.pattern.test(value)) {
                    throw new AppointmentError(schema.message, field);
                }

                if (schema.validate && !schema.validate(value)) {
                    throw new AppointmentError(schema.message, field);
                }
            }
            return true;
        }
    };

    // Initialize department select with ARIA attributes
    function initializeDepartments() {
        if (!departmentSelect) return;
        
        departmentSelect.setAttribute('aria-label', 'Select Medical Department');
        departmentSelect.innerHTML = '<option value="">Select Department</option>';
        departments.forEach(dept => {
            departmentSelect.innerHTML += `
                <option value="${dept.id}">${dept.name} - ${dept.description}</option>
            `;
        });

        resetDependentFields();
    }

    // Reset all dependent fields
    function resetDependentFields() {
        resetDoctorSelect();
        resetTimeSelect();
        resetDateInput();
    }

    // Enhanced reset functions with ARIA attributes
    function resetDoctorSelect() {
        if (!doctorSelect) return;
        doctorSelect.setAttribute('aria-label', 'Select Doctor');
        doctorSelect.setAttribute('aria-disabled', 'true');
        doctorSelect.innerHTML = '<option value="">Please select a department first</option>';
    }

    function resetTimeSelect() {
        if (!timeSelect) return;
        timeSelect.setAttribute('aria-label', 'Select Appointment Time');
        timeSelect.setAttribute('aria-disabled', 'true');
        timeSelect.innerHTML = '<option value="">Please select a doctor and date first</option>';
    }

    function resetDateInput() {
        if (!dateInput) return;
        dateInput.setAttribute('aria-label', 'Select Appointment Date');
        dateInput.value = '';
        setDateConstraints();
    }

    // Set date constraints (no past dates, max 3 months ahead)
    function setDateConstraints() {
        const today = new Date();
        const maxDate = new Date();
        maxDate.setMonth(maxDate.getMonth() + 3);
        
        dateInput.min = today.toISOString().split('T')[0];
        dateInput.max = maxDate.toISOString().split('T')[0];
    }

    // Enhanced doctor update with availability info
    function updateDoctors(departmentId) {
        if (!doctorSelect) return;

        doctorSelect.innerHTML = '<option value="">Select Doctor</option>';
        doctorSelect.removeAttribute('aria-disabled');
        
        if (!departmentId) {
            resetDoctorSelect();
            return;
        }

        const departmentDoctors = doctors.filter(doc => doc.department === departmentId);
        departmentDoctors.forEach(doctor => {
            const availableDays = Object.keys(doctor.availability).join(', ');
            doctorSelect.innerHTML += `
                <option value="${doctor.name}">
                    ${doctor.name} - ${doctor.title}
                    (Available: ${availableDays})
                </option>
            `;
        });
    }

    // Enhanced time slot update with better grouping
    function updateTimeSlots() {
        if (!timeSelect || !dateInput?.value || !doctorSelect?.value) return;

        const selectedDate = new Date(dateInput.value);
        const dayOfWeek = utils.getDayOfWeek(selectedDate);
        const selectedDoctor = doctors.find(doc => doc.name === doctorSelect.value);

        timeSelect.innerHTML = '<option value="">Select Time</option>';
        timeSelect.removeAttribute('aria-disabled');

        // Check if doctor is available on this day
        if (!selectedDoctor?.availability[dayOfWeek]) {
            timeSelect.innerHTML = `<option value="">Doctor not available on ${dayOfWeek}</option>`;
            return;
        }

        // Check if date is in unavailable dates (with null check)
        const dateString = dateInput.value;
        if (selectedDoctor.unavailableDates && selectedDoctor.unavailableDates.includes(dateString)) {
            timeSelect.innerHTML = '<option value="">Doctor not available on this date</option>';
            return;
        }

        // Get available slots for the day
        const daySchedule = selectedDoctor.availability[dayOfWeek];
        const availableSlots = daySchedule.slots;
        const breakTime = daySchedule.breakTime;

        // Group time slots by period
        const periods = {
            morning: availableSlots.filter(time => time < '12:00'),
            afternoon: availableSlots.filter(time => {
                const hour = parseInt(time.split(':')[0]);
                return hour >= 12 && hour < 17;
            }),
            evening: availableSlots.filter(time => time >= '17:00')
        };

        // Add time slots grouped by period
        Object.entries(periods).forEach(([period, slots]) => {
            if (slots.length > 0) {
                const group = document.createElement('optgroup');
                group.label = `${period.charAt(0).toUpperCase() + period.slice(1)} (${TIME_SLOTS[period].label})`;
                
                slots.forEach(time => {
                    // Skip break time
                    if (breakTime && time >= breakTime.split('-')[0] && time <= breakTime.split('-')[1]) {
                        return;
                    }

                    const option = document.createElement('option');
                    option.value = time;
                    option.textContent = utils.formatTime(time);
                    group.appendChild(option);
                });

                if (group.children.length > 0) {
                    timeSelect.appendChild(group);
                }
            }
        });

        if (timeSelect.options.length === 1) {
            timeSelect.innerHTML = '<option value="">No available time slots</option>';
        }

        // Update ARIA labels
        timeSelect.setAttribute('aria-label', `Available time slots for ${selectedDoctor.name} on ${utils.formatDate(selectedDate)}`);
    }

    // Event listeners with improved handling
    departmentSelect?.addEventListener('change', function() {
        updateDoctors(this.value);
        resetTimeSelect();
        if (dateInput) dateInput.value = '';
    });

    doctorSelect?.addEventListener('change', function() {
        if (dateInput?.value) {
            updateTimeSlots();
        } else {
            resetTimeSelect();
        }
    });

    dateInput?.addEventListener('change', function() {
        if (doctorSelect?.value) {
            updateTimeSlots();
        }
    });

    // Form submission handler
    appointmentForm?.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Clear previous errors
        AppointmentManager.clearErrors();
        
        // Get submit button and store original text
        const submitButton = this.querySelector('button[type="submit"]');
        const originalButtonText = submitButton ? submitButton.innerHTML : 'Schedule Appointment';
        
        try {
            const formData = new FormData(this);
            
            // Validate form
            AppointmentManager.validateForm(formData);

            // Disable submit button and show loading state
            if (submitButton) {
                submitButton.disabled = true;
                submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Scheduling...';
            }

            // Send appointment request with correct URL
            const response = await fetch('https://www.bmreducation.com/medcare/appointments.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                credentials: 'same-origin',
                body: JSON.stringify(Object.fromEntries(formData))
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();

            if (!result.success) {
                throw new Error(result.message || 'Failed to schedule appointment');
            }

            // Show success message
            const successDiv = document.createElement('div');
            successDiv.className = 'alert alert-success';
            successDiv.role = 'alert';
            successDiv.innerHTML = `
                Appointment scheduled successfully!<br>
                Reference: ${result.data.appointmentRef}<br>
                Date: ${utils.formatDate(result.data.appointmentDate)}<br>
                Time: ${utils.formatTime(result.data.appointmentTime)}<br>
                ${result.data.emailSent ? 'Confirmation email has been sent.' : ''}
            `;
            appointmentForm.insertBefore(successDiv, appointmentForm.firstChild);

            // Reset form
            this.reset();
            initializeDepartments();

        } catch (error) {
            console.error('Appointment Error:', error);
            
            // Show error message
            AppointmentManager.showError(
                error.message || 'Failed to schedule appointment. Please try again later.'
            );
        } finally {
            // Reset button state
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.innerHTML = originalButtonText;
            }
        }
    });

    // Enhanced message display with ARIA live region
    function showMessage(message, type = 'success') {
        if (!messageContainer) return;

        messageContainer.setAttribute('role', 'alert');
        messageContainer.setAttribute('aria-live', 'polite');

        messageContainer.innerHTML = `
            <div class="alert alert-${type}">
                <span class="alert-icon">
                    ${type === 'success' ? '✓' : '⚠'}
                </span>
                <span class="alert-message">${message}</span>
                <button class="alert-close" aria-label="Close message">×</button>
            </div>
        `;

        // Auto-hide success messages
        if (type === 'success') {
            setTimeout(() => {
                messageContainer.innerHTML = '';
            }, 5000);
        }

        // Add close button functionality
        const closeBtn = messageContainer.querySelector('.alert-close');
        closeBtn?.addEventListener('click', () => {
            messageContainer.innerHTML = '';
        });
    }

    // Initialize the form
    initializeDepartments();
});
