// Fonction pour charger la configuration
async function loadConfig() {
    const response = await fetch('conf.json');
    const data = await response.json();
    return data.ville;
}

// Fonction pour sauvegarder la ville dans la configuration
async function saveConfig(ville) {
    const config = { ville };
    await fetch('conf.json', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
    });
}

// Fonction pour récupérer les données météo
async function getWeather(ville) {
    const apiKey = 'insérer le token'; // Remplace par ta clé API
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${ville}&units=metric&appid=${apiKey}&lang=fr`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Problème avec la récupération des données');
        const weatherData = await response.json();
        displayWeather(weatherData);
        saveConfig(ville); // Sauvegarde la dernière ville recherchée
    } catch (error) {
        console.error('Erreur:', error);
    }
}

// Fonction pour afficher les données météo
function displayWeather(data) {
    const cityElement = document.getElementById('city');
    const tempElement = document.getElementById('temperature');
    const descElement = document.getElementById('description');
    const iconElement = document.getElementById('weather-icon');

    cityElement.textContent = data.name;
    tempElement.textContent = `${data.main.temp}°C`;
    descElement.textContent = data.weather[0].description;
    iconElement.src = `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
}

// Fonction pour rafraîchir les données toutes les heures
async function refreshWeather() {
    const ville = await loadConfig();
    getWeather(ville);
}

// Gestion de la recherche par l'utilisateur
document.getElementById('search-button').addEventListener('click', () => {
    const ville = document.getElementById('city-input').value;
    if (ville) {
        getWeather(ville);
    }
});

// Exécution au chargement
window.onload = refreshWeather;
setInterval(refreshWeather, 3600000); // Mettre à jour toutes les heures
