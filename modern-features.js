// Modern Features for TrainGO

// Weather Widget
function initWeatherWidget() {
    const cities = ['Delhi', 'Mumbai', 'Kolkata', 'Chennai', 'Hyderabad'];
    const temps = [25, 28, 30, 32, 27];
    const icons = ['fas fa-sun', 'fas fa-cloud-sun', 'fas fa-cloud-rain', 'fas fa-sun', 'fas fa-cloud'];
    
    let currentIndex = 0;
    
    function updateWeather() {
        const weatherWidget = document.getElementById('weatherWidget');
        if (weatherWidget) {
            const city = cities[currentIndex];
            const temp = temps[currentIndex];
            const icon = icons[currentIndex];
            
            weatherWidget.innerHTML = `
                <div class="weather-info">
                    <i class="${icon}"></i>
                    <span class="weather-temp">${temp}°C</span>
                    <span class="weather-city">${city}</span>
                </div>
            `;
            
            currentIndex = (currentIndex + 1) % cities.length;
        }
    }
    
    updateWeather();
    setInterval(updateWeather, 5000);
}

// Live Train Status Updates
function initLiveStatus() {
    const trains = [
        { name: 'Rajdhani Express', status: 'On Time', class: 'on-time' },
        { name: 'Shatabdi Express', status: '15 min delay', class: 'delayed' },
        { name: 'Duronto Express', status: 'On Time', class: 'on-time' },
        { name: 'Kerala Express', status: '5 min delay', class: 'delayed' },
        { name: 'Mumbai Rajdhani', status: 'On Time', class: 'on-time' }
    ];
    
    let currentTrainIndex = 0;
    
    function updateLiveStatus() {
        const liveStatus = document.getElementById('liveStatus');
        if (liveStatus) {
            const displayTrains = trains.slice(currentTrainIndex, currentTrainIndex + 2);
            if (displayTrains.length < 2) {
                displayTrains.push(...trains.slice(0, 2 - displayTrains.length));
            }
            
            liveStatus.innerHTML = `
                <h4><i class="fas fa-broadcast-tower"></i> Live Updates</h4>
                ${displayTrains.map(train => `
                    <div class="status-item">
                        <span class="train-name">${train.name}</span>
                        <span class="status ${train.class}">${train.status}</span>
                    </div>
                `).join('')}
            `;
            
            currentTrainIndex = (currentTrainIndex + 1) % trains.length;
        }
    }
    
    updateLiveStatus();
    setInterval(updateLiveStatus, 8000);
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
        <button onclick="this.parentElement.remove()"><i class="fas fa-times"></i></button>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

// Loyalty Points System
let userPoints = parseInt(localStorage.getItem('trainGO_points')) || 0;

function addLoyaltyPoints(points) {
    userPoints += points;
    localStorage.setItem('trainGO_points', userPoints.toString());
    showNotification(`You earned ${points} loyalty points! Total: ${userPoints}`, 'success');
}

function displayLoyaltyPoints() {
    // Remove existing points display
    const existingPoints = document.querySelector('.loyalty-points');
    if (existingPoints) {
        existingPoints.remove();
    }
    
    const pointsDisplay = document.createElement('div');
    pointsDisplay.className = 'loyalty-points';
    pointsDisplay.innerHTML = `
        <i class="fas fa-star"></i>
        <span>${userPoints} Points</span>
    `;
    
    const userProfile = document.getElementById('userProfile');
    const navAuth = document.getElementById('navAuth');
    
    if (userProfile && userProfile.style.display !== 'none') {
        // User is logged in, add to user profile area
        userProfile.appendChild(pointsDisplay);
    } else if (navAuth) {
        // User not logged in, add to nav auth area
        navAuth.appendChild(pointsDisplay);
    }
}

// Enhanced Booking Confirmation
function enhancedBookingConfirmation(ticket) {
    const modal = document.createElement('div');
    modal.className = 'booking-success-modal';
    modal.innerHTML = `
        <div class="success-content">
            <div class="success-animation">
                <i class="fas fa-check-circle"></i>
            </div>
            <h2>Booking Confirmed!</h2>
            <div class="ticket-summary">
                <h3>${ticket.trainName}</h3>
                <p><strong>Ticket ID:</strong> ${ticket.id}</p>
                <p><strong>Date:</strong> ${ticket.travelDate}</p>
                <p><strong>Passengers:</strong> ${ticket.passengers.length}</p>
                <p><strong>Total:</strong> ₹${ticket.totalPrice}</p>
            </div>
            <div class="success-actions">
                <button class="btn-primary" onclick="generateETicket('${ticket.id}'); this.parentElement.parentElement.parentElement.remove();">
                    <i class="fas fa-download"></i> Download E-Ticket
                </button>
                <button class="btn-secondary" onclick="this.parentElement.parentElement.parentElement.remove();">
                    <i class="fas fa-times"></i> Close
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add points for booking
    addLoyaltyPoints(Math.floor(ticket.totalPrice / 100));
    
    setTimeout(() => {
        modal.classList.add('show');
    }, 100);
}

// Train Delay Simulator
function simulateTrainDelays() {
    const trains = document.querySelectorAll('#trainTableBody tr');
    trains.forEach((row, index) => {
        if (Math.random() < 0.3) { // 30% chance of delay
            const delayMinutes = Math.floor(Math.random() * 30) + 5;
            const statusCell = row.querySelector('td:last-child');
            if (statusCell) {
                const delayBadge = document.createElement('span');
                delayBadge.className = 'delay-badge';
                delayBadge.innerHTML = `<i class="fas fa-clock"></i> +${delayMinutes}min`;
                statusCell.appendChild(delayBadge);
            }
        }
    });
}

// Weather Page Functionality
function handleWeatherSearch() {
    const weatherForm = document.getElementById('weatherSearchForm');
    if (weatherForm) {
        weatherForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const selectedCity = document.getElementById('weatherCity').value;
            if (selectedCity) {
                showWeatherForCity(selectedCity);
            } else {
                showNotification('Please select a city first!', 'error');
            }
        });
    }
    
    // Also handle direct city selection change
    const weatherCity = document.getElementById('weatherCity');
    if (weatherCity) {
        weatherCity.addEventListener('change', function() {
            if (this.value) {
                showWeatherForCity(this.value);
            }
        });
    }
}

function showWeatherForCity(cityName) {
    const weatherData = {
        'New Delhi': { temp: 25, desc: 'Sunny', icon: 'fas fa-sun', humidity: 45, wind: 12, visibility: 10 },
        'Mumbai': { temp: 28, desc: 'Partly Cloudy', icon: 'fas fa-cloud-sun', humidity: 65, wind: 15, visibility: 8 },
        'Kolkata': { temp: 30, desc: 'Humid', icon: 'fas fa-cloud', humidity: 75, wind: 10, visibility: 7 },
        'Chennai': { temp: 32, desc: 'Light Rain', icon: 'fas fa-cloud-rain', humidity: 80, wind: 18, visibility: 6 },
        'Hyderabad': { temp: 27, desc: 'Clear', icon: 'fas fa-sun', humidity: 50, wind: 14, visibility: 9 },
        'Bangalore': { temp: 24, desc: 'Pleasant', icon: 'fas fa-cloud-sun', humidity: 55, wind: 8, visibility: 12 },
        'Pune': { temp: 26, desc: 'Mild', icon: 'fas fa-sun', humidity: 48, wind: 11, visibility: 10 },
        'Jaipur': { temp: 28, desc: 'Dry', icon: 'fas fa-sun', humidity: 35, wind: 15, visibility: 11 },
        'Ahmedabad': { temp: 29, desc: 'Hot', icon: 'fas fa-sun', humidity: 42, wind: 13, visibility: 9 },
        'Kochi': { temp: 29, desc: 'Coastal', icon: 'fas fa-cloud-sun', humidity: 76, wind: 14, visibility: 8 }
    };
    
    const weather = weatherData[cityName] || weatherData['New Delhi'];
    const weatherCards = document.getElementById('weatherCards');
    
    weatherCards.innerHTML = `
        <div class="weather-card active">
            <div class="city-name">${cityName}</div>
            <div class="weather-icon"><i class="${weather.icon}"></i></div>
            <div class="temperature">${weather.temp}°C</div>
            <div class="weather-desc">${weather.desc}</div>
            <div class="weather-details">
                <span><i class="fas fa-eye"></i> Visibility: ${weather.visibility}km</span>
                <span><i class="fas fa-tint"></i> Humidity: ${weather.humidity}%</span>
                <span><i class="fas fa-wind"></i> Wind: ${weather.wind} km/h</span>
            </div>
        </div>
    `;
    
    showNotification(`Weather updated for ${cityName}`, 'success');
}

// Initialize all modern features
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        initWeatherWidget();
        initLiveStatus();
        displayLoyaltyPoints();
        handleWeatherSearch();
        
        // Update points display when user logs in/out
        const originalShowUserDashboard = window.showUserDashboard;
        if (originalShowUserDashboard) {
            window.showUserDashboard = function() {
                originalShowUserDashboard();
                setTimeout(displayLoyaltyPoints, 100);
            };
        }
        
        const originalLogout = window.logout;
        if (originalLogout) {
            window.logout = function() {
                originalLogout();
                setTimeout(displayLoyaltyPoints, 100);
            };
        }
        
        // Show welcome notification for new users
        if (!localStorage.getItem('trainGO_welcomed')) {
            setTimeout(() => {
                showNotification('Welcome to TrainGO! Book your first ticket and earn loyalty points.', 'success');
                localStorage.setItem('trainGO_welcomed', 'true');
            }, 2000);
        }
        
        // Simulate train delays on train table load
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.target.id === 'trainTableBody' && mutation.addedNodes.length > 0) {
                    setTimeout(simulateTrainDelays, 1000);
                }
            });
        });
        
        const trainTableBody = document.getElementById('trainTableBody');
        if (trainTableBody) {
            observer.observe(trainTableBody, { childList: true });
        }
    }, 1000);
});

// Enhanced search with autocomplete
function initSmartSearch() {
    const searchInputs = document.querySelectorAll('select[id*="City"]');
    searchInputs.forEach(input => {
        input.addEventListener('change', function() {
            // Add search history
            const searchHistory = JSON.parse(localStorage.getItem('trainGO_searchHistory') || '[]');
            const searchTerm = this.value;
            if (searchTerm && !searchHistory.includes(searchTerm)) {
                searchHistory.unshift(searchTerm);
                if (searchHistory.length > 5) searchHistory.pop();
                localStorage.setItem('trainGO_searchHistory', JSON.stringify(searchHistory));
            }
        });
    });
}

// Call smart search initialization
setTimeout(initSmartSearch, 1000);