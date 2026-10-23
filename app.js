// variables
const header = document.querySelector("header");
const nav = document.querySelector(".main-nav");
const pokemonWrapper = document.getElementById("pokemonWrapper");

const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const pageNum = document.getElementById("pageNum");

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
let curr = 1;
let totalPokemon = 0;
const limit = 40;

async function fetchPokemonPage(page = 1) {
  try {
    pokemonWrapper.innerHTML = `Loading....`;
    const offset = (page - 1) * limit;
    const response = await fetch(
      `${baseAPI}pokemon?limit=${limit}&offset=${offset}`,
    );
    if (!response.ok) {
      throw new Error("Failed to Catch any Pokemon, try again...");
    }
    const data = await response.json();
    totalPokemon = data.count;
    curr = page;
    const pokemonData = await Promise.all(
      data.results.map(async (pokemon) => {
        const response = await fetch(pokemon.url);
        if (!response.ok) {
          throw new Error(`Failed to catch ${pokemon.name}`);
        }
        return response.json();
      }),
    );
    pokemonWrapper.innerHTML = "";
    pokemonData.forEach((pokemon) => {
      generateCard(pokemon);
    });
    loadPage();
  } catch (error) {
    console.error(error);
    pokemonWrapper.innerHTML = `<p>Data not found</p>`;
  }
}
function loadPage() {
  const totalPage = Math.ceil(totalPokemon / limit);
  pageNum.textContent = `Page ${curr} of ${totalPage}`;
  prevBtn.disabled = curr === 1;
  nextBtn.disabled = curr === totalPage;
}
prevBtn.addEventListener("click", () => {
  if (curr > 1) {
    fetchPokemonPage(curr - 1);
  }
});
nextBtn.addEventListener("click", () => {
  const totalPage = Math.ceil(totalPokemon / limit);
  if (curr < totalPage) {
    fetchPokemonPage(curr + 1);
  }
});
function generateCard(poke) {
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
fetchPokemonPage();

function setCount(count){
  
}