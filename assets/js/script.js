// Parametres génénaux
let cityName = ''
// Parametres pour l'api OPENWEATHERMAP
let apiKey = '2e77e5cd4d16a2f4b62fd4f6cc0dc82c'
let lang = 'fr'
// Caen : lat : 49.18585 , lon : -0.35912
let lon = -0.35912
let lat = 49.18585
let timezoneDelta = 0
// `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`
// let url_forecast = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&lang=${lang}&units=metric`
// let url_weather = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&lang=${lang}&units=metric`
let url_forecast_coords = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&lang=${lang}&units=metric`
let url_weather_coords = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&lang=${lang}&units=metric`
console.log(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&lang=${lang}&units=metric`)
// Parametres pour l'api GEONAMES
const baseURL = 'https://public.opendatasoft.com/api/records/1.0/search/';
const datasetParams = '?dataset=geonames-all-cities-with-a-population-1000&rows=1000';

let currentLocationInFav = ""

// Geolocalisation du navigateur
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
var options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
};
function success(pos) {
    var crd = pos.coords;
    lat = crd.latitude
    lon = crd.longitude
    //   console.log("Votre position actuelle est :");
    //   console.log(`Latitude : ${crd.latitude}`);
    //   console.log(`Longitude : ${crd.longitude}`);
    //   console.log(`La précision est de ${crd.accuracy} mètres.`);
    console.log(lat)
    console.log(lon)
    cityName = 'Ma position'
    url_forecast_coords = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&lang=${lang}&units=metric`
    url_weather_coords = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&lang=${lang}&units=metric`
    console.log(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&lang=${lang}&units=metric`)
    fetchDataFromWeatherURL(url_weather_coords)
}
function error(err) {
    console.warn(`ERREUR (${err.code}): ${err.message}`);
}
function getLocation() {
    navigator.geolocation.getCurrentPosition(success, error, options);
}
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

function getLocation_and_toggleCityInput() {
    navigator.geolocation.getCurrentPosition(success, error, options)
    toggleCityInput()
}


function displayOrHideDrawer() {
    generateFavoriteLocationsList()
    const drawerDiv = document.getElementById('drawer')
    const overlay = document.getElementById('drawerOverlay');
    const isDrawerHidden = drawerDiv.classList.contains('-translate-x-full') == true

    if (isDrawerHidden) {
        drawerDiv.classList.remove('-translate-x-full');
        // drawerDiv.classList.remove('hidden');
        overlay.classList.remove('hidden')
    } else {
        drawerDiv.classList.add('-translate-x-full');
        // drawerDiv.classList.add('hidden');
        overlay.classList.add('hidden')
    }
}





function toggleCityInput() {
    const cityDiv = document.getElementById("citySection");
    const inputDiv = document.getElementById("inputSection");
    const toggleBtn = document.getElementById("returnButton");
    const favoritesBtn = document.getElementById("favoritesButton")
    const favoriteStarBtn = document.getElementById("star_favorite_or_not")

    const isShowingInput = inputDiv.classList.contains("hidden") === false;
    cityDiv.classList.toggle("hidden");
    inputDiv.classList.toggle("hidden");
    toggleBtn.classList.toggle("hidden");
    favoritesBtn.classList.toggle("hidden");
    favoriteStarBtn.classList.toggle("hidden");
    // Ajoute ou retire l'effet grisé
    if (isShowingInput) {
        toggleBtn.classList.add("text-gray-400", "opacity-50");
    } else {
        toggleBtn.classList.remove("text-gray-400", "opacity-50");
    }
    // remettre a zero ce qui etait dans la recherche précédente pour lancer une autre recherche sans devoir supprimer manuellement le contenu dans le input
    document.getElementById("input_city").value = ''
    document.getElementById('dropdown_input_city').innerText = ''
    document.getElementById("input_city").focus() // pour pouvoir taper aussitot dans l'input sans devoir recliquer dedans
}



