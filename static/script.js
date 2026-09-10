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

// Add a marker on map
var marker = L.marker([51.5, -0.09]).addTo(map);

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
    item.addEventListener("mousedown", () => {
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

search.addEventListener("blur", () => {
    result.classList.add("hidden");
});