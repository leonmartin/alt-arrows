"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "alt-arrows" is now active!');
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    // let disposable = vscode.commands.registerCommand('alt-arrows.helloWorld', () => {
    // The code you place here will be executed every time your command is executed
    // Display a message box to the user
    // vscode.window.showInformationMessage('Hello World from alt-arrows!');
    // });
    // context.subscriptions.push(disposable);
    let altPlusRight = vscode.commands.registerCommand("alt-arrows.altPlusRight", () => {
        // The code you place here will be executed every time your command is executed
        // Display a message box to the user
        // vscode.window.showInformationMessage('Hello World from alt-arrows!');
        const editor = vscode.window.activeTextEditor;
        const selText = editor === null || editor === void 0 ? void 0 : editor.document.getText(editor.selection);
        vscode.window.showInformationMessage("alt+right: " + selText);
        editor === null || editor === void 0 ? void 0 : editor.edit((textEditor) => {
            textEditor.delete(new vscode.Range(editor.selection.start, editor.selection.end));
            textEditor.insert(editor.selection.end.translate(0, 1), selText !== null && selText !== void 0 ? selText : "");
        });
        if (editor) {
            editor.selection = new vscode.Selection(editor.selection.start.translate(0, 1), editor.selection.start.translate(0, (selText !== null && selText !== void 0 ? selText : "").length + 1));
        }
    });
    context.subscriptions.push(altPlusRight);
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map