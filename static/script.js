// MAP
// Create map with Leaflet
const map = L.map('map', {
    zoomControl: false
}).setView([-30.03488, -52.89261], 14);

// Set controls settings
L.control.zoom({
    position: "bottomright",
    zoomInText: '+',
    zoomOutText: '−',
    zoomInTitle: 'Aumentar zoom',
    zoomOutTitle: 'Diminuir zoom'
}).addTo(map);

// MapTiler API Key
const key = 'Ualu49Oxpm6WIVrZ1UXb';

// Load my custom skin from MapTiler
const mtLayer = L.maptiler.maptilerLayer({
    apiKey: key,
    style: "01a07c96-46e2-7f85-8a85-a2b947659ad3"
}).addTo(map);

// Marker icon
const myIcon = L.divIcon({
    className: 'my-div-icon',
    iconSize: [38, 38],
    iconAnchor: [0, 38],
    html: '<i data-lucide="recycle"></i>',
});

// Place details card
const card = document.querySelector(".card");
const cardCategory = card.querySelector(".tag p");
const categoryIcon = card.querySelector(".tag i");
const cardTitle = card.querySelector(".title");
const cardAddress = card.querySelector(".address");
const cardItems = card.querySelector("li");
const closeCard = card.querySelector(".close");
const routeButton = card.querySelector(".route");

card.classList.add("hidden");

places.forEach((place) => {
    const marker = L.marker(
        [place.latitude, place.longitude],
        { icon: myIcon }
    ).addTo(map);

    marker.on("click", () => showPlace(place));
});

function showPlace(place) {
    cardCategory.textContent = place.category || "Ponto de coleta";

    const icons = {
        "Recicláveis": "recycle",
        "Eletrônicos": "monitor-smartphone",
        "Pilhas e baterias": "car-battery",
        "Orgânico": "banana",
        "Óleo": "droplets",
        "Lâmpadas": "lightbulb"
    };

    const iconName = icons[place.category] || "map-pin";
    const currentIcon = card.querySelector(".tag svg, .tag i");

    currentIcon.outerHTML = `<i data-lucide="${iconName}"></i>`;
    lucide.createIcons();

    cardTitle.textContent = place.name;
    cardAddress.textContent = place.address || "Informações não disponíveis";
    cardItems.textContent = place.items || "Itens não informados";

    routeButton.onclick = () => {
        const destination = `${place.latitude},${place.longitude}`;
        const routeUrl = place.link || (
            `https://www.google.com/maps/dir/?api=1&destination=${destination}`
        );

        window.open(routeUrl, "_blank", "noopener");
    };

    card.classList.remove("hidden");
}

// Botão de fechar do card
closeCard.addEventListener('click', () => {
    card.classList.add('hidden');
});


// LUCIDE ICONS
lucide.createIcons();

// SEARCH
const search = document.querySelector("#input-search");
const result = document.querySelector("#search-result");
const items = document.querySelectorAll(".search-result-item");

search.addEventListener("focus", () => {
    result.classList.remove("hidden");
})

// AI helped me here - Item name on input value
items.forEach((item) => {
    item.addEventListener("click", () => {
        search.value = item.querySelector(".text-body").textContent.trim();
        result.classList.add("hidden");
    });
});

// AI helped me here - Search itens on result
search.addEventListener("input", () => {
    const searchText = search.value.toLowerCase().trim();

    items.forEach((item) => {
        const itemName = item.querySelector(".text-body").textContent.toLowerCase();
        const itemDescription = item.querySelector(".text-description").textContent.toLowerCase();

        const nMatches = itemName.includes(searchText);
        const dMatches = itemDescription.includes(searchText);

        item.classList.toggle("hidden", nMatches === false && dMatches == false);
    })
})

search.addEventListener("mousedown", () => {
    result.classList.add("hidden");
})