// const trendingMovies = [
//     { id: 1, title: "Stranger Things", desc: "A group of young friends witness supernatural forces and secret government exploits.", img: "https://picsum.photos/id/10/800/600" },
//     { id: 2, title: "Wednesday", desc: "Wednesday Addams investigates a murder spree while making new friends and foes.", img: "https://picsum.photos/id/20/800/600" },
//     { id: 3, title: "Squid Game", desc: "Hundreds of cash-strapped players accept a strange invitation to compete in children's games.", img: "https://picsum.photos/id/30/800/600" },
//     { id: 4, title: "Money Heist", desc: "An unusual group of robbers attempt to carry out the most perfect robbery in Spanish history.", img: "https://picsum.photos/id/40/800/600" },
//     { id: 5, title: "Dark", desc: "A family saga with a supernatural twist, set in a German town where two children disappear.", img: "https://picsum.photos/id/50/800/600" },
//     { id: 6, title: "The Witcher", desc: "Geralt of Rivia, a mutated monster-hunter for hire, journeys toward his destiny.", img: "https://picsum.photos/id/60/800/600" },
//     { id: 7, title: "Breaking Bad", desc: "A chemistry teacher diagnosed with cancer teams up with a former student to secure his family's future.", img: "https://picsum.photos/id/70/800/600" },
//     { id: 8, title: "Lucifer", desc: "Bored and unhappy as the Lord of Hell, Lucifer Morningstar relocates to Los Angeles.", img: "https://picsum.photos/id/80/800/600" },
//     { id: 9, title: "Peaky Blinders", desc: "A notorious gang in 1919 Birmingham, England, is led by the fierce Tommy Shelby.", img: "https://picsum.photos/id/90/800/600" },
//     { id: 10, title: "Narcos", desc: "A gritty chronicle of the criminal exploits of Colombian drug lord Pablo Escobar.", img: "https://picsum.photos/id/100/800/600" }
// ];
const API_KEY = "95b6868fb4ee1d567745c18acc413c41";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";
const BACKDROP_BASE_URL = "https://image.tmdb.org/t/p/original";

let trendingMovies = [];
const genreMap = {};

// DOM References
const movieList = document.getElementById("movieList");
const postersContainer = document.getElementById("posters");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

const modal = document.getElementById("movieModal");
const modalTitle = document.getElementById("modalTitle");
const modalDesc = document.getElementById("modalDesc");
const modalPoster = document.getElementById("modalPoster");
const genreTags = document.getElementById("genreTags");
const trailerWrapper = document.getElementById("trailerWrapper");
const trailerPlayer = document.getElementById("trailerPlayer");
const closeModalBtn = document.getElementById("closeModal");

// 1. Fetch Movie and TV Genres to convert IDs into readable names
async function loadGenres() {
    try {
        const [movieGenresRes, tvGenresRes] = await Promise.all([
            fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=en-US`),
            fetch(`https://api.themoviedb.org/3/genre/tv/list?api_key=${API_KEY}&language=en-US`)
        ]);

        const movieData = await movieGenresRes.json();
        const tvData = await tvGenresRes.json();

        [...movieData.genres, ...tvData.genres].forEach((g) => {
            genreMap[g.id] = g.name;
        });
    } catch (error) {
        console.error("Could not load genres:", error);
    }
}

// 2. Fetch YouTube trailer key for a specific title
async function fetchTrailer(mediaType, id) {
    try {
        const type = mediaType === "tv" ? "tv" : "movie";
        const res = await fetch(`https://api.themoviedb.org/3/${type}/${id}/videos?api_key=${API_KEY}&language=en-US`);
        const data = await res.json();

        const trailer = data.results.find((vid) => vid.site === "YouTube" && vid.type === "Trailer") || data.results[0];
        return trailer ? trailer.key : null;
    } catch (err) {
        console.error("Error fetching trailer:", err);
        return null;
    }
}

// 3. Fetch Top 10 trending items and render cards
async function renderCards() {
    await loadGenres();

    const url = `https://api.themoviedb.org/3/trending/all/day?api_key=${API_KEY}`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

        const data = await response.json();

        if (!data.results || data.results.length === 0) {
            throw new Error("No trending titles found.");
        }
        
        trendingMovies = data.results.slice(0, 10).map((item) => ({
            id: item.id,
            mediaType: item.media_type || (item.title ? "movie" : "tv"),
            title: item.title || item.name || "Untitled",
            desc: item.overview || "No overview available.",
            genres: (item.genre_ids || []).map((id) => genreMap[id]).filter(Boolean),
            img: item.poster_path
                ? `${IMAGE_BASE_URL}${item.poster_path}`
                : "https://via.placeholder.com/300x450?text=No+Poster",
            backdrop: item.backdrop_path
                ? `${BACKDROP_BASE_URL}${item.backdrop_path}`
                : item.poster_path
                    ? `${IMAGE_BASE_URL}${item.poster_path}`
                    : "https://via.placeholder.com/800x450?text=No+Backdrop"
        }));

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
    } catch (error) {
        console.error("Failed to fetch trending movies:", error);
        movieList.innerHTML = `<p style="color: #8c8c8c; padding: 20px;">Could not load trending titles right now.</p>`;
    }
}

renderCards();


prevBtn.addEventListener("click", () => {
    postersContainer.scrollLeft -= 700;
});

nextBtn.addEventListener("click", () => {
    postersContainer.scrollLeft += 700;
});


movieList.addEventListener("click", async (e) => {
    const card = e.target.closest(".postersbtn");
    if (!card) return;
    const movieId = Number(card.dataset.id);

    const selectedMovie = trendingMovies.find((item) => item.id === movieId);
    if (!selectedMovie) return;

    modalTitle.textContent = selectedMovie.title;
    modalDesc.textContent = selectedMovie.desc;
    modalPoster.style.backgroundImage = `url('${selectedMovie.backdrop}')`;


    genreTags.innerHTML = selectedMovie.genres
        .slice(0, 3)
        .map((genre) => `<span class="genre-badge">${genre}</span>`)
        .join("");

    const trailerKey = await fetchTrailer(selectedMovie.mediaType, selectedMovie.id);

    if (!modal.classList.contains("hidden")) {
        if (trailerKey) {
            trailerPlayer.src = `https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=1&playsinline=1&rel=0`;
            trailerWrapper.classList.remove("hidden");
        } else {
            trailerPlayer.src = "";
            trailerWrapper.classList.add("hidden");
        }
    }

    modal.classList.remove("hidden");
    document.body.style.overflow = "hidden";
});

// Modal Close Handling
function closeModal() {
    modal.classList.add("hidden");
    document.body.style.overflow = "";
    trailerPlayer.src = ""; // Stops video & audio when closed
    trailerWrapper.classList.add("hidden");
}

closeModalBtn.addEventListener("click", closeModal);

modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
});

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.classList.contains("hidden")) {
        closeModal();
    }
});