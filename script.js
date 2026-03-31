const container = document.getElementById("countries");
const loading = document.getElementById("loading");
const searchInput = document.getElementById("search");
const regionFilter = document.getElementById("regionFilter");
let countriesData = [];
async function fetchCountries() {
  try {
    loading.style.display = "block";

    const res = await fetch("https://restcountries.com/v3.1/all?fields=name,flags,capital,region,population");

    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }

    const data = await res.json();

    if (!Array.isArray(data)) {
      throw new Error("Invalid data format");
    }

    countriesData = data;
    displayCountries(countriesData);

    loading.style.display = "none";
  } catch (error) {
    console.error("Error:", error);
    loading.innerText = "Failed to load data";
  }
}
function displayCountries(countries) {
  container.innerHTML = "";

  countries.forEach(country => {
    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
      <img src="${country.flags.png}" alt="flag" />
      <h3>${country.name.common}</h3>
      <p><strong>Capital:</strong> ${country.capital?.[0] || "N/A"}</p>
      <p><strong>Region:</strong> ${country.region}</p>
      <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
    `;
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
searchInput.addEventListener("input", () => {
  const value = searchInput.value.toLowerCase();

  const filtered = countriesData.filter(country =>
    country.name.common.toLowerCase().includes(value)
  );

  displayCountries(filtered);
});

regionFilter.addEventListener("change", () => {
  const region = regionFilter.value;
  filterRegion(region);
});
function filterRegion(region) {
  let filtered = countriesData;

  if (region) {
    filtered = countriesData.filter(c => c.region === region);
  }

  displayCountries(filtered);
}
fetchCountries();