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

// https://github.com/microsoft/vscode-languageserver-node/blob/8e6bf18f22b2e83b60a27a51447b99acf98c4381/client/src/common/client.ts#L199
class ErrorHandler {
  error(error, message, repeatErrorCount) {
    // same as the default error handler
    if(repeatErrorCount && repeatErrorCount <= 3) {
      return { action: 1 } // continue
    }
    return { action: 2 } // shutdown
  }

  async closed() {
    let message = client.$state === "starting" ? "luapls failed to start" : "luapls crashed"
    return vscode.window.showErrorMessage(message, "restart", "view output").then(value => {
      if(value === "restart") {
        return { action: 2 }  // restart
      } else if(value === "view output") {
        client.outputChannel.show(true)
      }
      return { action: 1, handled: true } // don't restart, don't spam errors
    })
  }
}

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

  context.subscriptions.push(vscode.commands.registerCommand("luapls.hello", () => {
    vscode.window.showInformationMessage("haiii :3")
  }))
  context.subscriptions.push(vscode.commands.registerCommand("luapls.restart", () => {
    if(client.$state !== "startFailed") { client.restart() }
    else { vscode.window.showInformationMessage("luapls is not running, cannot restart") }
  }))

  client = new lc.LanguageClient(
    "luapls", // id
    "luapls", // display name
    { command: executable, args: ["lsp", lspDebug ? "3" : "2"] }, // 2 is commonlog's debug level, luapls checks for level 3 to enable tracing lsp messages sent/received
    { // LanguageClient options
      documentSelector: [{ scheme: "file", language: "lua" }],
      errorHandler: new ErrorHandler(),
      initializationFailedHandler: () => { client.$state = "stopped"; return false }  // prevent error spam when startup fails
    }
  )
  // intercept this stupid unhelpful error message
  const origError = client.error
  client.error = function (msg, data, show) {
    if(msg === "luapls client: couldn't create connection to server." || msg == "Restarting server failed") return
    origError.call(client, msg, data, show)
  }

  await client.start().catch(e => client.error(e))  // we already deal with the error in ErrorHandler, just log it
  console.log("started client", client)
}

module.exports.deactivate = function () {
  console.log("deactivate", client)
  if(client !== undefined) {
    client.stop()
  }
  console.log("goodbye from deactivate()")
}
