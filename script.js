// sélection de l'emprise de la vue selon la latitude, la longitude et l'échelle
var map = L.map('map').setView([36.204824, 138.252924], 5);

// ajout du fond de carte : "ESRI imagerie satellite"
var Esri_WorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
}).addTo(map);


var geojsonLayer; // Déclaration de la variable pour stocker la couche GeoJSON
var data; // Déclaration de la variable data

// Utilisez fetch pour charger les données depuis un fichier local
fetch('data/fukushima.js')
    .then(response => response.json())
    .then(jsonData => {
        // Stocker les données dans la variable data globale
        data = jsonData;

        // Événement de changement sur le formulaire de sélection d'année
        document.getElementById('id_dilemSelect').addEventListener('change', function () {
            var selectedid_dilem = this.value;
            // Vérifier si une option a été sélectionnée
            if (selectedid_dilem !== "") {
                // Supprimer la couche GeoJSON existante s'il y en a une
                if (geojsonLayer) {
                    map.removeLayer(geojsonLayer);
                }
                // Création de la couche GeoJSON si une option est sélectionnée
                geojsonLayer = L.geoJSON(data, {
                    style: function (feature) {
                        // Style des polygones
                        return {
                            fillColor: 'blue',
                            color: '#000',
                            weight: 1,
                            opacity: 1,
                            fillOpacity: 0.5 // Opacité de remplissage des polygones
                        };
                    },
                    onEachFeature: function (feature, layer) {
                        // Ajout d'une popup à chaque élément de la couche GeoJSON
                        if (feature.properties && feature.properties.ID_DILEM) {
                            var statut = feature.properties.Statut ? feature.properties.Statut : "";
                            layer.bindPopup(feature.properties.ID_DILEM + '<br>' + feature.properties.Annee + '<br>' + statut);
                        }
                    }
                }).addTo(map);

                // Mettre à jour les éléments de la couche GeoJSON en fonction de l'année sélectionnée
                updateData(selectedid_dilem);
            } else {
                // Si aucune option n'est sélectionnée, supprimer la couche GeoJSON de la carte
                if (geojsonLayer) {
                    map.removeLayer(geojsonLayer);
                }
            }
        });
    })
    .catch(error => {
        console.error('Erreur de chargement des données :', error);
    });

// Fonction pour mettre à jour les éléments de la couche GeoJSON en fonction de l'ID sélectionné
function updateData(id_dilem) {
    geojsonLayer.clearLayers();
    var filteredFeatures = data.features.filter(function (feature) {
        console.log('Feature ID_DILEM:', feature.properties.ID_DILEM, ' | Selected ID_DILEM:', id_dilem);
        // Comparaison des ID en tant que chaînes de caractères
        return feature.properties.ID_DILEM === id_dilem;
    });
    console.log('Nombre d\'entités filtrées pour l\'ID', id_dilem, ':', filteredFeatures.length);
    geojsonLayer.addData({ type: 'FeatureCollection', features: filteredFeatures });

}






// var geojsonLayer; // Déclaration de la variable pour stocker la couche GeoJSON
// var data; // Déclaration de la variable data

// // Utilisez fetch pour charger les données depuis un fichier local
// fetch('data/individus.js')
//     .then(response => response.json())
//     .then(jsonData => {
//         // Stocker les données dans la variable data globale
//         data = jsonData;