function updateHour() {
    const unixTimestampCurrentDateInThisFunction = Math.floor(Date.now() / 1000)
    const currentDateInThisFunction = new Date((unixTimestampCurrentDateInThisFunction + timezoneDelta) * 1000)
    const hoursInThisFunction = currentDateInThisFunction.getUTCHours().toString()
    const minutesInThisFunction = currentDateInThisFunction.getUTCMinutes().toString().padStart(2, '0')
    current_hour_full = `${hoursInThisFunction}:${minutesInThisFunction}`
    // console.log(current_hour_full)
    const secondesInThisFunction = currentDateInThisFunction.getUTCSeconds()
    // console.log(secondesInThisFunction)
    if (secondesInThisFunction % 2 == 0) {
        // console.log('pair')
        // console.log(current_hour_full = `${hoursInThisFunction}:${minutesInThisFunction}`)
        // document.getElementById('current_hour').innerText = current_hour_full
        document.getElementById('current_hours').innerText = hoursInThisFunction
        document.getElementById('current_hour_separator').innerText = ":"
        document.getElementById('current_minutes').innerText = minutesInThisFunction
    } else {
        // console.log('impair')
        // console.log(current_hour_full = `${hoursInThisFunction} ${minutesInThisFunction}`)
        // document.getElementById('current_hour').innerText = current_hour_full
        document.getElementById('current_hours').innerText = hoursInThisFunction
        document.getElementById('current_hour_separator').innerText = ""
        document.getElementById('current_minutes').innerText = minutesInThisFunction
    }
}

setInterval(updateHour, 1000)



