const searchInput = document.getElementById('search-input');
const statusSelect = document.getElementById('status-select');
const animeList = document.getElementById('anime-list');

let searchTimeout;

const searchAnime = async (query, status) => {
    let url = `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log(data);
        console.log('Datos recibidos de la API:', data);
        let animes = data.data;

        if (status) {
            animes = animes.filter(anime => {
                if (status === 'en-emision') {
                    return anime.airing;
                } else if (status === 'finalizado') {
                    return !anime.airing;
                }
                return true;
            });
        }
        console.log('Animes filtrados:', animes);

        displayAnime(animes);
    } catch (error) {
        console.error('Error fetching anime data:', error);
        animeList.innerHTML = '<p>Error al cargar los datos de anime.</p>';
    }
};

const displayAnime = (animes) => {
    animeList.innerHTML = '';

    if (animes.length === 0) {
        animeList.innerHTML = '<p>No se encontraron resultados.</p>';
        console.log('No se encontraron resultados');
        return;
    }

    console.log('Mostrando animes:', animes);

    animes.forEach(anime => {
        const animeElement = document.createElement('div');
        animeElement.className = 'anime-item';
        animeElement.innerHTML = `
            <h3>${anime.title}</h3>
            <img src="${anime.images.jpg.image_url}" alt="${anime.title}">
            <p>${anime.synopsis || 'Descripción no disponible'}</p>
            <p>Estado: ${anime.airing ? 'En emisión' : 'Finalizado'}</p>
            <a href="${anime.url}" target="_blank">Más info</a>
        `;
        animeList.appendChild(animeElement);
    });

    console.log('Lista de animes actualizada');
};

const delayedSearch = (query, status) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        console.log('Búsqueda iniciada:', { query, status });
        if (query.length > 0 || status) {
            searchAnime(query, status);
        } else {
            animeList.innerHTML = '';
            console.log('Lista de animes limpiada');
        }
    }, 2000);
};

searchInput.addEventListener('input', () => {
    const query = searchInput.value.trim();
    const status = statusSelect.value;
    delayedSearch(query, status);
});

statusSelect.addEventListener('change', () => {
    const query = searchInput.value.trim();
    const status = statusSelect.value;
    console.log('Estado cambiado:', { query, status });
    delayedSearch(query, status);
});
