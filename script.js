const serviceCards = document.querySelectorAll(".service-card");
const images = document.querySelectorAll("img");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      entry.target.classList.toggle("is-visible", entry.isIntersecting);
    });
  },
  { threshold: 0.62 }
);

serviceCards.forEach((card) => observer.observe(card));

images.forEach((image) => {
  image.addEventListener("error", () => {
    image.hidden = true;
  });
});
