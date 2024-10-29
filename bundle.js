const yazl = require("yazl")
const fs = require("fs")

let zipfile = new yazl.ZipFile()
zipfile.addFile("dist.js", "extension/extension.js")
zipfile.addFile("package.json", "extension/package.json")
zipfile.addFile("README.md", "extension/README.md")
zipfile.addFile("LICENSE", "extension/LICENSE.txt")
//zipfile.addFile("LICENSE-luapls", "extension/LICENSE-luapls.txt")
zipfile.addFile("icon.png", "extension/icon.png")
//zipfile.addFile("luapls.exe", "extension/luapls.exe")

const filename = `luapls-${process.env.npm_package_version}.vsix`
zipfile.outputStream.pipe(fs.createWriteStream(filename)).on("close", function () {
  console.log(`${filename} created`)
})

zipfile.end()
