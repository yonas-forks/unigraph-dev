import { unpad } from "unigraph-dev-common/lib/utils/entityUtils";
import Editor from "@monaco-editor/react";
import React from "react";
import { Button } from "@material-ui/core";
import { Save } from "@material-ui/icons";
// eslint-disable-next-line import/no-webpack-loader-syntax
const unigraphDecl: string = require('!!raw-loader!unigraph-dev-common/lib/api/unigraph.d.ts').default;
const beginStr = '/** Unigraph interface */'
const endStr = '/** End of unigraph interface */'
let decl = unigraphDecl.substring(
    unigraphDecl.lastIndexOf(beginStr)+beginStr.length,
    unigraphDecl.lastIndexOf(endStr)    
)
decl = decl.replace("export interface Unigraph", "declare interface Unigraph")
console.log(decl);

export const ExecutableCodeEditor = ({data}: any) => {
    
    const unpadded = unpad(data);

    const [currentCode, setCurrentCode] = React.useState(unpadded['src'])

    const updateCode = (newSrc: string) => 
        {window.unigraph.updateObject(data.uid, {src: newSrc})}

    function handleEditorChange(value: any, event: any) {
        setCurrentCode(value);
    }

    const displayData = {...unpadded};
    delete displayData['src']
    

    return <div>
        {JSON.stringify(displayData)}
        <Button onClick={() => updateCode(currentCode)}><Save/></Button>
        <Editor
            height="90vh"
            width="100vh"
            defaultLanguage="javascript"
            beforeMount={(monaco) => {
                monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
                    noSemanticValidation: false,
                    noSyntaxValidation: false,
                    // Disable error codes: no top level await *2; check for typescript annotation
                    diagnosticCodesToIgnore: [1375, 1378, 7044]
                });

                monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
                    target: monaco.languages.typescript.ScriptTarget.ES2016,
                    allowNonTsExtensions: true
                });

                monaco.languages.typescript.javascriptDefaults.addExtraLib(decl + "\ndeclare var unigraph: Unigraph<WebSocket>; declare const unpad = (a:any) => any;declare const require = (a:any) => any;")
            }}
            defaultValue={currentCode}
            onChange={handleEditorChange}
        />
    </div>

}