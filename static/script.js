// Create map with Leaflet
const map = L.map('map', {
    zoomControl: false,
    maxZoom: 19,
    scrollWheelZoom: false
}).setView([-30.03488, -52.89261], 14);


// Zoom controls
const zoomInButton = document.querySelector(".zoom-in");
const zoomOutButton = document.querySelector(".zoom-out");

zoomInButton.addEventListener('click', () => {
    map.zoomIn();
});

zoomOutButton.addEventListener('click', () => {
    map.zoomOut();
});


// Set location to Cachoeira do Sul
const button = document.querySelector(".centralize-view");

button.addEventListener('click', () => {
    map.setView([-30.03488, -52.89261], 14)
});


// MapTiler API Key
const key = 'Ualu49Oxpm6WIVrZ1UXb';

// Load my custom skin from MapTiler
const mtLayer = L.maptiler.maptilerLayer({
    apiKey: key,
    style: "01a07c96-46e2-7f85-8a85-a2b947659ad3",
}).addTo(map);

// Get data from Jinja tamplate
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
            className: `custom-cluster custom-cluster-${size}`,
            iconSize: L.point(18, 18)
        });
    }
});

// Create marker for each place
function refreshMapIcons() {
    requestAnimationFrame(() => {
        lucide.createIcons();
    });
}

places.forEach((place) => {
    
    // Style
    const placeIcon = L.divIcon({
        className: "my-div-icon",
        iconSize: [38, 38],
        iconAnchor: [0, 38],
        html: `<i data-lucide="${place.icon || "map-pin"}"></i>`
    });

    // Position
    const marker = L.marker(
        [place.latitude, place.longitude],
        { icon: placeIcon }
    );

    // Save marker with category
    markers.push({
        marker: marker,
        category: place.category_name
    });

    markerCluster.addLayer(marker);
    marker.on("add", refreshMapIcons);

    // Marker click event
    marker.on("click", () => {

        if (selectedMarker) {
            const previousMarker = selectedMarker.getElement();

            if (previousMarker) {
                previousMarker.classList.remove("selected");
            }
        }

        const currentMarker = marker.getElement();
        currentMarker.classList.add("selected");

        selectedMarker = marker;

        // Card
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
        refreshMapIcons();

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

markerCluster.on("layeradd", refreshMapIcons);
markerCluster.on("animationend", refreshMapIcons);
map.on("zoomend", refreshMapIcons);
map.on("moveend", refreshMapIcons);


// Filter
const categorySelect = document.querySelector("#category-select");

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
    refreshMapIcons();
}

categorySelect.addEventListener("change", () => {
    applyAllFilters();
});

refreshMapIcons();