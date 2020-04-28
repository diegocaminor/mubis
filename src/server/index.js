require("ignore-styles"); // le dice al servidor que ignore todos los llamados a clases de css porque no hay forma de que se pinte algo con css desde el lado del servidor

require("@babel/register")({
  presets: ["@babel/preset-env", "@babel/preset-react"],
});

// asset-require-hook permite que los assets se carguen desde el servidor y puedan ser enviados al cliente de manera eficiente
// es un hook que nos permite hacer bind en tiempo real de las rutas a las que vamos a hacer referencia en nuestra aplicación express
require("asset-require-hook")({
  extensions: ["jpg", "png", "gif"], // extensiones que va soportar
  name: "/assets/[hash].[ext]", // nombre del archivo con el que saldrá
});

require("./server");
