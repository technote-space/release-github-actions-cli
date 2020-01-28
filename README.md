# Release GitHub Actions Cli

[![CI Status](https://github.com/technote-space/release-github-actions-cli/workflows/CI/badge.svg)](https://github.com/technote-space/release-github-actions-cli/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/technote-space/release-github-actions-cli/blob/master/LICENSE)

Release GitHub Actions for cli.   
Wrapper of [Release GitHub Actions](https://github.com/technote-space/release-github-actions).

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**

- [Usage](#usage)
- [Example](#example)
- [Addition](#addition)
  - [`GITHUB_TOKEN`](#github_token)
- [Author](#author)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Usage
1. Install
   ```shell script
   npm install -g release-github-actions-cli
   ```
1. Setup `.env`
   - Required
     - TARGET_OWNER
     - TARGET_REPO
     - GITHUB_TOKEN
   - Optional
     - `INPUT_ + [inputs name]`
       - `inputs name`: see inputs in [action.yml](https://github.com/technote-space/release-github-actions/blob/master/action.yml)
1. Run commands
   ```shell script
   release-ga --tag <tag> --branch [branch]
   ```

## Example
1. Create `.env`
    ```dotenv
    TARGET_OWNER=<repo owner>
    TARGET_REPO=<repo name>
    GITHUB_TOKEN=<token>
    INPUT_TEST_TAG_PREFIX=test/
    ```
1. Run command  
   ```
   release-ga --tag test/v1.2.3 --branch release/v1.2.3
   ```  
   => It will be built using the source of the `release/v1.2.3` branch and added the `test/v1`, `test/v1.2`, `test/v1.2.3` tags.

## Addition
### `GITHUB_TOKEN`
[personal access token](https://help.github.com/en/articles/creating-a-personal-access-token-for-the-command-line) with the public_repo or repo scope.
(repo is required for private repositories.)  

## Author
[GitHub (Technote)](https://github.com/technote-space)  
[Blog](https://technote.space)
