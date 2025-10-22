class DeveloperProfiles {
    constructor() {
        this.currentPage = 1;
        this.currentLimit = 9;
        this.currentSearchQuery = {};
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadProfiles();
    }

    bindEvents() {
        // Form events
        document.getElementById('showCreateForm').addEventListener('click', () => this.showForm());
        document.getElementById('cancelForm').addEventListener('click', () => this.hideForm());
        document.getElementById('profileFormElement').addEventListener('submit', (e) => this.handleFormSubmit(e));
        
        // Search events
        document.getElementById('searchBtn').addEventListener('click', () => this.handleSearch());
        document.getElementById('clearSearch').addEventListener('click', () => this.clearSearch());
        
        // Enter key for search inputs
        ['#searchLocation', '#searchSkills'].forEach(selector => {
            document.querySelector(selector).addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.handleSearch();
            });
        });
    }

    async loadProfiles(page = 1) {
        this.showLoading();
        this.currentPage = page;

        try {
            const queryParams = new URLSearchParams({
                page: page,
                limit: this.currentLimit,
                ...this.currentSearchQuery
            });

            const response = await fetch(`/api/profiles?${queryParams}`);
            const result = await response.json();

            if (result.success) {
                this.displayProfiles(result.data);
                this.displayPagination(result.pagination);
            } else {
                throw new Error(result.message);
            }
        } catch (error) {
            this.showError('Failed to load profiles: ' + error.message);
        } finally {
            this.hideLoading();
        }
    }

    displayProfiles(profiles) {
        const grid = document.getElementById('profilesGrid');
        
        if (profiles.length === 0) {
            grid.innerHTML = `
                <div class="no-profiles">
                    <h3>No profiles found</h3>
                    <p>Try adjusting your search criteria or create a new profile.</p>
                </div>
            `;
            return;
        }

        grid.innerHTML = profiles.map(profile => `
            <div class="profile-card">
                <div class="profile-header">
                    <div class="profile-name">${this.escapeHtml(profile.name)}</div>
                    <span class="availability ${profile.availableForWork ? 'available' : 'not-available'}">
                        ${profile.availableForWork ? 'Available' : 'Not Available'}
                    </span>
                </div>
                <div class="profile-email">${this.escapeHtml(profile.email)}</div>
                <div class="profile-location">📍 ${this.escapeHtml(profile.location)}</div>
                
                <div class="profile-skills">
                    ${profile.skills.map(skill => `
                        <span class="skill-tag">${this.escapeHtml(skill)}</span>
                    `).join('')}
                </div>
                
                <div class="profile-details">
                    <span class="experience">${profile.experienceYears} years experience</span>
                    <span class="rate">$${profile.hourlyRate}/hr</span>
                </div>
                
                <div class="profile-actions">
                    <button class="btn btn-primary" onclick="app.editProfile(${profile.id})">Edit</button>
                    <button class="btn btn-danger" onclick="app.deleteProfile(${profile.id})">Delete</button>
                </div>
            </div>
        `).join('');
    }

    displayPagination(pagination) {
        const paginationEl = document.getElementById('pagination');
        
        if (pagination.totalPages <= 1) {
            paginationEl.innerHTML = '';
            return;
        }

        paginationEl.innerHTML = `
            <button class="pagination-btn" ${!pagination.hasPrev ? 'disabled' : ''} 
                onclick="app.loadProfiles(${pagination.currentPage - 1})">Previous</button>
            
            <span class="pagination-info">
                Page ${pagination.currentPage} of ${pagination.totalPages}
            </span>
            
            <button class="pagination-btn" ${!pagination.hasNext ? 'disabled' : ''} 
                onclick="app.loadProfiles(${pagination.currentPage + 1})">Next</button>
        `;
    }

    showForm(profile = null) {
        const form = document.getElementById('profileForm');
        const title = document.getElementById('formTitle');
        const formElement = document.getElementById('profileFormElement');
        
        if (profile) {
            title.textContent = 'Edit Profile';
            this.populateForm(profile);
        } else {
            title.textContent = 'Create Profile';
            formElement.reset();
            document.getElementById('profileId').value = '';
        }
        
        form.style.display = 'flex';
    }

    hideForm() {
        document.getElementById('profileForm').style.display = 'none';
    }

    populateForm(profile) {
        document.getElementById('profileId').value = profile.id;
        document.getElementById('name').value = profile.name;
        document.getElementById('email').value = profile.email;
        document.getElementById('location').value = profile.location;
        document.getElementById('skills').value = profile.skills.join(', ');
        document.getElementById('experienceYears').value = profile.experienceYears;
        document.getElementById('hourlyRate').value = profile.hourlyRate;
        document.getElementById('availableForWork').checked = profile.availableForWork;
    }

    async handleFormSubmit(e) {
        e.preventDefault();
        
        const profileId = document.getElementById('profileId').value;
        const formData = {
            name: document.getElementById('name').value.trim(),
            email: document.getElementById('email').value.trim(),
            location: document.getElementById('location').value.trim(),
            skills: document.getElementById('skills').value.split(',').map(skill => skill.trim()).filter(skill => skill),
            experienceYears: parseInt(document.getElementById('experienceYears').value),
            hourlyRate: parseInt(document.getElementById('hourlyRate').value),
            availableForWork: document.getElementById('availableForWork').checked
        };

        try {
            let response;
            if (profileId) {
                // Update existing profile
                response = await fetch(`/api/profiles/${profileId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });
            } else {
                // Create new profile
                response = await fetch('/api/profiles', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });
            }

            const result = await response.json();

            if (result.success) {
                this.hideForm();
                this.showSuccess(profileId ? 'Profile updated successfully!' : 'Profile created successfully!');
                this.loadProfiles(this.currentPage);
            } else {
                throw new Error(result.message || (result.errors ? result.errors.join(', ') : 'Operation failed'));
            }
        } catch (error) {
            this.showError('Failed to save profile: ' + error.message);
        }
    }

    async editProfile(id) {
        try {
            const response = await fetch(`/api/profiles/${id}`);
            const result = await response.json();

            if (result.success) {
                this.showForm(result.data);
            } else {
                throw new Error(result.message);
            }
        } catch (error) {
            this.showError('Failed to load profile: ' + error.message);
        }
    }

    async deleteProfile(id) {
        if (!confirm('Are you sure you want to delete this profile?')) {
            return;
        }

        try {
            const response = await fetch(`/api/profiles/${id}`, {
                method: 'DELETE'
            });
            const result = await response.json();

            if (result.success) {
                this.showSuccess('Profile deleted successfully!');
                this.loadProfiles(this.currentPage);
            } else {
                throw new Error(result.message);
            }
        } catch (error) {
            this.showError('Failed to delete profile: ' + error.message);
        }
    }

    handleSearch() {
        const location = document.getElementById('searchLocation').value.trim();
        const skills = document.getElementById('searchSkills').value.trim();
        const available = document.getElementById('filterAvailable').value;

        this.currentSearchQuery = {};
        
        if (location) this.currentSearchQuery.location = location;
        if (skills) this.currentSearchQuery.skills = skills;
        if (available) this.currentSearchQuery.availableForWork = available;

        this.loadProfiles(1);
    }

    clearSearch() {
        document.getElementById('searchLocation').value = '';
        document.getElementById('searchSkills').value = '';
        document.getElementById('filterAvailable').value = '';
        
        this.currentSearchQuery = {};
        this.loadProfiles(1);
    }

    showLoading() {
        document.getElementById('loading').style.display = 'block';
    }

    hideLoading() {
        document.getElementById('loading').style.display = 'none';
    }

    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    showNotification(message, type) {
        // Remove existing notifications
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 4px;
            color: white;
            font-weight: 500;
            z-index: 1001;
            animation: slideIn 0.3s ease;
            ${type === 'success' ? 'background-color: #27ae60;' : 'background-color: #e74c3c;'}
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
}

// Initialize the application
const app = new DeveloperProfiles();