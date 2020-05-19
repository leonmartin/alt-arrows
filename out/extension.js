"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
function moveSelection(direction, editor, selection) {
    // get selected text
    const selStart = selection.start;
    const selEnd = selection.end;
    const selText = editor.document.getText(selection);
    if (selText === "") {
        return;
    }
    console.log("alt+" + direction + ":\t" + selText);
    //
    //
    // ALT+RIGHT
    if (direction === "right") {
        // get next char
        const nextChar = editor.document.getText(new vscode.Range(selEnd, selEnd.translate(0, 1)));
        // return if there is no next char
        if (nextChar === "") {
            return;
        }
        // edit text
        editor.edit((textEditor) => {
            // temporarly delete selected text
            textEditor.delete(new vscode.Range(selStart, selEnd));
            // insert selected text one character to the right
            textEditor.insert(selEnd.translate(0, 1), selText);
        });
        // update selection in editor
        editor.selection = new vscode.Selection(selStart.translate(0, 1), selStart.translate(0, selText.length + 1));
        //
        //
        // ALT+LEFT
    }
    else if (direction === "left") {
        // return if the selection starts at the beginning of the line
        if (editor.document.offsetAt(selStart) === 0) {
            return;
        }
        // return if translating -1 fails, i.e., there is no previous position
        try {
            selStart.translate(0, -1);
        }
        catch (e) {
            return;
        }
        // get previous char
        const prevChar = editor.document.getText(new vscode.Range(selStart.translate(0, -1), selStart));
        // edit text
        editor.edit((textEditor) => {
            // temporarly delete previous char
            textEditor.delete(new vscode.Range(selStart.translate(0, -1), selStart));
            // insert previous character after selected text
            textEditor.insert(selEnd, prevChar);
        });
        // update selection in editor
        editor.selection = new vscode.Selection(selStart.translate(0, -1), selEnd.translate(0, -1));
    }
}
function moveSelections(direction) {
    // get active text editor
    const editor = vscode.window.activeTextEditor;
    // return if editor is null
    if (!editor) {
        console.log("ERROR: editor is null!");
        return;
    }
    console.log(editor.selections);
    const currentSelections = editor.selections;
    // TODO: only the moving of the first selection is excuted; is possibly caused by promise of edit method
    currentSelections.forEach((selection) => {
        moveSelection(direction, editor, selection);
    });
}
function activate(context) {
    console.log('"alt-arrows" is now active!');
    let altPlusRight = vscode.commands.registerCommand("alt-arrows.altPlusRight", () => {
        moveSelections("right");
    });
    let altPlusLeft = vscode.commands.registerCommand("alt-arrows.altPlusLeft", () => {
        moveSelections("left");
    });
    context.subscriptions.push(altPlusRight, altPlusLeft);
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map