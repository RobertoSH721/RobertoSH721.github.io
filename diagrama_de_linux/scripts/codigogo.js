function init() {

  // Since 2.2 you can also author concise templates with method chaining instead of GraphObject.make
  // For details, see https://gojs.net/latest/intro/buildingObjects.html
  const $ = go.GraphObject.make;  // for conciseness in defining templates

  // some constants that will be reused within templates
  var mt8 = new go.Margin(8, 0, 0, 0);
  var mr8 = new go.Margin(0, 8, 0, 0);
  var ml8 = new go.Margin(0, 0, 0, 8);
  var roundedRectangleParams = {
    parameter1: 2,  // set the rounded corner
    spot1: go.Spot.TopLeft, spot2: go.Spot.BottomRight  // make content go all the way to inside edges of rounded corners
  };

  myDiagram =
    new go.Diagram("myDiagramDiv",  // the DIV HTML element
      {
        // Put the diagram contents at the top center of the viewport
        initialDocumentSpot: go.Spot.Top,
        initialViewportSpot: go.Spot.Top,
        // OR: Scroll to show a particular node, once the layout has determined where that node is
        // "InitialLayoutCompleted": e => {
        //  var node = e.diagram.findNodeForKey(28);
        //  if (node !== null) e.diagram.commandHandler.scrollToPart(node);
        // },
        layout:
          $(go.TreeLayout,  // use a TreeLayout to position all of the nodes
            {
              isOngoing: false,  // don't relayout when expanding/collapsing panels
              treeStyle: go.TreeLayout.StyleLastParents,
              // properties for most of the tree:
              angle: 90,
              layerSpacing: 80,
              // properties for the "last parents":
              alternateAngle: 0,
              alternateAlignment: go.TreeLayout.AlignmentStart,
              alternateNodeIndent: 15,
              alternateNodeIndentPastParent: 1,
              alternateNodeSpacing: 15,
              alternateLayerSpacing: 40,
              alternateLayerSpacingParentOverlap: 1,
              alternatePortSpot: new go.Spot(0.001, 1, 20, 0),
              alternateChildPortSpot: go.Spot.Left
            })
      });

  // This function provides a common style for most of the TextBlocks.
  // Some of these values may be overridden in a particular TextBlock.
  function textStyle(field) {
    return [
      {
        font: "12px Roboto, sans-serif", stroke: "white", //color del texto 
        visible: false  // only show textblocks when there is corresponding data for them
      },
      new go.Binding("visible", field, val => val !== undefined)
    ];
  }

  // define Converters to be used for Bindings
  function theNationFlagConverter(nation) {
    return "https://www.nwoods.com/images/emojiflags/" + nation + ".png";
  }

  // define the Node template
  myDiagram.nodeTemplate =
    $(go.Node, "Auto",
      {
        locationSpot: go.Spot.Top,
        isShadowed: true, shadowBlur: 1,
        shadowOffset: new go.Point(0, 1),
        shadowColor: "rgba(0, 0, 0, .14)",
        selectionAdornmentTemplate:  // selection adornment to match shape of nodes
          $(go.Adornment, "Auto",
            $(go.Shape, "RoundedRectangle", roundedRectangleParams,
              { fill: null, stroke: "#7986cb", strokeWidth: 3 }
            ),
            $(go.Placeholder)
          )  // end Adornment
      },
      $(go.Shape, "RoundedRectangle", roundedRectangleParams, // color del rectangulo
        { name: "SHAPE", fill: "#ffffff", strokeWidth: 0 },
        // gold if highlighted, white otherwise
        new go.Binding("fill", "isHighlighted", h => h ? "gold" : "#1c6c4c").ofObject()
      ),
      $(go.Panel, "Vertical",
        $(go.Panel, "Horizontal",
          { margin: 8 },
            (new go.Picture(//Poner imagenes
              { margin: 10, width: 250, height: 180, background: "black" })
              .bind("source")),
          $(go.Panel, "Table",
            $(go.TextBlock,
              {
                row: 0, alignment: go.Spot.Left,
                font: "bold 28px Roboto, sans-serif",
                stroke: "black", //caracteristicas del titulo o nombre
                maxSize: new go.Size(160, NaN)
              },
              new go.Binding("text", "name")
            ),
            $(go.TextBlock, textStyle("info"),
              {
                row: 1, alignment: go.Spot.Left,
                font: "15px Roboto, sans-serif", //caracteristicas de la info
                maxSize: new go.Size(160, NaN)
              },
              new go.Binding("text", "info")
            ),
            $("PanelExpanderButton", "INFO",
              { row: 0, column: 1, rowSpan: 2, margin: ml8 }
            )
          )
        ),
        $(go.Shape, "LineH",
          {
            stroke: "white", strokeWidth: 1, // linea que separa el cuadro
            height: 1, stretch: go.GraphObject.Horizontal
          },
          new go.Binding("visible").ofObject("INFO")  // only visible when info is expanded
        ),
        $(go.Panel, "Vertical",
          {
            name: "INFO",  // identify to the PanelExpanderButton
            stretch: go.GraphObject.Horizontal,  // take up whole available width
            margin: 8,
            defaultAlignment: go.Spot.Left,  // thus no need to specify alignment on each element
          },
          $(go.TextBlock, textStyle("Origina"),
            new go.Binding("text", "Origina")
          ),
          $(go.TextBlock, textStyle("unir"),
            new go.Binding("margin", "Origina", head => mt8), // some space above if there is also a Origina value
            new go.Binding("text", "unir", unir => {
              var unir = myDiagram.model.findNodeDataForKey(unir);
              /*if (unir !== null) {
                return "Proviene de: " + unir.name;
              }
              return "";*/
            })
          )
        )
      )
    );

  // define the Link template, a simple orthogonal line
  myDiagram.linkTemplate =
    $(go.Link, go.Link.Orthogonal,
      { corner: 5, selectable: false },
      $(go.Shape, { strokeWidth: 3, stroke: "black" }));  // color de las lineas del arbol


  // set up the nodeDataArray, describing each person/position
  var nodeDataArray = [
    { key: 0, name: "Linux", source: "./imagenes/Linux.png", info: "Linux® es un sistema operativo, en 1991, Linus Torvalds lo diseñó y creó a modo de pasatiempo. Mientras estaba en la universidad", Origina: "Creador: Linus Torvalds" },
    { key: 1, unir: 0, name: "Debian:", source: "./imagenes/debian.png", info: "Debian es una distribución universal y flexible que enfatiza el software libre.", Origina: "Proviene de Linux"},
    { key: 2, unir: 0, name: "RedHat:", source: "./imagenes/redhat.png", info: "Red Hat Enterprise Linux (RHEL) es una distribución empresarial ampliamente utilizada.", Origina: "Proviene de Linux" },
    { key: 3, unir: 1, name: "Ubuntu:", source: "./imagenes/ubuntu.png", info: "Basada en Debian, Ubuntu es popular para usuarios de escritorio y servidores.", Origina: "Se originan de Debian"},
    { key: 4, unir: 1, name: "Linux Mint:", source: "./imagenes/linuxmint.png", info: "Linux Mint ofrece una experiencia de usuario amigable y completa.", Origina: "Se originan de Debian"},
    { key: 5, unir: 0, name: "SUSE:", source: "./imagenes/suse.png", info: "SUSE Linux Enterprise Server (SLES) es una distribución empresarial con soporte a largo plazo.", Origina: "Proviene de Linux"},
    { key: 6, unir: 0, name: "Arch Linux:", source: "./imagenes/archlinux.png", info: "Arch es una distribución rolling release, altamente personalizable y orientada a usuarios avanzados.", Origina: "Proviene de Linux"},
    { key: 7, unir: 0, name: "Kali Linux:", source: "./imagenes/kalilinux.png", info: "Diseñada para pruebas de penetración y seguridad, Kali Linux incluye herramientas específicas para auditorías.", Origina: "Proviene de Linux"},
    { key: 8, unir: 3, name: "Pop! OS:", source: "./imagenes/popos.png", info: "Desarrollada por System76, Pop! OS está basada en Ubuntu y se enfoca en la productividad y la creatividad.", Origina: "Se origina por Ubuntu"},
    { key: 9, unir: 3, name: "Xubuntu:", source: "./imagenes/xubuntu.png", info: " Es ligero, rápido y diseñado para funcionar bien en hardware más antiguo.", Origina: "Se origina por Ubuntu"},
    { key: 10, unir: 3, name: "Lubuntu:", source: "./imagenes/lubuntu.png", info: "Está diseñado para ser ligero y eficiente, ideal para computadoras con recursos limitados.", Origina: "Se origina por Ubuntu"},
    { key: 11, unir: 3, name: "Kubuntu:", source: "./imagenes/kubuntu.png", info: "Ofrece una apariencia y sensación más agradable que Ubuntu, con la flexibilidad para personalizar el escritorio.", Origina: "Se origina por Ubuntu"},
    { key: 12, unir: 0, name: "Android:", source: "./imagenes/android.png", info: "Sistema operativo móvil basado en el kernel de Linux, utilizado en teléfonos y tabletas.", Origina: "Proviene de Linux"},
    { key: 13, unir: 0, name: "MacOS:", source: "./imagenes/macos.png", info: "MacOS y Linux comparten similitudes debido a sus raíces Unix, pero no comparten el mismo código. Ambos ofrecen experiencias de usuario similares, pero difieren en licencia, hardware y desarrollo.", Origina: "Creador: Apple"},
    { key: 14, unir: 0, name: "iOS:", source: "./imagenes/ios.png", info: "iOS y Linux comparten algunas similitudes debido a sus raíces Unix, son sistemas operativos distintos con objetivos y enfoques diferentes.", Origina: "Creador: Apple"}

  ]
  // create the Model with data for the tree, and assign to the Diagram
  myDiagram.model =
    new go.TreeModel(
      {
        nodeParentKeyProperty: "unir",  // this property refers to the parent node data
        nodeDataArray: nodeDataArray
      });

  // Overview
  myOverview =
    new go.Overview("myOverviewDiv",  // the HTML DIV element for the Overview
      { observed: myDiagram, contentAlignment: go.Spot.Center });   // tell it which Diagram to show and pan
}

