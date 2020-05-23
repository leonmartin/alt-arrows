"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
function validate(editor, selection, movingDist) {
    const selStart = selection.start;
    const selEnd = selection.end;
    const selText = editor.document.getText(selection);
    let valid = true;
    if (movingDist > 0) {
        // return false if moving distance exceeds available space or selText is empty
        const lineLimit = editor.document.lineAt(selStart.line).range.end.character;
        if (lineLimit - selEnd.character < movingDist || selText === "") {
            valid = false;
        }
    }
    else {
        // return false if moving distance exceeds available space or selText is empty
        if (selStart.character < Math.abs(movingDist) || selText === "") {
            valid = false;
        }
    }
    return valid;
}
function updateSelections(editor, movingDist) {
    // update selection if valid, retain selection if invalid
    if (movingDist > 0) {
        editor.selections = editor.selections.map((sel) => {
            if (validate(editor, sel, movingDist)) {
                return new vscode.Selection(sel.start.translate(0, movingDist), sel.end.translate(0, movingDist));
            }
            return sel;
        });
    }
    else {
        editor.selections = editor.selections.map((sel) => {
            if (validate(editor, sel, movingDist)) {
                return new vscode.Selection(sel.start.translate(0, movingDist), sel.end.translate(0, movingDist));
            }
            return sel;
        });
    }
}
function moveSelections(movingDist) {
    // get active text editor
    const editor = vscode.window.activeTextEditor;
    // return if editor is undefined
    if (!editor) {
        console.log("Error: editor must not be undefined!");
        return;
    }
    // edit text
    editor.edit((textEditor) => {
        // skip if invalid
        editor.selections.forEach((sel) => {
            if (!validate(editor, sel, movingDist)) {
                return;
            }
            const selStart = sel.start;
            const selEnd = sel.end;
            const selText = editor.document.getText(sel);
            // temporarly delete selected text
            textEditor.delete(new vscode.Range(selStart, selEnd));
            //
            //
            // ALT+RIGHT
            if (movingDist > 0) {
                // insert selected text after movingDist characters to the right
                textEditor.insert(selEnd.translate(0, movingDist), selText);
                //
                //
                // ALT+LEFT
            }
            else {
                // insert selected text before movingDist characters to the left
                textEditor.insert(selStart.translate(0, movingDist), selText);
            }
        });
    });
    updateSelections(editor, movingDist);
}
function activate(context) {
    console.log('"alt-arrows" is now active!');
    let altPlusRight = vscode.commands.registerCommand("alt-arrows.altPlusRight", () => {
        moveSelections(1);
    });
    let altPlusLeft = vscode.commands.registerCommand("alt-arrows.altPlusLeft", () => {
        moveSelections(-1);
    });
    let shiftPlusAltPlusRight = vscode.commands.registerCommand("alt-arrows.shiftPlusAltPlusRight", () => {
        moveSelections(-5);
    });
    context.subscriptions.push(altPlusRight, altPlusLeft, shiftPlusAltPlusRight);
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map