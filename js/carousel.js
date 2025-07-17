let currentCarouselIndex = 1;
let touchStartX = 0;
let touchEndX = 0;

function injectCarouselSlides(slideContents) {
  const track = document.getElementById("carousel-track");
  track.innerHTML = "";

  // Clone last slide and add to beginning
  const lastSlideClone = document.createElement("div");
  lastSlideClone.innerHTML = slideContents[slideContents.length - 1];
  track.appendChild(lastSlideClone);

  // Append all real slides
  slideContents.forEach((content) => {
    const slide = document.createElement("div");
    slide.innerHTML = content;
    track.appendChild(slide);
  });

  // Clone first slide and add to end
  const firstSlideClone = document.createElement("div");
  firstSlideClone.innerHTML = slideContents[0];
  track.appendChild(firstSlideClone);

  currentCarouselIndex = 1;
  updateCarousel(false);
}

function updateCarousel(transition = true) {
  const track = document.getElementById("carousel-track");

  if (transition) {
    track.style.transition = "transform 0.5s ease-in-out";
  } else {
    track.style.transition = "none";
  }

  track.style.transform = `translateX(-${currentCarouselIndex * 100}%)`;
}

function nextSlide() {
  const track = document.getElementById("carousel-track");
  const totalSlides = track.children.length;

  currentCarouselIndex++;
  updateCarousel(true);

  if (currentCarouselIndex === totalSlides - 1) {
    setTimeout(() => {
      currentCarouselIndex = 1;
      updateCarousel(false);
    }, 500);
  }
}

function prevSlide() {
  const track = document.getElementById("carousel-track");
  currentCarouselIndex--;
  updateCarousel(true);

  if (currentCarouselIndex === 0) {
    setTimeout(() => {
      const totalSlides = track.children.length;
      currentCarouselIndex = totalSlides - 2;
      updateCarousel(false);
    }, 500);
  }
}

// Touch swipe handlers
function handleTouchStart(e) {
  touchStartX = e.changedTouches[0].screenX;
}

function handleTouchEnd(e) {
  touchEndX = e.changedTouches[0].screenX;
  handleSwipeGesture();
}

function handleSwipeGesture() {
  const swipeDistance = touchEndX - touchStartX;
  const swipeThreshold = 50;

  if (swipeDistance > swipeThreshold) {
    prevSlide();
  } else if (swipeDistance < -swipeThreshold) {
    nextSlide();
  }
}

// Init on DOM load
document.addEventListener("DOMContentLoaded", () => {
  const track = document.getElementById("carousel-track");
  track.addEventListener("touchstart", handleTouchStart, false);
  track.addEventListener("touchend", handleTouchEnd, false);
});
