# Release GitHub Actions CLI

[![CI Status](https://github.com/technote-space/release-github-actions-cli/workflows/CI/badge.svg)](https://github.com/technote-space/release-github-actions-cli/actions)
[![codecov](https://codecov.io/gh/technote-space/release-github-actions-cli/branch/master/graph/badge.svg)](https://codecov.io/gh/technote-space/release-github-actions-cli)
[![CodeFactor](https://www.codefactor.io/repository/github/technote-space/release-github-actions-cli/badge)](https://www.codefactor.io/repository/github/technote-space/release-github-actions-cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/technote-space/release-github-actions-cli/blob/master/LICENSE)

*Read this in other languages: [English](README.md), [日本語](README.ja.md).*

[Release GitHub Actions](https://github.com/technote-space/release-github-actions) の CLIツール

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Details</summary>

- [スクリーンショット](#%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%B3%E3%82%B7%E3%83%A7%E3%83%83%E3%83%88)
- [使用方法](#%E4%BD%BF%E7%94%A8%E6%96%B9%E6%B3%95)
  - [package で使用](#package-%E3%81%A7%E4%BD%BF%E7%94%A8)
  - [グローバルで使用](#%E3%82%B0%E3%83%AD%E3%83%BC%E3%83%90%E3%83%AB%E3%81%A7%E4%BD%BF%E7%94%A8)
- [Args](#args)
  - [必須](#%E5%BF%85%E9%A0%88)
  - [オプション](#%E3%82%AA%E3%83%97%E3%82%B7%E3%83%A7%E3%83%B3)
- [設定](#%E8%A8%AD%E5%AE%9A)
  - [OWNER](#owner)
  - [REPO](#repo)
  - [INPUTS](#inputs)
- [Author](#author)

</details>
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## スクリーンショット
![Cli](https://github.com/technote-space/release-github-actions-cli/raw/images/cli.gif)

## 使用方法
### package で使用
1. インストール
    ```shell script
    yarn add --dev @technote-space/release-github-actions-cli
    ```
1. コマンド実行
    ```shell script
    yarn release-ga --token <token> -t <tag>
    ```

    ヘルプ表示
    
    ```shell script
    yarn release-ga -h
    ```

### グローバルで使用
1. インストール
    ```shell script
    yarn global add @technote-space/release-github-actions-cli
    ```
1. コマンド実行
    ```shell script
    release-ga --token <token> -p <package dir> -t <tag>
    ```

    ヘルプ表示
    
    ```shell script
    release-ga -h
    ```

## Args
### 必須
#### token
[personal access token](https://help.github.com/en/github/authenticating-to-github/creating-a-personal-access-token-for-the-command-line)

例：
```
--token 1234567890
```

`token` が書かれた `.env` ファイルを用意している場合は不要です。  
例：
```dotenv
token=1234567890
```

#### tag
[detail](https://github.com/technote-space/release-github-actions#condition)

例： 
```
--tag v1.2.3
```

```
-t v1.2.3
```

[`test`](#test) オプションを設定している場合は不要です。

### オプション
#### branch
ビルドに使用するブランチ名  
このオプションが指定されていない場合、現在のソースコードが使用されます。

例：
```
--branch release/v1.2.3
```

```
-b release/v1.2.3
```

#### dry run
プッシュしないかどうか

例：
```
--dry-run
```

```
-n
```

#### package file directory
`package.json` ファイルのあるディレクトリ

例：
```
--package /tmp/test-repo
```

```
-p /tmp/test-repo
```

#### test
テストモード

タグ名は最新のタグから決まります。  
テスト用タグプリフィックスに `test/` が設定されます。

## 設定
`Release GitHub Actions CLI` は `.releasegarc`, `.releasegarc.json`, `.releasegarc.js`, `.releasega.config.js` または `package.json` の `releasega` プロパティで設定できます。

例： `.releasegarc`
```json
{
  "owner": "test-owner",
  "repo": "test-repo",
  "inputs": {
    "test-tag-prefix": "test/",
    "fetch-depth": "5"
  }
}
```

例： `package.json`
```json
{
  "name": "test",
  "version": "1.0.0",
  "repository": {
  },
  "dependencies": {
  },
  "releasega": {
    "owner": "test-owner",
    "repo": "test-repo",
    "inputs": {
      "test-tag-prefix": "test/",
      "fetch-depth": "5"
    }
  }
}
```

### OWNER
Owner を指定するために使用します。  
default: `package.json` 内のURLから検出します

### REPO
Repo を指定するために使用します。  
default: `package.json` 内のURLから検出します。

### INPUTS
アクションの inputs を設定します。  
[action.yml](https://github.com/technote-space/release-github-actions/blob/master/action.yml)  

例：
```json
{
  "inputs": {
    "commit message": "test message",
    "commit-name": "test name",
    "COMMIT_EMAIL": "test@example.com"
  }
}
```

## Author
[GitHub (Technote)](https://github.com/technote-space)  
[Blog](https://technote.space)
