import * as vscode from "vscode";

function moveSelections(direction: String) {
  // get active text editor
  const editor = vscode.window.activeTextEditor;

  // return if editor is null
  if (!editor) {
    console.log("ERROR: editor is null!");
    return;
  }

  console.log(editor.selections);

  const currentSelections = editor.selections;

  //
  //
  // ALT+RIGHT
  if (direction === "right") {
    // edit text
    editor.edit((textEditor) => {
      currentSelections.forEach((selection) => {
        const selStart = selection.start;
        const selEnd = selection.end;
        const selText = editor.document.getText(selection);

        // get next char
        const nextChar = editor.document.getText(
          new vscode.Range(selEnd, selEnd.translate(0, 1))
        );
        console.log(nextChar);

        // return if there is no next char
        if (nextChar === "") {
          return;
        }

        // temporarly delete selected text
        textEditor.delete(new vscode.Range(selStart, selEnd));

        // insert selected text one character to the right
        textEditor.insert(selEnd.translate(0, 1), selText);

        // TODO: update selection in editor
        editor.selection = new vscode.Selection(
          selStart.translate(0, 1),
          selStart.translate(0, selText.length + 1)
        );
      });
    });

    //
    //
    // ALT+LEFT
  } else if (direction === "left") {
    // edit text
    editor.edit((textEditor) => {
      currentSelections.forEach((selection) => {
        const selStart = selection.start;
        const selEnd = selection.end;
        const selText = editor.document.getText(selection);

        // return if the selection starts at the beginning of the line
        if (editor.document.offsetAt(selStart) === 0) {
          return;
        }

        // return if translating -1 fails, i.e., there is no previous position
        try {
          selStart.translate(0, -1);
        } catch (e) {
          return;
        }

        // get previous char
        const prevChar = editor.document.getText(
          new vscode.Range(selStart.translate(0, -1), selStart)
        );

        // temporarly delete previous char
        textEditor.delete(
          new vscode.Range(selStart.translate(0, -1), selStart)
        );

        // insert previous character after selected text
        textEditor.insert(selEnd, prevChar);

        // TODO: update selection in editor
        editor.selection = new vscode.Selection(
          selStart.translate(0, -1),
          selEnd.translate(0, -1)
        );
      });
    });
  }
}

export function activate(context: vscode.ExtensionContext) {
  console.log('"alt-arrows" is now active!');

  let altPlusRight = vscode.commands.registerCommand(
    "alt-arrows.altPlusRight",
    () => {
      moveSelections("right");
    }
  );

  let altPlusLeft = vscode.commands.registerCommand(
    "alt-arrows.altPlusLeft",
    () => {
      moveSelections("left");
    }
  );

  context.subscriptions.push(altPlusRight, altPlusLeft);
}

export function deactivate() {}
