import api from './api.js';

document.addEventListener("DOMContentLoaded", () => {
  const logoImg = document.querySelector(".logo img");

  const BaseURL = "http://glory-scout.tryasp.net/api";
  const token = localStorage.getItem("token");

  api.get(`${BaseURL}/Auth/user-info`)
    .then((response) => {
      if (logoImg && response.data.profilePhoto) {
        logoImg.src = response.data.profilePhoto;
        logoImg.alt = `${response.data.userName}'s profile picture`;
      }
    })
    .catch((error) => {
      console.error("Failed to fetch user info:", error);
    });
});
