const container = document.getElementById("countries");
const loading = document.getElementById("loading");
const searchInput = document.getElementById("search");
const regionFilter = document.getElementById("regionFilter");
const sortSelect = document.getElementById("sort");
const themeToggle = document.getElementById("themeToggle");

let countriesData = [];
let filteredData = []; 
async function fetchCountries() {
  try {
    loading.style.display = "block";

    const res = await fetch("https://restcountries.com/v3.1/all?fields=name,flags,capital,region,population");

    if (!res.ok) throw new Error("Failed to fetch data");

    const data = await res.json();

    if (!Array.isArray(data)) throw new Error("Invalid data format");

    countriesData = data;
    filteredData = data; 

    displayCountries(filteredData);

    loading.style.display = "none";
  } catch (error) {
    console.error("Error:", error);
    loading.innerText = "Failed to load data";
  }
}
function displayCountries(countries) {
  container.innerHTML = "";

  if (countries.length === 0) {
    container.innerHTML = "<p>No countries found</p>";
    return;
  }

  countries.forEach(country => {
    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
      <img src="${country.flags.png}" alt="flag" />
      <h3>${country.name.common}</h3>
      <p><strong>Capital:</strong> ${country.capital?.[0] || "N/A"}</p>
      <p><strong>Region:</strong> ${country.region}</p>
      <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
      <button class="fav-btn">⭐ Favorite</button>
    `;

    const favBtn = card.querySelector(".fav-btn");
    favBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      favBtn.classList.toggle("active");
    });

    
    card.addEventListener("click", () => {
      alert(
        `Country: ${country.name.common}
Capital: ${country.capital?.[0] || "N/A"}
Region: ${country.region}
Population: ${country.population.toLocaleString()}`
      );
    });

    container.appendChild(card);
  });
}
function applyFilters() {
  let result = [...countriesData];

  const searchValue = searchInput.value.toLowerCase();
  if (searchValue) {
    result = result.filter(c =>
      c.name.common.toLowerCase().includes(searchValue)
    );
  }

  const regionValue = regionFilter.value;
  if (regionValue) {
    result = result.filter(c => c.region === regionValue);
  }

  const sortValue = sortSelect.value;
  if (sortValue === "name-asc") {
    result.sort((a, b) => a.name.common.localeCompare(b.name.common));
  } else if (sortValue === "name-desc") {
    result.sort((a, b) => b.name.common.localeCompare(a.name.common));
  } else if (sortValue === "pop-asc") {
    result.sort((a, b) => a.population - b.population);
  } else if (sortValue === "pop-desc") {
    result.sort((a, b) => b.population - a.population);
  }

  filteredData = result;
  displayCountries(filteredData);
}
searchInput.addEventListener("input", applyFilters);
regionFilter.addEventListener("change", applyFilters);
sortSelect.addEventListener("change", applyFilters);
themeToggle.addEventListener("change", () => {
  document.body.classList.toggle("dark");
});

fetchCountries();