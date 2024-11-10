const yazl = require("yazl")
const fs = require("fs")
const package = require('./package.json')

// TODO: bundling luapls
const additional_files = [] //[ "LICENSE-luapls", "luapls.exe" ]

let zipfile = new yazl.ZipFile()
zipfile.addFile("dist.js", "extension/extension.js")
zipfile.addFile("package.json", "extension/package.json")
zipfile.addFile("README.md", "extension/README.md")
zipfile.addFile("LICENSE", "extension/LICENSE.txt")
zipfile.addFile(package.icon, `extension/${package.icon}`)

for(const file in additional_files) {
  zipfile.addFile(file, `extension/${file}`)
}

// extension.vsixmanifest, necessary for marketplace, in .zip root
zipfile.addBuffer(`<?xml version="1.0" encoding="utf-8"?>
<PackageManifest Version="2.0.0" xmlns="http://schemas.microsoft.com/developer/vsx-schema/2011" xmlns:d="http://schemas.microsoft.com/developer/vsx-schema-design/2011">
	<Metadata>
		<Identity Language="en-US" Id="${package.name}" Version="${package.version}" Publisher="${package.publisher}" />
		<DisplayName>${package.displayName}</DisplayName>
		<Description xml:space="preserve">${package.description}</Description>
		<Tags>${package.keywords.concat(package.activationEvents.map(e => e.startsWith("onLanguage:") && e.substring(11))).join(',')}</Tags>
		<Categories>${package.categories.join(',')}</Categories>
		<GalleryFlags>Public${package.preview ? " Preview" : ""}</GalleryFlags>
		<License>extension/LICENSE.txt</License>
		<Icon>extension/${package.icon}</Icon>

		<Properties>
			<Property Id="Microsoft.VisualStudio.Code.Engine" Value="${package.engines.vscode}" />
			<Property Id="Microsoft.VisualStudio.Code.ExtensionDependencies" Value="" />
			<Property Id="Microsoft.VisualStudio.Code.ExtensionPack" Value="" />
			<Property Id="Microsoft.VisualStudio.Code.ExtensionKind" Value="workspace" />
			<Property Id="Microsoft.VisualStudio.Code.LocalizedLanguages" Value="" />
			<Property Id="Microsoft.VisualStudio.Code.EnabledApiProposals" Value="" />
			<Property Id="Microsoft.VisualStudio.Code.ExecutesCode" Value="true" />

			<Property Id="Microsoft.VisualStudio.Services.Links.Source" Value="${package.repository?.url}" />
			<Property Id="Microsoft.VisualStudio.Services.Links.Support" Value="${package.bugs?.url}" />

			<Property Id="Microsoft.VisualStudio.Services.GitHubFlavoredMarkdown" Value="true" />
			<Property Id="Microsoft.VisualStudio.Services.Content.Pricing" Value="Free" />
		</Properties>
	</Metadata>
	<Installation>
		<InstallationTarget Id="Microsoft.VisualStudio.Code"/>
	</Installation>
	<Dependencies/>
	<Assets>
		<Asset Type="Microsoft.VisualStudio.Code.Manifest" Path="extension/package.json" Addressable="true" />
		<Asset Type="Microsoft.VisualStudio.Services.Content.Details" Path="extension/README.md" Addressable="true" />
    <Asset Type="Microsoft.VisualStudio.Services.Content.License" Path="extension/LICENSE.txt" Addressable="true" />
		<Asset Type="Microsoft.VisualStudio.Services.Icons.Default" Path="extension/${package.icon}" Addressable="true" />
	</Assets>
</PackageManifest>`, "extension.vsixmanifest")

// [Content_Types].xml, necessary for marketplace, in .zip root
zipfile.addBuffer(`<?xml version="1.0" encoding="utf-8"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension=".json" ContentType="application/json"/><Default Extension=".vsixmanifest" ContentType="text/xml"/><Default Extension=".js" ContentType="application/javascript"/><Default Extension=".md" ContentType="text/markdown"/><Default Extension=".txt" ContentType="text/plain"/><Default Extension=".png" ContentType="image/png"/></Types>`,
  "[Content_Types].xml")

const filename = `${package.name}-${package.version}.vsix`
zipfile.outputStream.pipe(fs.createWriteStream(filename)).on("close", function () {
  console.log(`${filename} created`)
})
zipfile.end()
