// sélection de l'emprise de la vue selon la latitude, la longitude et l'échelle
var map = L.map('map').setView([36.457, 136.302], 5);

// ajout du fond de carte : "ESRI imagerie satellite"
var Esri_WorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
}).addTo(map);


var japonLayer = L.geoJSON(japon, {
    style: {
        color: 'white',
        weight: 1.5,
        opacity: 1
    
    }
}).addTo(map);