async function fetchDataFromWeatherURL(url_weather_coords) {
    try {
        const response = await fetch(url_weather_coords)
        if (!response.ok) {
            throw new Error(`Error : ${response.status}`);
        }
        const data = await response.json()
        // Traitement des données
        // Afficher le nom de la ville au chargement initial (par defaut ce sont les coordonnées de Caen)
        console.log(data['name'])
        console.log(lat)
        console.log(lon)
        currentLocationInFav = data['name']
        check_if_already_in_favorites()
        // Afficher le nom dans le drawer favoris
        document.getElementById('currentLocationInFav').innerText = currentLocationInFav
        document.getElementById('city').innerText = data['name']
        // document.getElementById('city').innerText = cityName
        // document.getElementById('city').innerText = data['name']
        if (document.getElementById('city').innerText == '') {
            cityName = data['name']
            document.getElementById('city').innerText = cityName
        }
        // current_hour and current_date
        unix_timestamp_javascript = Math.floor(Date.now() / 1000); // Utilisation de la fonction pour avoir l'heure actuelle. Le timestamp de openweathermap n'est pas exact
        unix_timestamp = unix_timestamp_javascript
        timezoneDelta = data['timezone']
        current_date = new Date((unix_timestamp + timezoneDelta) * 1000) // Ajout de + timezone (information disponible dans l'API openweathermap)
        // console.log(current_date)
        dayDate = current_date.getUTCDate()
        listMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        monthDate = listMonths[current_date.getMonth()]
        yearDate = current_date.getFullYear()
        document.getElementById('current_date').innerText = `${dayDate} ${monthDate} ${yearDate}`
        // current_hour = current_date.getUTCHours() // Utilisation de getUTCHours au lieu de getHours() pour avoir l'heure universelle sans ajustement lié à l'horloge de ma machine
        // current_minutes = current_date.getUTCMinutes() // Utilisation de getUTCMinutes au lieu de getMinutes() pour avoir l'heure universelle sans ajustement lié à l'horloge de ma machine
        // // Ajout du zéro devant les minutes si besoin
        // current_minutes = current_minutes.toString().padStart(2, '0')
        // current_hour_full = `${current_hour}:${current_minutes}`
        // document.getElementById('current_hour').innerText = current_hour_full
        // Current metrics
        // current_description
        description = data['weather'][0]['description']
        description_first_letter_capitalized = description.charAt(0).toUpperCase()
        description_end_of_string_element = description.slice(1)
        description = description_first_letter_capitalized + description_end_of_string_element
        document.getElementById('current_description').innerText = description
        // current_temp
        document.getElementById('current_temp').innerText = Math.floor(data['main']['temp'])
        // current_icon
        icon = data['weather'][0]['icon']
        // Exemple nom icone de la nuit : 01n
        // Si il y a un n dans le nom de l'icone, alors afficher la nuit
        if (icon.includes('n')) {
            // console.log("c'est la nuit")
            document.getElementById('current_icon').classList.remove('bg-blue-700')
            document.getElementById('current_icon').classList.add('bg-blue-900')
        } else {
            // console.log("c'est le jour")
            document.getElementById('current_icon').classList.remove('bg-blue-900')
            document.getElementById('current_icon').classList.add('bg-blue-700')
        }
        document.getElementById('current_icon').src = `https://openweathermap.org/img/wn/${icon}@2x.png`
        // current_feels_like
        current_feels_like = Math.floor(data['main']['feels_like'])
        document.getElementById('current_feels_like').innerText = `Ressenti ${current_feels_like}°C`
        // // current_max
        // current_max = Math.floor(data['main']['temp_max'])
        // document.getElementById('current_max').innerText = `Max. : ${current_max}°`
        // // current_min
        // current_min = Math.floor(data['main']['temp_min'])
        // document.getElementById('current_min').innerText = `Min. : ${current_min}°`
        // sunrise
        unix_timestamp_sunrise = data['sys']['sunrise']
        date_hour_sunrise = new Date((unix_timestamp_sunrise + timezoneDelta) * 1000)
        sunrise_hour = date_hour_sunrise.getUTCHours()
        sunrise_minutes = date_hour_sunrise.getUTCMinutes()
        // Ajout du zéro devant les minutes si besoin
        sunrise_minutes = sunrise_minutes.toString().padStart(2, '0')
        sunrise_hour_full = `${sunrise_hour}:${sunrise_minutes}`
        document.getElementById('sunrise_hour').innerText = sunrise_hour_full
        // sunset
        unix_timestamp_sunset = data['sys']['sunset']
        date_hour_sunset = new Date((unix_timestamp_sunset + timezoneDelta) * 1000)
        sunset_hour = date_hour_sunset.getUTCHours()
        sunset_minutes = date_hour_sunset.getUTCMinutes()
        // Ajout du zéro devant les minutes si besoin
        sunset_minutes = sunset_minutes.toString().padStart(2, '0')
        sunset_hour_full = `${sunset_hour}:${sunset_minutes}`
        document.getElementById('sunset_hour').innerText = sunset_hour_full
        // Traitement concernant les widgets
        // WIND WIDGET
        wind_direction = data['wind']['deg']
        // console.log(wind_direction)
        document.getElementById('arrow_wind').style.transform = `translate(-50%, -50%) rotate(${wind_direction}deg`
        let wind_direction_string = ''
        if (wind_direction < 15) {
            wind_direction_string = 'N'
        } else if (wind_direction < 60) {
            wind_direction_string = 'NE'
        } else if (wind_direction < 105) {
            wind_direction_string = 'E'
        } else if (wind_direction < 150) {
            wind_direction_string = 'SE'
        } else if (wind_direction < 195) {
            wind_direction_string = 'S'
        } else if (wind_direction < 240) {
            wind_direction_string = 'SO'
        } else if (wind_direction < 285) {
            wind_direction_string = 'O'
        } else if (wind_direction < 330) {
            wind_direction_string = 'NO'
        } else {
            wind_direction_string = 'N'
        }
        document.getElementById('wind_direction_string').innerText = `Origine : ${wind_direction_string}`
        wind_direction_speed = Math.floor(data['wind']['speed'])
        document.getElementById('wind_direction_speed').innerText = `${wind_direction_speed}`
        // HUMIDITY WIDGET
        humidity = (data['main']['humidity'])
        temp = data['main']['temp']
        // // methode 1 approximation empirique
        // // dew_point = temp - ((100-humidity)/5)
        // console.log(dew_point)
        // methode 2 formule de Magnus-Tetens
        a = Math.log(humidity / 100) + (17.27 * temp) / (237.7 + temp)
        Td = (237.7 * a) / (17.27 - a)
        dew_point = Math.round(Td)
        // console.log(Math.round(dew_point))
        document.getElementById("humidity_percentage").innerText = humidity
        document.getElementById("dew_point").innerText = dew_point

    } catch (error) {
        console.log('Error : ', error.message)
    }
}



