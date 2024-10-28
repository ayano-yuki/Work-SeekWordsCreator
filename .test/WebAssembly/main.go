// main.go
package main

import (
    "syscall/js"
    "github.com/jdkato/prose/v2"
)

func isNoun(this js.Value, p []js.Value) interface{} {
    word := p[0].String()

    // 文を解析して、単語の品詞を識別
    doc, _ := prose.NewDocument(word)
    for _, tok := range doc.Tokens() {
        if tok.Tag == "NN" || tok.Tag == "NNS" || tok.Tag == "NNP" || tok.Tag == "NNPS" {
            return js.ValueOf(true) // 名詞の場合
        }
    }
    return js.ValueOf(false) // 名詞でない場合
}

func main() {
    // JavaScriptに関数をエクスポート
    js.Global().Set("isNoun", js.FuncOf(isNoun))

    // ブロックすることで、Wasmが実行され続ける
    select {}
}
