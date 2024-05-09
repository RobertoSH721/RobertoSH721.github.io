function init() {
    var $ = go.GraphObject.make; // for conciseness in defining templates

    myDiagram = new go.Diagram('myDiagramDiv', {
      validCycle: go.CycleMode.NotDirected, // don't allow loops
      'undoManager.isEnabled': true,
    });

    myDiagram.toolManager.mouseDownTools.add(
      new RowResizingTool({
        doResize: function (rowdef, height) {
          const panel = rowdef.panel.elt(rowdef.index);
          if (panel) {
            const tb = panel.findObject('TB');
            if (tb) tb.height = height;
          }
          rowdef.height = height;
        },
      })
    );
    myDiagram.toolManager.mouseDownTools.add(new ColumnResizingTool());

    // This template is a Panel that is used to represent each item in a Panel.itemArray.
    // The Panel is data bound to the item object.
    var fieldTemplate = $(go.Panel,
      'TableRow', // this Panel is a row in the containing Table
      new go.Binding('portId', 'name'), // this Panel is a "port"
      {
        background: 'transparent', // so this port's background can be picked by the mouse
        fromSpot: go.Spot.Right, // links only go from the right side to the left side
        toSpot: go.Spot.Left,
        // allow drawing links from or to this port:
        fromLinkable: true,
        toLinkable: true,
      },
      $(go.Shape,
        {
          column: 0,
          width: 12,
          height: 12,
          margin: 4,
          // but disallow drawing links from or to this shape:
          fromLinkable: false,
          toLinkable: false,
        },
        new go.Binding('figure', 'figure'),
        new go.Binding('fill', 'color')
      ),
      $(go.TextBlock,
        {
          name: 'TB',
          column: 1,
          margin: new go.Margin(0, 2),
          stretch: go.Stretch.Horizontal,
          font: 'bold 13px sans-serif',
          wrap: go.Wrap.None,
          overflow: go.TextOverflow.Ellipsis,
          // and disallow drawing links from or to this text:
          fromLinkable: false,
          toLinkable: false,
        },
        new go.Binding('height').makeTwoWay(),
        new go.Binding('text', 'name')
      ),
      $(go.TextBlock,
        {
          column: 2,
          margin: new go.Margin(0, 2),
          stretch: go.Stretch.Horizontal,
          font: '13px sans-serif',
          maxLines: 3,
          overflow: go.TextOverflow.Ellipsis,
          editable: true,
        },
        new go.Binding('text', 'info').makeTwoWay()
      )
    );

    // Return initialization for a RowColumnDefinition, specifying a particular column
    // and adding a Binding of RowColumnDefinition.width to the IDX'th number in the data.widths Array
    function makeWidthBinding(idx) {
      // These two conversion functions are closed over the IDX variable.
      // This source-to-target conversion extracts a number from the Array at the given index.
      function getColumnWidth(arr) {
        if (Array.isArray(arr) && idx < arr.length) return arr[idx];
        return NaN;
      }
      // This target-to-source conversion sets a number in the Array at the given index.
      function setColumnWidth(w, data) {
        var arr = data.widths;
        if (!arr) arr = [];
        if (idx >= arr.length) {
          for (var i = arr.length; i <= idx; i++) arr[i] = NaN; // default to NaN
        }
        arr[idx] = w;
        return arr; // need to return the Array (as the value of data.widths)
      }
      return [{ column: idx }, new go.Binding('width', 'widths', getColumnWidth).makeTwoWay(setColumnWidth)];
    }

    // This template represents a whole "record".
    myDiagram.nodeTemplate = $(go.Node,
      'Auto',
      new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),
      // this rectangular shape surrounds the content of the node
      $(go.Shape, { fill: '#F9EFBC' }),//color del tablero
      // the content consists of a header and a list of items
      $(go.Panel,
        'Vertical',
        { stretch: go.Stretch.Horizontal, margin: 0.5 },
        // this is the header for the whole node
        $(go.Panel,
          'Auto',
          { stretch: go.Stretch.Horizontal }, // as wide as the whole node
          $(go.Shape, { fill: '#9E8818', strokeWidth: 0 }),
          $(go.TextBlock,
            {
              alignment: go.Spot.Center, //estilo de la primera fila
              margin: 3,
              stroke: 'white',
              textAlign: 'center',
              font: 'bold 12pt sans-serif',
            },
            new go.Binding('text', 'key')
          )
        ),
        // this Panel holds a Panel for each item object in the itemArray;
        // each item Panel is defined by the itemTemplate to be a TableRow in this Table
        $(go.Panel,
          'Table',
          {
            name: 'TABLE',
            stretch: go.Stretch.Horizontal,
            minSize: new go.Size(100, 10),
            defaultAlignment: go.Spot.Left,
            defaultStretch: go.Stretch.Horizontal,
            defaultColumnSeparatorStroke: 'teal',
            defaultRowSeparatorStroke: 'teal',
            itemTemplate: fieldTemplate,
          },
          $(go.RowColumnDefinition, makeWidthBinding(0)),
          $(go.RowColumnDefinition, makeWidthBinding(1)),
          $(go.RowColumnDefinition, makeWidthBinding(2)),
          new go.Binding('itemArray', 'fields')
        ) // end Table Panel of items
      ) // end Vertical Panel
    ); // end Node

    myDiagram.linkTemplate = $(go.Link,
      { relinkableFrom: true, relinkableTo: true, toShortLength: 4 }, // let user reconnect links
      $(go.Shape, { stroke: "DarkRed" ,strokeWidth: 2 }),
      $(go.Shape, { toArrow: "chevron", stroke: "MediumSlateBlue", strokeWidth: 3 })
    );

    myDiagram.model = new go.GraphLinksModel({
      copiesArrays: true,
      copiesArrayObjects: true,
      linkFromPortIdProperty: 'fromPort',
      linkToPortIdProperty: 'toPort',
      // automatically update the model that is shown on this page
      Changed: (e) => {
        if (e.isTransactionFinished) /*showModel()*/;
      },
      nodeDataArray: [
        {
          key: 'Espacio de Direcciones Virtuales',
          widths: [50, NaN, 30],
          fields: [
            { name: 'R60&R64', info: 'X', color: 'blue', figure: 'Rectangle' },
            { name: 'Z56&Z60', info: 'X', color: 'white', figure: 'Ellipse' },
            { name: 'Y52&Y56', info: 'X', color: 'yellow', figure: 'Diamond' },
            { name: 'O36&O40', info: 'X', color: 'lime', figure: 'Ellipse' },
            { name: 'D28&M32', info: '7', color: 'Indigo', figure: 'Diamond' },
            { name: 'B48&B52', info: 'X', color: 'SeaGreen', figure: 'Rectangle' },
            { name: 'V20&V24', info: '5', color: 'DarkKhaki', figure: 'Diamond' },
            { name: 'F44&F48', info: 'X', color: 'OliveDrab', figure: 'Ellipse' },
            { name: 'L40&L44', info: 'X', color: 'red', figure: 'Diamond' },
            { name: 'G32&G36', info: 'X', color: 'green', figure: 'Ellipse' },
            { name: 'K12&K16', info: '3', color: 'Crimson', figure: 'Ellipse' },
            { name: 'J16&J20', info: '4', color: 'DarkOrange', figure: 'Rectangle' },
            { name: 'R0&R4', info: '0', color: 'MediumSlateBlue', figure: 'Ellipse' },
            { name: 'S24&S28', info: '6', color: 'Gold', figure: 'Rectangle' },
            { name: 'W4&W8', info: '1', color: 'DarkMagenta', figure: 'Diamond' },
            { name: 'M8&M12', info: '2', color: 'SpringGreen', figure: 'Rectangle' }
          ],
          loc: '0 0',
        },
        {
          key: 'Direccion de Memoria Fisica',
          widths: [50, NaN, 30],
          fields: [
            { name: 'D28&M32', info: '7', color: 'Indigo', figure: 'Diamond' },
            { name: 'S24&S28', info: '6', color: 'Gold', figure: 'Rectangle' },
            { name: 'V20&V24', info: '5', color: 'DarkKhaki', figure: 'Diamond' },
            { name: 'J16&J20', info: '4', color: 'DarkOrange', figure: 'Rectangle' },
            { name: 'K12&K16', info: '3', color: 'Crimson', figure: 'Ellipse' },
            { name: 'M8&M12', info: '2', color: 'SpringGreen', figure: 'Rectangle' },
            { name: 'W4&W8', info: '1', color: 'DarkMagenta', figure: 'Diamond' },
            { name: 'R0&R4', info: '0', color: 'MediumSlateBlue', figure: 'Ellipse' },
          ],
          loc: '350 0',
        },
      ],
      linkDataArray: [
        { from: 'Espacio de Direcciones Virtuales', fromPort: 'D28&M32', to: 'Direccion de Memoria Fisica', toPort: 'D28&M32' },
        { from: 'Espacio de Direcciones Virtuales', fromPort: 'S24&S28', to: 'Direccion de Memoria Fisica', toPort: 'S24&S28' },
        { from: 'Espacio de Direcciones Virtuales', fromPort: 'V20&V24', to: 'Direccion de Memoria Fisica', toPort: 'V20&V24' },
        { from: 'Espacio de Direcciones Virtuales', fromPort: 'J16&J20', to: 'Direccion de Memoria Fisica', toPort: 'J16&J20' },
        { from: 'Espacio de Direcciones Virtuales', fromPort: 'K12&K16', to: 'Direccion de Memoria Fisica', toPort: 'K12&K16' },
        { from: 'Espacio de Direcciones Virtuales', fromPort: 'M8&M12', to: 'Direccion de Memoria Fisica', toPort: 'M8&M12' },
        { from: 'Espacio de Direcciones Virtuales', fromPort: 'W4&W8', to: 'Direccion de Memoria Fisica', toPort: 'W4&W8' },
        { from: 'Espacio de Direcciones Virtuales', fromPort: 'R0&R4', to: 'Direccion de Memoria Fisica', toPort: 'R0&R4' },
      ],
    });

    // showModel();  show the diagram's initial model

    /*function showModel() {
      document.getElementById('mySavedModel').textContent = myDiagram.model.toJson();
    }*/
  }
  window.addEventListener('DOMContentLoaded', init);