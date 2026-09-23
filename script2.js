const trendingMovies = [
  { 
    id: 1, 
    title: "Stranger Things", 
    desc: "A group of young friends witness supernatural forces and secret government exploits.", 
    img: "https://picsum.photos/id/10/800/600",
    genres: ["Sci-Fi", "Horror", "Drama"]
  },
  { 
    id: 2, 
    title: "Wednesday", 
    desc: "Wednesday Addams investigates a murder spree while making new friends and foes.", 
    img: "https://picsum.photos/id/20/800/600",
    genres: ["Comedy", "Fantasy", "Mystery"]
  },
  { 
    id: 3, 
    title: "Squid Game", 
    desc: "Hundreds of cash-strapped players accept a strange invitation to compete in children's games.", 
    img: "https://picsum.photos/id/30/800/600",
    genres: ["Thriller", "Mystery", "Drama"]
  },
  { 
    id: 4, 
    title: "Money Heist", 
    desc: "An unusual group of robbers attempt to carry out the most perfect robbery in Spanish history.", 
    img: "https://picsum.photos/id/40/800/600",
    genres: ["Action", "Crime", "Thriller"]
  },
  { 
    id: 5, 
    title: "Dark", 
    desc: "A family saga with a supernatural twist, set in a German town where two children disappear.", 
    img: "https://picsum.photos/id/50/800/600",
    genres: ["Mystery", "Sci-Fi", "Drama"]
  },
  { 
    id: 6, 
    title: "The Witcher", 
    desc: "Geralt of Rivia, a mutated monster-hunter for hire, journeys toward his destiny.", 
    img: "https://picsum.photos/id/60/800/600",
    genres: ["Action", "Adventure", "Fantasy"]
  },
  { 
    id: 7, 
    title: "Breaking Bad", 
    desc: "A chemistry teacher diagnosed with cancer teams up with a former student to secure his family's future.", 
    img: "https://picsum.photos/id/70/800/600",
    genres: ["Crime", "Drama", "Thriller"]
  },
  { 
    id: 8, 
    title: "Lucifer", 
    desc: "Bored and unhappy as the Lord of Hell, Lucifer Morningstar relocates to Los Angeles.", 
    img: "https://picsum.photos/id/80/800/600",
    genres: ["Crime", "Drama", "Fantasy"]
  },
  { 
    id: 9, 
    title: "Peaky Blinders", 
    desc: "A notorious gang in 1919 Birmingham, England, is led by the fierce Tommy Shelby.", 
    img: "https://picsum.photos/id/90/800/600",
    genres: ["Crime", "Drama"]
  },
  { 
    id: 10, 
    title: "Narcos", 
    desc: "A gritty chronicle of the criminal exploits of Colombian drug lord Pablo Escobar.", 
    img: "https://picsum.photos/id/100/800/600",
    genres: ["Biography", "Crime", "Drama"]
  }
];

const movieList = document.getElementById("movieList");
const postersContainer = document.getElementById("posters");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

const modal = document.getElementById("movieModal");
const modalTitle = document.getElementById("modalTitle");
const modalDesc = document.getElementById("modalDesc");
const modalPoster = document.getElementById("modalPoster");
const genreTags = document.getElementById("genreTags");
const closeModalBtn = document.getElementById("closeModal");

function renderCards() {
  movieList.innerHTML = "";
  trendingMovies.forEach((movie, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <button class="postersbtn" data-id="${movie.id}">
        <div style="background-image: url('${movie.img}'); background-size: cover; background-position: center; border-radius: 0.5rem;"></div>
        <span>${index + 1}</span>
      </button>
    `;
    movieList.append(li);
  });
}

renderCards();

// Slider Controls
prevBtn.addEventListener("click", () => {
  postersContainer.scrollLeft -= 700;
});

nextBtn.addEventListener("click", () => {
  postersContainer.scrollLeft += 700;
});

// Modal Open Handler
movieList.addEventListener("click", (e) => {
  const card = e.target.closest(".postersbtn");
  if (!card) return;
  const movieId = Number(card.dataset.id);

  const selectedMovie = trendingMovies.find((item) => item.id === movieId);
  if (selectedMovie) {
    modalTitle.textContent = selectedMovie.title;
    modalDesc.textContent = selectedMovie.desc;
    modalPoster.style.backgroundImage = `url('${selectedMovie.img}')`;

    // Render genre pills
    genreTags.innerHTML = selectedMovie.genres
      .map((g) => `<span class="genre-badge">${g}</span>`)
      .join("");

    modal.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  }
});

// Modal Close Handlers
function closeModal() {
  modal.classList.add("hidden");
  document.body.style.overflow = "";
}

closeModalBtn.addEventListener("click", closeModal);

modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    closeModal();
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});
