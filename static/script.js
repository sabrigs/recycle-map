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


// Busca os dados da rota criada no Flask
let selectedMarker = null;

fetch("/places")
    .then((response) => response.json())
    .then((places) => {
        
        // Cria um marcador no mapa para cada local
        places.forEach((place) => {
            
            // Estilo do marcado
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
            ).addTo(map);
            
            // Interação de clique no marcador
            marker.on("click", () => {
                // Estilo do marcador quando selecionado
                if (selectedMarker) {
                    const previousElement = selectedMarker.getElement();
                    previousElement.style.backgroundColor = "";
                    previousElement.style.border = "";
                    previousElement.querySelector("svg").style.color = "";
                }

                const markerElement = marker.getElement();
                markerElement.style.backgroundColor = "#384CAB";
                markerElement.style.border = "2px solid #384CAB";
                markerElement.querySelector("svg").style.color = "white";

                selectedMarker = marker;

                // Plota os dados no card
                const card = document.querySelector("#card");
                const close = card.querySelector(".close");
                const title = card.querySelector(".title");
                const address = card.querySelector(".address");
                const category = card.querySelector(".tag p");
                const icon = card.querySelector(".tag svg");
                const description = card.querySelector("p.description");
                const route = card.querySelector(".route-link");
                
                card.classList.remove("hidden");
                title.textContent = place.name;
                address.textContent = place.address;
                category.textContent = place.category_name;
                description.textContent = place.items;
                route.setAttribute("href", `https://www.google.com/maps/dir/?api=1&destination=${place.latitude},${place.longitude}`);
                icon.setAttribute("data-lucide", place.icon);
                lucide.createIcons();
                
                // Fecha o card
                close.addEventListener("click", () => {
                    card.classList.add("hidden");
                })
            });
        });

        lucide.createIcons();
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