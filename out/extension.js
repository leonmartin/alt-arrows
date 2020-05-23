"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
function validate(editor, selection, movingDist, direction) {
    const selStart = selection.start;
    const selEnd = selection.end;
    const selText = editor.document.getText(selection);
    let valid = true;
    if (direction === "right") {
        // return false if moving distance exceeds available space or selText is empty
        const lineLimit = editor.document.lineAt(selStart.line).range.end.character;
        if (lineLimit - selEnd.character < movingDist || selText === "") {
            valid = false;
        }
    }
    else if (direction === "left") {
        // return false if moving distance exceeds available space or selText is empty
        if (selStart.character < movingDist || selText === "") {
            valid = false;
        }
    }
    return valid;
}
function updateSelections(direction, editor, movingDist) {
    console.log(editor.selections);
    // update selection if valid, retain selection if invalid
    if (direction === "right") {
        editor.selections = editor.selections.map((sel) => {
            if (validate(editor, sel, movingDist, direction)) {
                return new vscode.Selection(sel.start.translate(0, movingDist), sel.end.translate(0, movingDist));
            }
            return sel;
        });
    }
    else if (direction === "left") {
        editor.selections = editor.selections.map((sel) => {
            if (validate(editor, sel, movingDist, direction)) {
                return new vscode.Selection(sel.start.translate(0, -movingDist), sel.end.translate(0, -movingDist));
            }
            return sel;
        });
    }
}
function moveSelections(direction, movingDist) {
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
            if (!validate(editor, sel, movingDist, direction)) {
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
            if (direction === "right") {
                // insert selected text after movingDist characters to the right
                textEditor.insert(selEnd.translate(0, movingDist), selText);
                //
                //
                // ALT+LEFT
            }
            else if (direction === "left") {
                // insert selected text before movingDist characters to the left
                textEditor.insert(selStart.translate(0, -movingDist), selText);
            }
        });
    });
    updateSelections(direction, editor, movingDist);
}
function activate(context) {
    console.log('"alt-arrows" is now active!');
    let altPlusRight = vscode.commands.registerCommand("alt-arrows.altPlusRight", () => {
        moveSelections("right", 1);
    });
    let altPlusLeft = vscode.commands.registerCommand("alt-arrows.altPlusLeft", () => {
        moveSelections("left", 1);
    });
    context.subscriptions.push(altPlusRight, altPlusLeft);
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map