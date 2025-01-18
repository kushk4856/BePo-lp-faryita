// Mobile Navigation Toggle
const hamburger = document.querySelector(".hamburger");
const mobileNav = document.querySelector(".mobile-nav");
const overlay = document.querySelector(".overlay");
const closeBtn = document.querySelector(".mobile-nav-close");
const mobileNavLinks = document.querySelectorAll(".mobile-nav-links a");

function openMobileNav() {
  mobileNav.classList.add("active");
  overlay.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeMobileNav() {
  mobileNav.classList.remove("active");
  overlay.classList.remove("active");
  document.body.style.overflow = "";
}

hamburger.addEventListener("click", openMobileNav);
closeBtn.addEventListener("click", closeMobileNav);
overlay.addEventListener("click", closeMobileNav);

// Close mobile nav when clicking on links
mobileNavLinks.forEach((link) => {
  link.addEventListener("click", closeMobileNav);
});

// Sticky Navigation
window.addEventListener("scroll", function () {
  const nav = document.querySelector("nav");
  if (window.scrollY > 50) {
    nav.style.background = "rgba(255, 255, 255, 1)";
    nav.style.boxShadow = "0 2px 10px rgba(0,0,0,0.1)";
  } else {
    nav.style.background = "white";
    nav.style.boxShadow = "none";
  }
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const targetId = this.getAttribute("href");
    if (targetId === "#") return;

    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});

// Add touch support for mobile navigation
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener(
  "touchstart",
  (e) => {
    touchStartX = e.changedTouches[0].screenX;
  },
  false
);

document.addEventListener(
  "touchend",
  (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  },
  false
);

function handleSwipe() {
  const swipeThreshold = 100;
  const diff = touchStartX - touchEndX;

  if (Math.abs(diff) < swipeThreshold) return;

  if (diff > 0) {
    // Swipe left to open
    openMobileNav();
  } else {
    // Swipe right to close
    closeMobileNav();
  }
}

// ?== Marquee Slidr loop
// ===continoue slider ==
const sliderLogo = document.getElementById("slider_logo");
console.log(sliderLogo);
// const sliderLogo2 = document.getElementById("slider_logo2");
const cardWidthLogo = sliderLogo.children[0].offsetWidth + 20;
// const intervalSpeed = 2000;

function startSlider(slider, direction) {
  let position = 0;
  const speed = 1.7;
  let isAnimating = true;

  function slide() {
    if (!isAnimating) return;

    if (direction === "reverse") {
      position += speed;
      slider.style.transform = `translateX(${position}px)`;

      if (position >= cardWidthLogo) {
        position = 0;
        slider.style.transition = "none";
        slider.style.transform = "translateX(0)";
        slider.prepend(slider.children[slider.children.length - 1]);
      }
    } else {
      position -= speed;
      slider.style.transform = `translateX(${position}px)`;

      if (position <= -cardWidthLogo) {
        position = 0;
        slider.style.transition = "none";
        slider.style.transform = "translateX(0)";
        slider.appendChild(slider.children[0]);
      }
    }
    requestAnimationFrame(slide);
  }

  slide();
}

startSlider(sliderLogo, "forward");

// Accordion functionality
const accordionButtons = document.querySelectorAll(".accordion-button");

accordionButtons[0].classList.add("active");
accordionButtons[0].nextElementSibling.style.maxHeight =
  accordionButtons[0].nextElementSibling.scrollHeight + "px";

accordionButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const currentContent = button.nextElementSibling;
    const isActive = button.classList.contains("active");

    // Close all accordions
    accordionButtons.forEach((btn, i) => {
      // if (i !== 0) {
      //   btn.classList.remove("active");
      //   btn.nextElementSibling.style.maxHeight = null;
      // }
      btn.classList.remove("active");
      btn.nextElementSibling.style.maxHeight = null;
    });

    // Open clicked accordion if it wasn't active
    if (!isActive) {
      button.classList.add("active");
      currentContent.style.maxHeight = currentContent.scrollHeight + "px";
    }
  });
});

