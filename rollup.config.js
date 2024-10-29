const commonjs = require("@rollup/plugin-commonjs")
const resolve = require("@rollup/plugin-node-resolve")
const terser = require("@rollup/plugin-terser")

module.exports = {
  input: "extension.js",
  output: {
    file: "dist.js",
    format: "cjs"
  },
  plugins: [commonjs(), resolve(), terser()]
}
