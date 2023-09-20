const apiUrl = 'https://pokeapi.co/api/v2/pokemon?limit=151'; // Obtener los primeros 151 Pokémon de Kanto

const pokemonDetailsContainer = document.getElementById('pokemon-details');
const prevButton = document.getElementById('prev-button');
const nextButton = document.getElementById('next-button');

let currentPokemonIndex = 0; // Índice del Pokémon actual

async function fetchPokemonDetails(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();

        // Crear elementos HTML para mostrar los detalles del Pokémon
        const image = document.createElement('img');
        const name = document.createElement('h2');
        const types = document.createElement('p');
        const description = document.createElement('p');

        // Establecer la imagen del Pokémon
        image.src = data.sprites.front_default;
        image.alt = data.name;

        // Establecer el nombre del Pokémon
        name.textContent = data.name;

        // Obtener y establecer los tipos del Pokémon
        const pokemonTypes = data.types.map(type => type.type.name).join(', ');
        types.textContent = `Tipo: ${pokemonTypes}`;

        // Obtener y establecer la descripción del Pokémon
        const speciesUrl = data.species.url;
        const speciesResponse = await fetch(speciesUrl);
        const speciesData = await speciesResponse.json();
        const flavorText = speciesData.flavor_text_entries.find(
            entry => entry.language.name === 'en'
        ).flavor_text;
        description.textContent = `Descripción: ${flavorText}`;

        // Limpiar el contenedor de detalles y agregar nuevos detalles
        pokemonDetailsContainer.innerHTML = '';
        pokemonDetailsContainer.appendChild(image);
        pokemonDetailsContainer.appendChild(name);
        pokemonDetailsContainer.appendChild(types);
        pokemonDetailsContainer.appendChild(description);
    } catch (error) {
        console.error('Error al obtener detalles del Pokémon:', error);
    }
}

async function fetchPokemon() {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        // Cargar detalles del primer Pokémon
        fetchPokemonDetails(data.results[currentPokemonIndex].url);

        // Manejar el botón "Anterior"
        prevButton.addEventListener('click', () => {
            if (currentPokemonIndex > 0) {
                currentPokemonIndex--;
                fetchPokemonDetails(data.results[currentPokemonIndex].url);
            }
        });

        // Manejar el botón "Siguiente"
        nextButton.addEventListener('click', () => {
            if (currentPokemonIndex < data.results.length - 1) {
                currentPokemonIndex++;
                fetchPokemonDetails(data.results[currentPokemonIndex].url);
            }
        });
    } catch (error) {
        console.error('Error al obtener la lista de Pokémon:', error);
    }
}

// Llamar a la función para cargar la lista de Pokémon
fetchPokemon();