// the Search functionality highlights all of the nodes that have at least one data property match a RegExp
function searchDiagram() {  // called by button
  var input = document.getElementById("mySearch");
  if (!input) return;
  myDiagram.focus();

  myDiagram.startTransaction("highlight search");

  if (input.value) {
    // search four different data properties for the string, any of which may match for success
    // create a case insensitive RegExp from what the user typed
    var safe = input.value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    var regex = new RegExp(safe, "i");
    var results = myDiagram.findNodesByExample({ name: regex },
      { nation: regex },
      { info: regex },
      { Origina: regex });
    myDiagram.highlightCollection(results);
    // try to center the diagram at the first node that was found
    if (results.count > 0) myDiagram.centerRect(results.first().actualBounds);
  } else {  // empty string only clears highlighteds collection
    myDiagram.clearHighlighteds();
  }

  myDiagram.commitTransaction("highlight search");
}
window.addEventListener('DOMContentLoaded', init);

/*const $ = go.GraphObject.make;  // for conciseness in defining templates

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
  { key: "Linux" , source: "./imagenes/protoestrella.jpg"}, 
  //{ key: "Enana Marron", source: "./imagenes/Enana_Marron.jpg" }, 
  //{ key: "Enana Roja", source: "./imagenes/Enana_Roja.jpg" }, { key: "Estrella Media", source: "./imagenes/sol.jpg" }, { key: "Estrella Masiva", source: "./imagenes/estrella_masiva.jpg"},
  //{ key: "Enana Blanca", source: "./imagenes/Enana_Blanca.jpg" }, { key: "Gigante Roja", source: "./imagenes/Gigante_roja.jpg" }, { key: "Super Gigante Roja", source: "./imagenes/super_gigante_roja.jpg" }, 
  //{ key: "Nebulosa Planetaria", source: "./imagenes/nebulosa_planetaria.jpg" }, { key: "Supernova", source: "./imagenes/supernova.jpg" },
  //{ key: "Estrella de Neutrones", source: "./imagenes/estrella_de_neutrones.jpg" }, { key: "Magnetar", source: "./imagenes/magnetar.jpg" }, {key: "Pulsar", source: "./imagenes/pulsar.jpg"},
  //{ key: "Agujero Negro", source: "./imagenes/agujero_negro.jpg"}
  
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
*/