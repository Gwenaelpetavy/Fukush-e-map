const map = L.map('map', {
  zoomControl: false
}).setView([36.2048, 138.2529], 5);
L.control.scale({
  position: 'bottomleft'
}).addTo(map);
L.control.zoom({
  position: 'bottomright'
}).addTo(map);

const sidepanelLeft = L.control.sidepanel('mySidepanelLeft', {
  tabsPosition: 'left',
  startTab: 'tab-1'
}).addTo(map);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);
// Création d'un contrôle personnalisé pour le bouton de plein écran
var fullscreenControl = L.Control.extend({
  onAdd: function (map) {
    var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
    var button = L.DomUtil.create('a', 'leaflet-bar-part leaflet-control-custom', container);
    button.innerHTML = '<i class="fas fa-expand"></i>'; // icône pour entrer en plein écran par défaut
    button.href = '#';
    button.role = 'button';
    button.style.backgroundColor = 'white';
    button.style.width = '30px';
    button.style.height = '30px';
    button.style.borderRadius = '5px';
    button.style.boxShadow = '0 1px 4px rgba(0, 0, 0, 0.3)';
    button.style.textAlign = 'center';
    button.style.lineHeight = '30px';
    button.style.textDecoration = 'none';
    button.style.color = '#333';
    button.style.fontFamily = 'sans-serif';
    button.style.fontSize = '12px';
    button.style.fontWeight = 'bold';

    button.onclick = function () {
      toggleFullScreen();
    }

    return container;
  },
});

// Ajout du contrôle personnalisé à la carte Leaflet
map.addControl(new fullscreenControl({ position: 'bottomright' }));

