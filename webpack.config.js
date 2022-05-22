var path = require("path");
var pathToPhaser = path.join(__dirname, "/node_modules/phaser/");
var phaser = path.join(pathToPhaser, "dist/phaser.js");

module.exports = {
  entry: "./src/game.ts",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          {
            loader: "ts-loader", options: {
            }
          }
        ],
        rules: [
          {
            exclude: "/node_modules/"
          }
        ]
      },
    ]
  },
  devServer: {
    devMiddleware: {
      publicPath: "/dist/",
    },
    static: path.resolve(__dirname, "./"),
    host: "127.0.0.1",
    port: 8080,
    open: true
  },
  resolve: {
    extensions: [".ts", ".js"],
    alias: {
      phaser: phaser
    }
  }
};
