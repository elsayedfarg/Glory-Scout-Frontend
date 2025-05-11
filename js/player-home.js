document.addEventListener("DOMContentLoaded", () => {
  const logoImg = document.querySelector(".logo img");

  const BaseURL = "http://glory-scout.tryasp.net/api";
  const token = localStorage.getItem("token");

  axios.get(`${BaseURL}/Auth/user-info`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
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
