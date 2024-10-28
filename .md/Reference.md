# Reference
## プロジェクトの生成及び公開
- [【完全解説】create-vueでVue3プロジェクト作成〜Vite爆速開発〜](https://reffect.co.jp/vue/create-vue)
- [Viteでフロントエンド開発環境を作成+Vercelにデプロイ](https://zenn.dev/carknow/articles/b9e1f565121ac6)
  
## ホーム画面
- [input type="file"をオリジナルのデザインに変更](https://qiita.com/comy/items/a9eac1de51f9fb1dfcca)

## API
- [PythonでMeCabを使って形態素解析入門](https://frkz.jp/study/python/mecab)
- [MeCabとPythonを使用した日本語テキスト分析入門](https://qiita.com/finders/items/7474deca81fd8f6cda07)
- [Renderで簡単なwebアプリをデプロイしてみた](https://qiita.com/kizataka/items/10693e87f726a95499e4)
- [GPTs+FastAPI+Renderで機能性♾️チャットボット開発](https://qiita.com/milukyna/items/16493a90d5ed1c516ffd)

## Front Error Response
### Cannot find module '@/components/XXX.vue' or its corresponding type declarations.ts-plugin(2307)
- main.tsがApp.vueをTypeScriptとして扱えないことが原因で発生する
  - 「shims.d.ts」を追加して、VueファイルをTypeScriptとして認識させる

参考：[TypeScriptのファイルでVueファイルをimportしようとすると「Cannot find module '~~~~~' or its corresponding type declarations.」のエラーが出てしまう。](https://qiita.com/raratyurara/items/3ec1d78bebb76bde641a)

### Could not find a declaration file for module 'seedrandom'.ts-plugin(7016)
- TypeScript未対応のモジュールをimportしたから
  - 「shims.d.ts」を追加して、モジュールをany型として認識させる

参考：[TypeScript未対応のモジュールをimportするときのエラー対策](https://qiita.com/ichironagata/items/58855c5108f2cbcd18b7)