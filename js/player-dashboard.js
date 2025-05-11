import api from './api.js';
// Remove static playersData and all static rendering logic
// Fetch and render real player data from API

document.addEventListener('DOMContentLoaded', function () {
  const playersGrid = document.getElementById('players-grid');

  function createPlayerCard(player) {
    const dominantFoot = player.dominantFoot || 'N/A';
    const currentTeam = player.currentTeam || 'Free agent';
    const profilePhoto = player.profilePhoto || 'https://via.placeholder.com/200';
    return `
      <div class="player-card">
        <div class="player-image-container">
          <img src="${profilePhoto}" alt="${player.userName}'s photo" class="player-image">
        </div>
        <div class="player-info">
          <h3 class="player-name">${player.userName}</h3>
          <div class="player-title">Age: ${player.age} | Position: ${player.position}</div>
          <div class="player-contact">
            <div class="contact-item"><strong>Dominant Foot:</strong> ${dominantFoot}</div>
            <div class="contact-item"><strong>Weight:</strong> ${player.weight} kg</div>
            <div class="contact-item"><strong>Height:</strong> ${player.height} cm</div>
            <div class="contact-item"><strong>Current Team:</strong> ${currentTeam}</div>
            <div class="contact-item"><strong>Nationality:</strong> ${player.nationality}</div>
          </div>
        </div>
      </div>
    `;
  }

  function renderPlayers(players) {
    playersGrid.innerHTML = '';
    if (!players.length) {
      playersGrid.innerHTML = '<div class="no-data">No players found.</div>';
      return;
    }
    players.forEach(player => {
      playersGrid.insertAdjacentHTML('beforeend', createPlayerCard(player));
    });
  }

  function showError(message) {
    playersGrid.innerHTML = `<div class="error-message">${message}</div>`;
  }

  api.get('http://glory-scout.tryasp.net/api/SearchPages/players')
    .then(res => renderPlayers(res.data))
    .catch(() => showError('Failed to load players. Please try again later.'));

  // Menu toggle logic (if needed)
  const menuToggle = document.getElementById('menu-toggle');
  menuToggle?.addEventListener('click', function () {
    const menuContent = document.getElementById('menu-content');
    if (menuContent.style.display === 'none') {
      menuContent.style.display = 'block';
    } else {
      menuContent.style.display = 'none';
    }
  });
});

// DOM Elements
const menuToggle = document.getElementById('menu-toggle');
const prevPageBtn = document.getElementById('prev-page');
const nextPageBtn = document.getElementById('next-page');
const signupModal = document.getElementById('signup-modal');
const signupForm = document.getElementById('signup-form');
const closeModal = document.querySelector('.close-modal');

// Toggle menu (simplified - no animation)
menuToggle.addEventListener('click', function () {
  const menuContent = document.getElementById('menu-content');
  if (menuContent.style.display === 'none') {
    menuContent.style.display = 'block';
  } else {
    menuContent.style.display = 'none';
  }
});

// Open signup modal
function openSignupModal() {
  signupModal.style.display = 'block';
}

// Close signup modal
closeModal.addEventListener('click', () => {
  signupModal.style.display = 'none';
});

// Close modal when clicking outside
window.addEventListener('click', (event) => {
  if (event.target === signupModal) {
    signupModal.style.display = 'none';
  }
});

// Handle signup form submission
signupForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // Get form values
  const name = document.getElementById('player-name').value;
  const title = document.getElementById('player-title').value;
  const company = document.getElementById('player-team').value;
  const phone = document.getElementById('player-phone').value;
  const email = document.getElementById('player-email').value;

  // Create new player object
  const newPlayer = {
    id: playersData.length + 1,
    name: name,
    title: title,
    company: company,
    phone: phone,
    email: email,
    initials: name.split(' ').map(n => n[0]).join('').substring(0, 2),
    badgeColor: getRandomColor(),
    image: "https://via.placeholder.com/200" // In a real app, this would be the uploaded image
  };

  // Add to players data
  playersData.push(newPlayer);

  // Re-render players
  renderPlayers(playersData);

  // Close modal
  signupModal.style.display = 'none';

  // Reset form
  signupForm.reset();
});

// Generate random color for badge
function getRandomColor() {
  const colors = ['#10b981', '#3b82f6', '#ec4899', '#8b5cf6', '#06b6d4', '#f97316'];
  return colors[Math.floor(Math.random() * colors.length)];
}

// Initialize the page
function init() {
  renderPlayers(playersData.slice(0, 8)); // Show first 8 players

  // Set up pagination
  const paginationNumbers = document.querySelectorAll('.pagination-number');
  paginationNumbers.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active class from all buttons
      paginationNumbers.forEach(btn => btn.classList.remove('active'));
      // Add active class to clicked button
      button.classList.add('active');

      const pageNumber = parseInt(button.textContent);
      const startIndex = (pageNumber - 1) * 8;
      const endIndex = startIndex + 8;
      renderPlayers(playersData.slice(startIndex, endIndex));
    });
  });

  // Previous page button
  prevPageBtn.addEventListener('click', () => {
    const activeButton = document.querySelector('.pagination-number.active');
    const currentPage = parseInt(activeButton.textContent);
    if (currentPage > 1) {
      const prevButton = document.querySelector(`.pagination-number:nth-child(${currentPage})`);
      if (prevButton) {
        prevButton.click();
      }
    }
  });

  // Next page button
  nextPageBtn.addEventListener('click', () => {
    const activeButton = document.querySelector('.pagination-number.active');
    const currentPage = parseInt(activeButton.textContent);
    if (currentPage < 4) { // Assuming we have 4 pages
      const nextButton = document.querySelector(`.pagination-number:nth-child(${currentPage + 2})`);
      if (nextButton) {
        nextButton.click();
      }
    }
  });
}

// Make openSignupModal available globally
window.openSignupModal = openSignupModal;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
