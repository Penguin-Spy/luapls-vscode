# luapls-vscode
A VS Code extension that adds [luapls](https://github.com/raiguard/luapls/) as a language server for Lua.  
Like luapls, this extension is under development and not ready for use.

# Installing
Download the extension from [GitHub releases](https://github.com/Penguin-Spy/luapls-vscode/releases/latest), then install the .vsix file in VS Code (click the 3 dots in the title of the Extensions menu).  
luapls is not bundled currently, so you will need to [build it yourself](https://github.com/raiguard/luapls/#build) and then provide the path to the executable in VS Code's settings.  
Note that luapls cannot handle Windows-formatted file URIs currently (so it likely won't even launch).

# License
Copyright © Penguin_Spy 2024  

This Source Code Form is subject to the terms of the Mozilla Public
License, v. 2.0. If a copy of the MPL was not distributed with this
file, You can obtain one at https://mozilla.org/MPL/2.0/.
This Source Code Form is "Incompatible With Secondary Licenses", as
defined by the Mozilla Public License, v. 2.0.

The Covered Software may not be used as training or other input data
for LLMs, generative AI, or other forms of machine learning or neural
networks.
