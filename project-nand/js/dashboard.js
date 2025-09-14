class DashboardManager {
    constructor() {
        this.baseUrl = 'https://www.bmreducation.com/medcare';
        this.init();
        this.startSessionCheck();
        this.currentSection = 'overview';
        this.setupSectionNavigation();
        this.setupHeaderActions();
        this.setupUserMenu();
    }

    startSessionCheck() {
        setInterval(() => this.checkSession(), 300000);
    }

    async init() {
        try {
            await this.checkSession();
            this.hideSessionLoader();
            this.setupEventListeners();
            this.loadUserData();
            this.updateDateTime();
            this.loadRecentActivity();
        } catch (error) {
            console.error('Initialization error:', error);
            this.redirectToLogin();
        }
    }

    async checkSession() {
        const token = localStorage.getItem('token');
        if (!token) {
            this.redirectToLogin();
            return;
        }

        try {
            const response = await fetch(`${this.baseUrl}/verify-session`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Session expired');
            }

            const data = await response.json();
            this.updateUserSession(data);
        } catch (error) {
            console.error('Session check failed:', error);
            this.clearSession();
            this.redirectToLogin();
        }
    }

    updateUserSession(data) {
        localStorage.setItem('userData', JSON.stringify({
            id: data.user_id,
            firstName: data.first_name,
            lastName: data.last_name,
            email: data.email,
            lastActive: new Date().toISOString()
        }));
    }

    loadUserData() {
        const userData = JSON.parse(localStorage.getItem('userData'));
        if (userData) {
            document.getElementById('userName').textContent = `${userData.firstName} ${userData.lastName}`;
            document.getElementById('welcomeName').textContent = userData.firstName;
            if (userData.avatar) {
                document.getElementById('userAvatar').src = userData.avatar;
            }
        }
    }

    setupEventListeners() {
        document.getElementById('sidebarToggle')?.addEventListener('click', () => {
            document.querySelector('.dashboard-sidebar').classList.toggle('active');
        });

        document.getElementById('userMenuBtn')?.addEventListener('click', () => {
            document.querySelector('.user-dropdown').classList.toggle('active');
        });

        document.getElementById('logoutBtn')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.handleLogout();
        });

        document.addEventListener('click', (e) => {
            if (!e.target.closest('.user-menu')) {
                document.querySelector('.user-dropdown')?.classList.remove('active');
            }
        });
    }

    async handleLogout() {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                this.redirectToLogin();
                return;
            }

            const response = await fetch(`${this.baseUrl}/logout`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Logout failed');
            }
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            this.clearSession();
            this.redirectToLogin();
        }
    }

    clearSession() {
        localStorage.removeItem('token');
        localStorage.removeItem('userData');
    }

    redirectToLogin() {
        window.location.href = 'login.html';
    }

    hideSessionLoader() {
        document.getElementById('sessionLoader').style.display = 'none';
    }

    updateDateTime() {
        const dateElement = document.getElementById('currentDate');
        if (dateElement) {
            const options = { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            };
            dateElement.textContent = new Date().toLocaleDateString('en-US', options);
        }
    }

    async loadRecentActivity() {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${this.baseUrl}/recent-activity`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error('Failed to fetch activity');

            const activities = await response.json();
            this.renderActivityList(activities);
        } catch (error) {
            console.error('Error loading activity:', error);
        }
    }

    renderActivityList(activities) {
        const activityList = document.getElementById('activityList');
        if (!activityList) return;

        activityList.innerHTML = activities.map(activity => `
            <div class="activity-item">
                <div class="activity-icon">
                    <i class="fas ${this.getActivityIcon(activity.type)}"></i>
                </div>
                <div class="activity-details">
                    <p class="activity-text">${activity.description}</p>
                    <p class="activity-time">${this.formatActivityTime(activity.timestamp)}</p>
                </div>
            </div>
        `).join('');
    }

    getActivityIcon(type) {
        const icons = {
            appointment: 'fa-calendar-check',
            prescription: 'fa-prescription',
            test: 'fa-flask',
            payment: 'fa-credit-card',
            default: 'fa-circle-info'
        };
        return icons[type] || icons.default;
    }

    formatActivityTime(timestamp) {
        return new Date(timestamp).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    }

    setupSectionNavigation() {
        const navLinks = document.querySelectorAll('.sidebar-nav a');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = e.currentTarget.getAttribute('href').substring(1);
                this.showSection(section);
            });
        });
    }

    showSection(sectionId) {
        // Hide all sections
        document.querySelectorAll('.dashboard-section').forEach(section => {
            section.classList.remove('active');
        });
        
        // Show selected section
        const selectedSection = document.getElementById(sectionId);
        if (selectedSection) {
            selectedSection.classList.add('active');
            this.currentSection = sectionId;
            this.loadSectionData(sectionId);
        }
    }

    async loadSectionData(sectionId) {
        switch (sectionId) {
            case 'appointments':
                await this.loadAppointments();
                break;
            case 'medical-records':
                await this.loadMedicalRecords();
                break;
            case 'profile':
                await this.loadProfileData();
                break;
            // Add other cases as needed
        }
    }

    async loadAppointments() {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            const response = await fetch(`${this.baseUrl}/get-appointments.php`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch appointments');
            }

            const data = await response.json();
            this.renderAppointments(data.appointments);
        } catch (error) {
            console.error('Error loading appointments:', error);
            alert('Failed to load appointments. Please try again later.');
        }
    }

    renderAppointments(appointments) {
        const appointmentsList = document.getElementById('appointmentsList');
        if (!appointmentsList) return;

        if (!appointments || appointments.length === 0) {
            appointmentsList.innerHTML = '<p class="no-appointments">No appointments found.</p>';
            return;
        }

        appointmentsList.innerHTML = appointments.map(appointment => `
            <div class="appointment-card">
                <div class="appointment-header">
                    <h3>Dr. ${appointment.doctor_name}</h3>
                    <span class="appointment-status ${appointment.status.toLowerCase()}">${appointment.status}</span>
                </div>
                <div class="appointment-details">
                    <p><i class="fas fa-calendar"></i> ${this.formatDate(appointment.appointment_date)}</p>
                    <p><i class="fas fa-clock"></i> ${this.formatTime(appointment.appointment_time)}</p>
                    <p><i class="fas fa-stethoscope"></i> ${appointment.specialty}</p>
                </div>
                <div class="appointment-actions">
                    ${this.getAppointmentActions(appointment)}
                </div>
            </div>
        `).join('');

        this.setupAppointmentActions();
    }

    setupAppointmentFilters() {
        const statusFilter = document.getElementById('statusFilter');
        const dateFilter = document.getElementById('dateFilter');

        if (statusFilter) {
            statusFilter.addEventListener('change', () => this.filterAppointments());
        }

        if (dateFilter) {
            dateFilter.addEventListener('change', () => this.filterAppointments());
        }
    }

    filterAppointments() {
        const status = document.getElementById('statusFilter').value;
        const date = document.getElementById('dateFilter').value;

        // Implementation of filter logic
        // This will re-fetch appointments with filter parameters
    }

    getAppointmentActions(appointment) {
        if (appointment.status.toLowerCase() === 'confirmed') {
            return `
                <button class="btn-reschedule" data-id="${appointment.id}">
                    <i class="fas fa-clock"></i> Reschedule
                </button>
                <button class="btn-cancel" data-id="${appointment.id}">
                    <i class="fas fa-times"></i> Cancel
                </button>
            `;
        }
        return '';
    }

    setupAppointmentActions() {
        document.querySelectorAll('.btn-reschedule').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const appointmentId = e.currentTarget.dataset.id;
                this.handleReschedule(appointmentId);
            });
        });

        document.querySelectorAll('.btn-cancel').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const appointmentId = e.currentTarget.dataset.id;
                this.handleCancel(appointmentId);
            });
        });
    }

    async loadMedicalRecords() {
        // Implementation for loading medical records
    }

    async loadProfileData() {
        // Implementation for loading profile data
    }

    setupHeaderActions() {
        // User Menu Toggle
        const userMenu = document.querySelector('.user-menu');
        const userMenuBtn = document.getElementById('userMenuBtn');

        if (userMenuBtn) {
            userMenuBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                userMenu.classList.toggle('active');
            });

            // Close dropdown when clicking outside
            document.addEventListener('click', (e) => {
                if (!userMenu.contains(e.target)) {
                    userMenu.classList.remove('active');
                }
            });
        }

        // Update user information
        this.updateUserInfo();
    }

    updateUserInfo() {
        const userData = JSON.parse(localStorage.getItem('userData'));
        if (userData) {
            // Update main button
            document.getElementById('userName').textContent = `${userData.firstName} ${userData.lastName}`;
            document.getElementById('userAvatar').src = userData.avatar || 'images/avatar-placeholder.png';
            
            // Update dropdown
            document.getElementById('dropdownName').textContent = `${userData.firstName} ${userData.lastName}`;
            document.getElementById('dropdownEmail').textContent = userData.email;
            document.getElementById('dropdownAvatar').src = userData.avatar || 'images/avatar-placeholder.png';
            
            // Update appointment badge if needed
            const appointmentBadge = document.querySelector('.dropdown-item .badge');
            if (appointmentBadge && userData.upcomingAppointments) {
                appointmentBadge.textContent = userData.upcomingAppointments;
            }
        }
    }

    async markAllNotificationsAsRead() {
        try {
            const response = await fetch(`${this.baseUrl}/mark-notifications-read`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.getStoredToken()}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                document.querySelector('.notification-badge').style.display = 'none';
                // Update notification list UI
                this.updateNotificationList();
            }
        } catch (error) {
            console.error('Error marking notifications as read:', error);
        }
    }

    async handleDeleteAccount() {
        const confirmed = await this.showConfirmDialog(
            'Delete Account',
            'Are you sure you want to delete your account? This action cannot be undone.'
        );

        if (confirmed) {
            try {
                const response = await fetch(`${this.baseUrl}/delete-account`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${this.getStoredToken()}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    this.clearSession();
                    this.redirectToLogin();
                }
            } catch (error) {
                console.error('Error deleting account:', error);
            }
        }
    }

    showConfirmDialog(title, message) {
        return new Promise((resolve) => {
            // Implementation of custom confirm dialog
            const confirmed = window.confirm(message);
            resolve(confirmed);
        });
    }

    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    formatTime(timeString) {
        return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    }

    getStoredToken() {
        return localStorage.getItem('token');
    }

    showError(message) {
        // You can implement this according to your UI needs
        // For example, using a toast notification or alert
        console.error(message);
        // Example using alert (you might want to use a better UI component)
        alert(message);
    }

    async handleReschedule(appointmentId) {
        // Implement reschedule functionality
        console.log('Reschedule appointment:', appointmentId);
    }

    async handleCancel(appointmentId) {
        // Implement cancel functionality
        console.log('Cancel appointment:', appointmentId);
    }

    setupUserMenu() {
        const userMenuBtn = document.getElementById('userMenuBtn');
        const userDropdown = document.querySelector('.user-dropdown');

        if (userMenuBtn && userDropdown) {
            userMenuBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                userDropdown.classList.toggle('show');
            });

            // Close dropdown when clicking outside
            document.addEventListener('click', (e) => {
                if (!userMenuBtn.contains(e.target) && !userDropdown.contains(e.target)) {
                    userDropdown.classList.remove('show');
                }
            });
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new DashboardManager();
});