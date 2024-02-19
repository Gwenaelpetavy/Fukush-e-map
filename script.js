// sélection de l'emprise de la vue selon la latitude, la longitude et l'échelle
var map = L.map('map').setView([45.750000, 4.850000], 9);

// ajout du fond de carte : "ESRI imagerie satellite"
var Esri_WorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
}).addTo(map);


var rhoneLayer = L.geoJSON(rhone, {
    style: {
        color: 'white',
        weight: 1.5,
        opacity: 1
    },
    // affichage d'un pop-up (à partir d'OnEachFeature) annonçant le nom de la commune et son code Insee
    // lorsqu'une entité est cliquée par l'utilisateur
    onEachFeature: function (feature, layer) {
        if (feature.properties && feature.properties.NOM_M) {
            var popupContent = "<h4 style='text-align: center; margin: 0;'>" + feature.properties.NOM_M + "</h4>";
            if (feature.properties.INSEE_COM) {
                popupContent += "<p style='margin: 0;'>Code INSEE : " + feature.properties.INSEE_COM + "</p>";
            }
            layer.bindPopup(popupContent);
        }
    }
}).addTo(map);




var select = document.getElementById('select-population');

select.addEventListener('change', function() {
    var selectedValue = this.value;
    // Supprimez la couche actuellement affichée si elle existe
    if (geojsonLayer !== undefined) {
        map.removeLayer(geojsonLayer);
    }
    // Créez une nouvelle couche avec les entités correspondant à la valeur sélectionnée
    geojsonLayer = L.geoJSON(rhone, {
        filter: function(feature) {
            return feature.properties.POPULATION === selectedValue;
        },
        // Définissez l'option style ou d'autres si nécessaire
    }).addTo(map);
});







// ajout d'une échelle à la carte
L.control.scale().addTo(map);


// fonction et bouton permettant de revenir à la vue d'origine
function resetView() {
    map.setView([45.819960, 4.723230], 9);
}
var resetViewButton = L.Control.extend({
    options: {
        position: 'topleft'
    },

    onAdd: function (map) {
        var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');

        container.innerHTML = '<button onclick="resetView()">Vue d\'origine</button>';

        return container;
    }
});
map.addControl(new resetViewButton());


// ajout d'un gestionnaire de fond de carte et de couche
var fond_carte = {
    "Fond de carte ESRI World Imagery": Esri_WorldImagery
};
var couches = {
    "Communes du département du Rhône": rhoneLayer
};
L.control.layers(fond_carte, couches).addTo(map);


// ajout d'une légende customisée avec un fond transparent
var legend = L.control({ position: 'bottomright' });
legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend');
    div.style.backgroundColor = 'rgba(255, 255, 255, 0.7)';
    div.style.padding = '10px';
    div.innerHTML = '<h4 style="margin-top: 0;">Légende : </h4>' +
        '<div id="commune_legende" style="margin-bottom: 5px;"><div style="display: inline-block; width: 15px; height: 10px; background-color: white; border: 1px solid black;"></div> <span style="display: inline-block;">Communes du Rhône</span></div>'
    return div;
};
legend.addTo(map);

// fonction permettant de mettre à jour automatiquement la légende selon les couches affichées
function updateLegend() {
    var communeLegend = document.getElementById('commune_legende');

    communeLegend.style.display = map.hasLayer(rhoneLayer) ? 'block' : 'none';
}
map.on('overlayadd overlayremove', function () {
    updateLegend();
});