// Fonctions nécessaires au changement de ville
async function fetchCitiesFromAPI(query) {
    const url = `${baseURL}${datasetParams}&q=${encodeURIComponent(query)}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data.records || [];
    } catch (err) {
        console.error('Erreur API :', err);
        return [];
    }
}
function filterExactName(records, query) {
    query = query.toLowerCase();
    return records
        .filter(record => {
            const name = record.fields.name?.toLowerCase();
            return name && name.includes(query);
        })
        .sort((a, b) => {
            const popA = a.fields.population ?? 0;
            const popB = b.fields.population ?? 0;
            return popB - popA;
        });
}
function updateDropdown(filtered) {
    const dropdown = document.getElementById('dropdown_input_city');
    dropdown.innerHTML = '';
    const limited = filtered.slice(0, 5); // Limiter à 5 suggestions
    if (limited.length === 0) {
        dropdown.style.display = 'none';
        return;
    }
    limited.forEach(record => {
        const country = record.fields.cou_name_en ?? 'Unknown';
        const option = document.createElement('div');
        option.textContent = `${record.fields.name} (${country})`;
        option.style.padding = '5px';
        option.style.cursor = 'pointer';
        option.addEventListener('click', () => {
            // selectedCity = record;
            document.getElementById('input_city').value = record.fields.name;
            // *************************************************************************** PAS LA PEINE CAR SERA ACTUALISE AVEC L'API OPENWEATHER
            cityName = record.fields.name
            document.getElementById('city').innerText = cityName
            // *************************************************************************************************************************************
            dropdown.style.display = 'none';
            // **************************************************** ENLEVER LA DIV DE RECHERCHE ET AFFICHER LE NOUVEAU NOM DE LA VILLE 
            toggleCityInput()
            // ********************************************************
            // 🔁 Remplir les coordonnées globales
            lat = record.geometry?.coordinates?.[1];
            lon = record.geometry?.coordinates?.[0];
            // Utiliser les données précises du record
            // console.log("Ville sélectionnée :", record);
            // console.log(`lat : ${lat} , lon : ${lon}`);
            url_weather_coords = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&lang=${lang}&units=metric`
            url_forecast_coords = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&lang=${lang}&units=metric`
            // Appeler la fonction fetchDataFromWeatherURL lors d'un changement de ville
            fetchDataFromWeatherURL(url_weather_coords)
        });
        dropdown.appendChild(option);
    });
    dropdown.style.display = 'block';
}
// // La fonction qui orchestre la recherche
// async function changeCity() {
//     const input = document.getElementById('input_city');
//     const dropdown = document.getElementById('dropdown_input_city');
//     input.addEventListener('input', async () => {
//         const query = input.value.trim();
//         if (query.length === 0) {
//             dropdown.style.display = 'none'; // 👈 Ajout ici pour masquer le dropdown
//             return;
//         }
//         const records = await fetchCitiesFromAPI(query);
//         const filtered = filterExactName(records, query);
//         // 🪄 Remplir le menu déroulant
//         updateDropdown(filtered);
//     });
// }
// La fonction qui orchestre la recherche en utilisant un debounce et un delai pour eviter de spammer l'api
function debounce(fn, delay) {
    let timeoutId; // ⏳ une variable pour stocker le timer
    return (...args) => {
        clearTimeout(timeoutId); // 🔁 si une nouvelle exécution arrive, on annule le timer précédent
        timeoutId = setTimeout(() => {
            fn(...args); // ✅ on exécute la fonction après le délai si aucune nouvelle frappe n’est survenue
        }, delay); // ⏱ temps d’attente (ex. : 400ms)
    };
}
async function changeCity() {
    const input = document.getElementById('input_city');
    const dropdown = document.getElementById('dropdown_input_city');
    const handleInput = async () => {
        const query = input.value.trim();
        if (query.length === 0) {
            dropdown.style.display = 'none'; // 👈 Ajout ici pour masquer le dropdown
            return;
        }
        const records = await fetchCitiesFromAPI(query);
        const filtered = filterExactName(records, query);
        // 🪄 Remplir le menu déroulant
        updateDropdown(filtered);
    };
    input.addEventListener('input', debounce(handleInput, 400)) // debounce de 400ms
}




// INITIAL START
getLocation()
// navigator.geolocation.getCurrentPosition(success, error, options);
fetchDataFromWeatherURL(url_weather_coords)
// WATCHING FOR CHANGE IN CITY
changeCity()
// updateHour()















function addFavoriteLocation() {
    let newFavoriteLocation = currentLocationInFav
    let newFavoriteLocationLatitude = lat
    let newFavoriteLocationLongitude = lon
    console.log(newFavoriteLocation)
    console.log(newFavoriteLocationLatitude)
    console.log(newFavoriteLocationLongitude)
    itemToAdd = [newFavoriteLocation, newFavoriteLocationLatitude, newFavoriteLocationLongitude]
    // Pour récuperer la valeur de la clé villes dans le local storage ATTENTION C'EST UN STRING
    let recupLocalStorage = localStorage.getItem('villes')
    if (recupLocalStorage === null) {
        // console.log("je crée un tableau")
        recupLocalStorage = []
    } else {
        // console.log('je vais transformer mon tableau')
        // JSON.parse(recupLocalStorage)
        recupLocalStorage = JSON.parse(recupLocalStorage)
    }
    if (!recupLocalStorage.some(loc => loc[0] === newFavoriteLocation)) {
        if (recupLocalStorage.length < 7) {
            recupLocalStorage.push(itemToAdd)
            let newItemToAdd = JSON.stringify(recupLocalStorage)
            localStorage.setItem('villes', newItemToAdd)
        } else {
            // console.log('lancement fonction message temp')
            showTemporaryMessageInDrawer()
        }
    }
    generateFavoriteLocationsList()
    check_if_already_in_favorites()
}

function showTemporaryMessageInDrawer() {
    const box = document.getElementById('temporaryMessageFavDrawer');
    const box2 = document.getElementById('temporaryMessageInApp');
    // box.textContent = msg;
    // box.style.display = 'block';
    box.classList.remove('hidden')
    box2.classList.remove('hidden')
    // console.log('lancement timeout message temp')
    setTimeout(() => {
        // box.textContent = '';
        // box.style.display = 'none';
        box.classList.add('hidden')
        box2.classList.add('hidden')
    }, 5000); // 5 secondes
    // console.log('fin timeout message temp')
}

function generateFavoriteLocationsList() {
    let listFavoritesLocations = localStorage.getItem('villes')
    if (listFavoritesLocations === null) {
        listFavoritesLocations = []
    } else {
        // console.log('je vais transformer mon tableau')
        // JSON.parse(recupLocalStorage)
        listFavoritesLocations = JSON.parse(listFavoritesLocations)
    }
    // let listFavoritesLocations = [['Baghdad', 'latitude', 'longitude'], ['Paris', 'latitude', 'longitude'], ['Caen', 'latitude', 'longitude'], ['Sydney', 'latitude', 'longitude'], ['Le Havre', 'latitude', 'longitude'], ['Istanbul', 'latitude', 'longitude']]
    // console.log(currentLocationInFav)
    if (listFavoritesLocations.some(loc => loc[0] === currentLocationInFav)) {
        document.getElementById('buttonAddFavoriteLocation').classList.add('hidden');
    } else {
        document.getElementById('buttonAddFavoriteLocation').classList.remove('hidden');
    }
    const divFavLocations = document.getElementById('containerListFavLocations')
    divFavLocations.innerHTML = ''
    let i_list_favorites_locations = 0
    listFavoritesLocations.forEach(element => {
        element[1] = element[1].toFixed(4)
        element[2] = element[2].toFixed(4)
        divFavLocations.innerHTML += `
            <div class="flex flex-row justify-between items-center mb-4">
                <div class="flex flex-col">
                    <div class="ps-3 text-2xl font-semibold" onclick="searchFromFavoriteLocations(${i_list_favorites_locations})">${element[0]}</div>
                    <div class="ps-3 text-[0.9rem]">lat: ${element[1]} - lon: ${element[2]}</div>
                </div>
                <div>
                    <button type="button" class="border rounded-xl px-2 py-1"
                        id="buttonRemoveFavoriteLocation" onclick="removeFavoriteLocation(${i_list_favorites_locations})">
                        Remove
                    </button>
                </div>
            </div>
            `
        i_list_favorites_locations += 1
    });
}





// function addFavorite() {
//     let villeRecup = currentLocationInFav
//     // console.log(villeRecup)
//     // Pour récuperer la valeur de la clé TOTO dans le local storage ATTENTION C'EST UN STRING
//     let recupLocalStorage = localStorage.getItem('villes')
//     // console.log(recupLocalStorage)
//     // console.log(typeof recupLocalStorage )
//     // console;log('----------')
//     if (recupLocalStorage === null) {
//         console.log("je crée un tableau")
//         recupLocalStorage = []
//     } else {
//         console.log('je vais transformer mon tableau')
//         // JSON.parse(recupLocalStorage)
//         recupLocalStorage = JSON.parse(recupLocalStorage)
//     }
//     if (!recupLocalStorage.includes(villeRecup)) {
//         recupLocalStorage.push(villeRecup)
//         let nouvelleVille = JSON.stringify(recupLocalStorage)
//         localStorage.setItem('villes', nouvelleVille)
//     }
//     // recupLocalStorage.push(villeRecup)
//     // console.log(recupLocalStorage)
//     // // On doit transformer le tableau en string
//     // // JSON.stringify(recupLocalStorage)
//     // let nouvelleVille = JSON.stringify(recupLocalStorage)
//     // // On peut maintenant envoyer recupLocalStorage dans villes
//     // // localStorage.setItem('villes', recupLocalStorage)
//     // localStorage.setItem('villes', nouvelleVille)
// }




function removeFavoriteLocation(i_list_favorites_locations) {
    // Pour récuperer la valeur de la clé villes dans le local storage
    let recupLocalStorage = localStorage.getItem('villes')
    // if (recupLocalStorage === null) {
    //     // console.log("je crée un tableau")
    //     recupLocalStorage = []
    // } else {
    // console.log('je vais transformer mon tableau')
    // JSON.parse(recupLocalStorage)
    recupLocalStorage = JSON.parse(recupLocalStorage)
    // }
    // Supprime l'élément i_list_favorites_locations de recupLocalStorage
    recupLocalStorage.splice(i_list_favorites_locations, 1)
    let newItemToAdd = JSON.stringify(recupLocalStorage)
    localStorage.setItem('villes', newItemToAdd)
    // reactualiser la liste des favoris dans l'affichage
    generateFavoriteLocationsList()
    check_if_already_in_favorites()
}



function searchFromFavoriteLocations(i_list_favorites_locations) {
    let recupLocalStorage = localStorage.getItem('villes')
    recupLocalStorage = JSON.parse(recupLocalStorage)
    console.log(recupLocalStorage[i_list_favorites_locations])
    lat = recupLocalStorage[i_list_favorites_locations][1]
    lon = recupLocalStorage[i_list_favorites_locations][2]
    url_weather_coords = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&lang=${lang}&units=metric`
    fetchDataFromWeatherURL(url_weather_coords)
    displayOrHideDrawer()
}





