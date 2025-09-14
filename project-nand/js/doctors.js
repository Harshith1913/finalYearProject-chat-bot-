class DoctorProfileManager {
    constructor() {
        this.doctors = doctors;
        this.initializeProfiles();
        this.attachEventListeners();
    }

    initializeProfiles() {
        this.renderDoctorsList();
        this.setupFilters();
    }

    renderDoctorsList(filteredDoctors = this.doctors) {
        const container = document.getElementById('doctorsGrid');
        if (!container) return;

        container.innerHTML = filteredDoctors.map(doctor => this.createDoctorCard(doctor)).join('');
    }

    createDoctorCard(doctor) {
        return `
            <div class="doctor-card" data-department="${doctor.department}">
                <div class="doctor-image">
                    <img src="${doctor.image}" alt="${doctor.name}">
                </div>
                <div class="doctor-info">
                    <h3>${doctor.name}</h3>
                    <p class="doctor-title">${doctor.title}</p>
                    <p class="doctor-specialization">${doctor.specialization}</p>
                    <p class="doctor-experience">${doctor.experience} Experience</p>
                    <div class="doctor-actions">
                        <button class="btn btn-primary" onclick="window.location.href='appointments.html?doctor=${doctor.id}'">
                            Book Appointment
                        </button>
                        <button class="btn btn-secondary" onclick="window.location.href='doctor-${doctor.id}.html'">
                            View Profile
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    setupFilters() {
        const filterContainer = document.getElementById('doctorFilters');
        if (!filterContainer) return;

        const departments = [...new Set(this.doctors.map(doc => doc.department))];
        
        filterContainer.innerHTML = `
            <button class="filter-btn active" data-department="all">All</button>
            ${departments.map(dept => `
                <button class="filter-btn" data-department="${dept}">
                    ${this.departments.find(d => d.id === dept)?.name || dept}
                </button>
            `).join('')}
        `;
    }

    attachEventListeners() {
        // Filter buttons
        document.querySelectorAll('.filter-btn')?.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleFilterClick(e);
            });
        });

        // Search functionality
        document.getElementById('doctorSearch')?.addEventListener('input', 
            utils.debounce((e) => this.handleSearch(e), 300)
        );
    }

    handleFilterClick(e) {
        const department = e.target.dataset.department;
        
        // Update active state
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        e.target.classList.add('active');

        // Filter doctors
        const filteredDoctors = department === 'all' 
            ? this.doctors 
            : this.doctors.filter(doc => doc.department === department);

        this.renderDoctorsList(filteredDoctors);
    }

    handleSearch(e) {
        const searchTerm = e.target.value.toLowerCase();
        
        const filteredDoctors = this.doctors.filter(doctor => 
            doctor.name.toLowerCase().includes(searchTerm) ||
            doctor.specialization.toLowerCase().includes(searchTerm) ||
            doctor.title.toLowerCase().includes(searchTerm)
        );

        this.renderDoctorsList(filteredDoctors);
    }
}

// Initialize the doctor profile manager when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new DoctorProfileManager();
}); 