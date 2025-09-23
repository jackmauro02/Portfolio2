document.addEventListener("DOMContentLoaded", function () {
    const contactForm = document.querySelector("form");
  
    contactForm.addEventListener("submit", async function (event) {
      event.preventDefault(); // Prevent default form submission
  
      // Gather form data
      const formData = new FormData(contactForm);
      const name = formData.get("name").trim();
      const email = formData.get("email").trim();
      const message = formData.get("message").trim();
  
      // Basic validation
      if (!name || !email || !message) {
        alert("Please fill out all the fields.");
        return;
      }
  
      if (!validateEmail(email)) {
        alert("Please enter a valid email address.");
        return;
      }
  
      // Send the data to the server
      try {
        const response = await fetch("submit_form.php", {
          method: "POST",
          body: formData,
        });
  
        if (response.ok) {
          const result = await response.text(); // Adjust based on server response format
          alert("Your message has been sent successfully!");
          contactForm.reset(); // Clear the form
        } else {
          alert("An error occurred. Please try again later.");
        }
      } catch (error) {
        console.error("Error submitting the form:", error);
        alert("An error occurred. Please check your internet connection and try again.");
      }
    });
  
    // Email validation helper function
    function validateEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    }
  });
  