function check_if_already_in_favorites() {
    const favoriteStarBtn = document.getElementById("star_favorite_or_not")
    // recuperer les favoris
    let listFavoritesLocations = localStorage.getItem('villes')
    listFavoritesLocations = JSON.parse(listFavoritesLocations)

    if (listFavoritesLocations.some(loc => loc[0] === currentLocationInFav)) {
        const index_element_to_remove = listFavoritesLocations.findIndex(loc => loc[0] === currentLocationInFav)
        console.log('deja en favori')
        console.log(index_element_to_remove)
        // Ajouter l'étoile pleine
        favoriteStarBtn.innerHTML = `
            <button type="button" class="flex flex-row items-center p-2" id="star_favorite_or_not" onclick="removeFavoriteLocation(${index_element_to_remove})">
                <span class="material-symbols-outlined star_icon_favorite_filled">
                    star
                </span>
            </button>
        `
    } else {
        console.log('pas en favori')
        // Ajouter l'étoile vide
        favoriteStarBtn.innerHTML = `
            <button type="button" class="flex flex-row items-center p-2" id="star_favorite_or_not" onclick="addFavoriteLocation()">
                <span class="material-symbols-outlined star_icon_favorite_empty">
                    star
                </span>
            </button>
        `
        // document.getElementById('buttonAddFavoriteLocation').classList.remove('hidden');
    }
    generateFavoriteLocationsList()
}