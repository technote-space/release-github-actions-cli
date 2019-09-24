# Release GitHub Actions Script

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/technote-space/test-release-github-actions/blob/master/LICENSE)

Release GitHub Action from local.   
Wrapper of [Release GitHub Actions](https://github.com/technote-space/release-github-actions).

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**

- [Usage](#usage)
- [Addition](#addition)
  - [`token`](#token)
  - [`.gitignore`](#gitignore)
- [Author](#author)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Usage
1. Setup scripts  
`composer.json`
    ```json
    {
      "scripts": {
        "bin:download": [
          "mkdir -p ./release-script/.git",
          "chmod -R +w ./release-script/.git",
          "rm -rdf ./release-script",
          "git clone --depth=1 https://github.com/technote-space/release-github-actions-script.git release-script"
        ],
        "bin:release": [
          "@bin:check",
          "@bin:setup",
          "@bin:prepare",
          "@bin:commit",
          "@bin:push"
        ],
        "bin:check": "ls .env && export ROOT_DIR=$(cd $(dirname $0); pwd) && export $(cat .env | grep -v '^#' | xargs) && bash ./release-script/bin/check.sh",
        "bin:setup": "export ROOT_DIR=$(cd $(dirname $0); pwd) && export $(cat .env | grep -v '^#' | xargs) && bash ./release-script/bin/setup.sh",
        "bin:prepare": "export ROOT_DIR=$(cd $(dirname $0); pwd) && export $(cat .env | grep -v '^#' | xargs) && bash ./release-script/bin/prepare.sh",
        "bin:commit": "export ROOT_DIR=$(cd $(dirname $0); pwd) && export $(cat .env | grep -v '^#' | xargs) && bash ./release-script/bin/commit.sh",
        "bin:push": "export ROOT_DIR=$(cd $(dirname $0); pwd) && export $(cat .env | grep -v '^#' | xargs) && bash ./release-script/bin/push.sh"
      }
    }
    ```
1. Setup `.env`
   - Required
     - TARGET_OWNER
     - TARGET_REPO
     - GITHUB_TOKEN
   - Optional
     - `INPUT_ + [inputs name]`
       - `inputs name`: see inputs in action.yml
1. Run commands
   1. `composer bin:download`
   1. `composer bin:release <tag> [branch = master]`

## Example
1. Run command  
`composer bin:download`
1. Create `.env`
    ```dotenv
    TARGET_OWNER=<repo owner>
    TARGET_REPO=<repo name>
    GITHUB_TOKEN=<token>
    INPUT_TEST_TAG_PREFIX=test/
    ```
3. Run command  
`composer bin:release test/v1.2.3 release/v1.2.3`  
=> It will be built using the source of the `release/v1.2.3` branch and added the `test/v1`, `test/v1.2`, `test/v1.2.3` tags.

## Addition
### `GITHUB_TOKEN`
[personal access token](https://help.github.com/en/articles/creating-a-personal-access-token-for-the-command-line) with the public_repo or repo scope.
(repo is required for private repositories.)  

### `.gitignore`
You should add ignore pattern.
```
/.work
/release-script
```

## Author
[GitHub (Technote)](https://github.com/technote-space)  
[Blog](https://technote.space)
