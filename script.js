// --- SLIDER BUTTON DI LANDING PAGE ---
const slider = document.getElementById("slider");
const button = document.querySelector(".slide-button");

if (slider && button) {
  let isDragging = false;
  let startX = 0;
  let currentX = 0;

  slider.addEventListener("mousedown", (e) => {
    isDragging = true;
    startX = e.clientX;
    slider.style.transition = "none";
  });

  document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;

    const diff = e.clientX - startX;
    const maxRight = button.offsetWidth - slider.offsetWidth - 10;

    let moveX = Math.min(Math.max(0, diff), maxRight);
    currentX = moveX;
    slider.style.transform = `translateX(${moveX}px)`;
  });

  document.addEventListener("mouseup", () => {
    if (!isDragging) return;
    isDragging = false;
    slider.style.transition = "transform 0.3s ease";

    const maxRight = button.offsetWidth - slider.offsetWidth - 10;
    if (currentX >= maxRight - 10) {
      window.location.href = "choose.html";
    } else {
      slider.style.transform = "translateX(0)";
    }
  });
}

// --- PILIH KARAKTER (CHOOSE.HTML) ---
const characterEls = document.querySelectorAll(".character");
let selectedPlayers = [];

function updateSelectionVisual() {
  characterEls.forEach((character) => {
    const name = character.getAttribute("data-name");
    character.classList.remove("selected", "player1", "player2");

    // Hapus badge angka jika ada
    const existingBadge = character.querySelector(".badge");
    if (existingBadge) existingBadge.remove();

    if (selectedPlayers[0] === name) {
      character.classList.add("selected", "player1");
      addBadge(character, "1");
    } else if (selectedPlayers[1] === name) {
      character.classList.add("selected", "player2");
      addBadge(character, "2");
    }
  });

  // Tampilkan tombol start jika dua karakter dipilih
  const startSection = document.getElementById("startSection");
  if (startSection) {
    if (selectedPlayers.length === 2) {
      startSection.classList.remove("hidden");
    } else {
      startSection.classList.add("hidden");
    }
  }
}

function addBadge(characterEl, number) {
  const badge = document.createElement("span");
  badge.classList.add("badge");
  badge.textContent = number;
  characterEl.appendChild(badge);
}

characterEls.forEach((character) => {
  character.addEventListener("click", () => {
    const name = character.getAttribute("data-name");

    // Jika sudah dipilih, abaikan
    if (selectedPlayers.includes(name)) return;

    // Maksimal 2 karakter
    if (selectedPlayers.length < 2) {
      selectedPlayers.push(name);
      updateSelectionVisual();
    }
  });
});

// Tombol Start Game
const startButton = document.getElementById("startGame");
if (startButton) {
  startButton.addEventListener("click", () => {
    if (selectedPlayers.length === 2) {
      localStorage.setItem("player1", selectedPlayers[0]);
      localStorage.setItem("player2", selectedPlayers[1]);
      window.location.href = "game.html";
    }
  });
}

// --- CAROUSEL SCROLL LOOPING (CHOOSE.HTML) ---
const carousel = document.getElementById("carousel");

if (carousel) {
  const characters = carousel.querySelectorAll(".character");

  characters.forEach((character) => {
    character.addEventListener("mouseenter", () => {
      const carouselRect = carousel.getBoundingClientRect();
      const characterRect = character.getBoundingClientRect();

      const carouselScrollLeft = carousel.scrollLeft;
      const offset = characterRect.left - carouselRect.left;
      const scrollTo =
        carouselScrollLeft +
        offset -
        (carousel.offsetWidth / 2 - character.offsetWidth / 2);

      carousel.scrollTo({
        left: scrollTo,
        behavior: "smooth",
      });
    });
  });
}
