const key = 'Ualu49Oxpm6WIVrZ1UXb';

const map = L.map('map', {
    zoomControl: false
}).setView([-30.03488, -52.89261], 14);

L.control.zoom({
    position: "bottomright",
    zoomInText: '+',
    zoomOutText: '−',
    zoomInTitle: 'Aumentar zoom',
    zoomOutTitle: 'Diminuir zoom'
}).addTo(map);

const mtLayer = L.maptiler.maptilerLayer({
    apiKey: key,
    style: "01a07c96-46e2-7f85-8a85-a2b947659ad3"
}).addTo(map);


// Adiciona um pin
// var marker = L.marker([51.5, -0.09]).addTo(map);


// Pop-up
var popup = L.popup();
function onMapClick(e) {
    popup
        .setLatLng(e.latlng)
        .setContent("You clicked the map at " + e.latlng.toString())
        .openOn(map);
}
map.on('click', onMapClick);

// Icons
lucide.createIcons();