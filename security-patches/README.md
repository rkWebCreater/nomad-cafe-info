# セキュリティ修正フォーク

上流に修正版が公開されていない2件の依存ライブラリについて、このプロジェクトで使うローカル修正版を保持します。更新時は `package.json` と `package-lock.json` の `file:` 参照を含め、このフォルダー全体をGitHubへアップロードしてください。

## braces

- 元の版: 3.0.3
- ローカル版: 3.0.4+nomad.1
- 修正: `{` のネストが100階層を超えた時点で `SyntaxError` を返し、深い入力がAST処理の再帰でNode.jsプロセスを停止させないようにします。
- 対象: [GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm)

## node-forge

- 元の版: 1.4.0
- ローカル版: 1.4.1+nomad.1
- 修正: RSA PKCS#1 v1.5署名の検証時に、DigestInfo内のDigestAlgorithm要素数を検証します。アルゴリズムパラメーターがある場合は2要素、ない場合は1要素のみ許可します。
- 対象: [GHSA-86w9-cpqp-85rv](https://github.com/advisories/GHSA-86w9-cpqp-85rv)
- 関連する修正提案: [digitalbazaar/forge #1152](https://github.com/digitalbazaar/forge/pull/1152)

## インストール設定

`package.json` はこのフォルダーのローカルパッケージを依存関係として指定します。`.npmrc` の `install-links=true` により、npmはローカルパッケージをシンボリックリンクではなく通常のパッケージとして配置します。`package-lock.json` にもローカル参照が記録されています。

## 上流修正版が出たとき

GitHub Advisory Databaseに修正版が掲載されたら、上流の修正版へ依存を戻し、このフォルダーのローカル依存指定と `.npmrc` を削除できます。現在の上流修正状況は各アドバイザリで確認してください。
