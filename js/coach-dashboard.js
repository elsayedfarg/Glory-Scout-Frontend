// Sample player data
const playersData = [
    {
        id: 1,
        name: "Angela Moss",
        title: "Marketing Manager",
        company: "Highspeed Studios",
        phone: "+12 345 6789 0",
        email: "angelamoss@mail.com",
        initials: "Hs",
        badgeColor: "#10b981",
        image: "https://via.placeholder.com/200"
    },
    {
        id: 2,
        name: "Ahmad Zayn",
        title: "Photographer",
        company: "Audio Video Teams",
        phone: "+12 345 6789 0",
        email: "ahmadzayn@mail.com",
        initials: "AV",
        badgeColor: "#3b82f6",
        image: "https://via.placeholder.com/200"
    },
    // ... [add all other player objects here as you did before]
];

// DOM Elements
const playersGrid = document.getElementById('players-grid');
const menuToggle = document.getElementById('menu-toggle');
const prevPageBtn = document.getElementById('prev-page');
const nextPageBtn = document.getElementById('next-page');
const signupModal = document.getElementById('signup-modal');
const signupForm = document.getElementById('signup-form');
const closeModal = document.querySelector('.close-modal');

// Toggle menu visibility
menuToggle?.addEventListener('click', function () {
    const menuContent = document.getElementById('menu-content');
    if (menuContent) {
        menuContent.style.display = menuContent.style.display === 'none' ? 'block' : 'none';
    }
});

// Generate random badge color
function getRandomColor() {
    const colors = ['#10b981', '#3b82f6', '#ec4899', '#8b5cf6', '#06b6d4', '#f97316'];
    return colors[Math.floor(Math.random() * colors.length)];
}

// Render players
function renderPlayers(players) {
    playersGrid.innerHTML = '';

    players.forEach(player => {
        const playerCard = document.createElement('div');
        playerCard.className = 'player-card';
        playerCard.innerHTML = `
        <div class="player-image-container">
          <img src="${player.image}" alt="${player.name}" class="player-image">
          <div class="player-badge" style="background-color: ${player.badgeColor}">
            ${player.initials}
          </div>
          <div class="player-options">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="1"></circle>
              <circle cx="12" cy="5" r="1"></circle>
              <circle cx="12" cy="19" r="1"></circle>
            </svg>
          </div>
        </div>
        <div class="player-info">
          <h3 class="player-name">${player.name}</h3>
          <div class="player-title">${player.title} at<br>${player.company}</div>
          <div class="player-contact">
            <div class="contact-item">
              <div class="contact-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
              </div>
              <span class="contact-text">${player.phone}</span>
            </div>
            <div class="contact-item">
              <div class="contact-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </div>
              <span class="contact-text">${player.email}</span>
            </div>
          </div>
        </div>
      `;
        playerCard.addEventListener('click', () => {
            window.location.href = `page player.html?id=${player.id}`;
        });
        playersGrid.appendChild(playerCard);
    });

    // Add 4 empty placeholders
    for (let i = 0; i < 4; i++) {
        const emptyCard = document.createElement('div');
        emptyCard.className = 'player-card';
        emptyCard.innerHTML = `
        <div class="player-image-container">
          <img src="https://via.placeholder.com/200" alt="Empty slot" class="player-image">
          <div class="player-badge" style="background-color: #4b5563">--</div>
          <div class="player-options">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="1"></circle>
              <circle cx="12" cy="5" r="1"></circle>
              <circle cx="12" cy="19" r="1"></circle>
            </svg>
          </div>
        </div>
        <div class="player-info">
          <h3 class="player-name">Available Slot</h3>
          <div class="player-title">Position<br>Team</div>
          <div class="player-contact">
            <div class="contact-item">
              <div class="contact-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
              </div>
              <span class="contact-text">+12 345 6789 0</span>
            </div>
            <div class="contact-item">
              <div class="contact-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </div>
              <span class="contact-text">email@example.com</span>
            </div>
          </div>
        </div>
      `;
        emptyCard.addEventListener('click', () => {
            window.location.href = "sign player.html";
        });
        playersGrid.appendChild(emptyCard);
    }
}

// Close modal
closeModal?.addEventListener('click', () => {
    signupModal.style.display = 'none';
});

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === signupModal) {
        signupModal.style.display = 'none';
    }
});

// Handle signup form
signupForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('player-name').value;
    const title = document.getElementById('player-title').value;
    const company = document.getElementById('player-team').value;
    const phone = document.getElementById('player-phone').value;
    const email = document.getElementById('player-email').value;

    const newPlayer = {
        id: playersData.length + 1,
        name,
        title,
        company,
        phone,
        email,
        initials: name.split(' ').map(n => n[0]).join('').substring(0, 2),
        badgeColor: getRandomColor(),
        image: "https://via.placeholder.com/200"
    };

    playersData.push(newPlayer);
    renderPlayers(playersData);
    signupModal.style.display = 'none';
});

// Initial render
renderPlayers(playersData);
