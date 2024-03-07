function create(){
    var creaalgo = document.createElement("div");
    var texto = document.createTextNode("Hola como estas?, por cierto te meti virus :)");
    creaalgo.appendChild(texto);
    var prueba = document.getElementById("div1");
    document.body.insertBefore(creaalgo, prueba);
}