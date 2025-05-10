document.addEventListener('DOMContentLoaded', function () {
  const form = document.querySelector('.reset-form');
  const emailInput = document.getElementById('email-input');
  const BaseURL = "http://glory-scout.tryasp.net/api";

  form.addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent form from submitting normally

    const email = emailInput.value.trim();
    if (!email) {
      alert("Please enter your email.");
      return;
    }

    axios.post(`${BaseURL}/Auth/send-password-reset-code`,
      { email },
      { headers: { "Content-Type": "application/json" } }
    ).then((response) => {
      alert(response.data);
      emailInput.value = '';
      window.location = "./verify-reset-code.html";
    }).catch((error) => {
      console.error(error);
      alert("Failed to send OTP. Please try again.");
    });
  });
});
