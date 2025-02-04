// Coordenadas de Santa Catarina e cidades do Contestado
var santaCatarina = [-27.2423, -50.2189];
var cidades = [
    {
        nome: "Caçador",
        coordenadas: [-26.7754, -51.0120],
        cor: "#FF5733", // Cor personalizada
        programacao: [
            { artista: "Banda XYZ", arte: "Show de Rock", horario: "20:00", local: "Praça Central" },
            { artista: "Grupo ABC", arte: "Teatro", horario: "18:00", local: "Teatro Municipal" }
        ]
    },
    {
        nome: "Curitibanos",
        coordenadas: [-27.2826, -50.5814],
        cor: "#33FF57", // Cor personalizada
        programacao: [
            { artista: "Cantor Z", arte: "MPB", horario: "19:30", local: "Parque das Araucárias" }
        ]
    },
    {
        nome: "Canoinhas",
        coordenadas: [-26.1766, -50.3950],
        cor: "#3357FF", // Cor personalizada
        programacao: [
            { artista: "Orquestra Sinfônica", arte: "Concerto Clássico", horario: "21:00", local: "Centro Cultural" }
        ]
    },
    {
        nome: "Lages",
        coordenadas: [-27.8150, -50.3259],
        cor: "#FF33A1", // Cor personalizada
        programacao: [
            { artista: "Grupo de Dança", arte: "Dança Contemporânea", horario: "17:00", local: "Teatro Marajoara" }
        ]
    }
];

// Cria o mapa centrado em Santa Catarina
var map = L.map('map').setView(santaCatarina, 8);

// Adiciona o mapa base do OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Função para exibir a programação
function exibirProgramacao(cidade) {
    var infoDiv = document.getElementById('info');
    var programacaoHTML = `<h3>${cidade.nome}</h3><ul>`;
    cidade.programacao.forEach(function (evento) {
        programacaoHTML += `
             <li>
                 <strong>Artista:</strong> ${evento.artista}<br>
                 <strong>Arte:</strong> ${evento.arte}<br>
                 <strong>Horário:</strong> ${evento.horario}<br>
                 <strong>Local:</strong> ${evento.local}
             </li>`;
    });
    programacaoHTML += "</ul>";
    infoDiv.innerHTML = programacaoHTML;
}

// Adiciona limites municipais (exemplo com GeoJSON)
fetch('https://raw.githubusercontent.com/tbrugz/geodata-br/master/geojson/geojs-42-mun.json')
    .then(response => response.json())
    .then(data => {
        L.geoJSON(data, {
            style: function (feature) {
                // Define a cor padrão para os municípios
                return {
                    color: "#000",
                    weight: 1,
                    opacity: 0.7,
                    fillColor: "#ccc",
                    fillOpacity: 0.5
                };
            },
            onEachFeature: function (feature, layer) {
                // Verifica se o município é uma das cidades do Contestado
                var cidadeContestado = cidades.find(cidade => cidade.nome === feature.properties.name);
                if (cidadeContestado) {
                    // Define a cor personalizada para o município
                    layer.setStyle({ fillColor: cidadeContestado.cor });

                    // Adiciona interação ao passar o mouse
                    layer.on('mouseover', function () {
                        this.setStyle({ fillColor: "orange" }); // Destaca ao passar o mouse
                        exibirProgramacao(cidadeContestado); // Exibe a programação
                    });

                    // Retorna ao normal ao retirar o mouse
                    layer.on('mouseout', function () {
                        this.setStyle({ fillColor: cidadeContestado.cor }); // Volta à cor original
                        document.getElementById('info').innerHTML = ""; // Limpa a informação
                    });
                }
            }
        }).addTo(map);
    });
