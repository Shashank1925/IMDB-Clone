// API key
const key = `e29884f6`;

// Get the search input element
const searchEl = document.getElementById("input");
const buttonEl = document.getElementById("submit");
const movieEl = document.querySelector(".movies");
const resultsContainer = document.getElementById("results");
const heartEl = document.getElementById("heart");

let timer;
let favoriteArray = [];
let icon = [];
// Add event listener for input events
searchEl.addEventListener("input", () => {
  movieEl.innerHTML = "";
  clearTimeout(timer);
  timer = setTimeout(() => {
    resultsContainer.style.marginLeft = "11rem";
    resultsContainer.style.paddingTop = "1rem";
    searchEl.style.padding = ".55rem";
    displaySuggestions();
  }, 0);
});
searchEl.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    findMovies();
    // searchEl.value = "";
    resultsContainer.innerHTML = "";
  }
});
buttonEl.addEventListener("click", (eve) => {
  eve.preventDefault();
  clearTimeout(timer);
  timer = setTimeout(() => {
    findMovies();
  }, 500);
});

async function findMovies() {
  const inputValueEl = searchEl.value;
  if (!inputValueEl) {
    return;
  }

  const url = `https://omdbapi.com/?s=${inputValueEl}&apikey=${key}`;
  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await res.json();
    // console.log(data);
    if (data.Response === "True") {
      displayMovieDetails(data.Search);
      displaySuggestions(data.Search);
    } else {
      resultsContainer.innerHTML = "No result found";
      return;
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}
// displaying movie details
async function displayMovieDetails(data) {
  movieEl.innerHTML = "";
  searchEl.value = "";
  for (let i = 0; i < data.length; i++) {
    const movieDetails = document.createElement("div");
    const imgEl = document.createElement("img");
    const movieName = document.createElement("p");
    const movieYear = document.createElement("p");
    const favorite = document.createElement("i");
    favorite.setAttribute("id", "favoriteHeart");
    favorite.setAttribute("class", "fa-solid fa-heart fa-lg");
    movieEl.appendChild(movieDetails);
    movieDetails.appendChild(imgEl);
    imgEl.setAttribute("onclick", "window.open('index2.html', '_blank');");
    movieDetails.addEventListener("click", () => {
      localStorage.setItem("movieIMGQuery", data[i].Poster);
      localStorage.setItem("movieNameQuery", data[i].Title);
      localStorage.setItem("movieYearQuery", data[i].Year);
    });
    imgEl.setAttribute(
      "src",
      data[i].Poster !== "N/A"
        ? data[i].Poster
        : "https://via.placeholder.com/150"
    );
    imgEl.setAttribute("alt", "Oops! Something went wrong");
    movieDetails.appendChild(movieName);
    movieName.textContent = data[i].Title;
    movieDetails.appendChild(movieYear);
    movieYear.textContent = `Released on: ${data[i].Year}`;
    movieDetails.appendChild(favorite);
    favorite.setAttribute("src", "fav.png");
    favorite.style.width = "2rem";
    favorite.style.marginLeft = "1rem";

    movieDetails.style.width = "14rem";
    movieDetails.style.height = "26rem";
    movieDetails.style.margin = ".7rem";
    movieDetails.style.marginTop = "2rem";
    movieDetails.style.borderRadius = ".5rem";
    movieDetails.style.backgroundColor = "aqua";
    movieDetails.addEventListener("mouseover", () => {
      movieDetails.style.transform = " translateY(-16px) scale(1.05)";
      movieDetails.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.5)";
      movieDetails.style.transition =
        "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out";
    });

    movieDetails.addEventListener("mouseout", () => {
      movieDetails.style.transform = " translateY(0) scale(1)";
      movieDetails.style.boxShadow = "none";
    });

    imgEl.style.width = "100%";
    imgEl.style.height = "80%";
    imgEl.style.borderRadius = ".3rem";
    imgEl.style.objectFit = "cover";
    imgEl.style.objectPosition = "center";
    imgEl.style.cursor = "pointer";

    movieName.style.textAlign = "center";
    movieName.style.color = "blue";
    movieName.style.wordBreak = "break-word";

    movieYear.style.textAlign = "center";
    movieYear.style.color = "black";
    movieYear.style.overflowWrap = "break-word";
    addFavorite(favorite, data[i]);
  }
}
// display function starts here
async function displaySuggestions() {
  resultsContainer.innerHTML = "";
  const inputValueEl = searchEl.value;
  const url = `https://omdbapi.com/?s=${inputValueEl}&apikey=${key}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Network response was not ok");
  }
  const data = await res.json();
  console.log(data);
  if (data.Response === "True") {
    resultsContainer.innerHTML = "";
    data.Search.forEach((movie) => {
      resultsContainer.style.display = "flex";
      resultsContainer.style.flexDirection = "Column";
      resultsContainer.style.cursor = "pointer";
      const suggestion = document.createElement("p");
      suggestion.textContent = movie.Title;
      resultsContainer.appendChild(suggestion);
      suggestion.addEventListener("click", () => {
        findMovies();
        searchEl.value = "";
      });
    });
  }
}
// adding favorites function starts here
function addFavorite(fav, movie) {
  fav.addEventListener("click", () => {
    if (fav.classList.toggle("favorite"));
    {
      favoriteArray.push(movie);
      searchEl.value = "";
      icon.push(fav);
    }
  });
}
// when click on heart icon
heartEl.addEventListener("click", () => addTofavorites(favoriteArray, icon));

function addTofavorites(data, icon) {
  console.log(icon);
  displayMovieDetails(data);
  const allHearts = document.querySelectorAll(".fa-lg");
  allHearts.forEach((heart) => {
    heart.classList.add("favorite");
  });
  console.log(allHearts);
  removeFromfavorites(allHearts);
}
// removal from my favorites
function removeFromfavorites(allHearts) {
  allHearts.forEach((heart) => {
    heart.addEventListener("click", () => {
      heart.classList.remove("favorite");
      const index = favoriteArray.indexOf(heart);
      console.log(index);
      if (index == -1) {
        favoriteArray = favoriteArray.splice(index, 1);
        favoriteArray.pop(heart);
      }
      heart.parentElement.remove();
    });
  });
}
