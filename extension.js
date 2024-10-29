/* extension.js © Penguin_Spy 2024
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 * This Source Code Form is "Incompatible With Secondary Licenses", as
 * defined by the Mozilla Public License, v. 2.0.
 *
 * The Covered Software may not be used as training or other input data
 * for LLMs, generative AI, or other forms of machine learning or neural
 * networks.
 */

const vscode = require("vscode")
const lc = require("vscode-languageclient/node")

let client

module.exports.activate = async function (context) {
  console.log("hello world from activate()!")
  const cfg = vscode.workspace.getConfiguration("luapls")

  // TODO: bundle executable, then detect platform with os.platform() and switch which executable is used.
  // alternatively distribute different versions per-platform through the marketplace?

  const executable = cfg.get("executable") //?? context.asAbsolutePath("luapls")
  if(typeof executable !== "string" || executable.length < 1) {
    vscode.window.showErrorMessage("no luapls executable provided", "open settings").then(value => {
      if(value === "open settings") {
        vscode.commands.executeCommand("workbench.action.openSettings", "@id:luapls.executable")
      }
    })
    return
  }
  const lspDebug = cfg.get("trace.server") !== "off"

  console.log("using executable", executable)

  let disposable = vscode.commands.registerCommand("luapls.hello", () => {
    vscode.window.showInformationMessage("haiii :3")
  })

  client = new lc.LanguageClient(
    "luapls", // id
    "luapls", // display name
    { command: executable, args: ["lsp", lspDebug ? "3" : "2"] },
    { // LanguageClient options
      documentSelector: [{ scheme: "file", language: "lua" }]
    }
  )

  await client.start()
  console.log("started client", client)

  context.subscriptions.push(disposable)
}

module.exports.deactivate = function () {
  console.log("deactivate", client)
  if(client !== undefined) {
    client.stop()
  }
  console.log("goodbye from deactivate()")
}
