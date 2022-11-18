import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { MonacoBinding } from "y-monaco";
import * as monaco from "monaco-editor";
import React, { useEffect, useState } from "react";
import fileApi from "../../api/fileApi";

const YMonaco = ({
  filePath = "/home/ubuntu/crow_data/66/wowhello/wowhello.py",
}) => {
  const [code, setCode] = useState("");
  useEffect(() => {
    const path = filePath
      ? filePath.replace("/home/ubuntu/crow_data/", "")
      : "68/금오/금오.py";
    const data = {
      filePath: path,
    };

    fileApi.fileCall(data).then((res) => {
      console.log(res.data);
      setCode(() => res.data);
    });
    // fileApi.fileCall(data).then(res => codes = res.data.fileContent)
  }, [filePath]);

  useEffect(() => {
    const path = filePath
      ? filePath.replace("/home/ubuntu/crow_data/", "")
      : "68/금오/금오.py";
    const data = {
      filePath: path,
    };

    fileApi.fileCall(data).then((res) => {
      console.log(res.data);
      setCode(() => res.data);
    });
    const editor = monaco.editor.create(
      document.getElementById("monaco-editor"),
      {
        value: "",
        language: "python",
        theme: "vs-dark",
      }
    );

    console.log(code);

    editor.getModel().setValue(code);

    window.addEventListener("load", () => {
      const ydoc = new Y.Doc();
      const provider = new WebsocketProvider(
        "wss://demos.yjs.dev",
        "room3",
        ydoc
      );
      const ytext = ydoc.getText("monaco");
      const monacoBinding = new MonacoBinding(
        ytext,
        editor.getModel(),
        new Set([editor]),
        provider.awareness
      );
      window.example = { provider, ydoc, ytext, monacoBinding };
    });
  }, []);

  return (
    <React.Fragment>
      <div id="monaco-editor" style={{ height: "500px" }} />
      <script type="text/javascript" src="./dist/monaco.bundle.js"></script>
    </React.Fragment>
  );
};

export default YMonaco;
