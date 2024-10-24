# Reference
## プロジェクトの生成及び公開
- [【完全解説】create-vueでVue3プロジェクト作成〜Vite爆速開発〜](https://reffect.co.jp/vue/create-vue)
- [Viteでフロントエンド開発環境を作成+Vercelにデプロイ](https://zenn.dev/carknow/articles/b9e1f565121ac6)
  
## ホーム画面
- [input type="file"をオリジナルのデザインに変更](https://qiita.com/comy/items/a9eac1de51f9fb1dfcca)


## Error Response
### Cannot find module '@/components/XXX.vue' or its corresponding type declarations.ts-plugin(2307)
- main.tsがApp.vueをTypeScriptとして扱えないことが原因で発生する
  - 「shims.d.ts」を追加して、VueファイルをTypeScriptとして認識させる

参考：[TypeScriptのファイルでVueファイルをimportしようとすると「Cannot find module '~~~~~' or its corresponding type declarations.」のエラーが出てしまう。](https://qiita.com/raratyurara/items/3ec1d78bebb76bde641a)