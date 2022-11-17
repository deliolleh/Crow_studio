import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { MonacoBinding } from "y-monaco";
import * as monaco from "monaco-editor";
import React, { useEffect, useState } from "react";
import fileApi from "../../api/fileApi";

const YMonaco = ({ filePath }) => {
  const [code, setCode] = useState("");
  useEffect(() => {
    const data = {
      filePath: filePath
        ? filePath.replace("/home/ubuntu/crow_data/", "")
        : "68/금오/금오.py",
    };
    fileApi.fileCall(data).then((res) => {
      console.log(res.data);
      setCode(() => res.data.fileContent);
    });
    // fileApi.fileCall(data).then(res => codes = res.data.fileContent)
  }, [filePath]);

  window.addEventListener("load", () => {
    const ydoc = new Y.Doc();
    const provider = new WebsocketProvider(
      "wss://demos.yjs.dev",
      "codes",
      ydoc
    );
    const ytext = ydoc.getText("monaco");

    const editor = monaco.editor.create(
      document.getElementById("monaco-editor"),
      {
        value: code,
        language: "python",
        theme: "vs-dark",
      }
    );

    const monacoBinding = new MonacoBinding(
      ytext,
      /** @type {monaco.editor.ITextModel} */ (editor.getModel()),
      new Set([editor]),
      provider.awareness
    );

    // @ts-ignore
    window.example = { provider, ydoc, ytext, monacoBinding };
  });

  return (
    <React.Fragment>
      <div id="monaco-editor" style={{ height: "200px" }} />
      <script type="text/javascript" src="./dist/monaco.bundle.js"></script>
    </React.Fragment>
  );
};

export default YMonaco;
