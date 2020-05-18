"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
function activate(context) {
    console.log('"alt-arrows" is now active!');
    let altPlusRight = vscode.commands.registerCommand("alt-arrows.altPlusRight", () => {
        // get active text editor
        const editor = vscode.window.activeTextEditor;
        // get currently selected text
        const selText = editor === null || editor === void 0 ? void 0 : editor.document.getText(editor.selection);
        console.log("alt+right: " + selText);
        // edit text
        editor === null || editor === void 0 ? void 0 : editor.edit((textEditor) => {
            // temporarly delete selected text
            textEditor.delete(new vscode.Range(editor.selection.start, editor.selection.end));
            // insert selected text one character to the right
            textEditor.insert(editor.selection.end.translate(0, 1), selText !== null && selText !== void 0 ? selText : "");
        });
        if (editor) {
            // update selection in editor
            editor.selection = new vscode.Selection(editor.selection.start.translate(0, 1), editor.selection.start.translate(0, (selText !== null && selText !== void 0 ? selText : "").length + 1));
        }
    });
    context.subscriptions.push(altPlusRight);
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map