// ====blog slider ================
document.addEventListener("DOMContentLoaded", function () {
  // Initialize carousel with unique IDs
  const juiceCarouselInit = () => {
    const track = document.getElementById("juiceBlogTrack");
    const cards = track.querySelectorAll(".juice-blog-card");
    const dotsContainer = document.getElementById("juiceBlogDots");
    const cardWidth = cards[0].offsetWidth + 20; // Including gap
    let currentIndex = 0;
    let startX,
      isDragging = false,
      startPos;

    // Calculate number of slides to show
    const slidesPerView = window.innerWidth > 992 ? 2 : 1;
    const totalSlides = Math.ceil(cards.length / slidesPerView);

    // Create dots
    for (let i = 0; i < totalSlides; i++) {
      const dot = document.createElement("div");
      dot.classList.add("juice-blog-dot");
      if (i === 0) dot.classList.add("active");
      dot.addEventListener("click", () => goToSlide(i));
      dotsContainer.appendChild(dot);
    }

    function updateDots() {
      const dots = dotsContainer.querySelectorAll(".juice-blog-dot");
      dots.forEach((dot, index) => {
        dot.classList.toggle("active", index === currentIndex);
      });
    }

    function goToSlide(index) {
      currentIndex = index;
      const offset = -index * (cardWidth * slidesPerView);
      track.style.transform = `translateX(${offset}px)`;
      updateDots();
    }

    // Auto-play functionality
    let autoplayInterval = setInterval(() => {
      currentIndex = (currentIndex + 1) % totalSlides;
      goToSlide(currentIndex);
    }, 3000);

    // Touch events for mobile
    track.addEventListener("touchstart", (e) => {
      startX = e.touches[0].clientX;
      isDragging = true;
      startPos = -currentIndex * (cardWidth * slidesPerView);
      clearInterval(autoplayInterval);
    });

    track.addEventListener("touchmove", (e) => {
      if (!isDragging) return;
      const currentX = e.touches[0].clientX;
      const diff = currentX - startX;
      track.style.transform = `translateX(${startPos + diff}px)`;
    });

    track.addEventListener("touchend", (e) => {
      isDragging = false;
      const endX = e.changedTouches[0].clientX;
      const diff = endX - startX;

      if (Math.abs(diff) > 50) {
        if (diff > 0 && currentIndex > 0) {
          currentIndex--;
        } else if (diff < 0 && currentIndex < totalSlides - 1) {
          currentIndex++;
        }
      }

      goToSlide(currentIndex);
      autoplayInterval = setInterval(() => {
        currentIndex = (currentIndex + 1) % totalSlides;
        goToSlide(currentIndex);
      }, 5000);
    });

    return { track, cardWidth, slidesPerView };
  };

  // Initialize carousel
  const carousel = juiceCarouselInit();

  // Window resize handler
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const newSlidesPerView = window.innerWidth > 992 ? 2 : 1;
      if (newSlidesPerView !== carousel.slidesPerView) {
        location.reload();
      }
    }, 250);
  });
});

// JavaScript for handling dropdowns
function toggleSection(sectionId) {
  const content = document.getElementById(sectionId);
  const arrow = content.parentElement.querySelector(".dropdown-arrow");

  // Toggle active class on content
  content.classList.toggle("active");

  // Toggle arrow rotation
  arrow.classList.toggle("active");

  // Close other dropdowns
  const allDropdowns = document.querySelectorAll(".dropdown-content");
  const allArrows = document.querySelectorAll(".dropdown-arrow");

  allDropdowns.forEach((dropdown) => {
    if (dropdown.id !== sectionId && dropdown.classList.contains("active")) {
      dropdown.classList.remove("active");
    }
  });

  allArrows.forEach((arrow) => {
    if (!arrow.parentElement.parentElement.querySelector(`#${sectionId}`)) {
      arrow.classList.remove("active");
    }
  });
}

// Optional: Close dropdowns when clicking outside
document.addEventListener("click", (event) => {
  if (!event.target.closest(".dropdown-section")) {
    const allDropdowns = document.querySelectorAll(".dropdown-content");
    const allArrows = document.querySelectorAll(".dropdown-arrow");

    allDropdowns.forEach((dropdown) => dropdown.classList.remove("active"));
    allArrows.forEach((arrow) => arrow.classList.remove("active"));
  }
});



/* 
==========================================================
? => Modal Functionality 
========================================================== 

 */

//open modal
function openModal(modalId) {
  // document.body.style.overflow = "hidden";
  const backdrop = document.getElementById(`${modalId}-backdrop`);
  const container = document.getElementById(`${modalId}-container`);
  const modalWrapper = container.querySelector(".modal-wrapper");

  // Remove hiding class if present
  backdrop.classList.remove("hiding");
  container.classList.remove("hiding");

  // Show modal
  backdrop.classList.add("show");
  container.classList.add("show");

  // Add click event listener to the modal wrapper
  modalWrapper.addEventListener("click", (event) => {
    // If clicked element is the modal wrapper (the outer area)
    if (event.target === modalWrapper) {
      closeModal(modalId);
    }
  });
}

//close modal
function closeModal(modalId) {
  const backdrop = document.getElementById(`${modalId}-backdrop`);
  const container = document.getElementById(`${modalId}-container`);

  // Add hiding class for close animation
  backdrop.classList.add("hiding");
  container.classList.add("hiding");

  // Remove show class after animation
  setTimeout(() => {
    backdrop.classList.remove("show");
    container.classList.remove("show");
    backdrop.classList.remove("hiding");
    container.classList.remove("hiding");
    document.body.style.overflow = "unset";
  }, 300);
}
