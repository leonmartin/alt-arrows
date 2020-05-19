"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
function moveSelection(direction) {
    // get active text editor
    const editor = vscode.window.activeTextEditor;
    // return if editor is null
    if (!editor) {
        console.log("ERROR: editor is null!");
        return;
    }
    // get currently selected text
    const selText = editor === null || editor === void 0 ? void 0 : editor.document.getText(editor.selection);
    if (selText === "") {
        return;
    }
    console.log("alt+" + direction + ":\t" + selText);
    //
    //
    // ALT+RIGHT
    if (direction === "right") {
        // get next char
        const nextChar = editor.document.getText(new vscode.Range(editor.selection.end, editor.selection.end.translate(0, 1)));
        // return if there is no next char
        if (nextChar === "") {
            return;
        }
        // edit text
        editor.edit((textEditor) => {
            // temporarly delete selected text
            textEditor.delete(new vscode.Range(editor.selection.start, editor.selection.end));
            // insert selected text one character to the right
            textEditor.insert(editor.selection.end.translate(0, 1), selText !== null && selText !== void 0 ? selText : "");
        });
        // update selection in editor
        editor.selection = new vscode.Selection(editor.selection.start.translate(0, 1), editor.selection.start.translate(0, (selText !== null && selText !== void 0 ? selText : "").length + 1));
        //
        //
        // ALT+LEFT
    }
    else if (direction === "left") {
        // return if the selection starts at the beginning of the line
        if (editor.document.offsetAt(editor.selection.start) === 0) {
            return;
        }
        // get previous char
        const prevChar = editor.document.getText(new vscode.Range(editor.selection.start.translate(0, -1), editor.selection.start));
        // return if there is no previous char
        if (prevChar === "") {
            return;
        }
        // edit text
        editor.edit((textEditor) => {
            // temporarly delete previous char
            textEditor.delete(new vscode.Range(editor.selection.start.translate(0, -1), editor.selection.start));
            // insert previous character after selected text
            textEditor.insert(editor.selection.end, prevChar !== null && prevChar !== void 0 ? prevChar : "");
        });
        // update selection in editor
        editor.selection = new vscode.Selection(editor.selection.start.translate(0, -1), editor.selection.end.translate(0, -1));
    }
}
function activate(context) {
    console.log('"alt-arrows" is now active!');
    let altPlusRight = vscode.commands.registerCommand("alt-arrows.altPlusRight", () => {
        moveSelection("right");
    });
    let altPlusLeft = vscode.commands.registerCommand("alt-arrows.altPlusLeft", () => {
        moveSelection("left");
    });
    context.subscriptions.push(altPlusRight, altPlusLeft);
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map