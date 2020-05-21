import * as vscode from "vscode";

function updateSelections(
  direction: String,
  editor: vscode.TextEditor,
  selections: vscode.Selection[]
) {
  if (direction === "right") {
    editor.selections = editor.selections.map(
      (sel) =>
        new vscode.Selection(sel.start.translate(0, 1), sel.end.translate(0, 1))
    );
  } else if (direction === "left") {
    editor.selections = editor.selections.map(
      (sel) =>
        new vscode.Selection(
          sel.start.translate(0, -1),
          sel.end.translate(0, -1)
        )
    );
  }

  // editor.selection = new vscode.Selection(
  //   selStart.translate(0, 0),
  //   selEnd.translate(0, 0)
  // );

  console.log(editor.selections);
}

function moveSelections(direction: String) {
  // get active text editor
  const editor = vscode.window.activeTextEditor;

  // return if editor is null
  if (!editor) {
    console.log("ERROR: editor is null!");
    return;
  }

  const currentSelections = editor.selections;

  //
  //
  // ALT+RIGHT
  if (direction === "right") {
    // edit text
    editor.edit((textEditor) => {
      currentSelections.forEach((sel) => {
        const selStart = sel.start;
        const selEnd = sel.end;
        const selText = editor.document.getText(sel);

        // get next char
        const nextChar = editor.document.getText(
          new vscode.Range(selEnd, selEnd.translate(0, 1))
        );

        // return if there is no next char or selText is empty
        if (nextChar === "" || selText === "") {
          return;
        }

        // temporarly delete selected text
        textEditor.delete(new vscode.Range(selStart, selEnd));

        // insert selected text one character to the right
        textEditor.insert(selEnd.translate(0, 1), selText);
      });
    });

    updateSelections(direction, editor, currentSelections);

    //
    //
    // ALT+LEFT
  } else if (direction === "left") {
    // edit text
    editor.edit((textEditor) => {
      currentSelections.forEach((sel) => {
        const selStart = sel.start;
        const selEnd = sel.end;
        const selText = editor.document.getText(sel);

        // return if the selection starts at the beginning of the line or selText is empty
        if (editor.document.offsetAt(selStart) === 0 || selText === "") {
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
      });
    });
  }

  updateSelections(direction, editor, currentSelections);
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
