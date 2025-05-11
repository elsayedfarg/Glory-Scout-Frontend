import api from './api.js';

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
  if (menuContent.style.display === 'none') {
    menuContent.style.display = 'block';
  } else {
    menuContent.style.display = 'none';
  }
});

// Generate random badge color
function getRandomColor() {
  const colors = ['#10b981', '#3b82f6', '#ec4899', '#8b5cf6', '#06b6d4', '#f97316'];
  return colors[Math.floor(Math.random() * colors.length)];
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

// Remove static playersData and all static rendering logic
// Fetch and render real coach data from API

document.addEventListener('DOMContentLoaded', function () {
  const playersGrid = document.getElementById('players-grid');

  function createCoachCard(coach) {
    const coachingSpecialty = coach.coachingSpecialty || 'N/A';
    const profilePhoto = coach.profilePhoto || 'https://via.placeholder.com/200';
    const currentClubName = coach.currentClubName || 'N/A';
    return `
      <div class="player-card">
        <div class="player-image-container">
          <img src="${profilePhoto}" alt="${coach.userName}'s photo" class="player-image">
        </div>
        <div class="player-info">
          <h3 class="player-name">${coach.userName}</h3>
          <div class="player-title">Specialization: ${coach.specialization}</div>
          <div class="player-contact">
            <div class="contact-item"><strong>Current Club:</strong> ${currentClubName}</div>
            <div class="contact-item"><strong>Coaching Specialty:</strong> ${coachingSpecialty}</div>
            <div class="contact-item"><strong>Experience:</strong> ${coach.experience}</div>
            <div class="contact-item"><strong>Nationality:</strong> ${coach.nationality}</div>
          </div>
        </div>
      </div>
    `;
  }

  function renderCoaches(coaches) {
    playersGrid.innerHTML = '';
    if (!coaches.length) {
      playersGrid.innerHTML = '<div class="no-data">No coaches found.</div>';
      return;
    }
    coaches.forEach(coach => {
      playersGrid.insertAdjacentHTML('beforeend', createCoachCard(coach));
    });
  }

  function showError(message) {
    playersGrid.innerHTML = `<div class="error-message">${message}</div>`;
  }

  api.get('http://glory-scout.tryasp.net/api/SearchPages/scouts')
    .then(res => renderCoaches(res.data))
    .catch(() => showError('Failed to load coaches. Please try again later.'));
});
