// MAP
// Create map with Leaflet
const map = L.map('map', {
    zoomControl: false,
    maxZoom: 19,
    scrollWheelZoom: false
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
    style: "01a07c96-46e2-7f85-8a85-a2b947659ad3",
}).addTo(map);


// Dados consultados pelo Flask e enviados pelo template via Jinja
const dataElement = document.querySelector("#recycle-map-data");
const { places, categories } = JSON.parse(dataElement.textContent);

let selectedMarker = null;
const markers = [];
const markerCluster = L.markerClusterGroup({
    iconCreateFunction: (cluster) => {
        const total = cluster.getChildCount();

        let size = "small";

        if (total >= 10 && total < 50) {
            size = "medium";
        } else if (total >= 50) {
            size = "large";
        }

        return L.divIcon({
            // html: `<span>${total}</span>`,
            className: `custom-cluster custom-cluster-${size}`,
            iconSize: L.point(18, 18)
        });
    }
});

// Cria um marcador no mapa para cada local
places.forEach((place) => {
    // Estilo do marcador
    const placeIcon = L.divIcon({
        className: "my-div-icon",
        iconSize: [38, 38],
        iconAnchor: [0, 38],
        html: `<i data-lucide="${place.icon || "map-pin"}"></i>`
    });

    // Posição do marcador
    const marker = L.marker(
        [place.latitude, place.longitude],
        { icon: placeIcon }
    );

    // Salvar o marcador junto com a categoria
    markers.push({
        marker: marker,
        category: place.category_name
    });

    markerCluster.addLayer(marker);
    lucide.createIcons();

    // Interação de clique no marcador
    marker.on("click", () => {

        // Se tiver algum marcador selecionado, retorna para estilo default
        if (selectedMarker) {
            const previousMarker = selectedMarker.getElement();

            if (previousMarker) {
                previousMarker.classList.remove("selected");
            }
        }

        // Estiliza o marcador selecionado atual
        const currentMarker = marker.getElement();
        currentMarker.classList.add("selected");

        selectedMarker = marker;

        // Plota os dados no card
        const card = document.querySelector("#card");
        const close = card.querySelector(".close");
        const title = card.querySelector(".title");
        const address = card.querySelector(".address");
        const icon = card.querySelector(".tag svg");
        const description = card.querySelector(".description");
        const route = card.querySelector(".route-link");
        const category = document.querySelector(".tag p");

        card.classList.remove("hidden");
        title.textContent = place.name;
        address.textContent = place.address;
        category.textContent = place.category_name;
        description.textContent = place.items;
        route.setAttribute("href", `https://www.google.com/maps/dir/?api=1&destination=${place.latitude},${place.longitude}`);
        icon.setAttribute("data-lucide", place.icon || "map-pin");
        lucide.createIcons();

        close.onclick = () => {
            card.classList.add("hidden");

            if (currentMarker) {
                currentMarker.classList.remove("selected");
            }

            selectedMarker = null;
        };
    });
});

map.addLayer(markerCluster);

function refreshMapIcons() {
    lucide.createIcons();
}

markerCluster.on("animationend", refreshMapIcons);
map.on("zoomend", refreshMapIcons);



// SEARCH
const categorySelect = document.querySelector("#category-select");

// Retorna true quando o marcador pertence à categoria selecionada
function matchesAllFilters(marker) {
    if (categorySelect.value === "all") {
        return true;
    }
    return marker.category === categorySelect.value;
}

function applyAllFilters() {
    markers.forEach((marker) => {
        if (matchesAllFilters(marker)) {
            markerCluster.addLayer(marker.marker);
        } else {
            markerCluster.removeLayer(marker.marker);

            if (selectedMarker === marker.marker) {
                document.querySelector("#card").classList.add("hidden");
                selectedMarker = null;
            }
        }
    });
    lucide.createIcons();
}

categorySelect.addEventListener("change", () => {
    applyAllFilters();
});

lucide.createIcons();