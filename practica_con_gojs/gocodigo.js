const $ = go.GraphObject.make;  // for conciseness in defining templates

      myDiagram =
        new go.Diagram("myDiagramDiv",  // must be the ID or reference to div
          {
            layout: $(go.GridLayout,
              { comparer: go.GridLayout.smartComparer})
            // other properties are set by the layout function, defined below
          });

myDiagram.nodeTemplate =
  $(go.Node, "Vertical",// poner el nodo en vertical
    $(go.Panel, "Auto",
      $(go.TextBlock,({margin: 12, stroke: "white", font: "bold 16px sans-serif" }),
        new go.Binding("text", "key"))
    ),
    (new go.Picture(//Poner imagenes
      { margin: 10, width: 250, height: 180, background: "black" })
      .bind("source")),
    $("TreeExpanderButton")
  );

  myDiagram.linkTemplate =
  new go.Link()
    .add(new go.Shape({ strokeWidth: 7, stroke: "#da5214" }))

myDiagram.layout = $(go.TreeLayout, { angle: 90 }); // el angle 90 pone el diagrama de forma vertical

var nodeDataArray = [
  { key: "Proestrella" , source: "./imagenes/protoestrella.jpg"}, 
  { key: "Enana Marron", source: "./imagenes/Enana_Marron.jpg" }, 
  { key: "Enana Roja", source: "./imagenes/Enana_Roja.jpg" }, { key: "Estrella Media", source: "./imagenes/sol.jpg" }, { key: "Estrella Masiva", source: "./imagenes/estrella_masiva.jpg"},
  { key: "Enana Blanca", source: "./imagenes/Enana_Blanca.jpg" }, { key: "Gigante Roja", source: "./imagenes/Gigante_roja.jpg" }, { key: "Super Gigante Roja", source: "./imagenes/super_gigante_roja.jpg" }, 
  { key: "Nebulosa Planetaria", source: "./imagenes/nebulosa_planetaria.jpg" }, { key: "Supernova", source: "./imagenes/supernova.jpg" },
  { key: "Estrella de Neutrones", source: "./imagenes/estrella_de_neutrones.jpg" }, { key: "Magnetar", source: "./imagenes/magnetar.jpg" }, {key: "Pulsar", source: "./imagenes/pulsar.jpg"},
  { key: "Agujero Negro", source: "./imagenes/agujero_negro.jpg"}
  
];
var linkDataArray = [
  { from: "Proestrella", to: "Enana Marron" },
  { from: "Proestrella", to: "Enana Roja" },
  { from: "Proestrella", to: "Estrella Media" },
  { from: "Proestrella", to: "Estrella Masiva" },
  { from: "Enana Roja", to: "Enana Blanca" },
  { from: "Estrella Media", to: "Gigante Roja" },
  { from: "Estrella Masiva", to: "Super Gigante Roja" },
  { from: "Gigante Roja", to: "Nebulosa Planetaria" },
  { from: "Super Gigante Roja", to: "Supernova" },
  { from: "Nebulosa Planetaria", to: "Enana Blanca" },
  { from: "Supernova", to: "Pulsar" },
  { from: "Supernova", to: "Estrella de Neutrones" },
  { from: "Supernova", to: "Magnetar" },
  { from: "Estrella de Neutrones", to: "Agujero Negro" },
  { from: "Magnetar", to: "Agujero Negro" }
  
];
myDiagram.model = new go.GraphLinksModel(nodeDataArray, linkDataArray);

/*const myDiagram = new go.Diagram("myDiagramDiv",
{
  "undoManager.isEnabled": true,
  layout: new go.TreeLayout({ angle: 90, layerSpacing: 65})
});

// the template we defined earlier
myDiagram.nodeTemplate =
new go.Node("Vertical",
  { background: "black" })
  .add(new go.Picture(
      { margin: 10, width: 250, height: 180, background: "black" })
      .bind("source"))
  .add(new go.TextBlock("Default Text",
      { margin: 12, stroke: "white", font: "bold 16px sans-serif" })
      .bind("text", "name"));

myDiagram.linkTemplate =
  new go.Link(
    // default routing is go.Link.Normal
    // default corner is 0
    { routing: go.Link.Orthogonal, corner: 5 })
    // the link path, a Shape
    .add(new go.Shape({ strokeWidth: 7, stroke: "#da5214" }))

// the same model as before
myDiagram.model = new go.TreeModel(
[
  { key: "1", name:"Protoestrella", source: "./imagenes/protoestrella.jpg" },
  { key: "2", parent: "1", name: "Enana Marron", source: "./imagenes/Enana_Marron.jpg" },
  { key: "2.1", parent: "1", name: "Enana Roja", source: "./imagenes/Enana_Roja.jpg" },
  { key: "2.2", parent: "1", name: "Estrella Media", source: "./imagenes/sol.jpg" },
  { key: "2.3", parent: "1", name: "Estrella Masiva", source: "./imagenes/estrella_masiva.jpg" },
  { key: "3", parent: "2.1", name: "Enana Blanca", source: "./imagenes/Enana_Blanca.jpg" },
  { key: "3.1", parent: "2.2", name: "Gigante Roja", source: "./imagenes/Gigante_roja.jpg" },
  { key: "3.2", parent: "2.3", name: "Super Gigante Roja", source: "./imagenes/super_gigante_roja.jpg" },
  { key: "4", parent: "3.1", name: "Nebulosa Planetaria", source: "./imagenes/nebulosa_planetaria.jpg" },
  { key: "4.1", parent: "3.2", name: "Super Nova", source: "./imagenes/supernova.jpg" },
  { key: "5", parent: "4", name: "Enana Blanca", source: "./imagenes/Enana_Blanca.jpg" },
  { key: "5.1", parent: "4.1", name: "Estrella de Neutrones", source: "./imagenes/estrella_de_neutrones.jpg" },
  { key: "5.2", parent: "4.1", name: "Magnetar", source: "./imagenes/magnetar.jpg" },
  { key: "6", parent: "5.1", name: "Agujero Negro", source: "./imagenes/" }

]);*/