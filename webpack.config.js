const path = require("path");
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CompressionWebpackPlugin = require("compression-webpack-plugin"); // comprime todos nuestros assets de manera que tengan un peso adecuado a la hora de salir a producción
const TerserPlugin = require("terser-webpack-plugin"); // usa terser para minificar archivos js
const ManifestPlugin = require("webpack-manifest-plugin"); // sirve para producción, cuando se contruye el build se crea un archivo manifest.json donde relaciona nombre de archivo original y hace referencia al destino final con hash de donde está el archivo
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

require("dotenv").config();

const isDev = process.env.ENV === "development";
const entry = ["./src/frontend/index.js"];

if (isDev) {
  entry.push(
    "webpack-hot-middleware/client?path=/__webpack_hmr&timeout=2000&reload=true"
  );
}

module.exports = {
  entry,
  mode: process.env.ENV,
  output: {
    path: path.resolve(__dirname, "src/server/public"),
    filename: isDev ? "assets/app.js" : "assets/app-[hash].js",
    publicPath: "/",
  },
  resolve: {
    extensions: [".js", ".jsx"],
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
    // con vendorfiles vas a abstraer tus archivos y vas a separar la lógica que estás programando de los archivos que estás importando en un archivo vendor que va ser cargado de manera diferente
    // básicamente tu archivo vendor serían todas las dependencias que tiene el desarrollo
    // Realizando Code Splitting podemos generar dos archivos:
    // app.js: va a contener solamente el código de la aplicación.
    // vendor.js: dentro va a tener todo el código de las dependencias.
    // Esto trae grandes ventajas en producción pues podemos aprovechar el caché del navegador para alojar nuestro vendor.js y con ello cada vez que un cliente quiera acceder de nuevo a nuestro sitio, solamente tenga que descargar los archivos que hayan cambiado, o sea, el archivo app.js.
    splitChunks: {
      chunks: "async", // se especifica que son asíncronos
      name: true,
      cacheGroups: {
        // se indica que grupos de cache se van a tomar para hacer el vedorfile
        vendors: {
          name: "vendors",
          chunks: "all",
          reuseExistingChunk: true,
          priority: 1,
          filename: isDev ? "assets/vendor.js" : "assets/vendor-[hash].js",
          enforce: true, // ejecuturá vendors siempre y si no sucede, se romperá el proceso para que no pueda seguir y la aplicación falle
          test(module, chunks) {
            const name = module.nameForCondition && module.nameForCondition();
            return chunks.some(
              (chunk) =>
                chunk.name != "vendors" && /[\\/]node_modules[\\/]/.test(name)
            );
          },
        },
      },
    },
  },
  module: {
    rules: [
      {
        enforce: "pre",
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: "eslint-loader",
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.(s*)css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          "css-loader",
          "sass-loader",
        ],
      },
      {
        test: /\.(png|gif|svg)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "assets/[hash].[ext]",
            },
          },
        ],
      },
    ],
  },
  devServer: {
    historyApiFallback: true,
  },
  plugins: [
    isDev ? new webpack.HotModuleReplacementPlugin() : () => {},
    isDev
      ? () => {}
      : new CompressionWebpackPlugin({
          test: /\.js$|\.css$/,
          filename: "[path].gz",
        }),
    isDev ? () => {} : new ManifestPlugin(),
    new MiniCssExtractPlugin({
      filename: isDev ? "assets/app.css" : "assets/app-[hash].css",
    }),
    isDev
      ? () => {}
      : new CleanWebpackPlugin({
          cleanOnceBeforeBuildPatterns: path.resolve(
            __dirname,
            "src/server/public"
          ),
        }),
  ],
};
