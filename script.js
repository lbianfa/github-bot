class RickAndMortyAPI {
    constructor() {
        this.baseURL = 'https://rickandmortyapi.com/api';
        this.currentPage = 1;
        this.currentEndpoint = 'character';
        this.currentFilters = {};
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadCharacters();
    }

    setupEventListeners() {
        const searchInput = document.getElementById('searchInput');
        const statusFilter = document.getElementById('statusFilter');
        const genderFilter = document.getElementById('genderFilter');

        searchInput.addEventListener('input', this.debounce(() => {
            this.currentFilters.name = searchInput.value;
            this.currentPage = 1;
            this.loadData();
        }, 500));

        statusFilter.addEventListener('change', () => {
            this.currentFilters.status = statusFilter.value;
            this.currentPage = 1;
            this.loadData();
        });

        genderFilter.addEventListener('change', () => {
            this.currentFilters.gender = genderFilter.value;
            this.currentPage = 1;
            this.loadData();
        });
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    showLoading() {
        document.getElementById('loading').style.display = 'flex';
    }

    hideLoading() {
        document.getElementById('loading').style.display = 'none';
    }

    async fetchData(endpoint, page = 1, filters = {}) {
        this.showLoading();
        
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                ...filters
            });

            const response = await fetch(`${this.baseURL}/${endpoint}?${params}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching data:', error);
            this.showError('Failed to load data. Please try again.');
            return null;
        } finally {
            this.hideLoading();
        }
    }

    showError(message) {
        const grid = document.getElementById('grid');
        grid.innerHTML = `
            <div class="error-message" style="grid-column: 1 / -1; text-align: center; padding: 2rem;">
                <h3 style="color: #d63d2e; margin-bottom: 1rem;">Error</h3>
                <p>${message}</p>
            </div>
        `;
    }

    async loadCharacters(page = 1) {
        this.currentEndpoint = 'character';
        this.currentPage = page;
        this.updateFiltersVisibility(true);
        
        const data = await this.fetchData('character', page, this.currentFilters);
        if (data) {
            this.renderCharacters(data.results);
            this.renderPagination(data.info);
        }
    }

    async loadLocations(page = 1) {
        this.currentEndpoint = 'location';
        this.currentPage = page;
        this.updateFiltersVisibility(false);
        this.clearFilters();
        
        const data = await this.fetchData('location', page);
        if (data) {
            this.renderLocations(data.results);
            this.renderPagination(data.info);
        }
    }

    async loadEpisodes(page = 1) {
        this.currentEndpoint = 'episode';
        this.currentPage = page;
        this.updateFiltersVisibility(false);
        this.clearFilters();
        
        const data = await this.fetchData('episode', page);
        if (data) {
            this.renderEpisodes(data.results);
            this.renderPagination(data.info);
        }
    }

    async loadData() {
        switch (this.currentEndpoint) {
            case 'character':
                await this.loadCharacters(this.currentPage);
                break;
            case 'location':
                await this.loadLocations(this.currentPage);
                break;
            case 'episode':
                await this.loadEpisodes(this.currentPage);
                break;
        }
    }

    updateFiltersVisibility(showCharacterFilters) {
        const statusFilter = document.getElementById('statusFilter');
        const genderFilter = document.getElementById('genderFilter');
        
        if (showCharacterFilters) {
            statusFilter.style.display = 'block';
            genderFilter.style.display = 'block';
        } else {
            statusFilter.style.display = 'none';
            genderFilter.style.display = 'none';
        }
    }

    clearFilters() {
        this.currentFilters = {};
        document.getElementById('searchInput').value = '';
        document.getElementById('statusFilter').value = '';
        document.getElementById('genderFilter').value = '';
    }

    renderCharacters(characters) {
        const grid = document.getElementById('grid');
        
        if (!characters || characters.length === 0) {
            grid.innerHTML = '<div class="no-results" style="grid-column: 1 / -1; text-align: center; padding: 2rem;"><p>No characters found.</p></div>';
            return;
        }

        grid.innerHTML = characters.map(character => `
            <div class="card">
                <img src="${character.image}" alt="${character.name}" class="card-image">
                <div class="card-content">
                    <h3 class="card-title">${character.name}</h3>
                    <div class="card-info">
                        <div class="card-detail">
                            <span class="status-indicator status-${character.status.toLowerCase()}"></span>
                            <span class="card-text">${character.status} - ${character.species}</span>
                        </div>
                        <div class="card-detail">
                            <span class="card-label">Last known location:</span>
                        </div>
                        <div class="card-detail">
                            <span class="card-text">${character.location.name}</span>
                        </div>
                        <div class="card-detail">
                            <span class="card-label">First seen in:</span>
                        </div>
                        <div class="card-detail">
                            <span class="card-text">${character.origin.name}</span>
                        </div>
                        <div class="card-detail">
                            <span class="card-label">Gender:</span>
                            <span class="card-text">${character.gender}</span>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    renderLocations(locations) {
        const grid = document.getElementById('grid');
        
        if (!locations || locations.length === 0) {
            grid.innerHTML = '<div class="no-results" style="grid-column: 1 / -1; text-align: center; padding: 2rem;"><p>No locations found.</p></div>';
            return;
        }

        grid.innerHTML = locations.map(location => `
            <div class="location-card">
                <h3 class="card-title">${location.name}</h3>
                <div class="card-info">
                    <div class="card-detail">
                        <span class="card-label">Type:</span>
                        <span class="card-text">${location.type}</span>
                    </div>
                    <div class="card-detail">
                        <span class="card-label">Dimension:</span>
                        <span class="card-text">${location.dimension}</span>
                    </div>
                    <div class="card-detail">
                        <span class="card-label">Residents:</span>
                        <span class="card-text">${location.residents.length} characters</span>
                    </div>
                    <div class="card-detail">
                        <span class="card-label">Created:</span>
                        <span class="card-text">${new Date(location.created).toLocaleDateString()}</span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    renderEpisodes(episodes) {
        const grid = document.getElementById('grid');
        
        if (!episodes || episodes.length === 0) {
            grid.innerHTML = '<div class="no-results" style="grid-column: 1 / -1; text-align: center; padding: 2rem;"><p>No episodes found.</p></div>';
            return;
        }

        grid.innerHTML = episodes.map(episode => `
            <div class="episode-card">
                <h3 class="card-title">${episode.name}</h3>
                <div class="card-info">
                    <div class="card-detail">
                        <span class="card-label">Episode:</span>
                        <span class="card-text">${episode.episode}</span>
                    </div>
                    <div class="card-detail">
                        <span class="card-label">Air Date:</span>
                        <span class="card-text">${episode.air_date}</span>
                    </div>
                    <div class="card-detail">
                        <span class="card-label">Characters:</span>
                        <span class="card-text">${episode.characters.length} characters</span>
                    </div>
                    <div class="card-detail">
                        <span class="card-label">Created:</span>
                        <span class="card-text">${new Date(episode.created).toLocaleDateString()}</span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    renderPagination(info) {
        const pagination = document.getElementById('pagination');
        
        if (!info) {
            pagination.innerHTML = '';
            return;
        }

        const { pages, prev, next } = info;
        const currentPage = this.currentPage;
        
        let paginationHTML = '';
        
        // Previous button
        paginationHTML += `
            <button class="pagination-btn" ${!prev ? 'disabled' : ''} onclick="api.loadPage(${currentPage - 1})">
                Previous
            </button>
        `;
        
        // Page numbers
        const startPage = Math.max(1, currentPage - 2);
        const endPage = Math.min(pages, currentPage + 2);
        
        if (startPage > 1) {
            paginationHTML += `<button class="pagination-btn" onclick="api.loadPage(1)">1</button>`;
            if (startPage > 2) {
                paginationHTML += `<span class="pagination-ellipsis">...</span>`;
            }
        }
        
        for (let i = startPage; i <= endPage; i++) {
            paginationHTML += `
                <button class="pagination-btn ${i === currentPage ? 'active' : ''}" onclick="api.loadPage(${i})">
                    ${i}
                </button>
            `;
        }
        
        if (endPage < pages) {
            if (endPage < pages - 1) {
                paginationHTML += `<span class="pagination-ellipsis">...</span>`;
            }
            paginationHTML += `<button class="pagination-btn" onclick="api.loadPage(${pages})">${pages}</button>`;
        }
        
        // Next button
        paginationHTML += `
            <button class="pagination-btn" ${!next ? 'disabled' : ''} onclick="api.loadPage(${currentPage + 1})">
                Next
            </button>
        `;
        
        pagination.innerHTML = paginationHTML;
    }

    loadPage(page) {
        this.currentPage = page;
        this.loadData();
    }
}

// Global functions for button clicks
function loadCharacters() {
    api.loadCharacters();
}

function loadLocations() {
    api.loadLocations();
}

function loadEpisodes() {
    api.loadEpisodes();
}

// Initialize the application
const api = new RickAndMortyAPI();