// Fonction pour mettre la carte en plein écran
function toggleFullScreen() {
  var elem = document.getElementById('map');
  var button = document.querySelector('.leaflet-control-custom');

  if (!document.fullscreenElement) {
    elem.requestFullscreen().catch(err => {
      alert(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
    });
    button.innerHTML = '<i class="fas fa-compress"></i>'; // icône pour sortir du plein écran
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
    button.innerHTML = '<i class="fas fa-expand"></i>'; // icône pour entrer en plein écran
  }
}

var toggleButton1 = document.getElementById('toggleLayer1');
var toggleButton2 = document.getElementById('toggleLayer2');

// État initial des couches (visibles)
var layer1Visible = true;
var layer2Visible = true;

// Ajout d'un écouteur d'événements au clic sur le bouton de bascule
toggleButton1.addEventListener('click', function () {
  if (layer1Visible) {
    // Masquer la couche 1 si elle est actuellement visible
    map.removeLayer(individusLayer);
    map.removeLayer(polyline); // Supprimer la polyligne lorsque la couche est masquée
    layer1Visible = false;
    // Mettre à jour l'icône du bouton
    toggleButton1.innerHTML = '<i class="far fa-eye-slash"></i>';
  } else {
    // Afficher la couche 1 si elle est actuellement masquée
    individusLayer.addTo(map);
    if (polyline) {
      map.addLayer(polyline); // Ajouter la polyligne lorsque la couche est affichée
    }
    layer1Visible = true;
    // Mettre à jour l'icône du bouton
    toggleButton1.innerHTML = '<i class="far fa-eye"></i>';
  }
});

// Ajout d'un écouteur d'événements au clic sur le bouton de bascule pour la couche 2
toggleButton2.addEventListener('click', function () {
  if (layer2Visible) {
    // Masquer la couche 2 si elle est actuellement visible
    map.removeLayer(fukushimaLayer);
    layer2Visible = false;
    // Mettre à jour l'icône du bouton
    toggleButton2.innerHTML = '<i class="far fa-eye-slash"></i>';
  } else {
    // Afficher la couche 2 si elle est actuellement masquée
    fukushimaLayer.addTo(map);
    layer2Visible = true;
    // Mettre à jour l'icône du bouton
    toggleButton2.innerHTML = '<i class="far fa-eye"></i>';
  }
});

function zoomToJapan() {
  // Définir une étendue qui couvre l'ensemble du Japon
  var bounds = [
    [20.0, 122.0], // Coin sud-ouest
    [45.0, 155.0]  // Coin nord-est
  ];

  // Centrer et zoomer sur l'ensemble du Japon
  map.fitBounds(bounds, { padding: [50, 50] }); // Vous pouvez ajuster le padding selon vos besoins
}

function zoomToFukushima() {
  map.setView([37.7749, 140.4674], 10); // Centrer sur Fukushima
}

var individusLayer = L.geoJSON().addTo(map);
var polyline = null; // Déclaration de la variable globale pour la polyligne

// Utiliser Fetch pour charger le fichier GeoJSON
function addindividusLayer(url) {
  // Utiliser Fetch pour charger le fichier GeoJSON depuis l'URL spécifiée
  fetch(url)
    .then(response => {
      // Vérifier si la réponse est OK (code de statut 200)
      if (!response.ok) {
        throw new Error('Erreur lors du chargement du fichier GeoJSON');
      }
      // Convertir la réponse en JSON
      return response.json();
    })
    .then(jsonData => {
      // Stocker les données dans la variable data globale
      data = jsonData;

      // Événement de changement sur le formulaire de sélection d'année
      document.getElementById('id_dilemSelect').addEventListener('change', function () {
        var selectedid_dilem = this.value;
        // Vérifier si une option a été sélectionnée
        if (selectedid_dilem !== "") {
          // Supprimer la couche GeoJSON existante s'il y en a une
          if (individusLayer) {
            map.removeLayer(individusLayer);
          }
          // Création de la couche GeoJSON si une option est sélectionnée
          individusLayer = L.geoJSON(data, {
            pointToLayer: function (feature, latlng) {
              // Personnalisez le marqueur pour chaque point
              return L.circleMarker(latlng, {
                radius: 8,
                fillColor: 'blue',
                color: '#000',
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
              });
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
          if (individusLayer) {
            map.removeLayer(individusLayer);
          }
          // Appeler updateData() avec un argument vide pour supprimer les lignes
          updateData("");
        }
      });
    })
    .catch(error => {
      console.error('Erreur de chargement des données :', error);
    });
}

// Fonction pour mettre à jour les éléments de la couche GeoJSON en fonction de l'ID sélectionné
function updateData(id_dilem) {
  individusLayer.clearLayers();
  var filteredFeatures = data.features.filter(function (feature) {
    return feature.properties.ID_DILEM === id_dilem;
  });
  console.log('Nombre de points filtrés par l\'ID', id_dilem, ':', filteredFeatures.length);
  individusLayer.addData({ type: 'FeatureCollection', features: filteredFeatures });

  // Supprimer la polyligne si elle existe
  if (polyline) {
    map.removeLayer(polyline);
    polyline = null;
  }

  // Créer une nouvelle polyligne entre les points avec des flèches
  var points = [];
  individusLayer.eachLayer(function (layer) {
    points.push(layer.getLatLng());
  });

  polyline = L.polyline(points, {
    color: 'red',
    weight: 2,
    opacity: 0.7,
    dashArray: '5, 10' // Optionnel : un trait en pointillés
  });

  if (layer1Visible) {
    // Ajouter la polyligne si la couche est actuellement affichée
    polyline.addTo(map);
  }
}
// Appel de la fonction addindividusLayer avec l'URL de votre fichier GeoJSON
addindividusLayer("data/individus.geojson");



var fukushimaLayer = L.geoJSON().addTo(map);

function addFukushimaLayer(url) {
  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('Erreur lors du chargement du fichier GeoJSON');
      }
      return response.json();
    })
    .then(jsonData => {
      dataFukushima = jsonData;

      // Événement de changement sur le formulaire de sélection d'année
      document.getElementById('id_dilemSelect').addEventListener('change', function () {
        var selectedid_dilem = this.value;
        if (selectedid_dilem !== "") {
          if (fukushimaLayer) {
            map.removeLayer(fukushimaLayer);
          }
          fukushimaLayer = L.geoJSON(dataFukushima, {
            style: function (feature) {
              return {
                fillColor: feature.properties.Zone === 1 ? 'lightgreen' : 'darkred',
                color: '#000',
                weight: 2,
                opacity: 1,
                fillOpacity: 0.5
              };
            }
          });

          // Mettre à jour les entités Fukushima lors de la sélection d'une option
          updateFukushima(selectedid_dilem);
        }
      });
    })
    .catch(error => {
      console.error('Erreur de chargement des données :', error);
    });
}

function updateFukushima(id_dilem, year) {
  if (!fukushimaLayer) {
    return; // Sortie si la couche Fukushima n'a pas été ajoutée
  }

  fukushimaLayer.clearLayers();
  var filteredFeatures = dataFukushima.features.filter(function (feature) {
    return feature.properties.ID_DILEM === id_dilem && feature.properties.Annee === 2013; // Filtrer par année 2013
  });
  console.log('Nombre de dessins filtrés par l\'ID', id_dilem, 'et année 2013 :', filteredFeatures.length);
  fukushimaLayer.addData({ type: 'FeatureCollection', features: filteredFeatures });

  // Ajouter la couche Fukushima à la carte si elle n'est pas déjà ajoutée
  if (!map.hasLayer(fukushimaLayer)) {
    fukushimaLayer.addTo(map);
  }
}

// Appel de la fonction addFukushimaLayer avec l'URL de votre fichier GeoJSON
addFukushimaLayer("data/fukushima.geojson");