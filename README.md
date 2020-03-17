# Release GitHub Actions CLI

[![CI Status](https://github.com/technote-space/release-github-actions-cli/workflows/CI/badge.svg)](https://github.com/technote-space/release-github-actions-cli/actions)
[![codecov](https://codecov.io/gh/technote-space/release-github-actions-cli/branch/master/graph/badge.svg)](https://codecov.io/gh/technote-space/release-github-actions-cli)
[![CodeFactor](https://www.codefactor.io/repository/github/technote-space/release-github-actions-cli/badge)](https://www.codefactor.io/repository/github/technote-space/release-github-actions-cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/technote-space/release-github-actions-cli/blob/master/LICENSE)

*Read this in other languages: [English](README.md), [日本語](README.ja.md).*

CLI tool of [Release GitHub Actions](https://github.com/technote-space/release-github-actions).

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Details</summary>

- [Screenshot](#screenshot)
- [Usage](#usage)
  - [For package](#for-package)
  - [For global](#for-global)
- [Args](#args)
  - [Required](#required)
  - [Option](#option)
- [Settings](#settings)
  - [OWNER](#owner)
  - [REPO](#repo)
  - [INPUTS](#inputs)
- [Author](#author)

</details>
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Screenshot
![Cli](https://github.com/technote-space/release-github-actions-cli/raw/images/cli.gif)

## Usage
### For package
1. Install
    ```shell script
    yarn add --dev @technote-space/release-github-actions-cli
    ```
1. Run command
    ```shell script
    yarn release-ga --token <token> -t <tag>
    ```

    show help
    
    ```shell script
    yarn release-ga -h
    ```

### For global
1. Install
    ```shell script
    yarn global add @technote-space/release-github-actions-cli
    ```
1. Run command
    ```shell script
    release-ga --token <token> -p <package dir> -t <tag>
    ```

    show help
    
    ```shell script
    release-ga -h
    ```

## Args
### Required
#### token
[personal access token](https://help.github.com/en/github/authenticating-to-github/creating-a-personal-access-token-for-the-command-line)

e.g.
```
--token 1234567890
```

Not required if you have a `.env` file with `token`.  
e.g.
```dotenv
token=1234567890
```

#### tag
[detail](https://github.com/technote-space/release-github-actions#condition)

e.g. 
```
--tag v1.2.3
```

```
-t v1.2.3
```

Not required if [`test`](#test) option is set.

### Option
#### branch
Branch name to use for build.   
If this option is not specified, the current source code will be used.

e.g.
```
--branch release/v1.2.3
```

```
-b release/v1.2.3
```

#### dry run
Whether not to push.

e.g.
```
--dry-run
```

```
-n
```

#### package file directory
Directory where `package.json` file exists.

e.g.
```
--package /tmp/test-repo
```

```
-p /tmp/test-repo
```

#### test
Test mode

The tag name is determined from the latest tag.  
`test/` is set as the test tag prefix.

## Settings
`Release GitHub Actions CLI` can be configured using `.releasegarc`, `.releasegarc.json`, `.releasegarc.js`, `.releasega.config.js` or `releasega` property in `package.json`.

e.g. `.releasegarc`
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

e.g. `package.json`
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
Use this option to specify the owner.  
default: detect from url in `package.json`

### REPO
Use this option to specify the repo.  
default: detect from url in `package.json`

### INPUTS
Use this option to set action inputs.  
[action.yml](https://github.com/technote-space/release-github-actions/blob/master/action.yml)  

e.g.
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
