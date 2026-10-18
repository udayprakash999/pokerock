// variables
const header = document.querySelector("header");
const nav = document.querySelector(".main-nav");
const pokemonWrapper = document.getElementById("pokemonWrapper");

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) {
      nav.classList.add("scrolled");
    } else {
      nav.classList.remove("scrolled");
    }
  });
});

observer.observe(header);

// API Function

const baseAPI = `https://pokeapi.co/api/v2/`;
function fetchAllPokemon() {
  let api = `${baseAPI}pokemon?limit=100`;
  fetch(api)
    .then((result) => result.json())
    .then((data) => {
      let results = data.results;
      results.forEach((res) => {
        let url = res.url;
        fetch(url)
          .then((result) => result.json())
          .then((data) => {
            generateCard(data);
          })
          .catch(console.error());
      });
    })
    .catch(console.error());
}
fetchAllPokemon();

function generateCard(poke) {
  console.log(poke);
  const artwork = `${poke?.sprites?.other?.["official-artwork"]?.front_default}`;
  let pokemonCard = document.createElement("div");
  pokemonCard.classList.add("pokemon-card");
  pokemonCard.dataset.id = `${poke.id}`;
  pokemonCard.innerHTML = `
    <div class="card-header">
        <div class="card-id">No. ${poke.id}</div>
    </div>
    <div class="pokemon-image">
    <img src=${artwork}>
    </div>
   <div class="card-footer">
        <div class="pokemon-name">${poke.name}</div>
        <div class="tags">
            <div class="tag">
                ${poke?.types?.[0]?.type.name}
            </div>
            <div class="tag">
                ${poke?.types?.[1]?.type.name}
            </div>
        </div>
    </div>
  `;
  pokemonWrapper.appendChild(pokemonCard);
}