//         // Événement de changement sur le formulaire de sélection d'année
//         document.getElementById('id_dilemSelect').addEventListener('change', function () {
//             var selectedid_dilem = this.value;
//             // Vérifier si une option a été sélectionnée
//             if (selectedid_dilem !== "") {
//                 // Supprimer la couche GeoJSON existante s'il y en a une
//                 if (geojsonLayer) {
//                     map.removeLayer(geojsonLayer);
//                 }
//                 // Création de la couche GeoJSON si une option est sélectionnée
//                 geojsonLayer = L.geoJSON(data, {
//                     pointToLayer: function (feature, latlng) {
//                         // Personnalisez le marqueur pour chaque point
//                         return L.circleMarker(latlng, {
//                             radius: 8,
//                             fillColor: 'blue',
//                             color: '#000',
//                             weight: 1,
//                             opacity: 1,
//                             fillOpacity: 0.8
//                         });
//                     },
//                     onEachFeature: function (feature, layer) {
//                         // Ajout d'une popup à chaque élément de la couche GeoJSON
//                         if (feature.properties && feature.properties.ID_DILEM) {
//                             var statut = feature.properties.Statut ? feature.properties.Statut : "";
//                             layer.bindPopup(feature.properties.ID_DILEM + '<br>' + feature.properties.Annee + '<br>' + statut);
//                         }
//                     }
//                 }).addTo(map);

//                 // Mettre à jour les éléments de la couche GeoJSON en fonction de l'année sélectionnée
//                 updateData(selectedid_dilem);
//             } else {
//                 // Si aucune option n'est sélectionnée, supprimer la couche GeoJSON de la carte
//                 if (geojsonLayer) {
//                     map.removeLayer(geojsonLayer);
//                 }
//             }
//         });
//     })
//     .catch(error => {
//         console.error('Erreur de chargement des données :', error);
//     });

// // Fonction pour mettre à jour les éléments de la couche GeoJSON en fonction de l'ID sélectionné
// function updateData(id_dilem) {
//     geojsonLayer.clearLayers();
//     var filteredFeatures = data.features.filter(function (feature) {
//         console.log('Feature ID_DILEM:', feature.properties.ID_DILEM, ' | Selected ID_DILEM:', id_dilem);
//         // Comparaison des ID en tant que chaînes de caractères
//         return feature.properties.ID_DILEM === id_dilem;
//     });
//     console.log('Nombre d\'entités filtrées pour l\'ID', id_dilem, ':', filteredFeatures.length);
//     geojsonLayer.addData({ type: 'FeatureCollection', features: filteredFeatures });

// }



// var select = document.getElementById('select-zone');

// select.addEventListener('change', function() {
//     var selectedValue = this.value;
//     // Supprimez la couche actuellement affichée si elle existe
//     if (geojsonLayer !== undefined) {
//         map.removeLayer(geojsonLayer);
//     }
//     // Créez une nouvelle couche avec les entités correspondant à la valeur sélectionnée
//     geojsonLayer = L.geoJSON(japon, {
//         filter: function(feature) {
//             return feature.properties.Zone === selectedValue;
//         },
//         // Définissez l'option style ou d'autres si nécessaire
//     }).addTo(map);
// });

// // ajout d'un gestionnaire de fond de carte et de couche
// var fond_carte = {
//     "Fond de carte ESRI World Imagery": Esri_WorldImagery
// };
// var couches = {
//     "Zones japon": japonLayer
// };
// L.control.layers(fond_carte, couches).addTo(map);


// // ajout d'une légende customisée avec un fond transparent
// var legend = L.control({ position: 'bottomright' });
// legend.onAdd = function (map) {
//     var div = L.DomUtil.create('div', 'info legend');
//     div.style.backgroundColor = 'rgba(255, 255, 255, 0.7)';
//     div.style.padding = '10px';
//     div.innerHTML = '<h4 style="margin-top: 0;">Légende : </h4>' +
//         '<div id="commune_legende" style="margin-bottom: 5px;"><div style="display: inline-block; width: 15px; height: 10px; background-color: white; border: 1px solid black;"></div> <span style="display: inline-block;">Communes du Rhône</span></div>'
//     return div;
// };
// legend.addTo(map);

// // fonction permettant de mettre à jour automatiquement la légende selon les couches affichées
// function updateLegend() {
//     var communeLegend = document.getElementById('commune_legende');

//     communeLegend.style.display = map.hasLayer(japonLayer) ? 'block' : 'none';
// }
// map.on('overlayadd overlayremove', function () {
//     updateLegend();
// });









