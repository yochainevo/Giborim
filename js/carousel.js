let currentCarouselIndex = 0;

function injectCarouselSlides(slideContents) {
  const track = document.getElementById("carousel-track");
  track.innerHTML = "";
  slideContents.forEach((content) => {
    const slide = document.createElement("div");
    slide.innerHTML = content;
    track.appendChild(slide);
  });
  updateCarousel();
}

function updateCarousel() {
  const track = document.getElementById("carousel-track");
  track.style.transform = `translateX(-${currentCarouselIndex * 100}%)`;
}

function nextSlide() {
  const totalSlides = document.getElementById("carousel-track").children.length;
  currentCarouselIndex = (currentCarouselIndex + 1) % totalSlides;
  updateCarousel();
}

function prevSlide() {
  const totalSlides = document.getElementById("carousel-track").children.length;
  currentCarouselIndex = (currentCarouselIndex - 1 + totalSlides) % totalSlides;
  updateCarousel();
}
