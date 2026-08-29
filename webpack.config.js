const path = require("path");
const fs = require("fs");

const files = fs
  .readdirSync("./src", { recursive: true })
  .filter(
    (path) =>
      !path.endsWith(".d.ts") && (path.endsWith(".ts") || path.endsWith(".tsx"))
  )
  .map((path) => "./src/" + path)
  .reduce((prev, path) => {
    prev[path.replace("./src/", "").replace(".tsx", "").replace(".ts", "")] =
      path;
    return prev;
  }, {});

module.exports = {
  mode: "production",
  target: "node",
  entry: files,
  output: {
    filename: "[name].js",
    library: {
      type: "commonjs2",
    },
  },
  optimization: {
    splitChunks: {
      chunks: "all",
    },
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx", ".json", ".scss"],
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: "swc-loader",
      },
      {
        test: /\.module\.scss$/, // Target .module.scss files
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              modules: true,
              importLoaders: 2,
            },
          },
          "sass-loader",
        ],
      },
    ],
  },
  externals: {
    react: "react",
    "react-dom": "react-dom",
    next: "next",
    "next/router": "next/router",
  },
};
