const key = `e29884f6`;
const heading = document.querySelector("h1");
const img = document.querySelector("img");
const movie = document.querySelector(".movieName");
const year = document.querySelector(".movieYear");
const selectedMovie = localStorage.getItem("movieIMGQuery");
const selectedName = localStorage.getItem("movieNameQuery");
const selectedYear = localStorage.getItem("movieYearQuery");
const searchEl = document.querySelector(".search");

async function singleMovie() {
  const url = `https://omdbapi.com/?s=${selectedMovie}&apikey=${key}`;
  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await res.json();
    img.setAttribute("src", selectedMovie);
    movie.textContent = selectedName;
    year.textContent = selectedYear;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}
singleMovie();
