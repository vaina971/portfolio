
// Animation on scroll for cards
document.addEventListener("DOMContentLoaded", () => {
    const cards = document.querySelectorAll(".card");
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    cards.forEach(card => {
        card.classList.add("invisible");
        observer.observe(card);
    });
});
