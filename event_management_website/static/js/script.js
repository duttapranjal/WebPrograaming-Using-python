/*
Project: Event Management Website
Student Name: [Your Name]
Roll Number: [Your Roll Number]
Date: 2026-04-07
*/

document.addEventListener("DOMContentLoaded", () => {
  setupRegistrationValidation();
  setupEventFilters();
});

function setupRegistrationValidation() {
  const form = document.getElementById("registrationForm");
  if (!form) {
    return;
  }

  form.addEventListener("submit", (event) => {
    const fullName = document.getElementById("full_name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const eventId = document.getElementById("event_id").value.trim();
    const tickets = document.getElementById("tickets").value.trim();

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^\d{10,15}$/;

    if (!fullName || !email || !phone || !eventId || !tickets) {
      event.preventDefault();
      alert("Please complete all fields before submitting.");
      return;
    }

    if (!emailPattern.test(email)) {
      event.preventDefault();
      alert("Please enter a valid email address.");
      return;
    }

    if (!phonePattern.test(phone)) {
      event.preventDefault();
      alert("Phone number must contain only digits (10 to 15). ");
      return;
    }

    if (Number(tickets) <= 0) {
      event.preventDefault();
      alert("Number of tickets should be at least 1.");
    }
  });
}

function setupEventFilters() {
  const searchInput = document.getElementById("searchInput");
  const cards = Array.from(document.querySelectorAll(".event-card"));
  const emptyState = document.getElementById("emptyState");
  const categoryButtons = Array.from(document.querySelectorAll("#categoryFilters .chip"));
  const dateButtons = Array.from(document.querySelectorAll("#dateFilters .chip"));

  if (!searchInput || cards.length === 0) {
    return;
  }

  let activeCategory = "all";
  let activeDate = "all";

  const applyFilters = () => {
    const query = searchInput.value.trim().toLowerCase();
    const today = new Date();
    let visibleCount = 0;

    cards.forEach((card) => {
      const text =
        card.dataset.name + " " + card.dataset.venue + " " + card.dataset.category;
      const categoryMatch = activeCategory === "all" || card.dataset.category === activeCategory;
      const searchMatch = text.includes(query);

      const eventDate = new Date(card.dataset.date);
      const isUpcoming = eventDate >= new Date(today.toDateString());
      const isThisMonth =
        eventDate.getMonth() === today.getMonth() && eventDate.getFullYear() === today.getFullYear();

      const dateMatch =
        activeDate === "all" ||
        (activeDate === "upcoming" && isUpcoming) ||
        (activeDate === "this-month" && isThisMonth);

      const isVisible = categoryMatch && searchMatch && dateMatch;
      card.style.display = isVisible ? "block" : "none";
      if (isVisible) {
        visibleCount += 1;
      }
    });

    if (emptyState) {
      emptyState.hidden = visibleCount !== 0;
    }
  };

  searchInput.addEventListener("input", applyFilters);

  categoryButtons.forEach((button) => {
    button.addEventListener("click", () => {
      categoryButtons.forEach((chip) => chip.classList.remove("active"));
      button.classList.add("active");
      activeCategory = button.dataset.category;
      applyFilters();
    });
  });

  dateButtons.forEach((button) => {
    button.addEventListener("click", () => {
      dateButtons.forEach((chip) => chip.classList.remove("active"));
      button.classList.add("active");
      activeDate = button.dataset.date;
      applyFilters();
    });
  });
}
