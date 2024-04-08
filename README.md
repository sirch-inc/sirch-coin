# SirchCoin Frontend Dashboard: Quickstart

This is the frontend dashboard for SirchCoin, written in React/JSX and uses the `create-react-app` command-line toolchain. The SirchCoin dashboard allows users to login to their accounts, send coins, deposit coins, etc. The interface is meant to be extremely simple and mimic the actions & functionality of an ATM machine.

## Prerequisites (one-time-chores)

1. Install the latest (long-term stable) `node.js` suite, which includes `npm`.
2. Install the latest `git` tools for your platform.
3. Install whatever other `git` tools you like (`github` for example).
4. After an invite by the team, configure your platform credentials to connect to the `sirch` github account (which might require RSA keys, etc).
5. Configure your `git` tools to use those credentials.
6. Using your `git` tools, fetch and pull down the latest version of the `sirch-inc/sirch-coin` github repository onto your local machine.
7. In a terminal, change into the `sirch-coin` directory where you pulled/downloaded the source code, then run `code .` to open in VS Code.
8. Create an `.env` text file with the necessary keys (ask a developer for these). NOTE: These may change over time!

## Generating a Token for Auth

❗ TBD, need to test & confirm

## Building the latest (day-to-day)

1. Use your `git` tools to pull down the latest code from the `sirch-coin` repo.
2. In your terminal, type `npm i` to install the latest dependencies. ON FAILURE: consult a developer.
3. Type `npm start` to run the project on [http://localhost:3000](http://localhost:3000). ON FAILURE: consult a developer.

## Making Changes & Submitting Pull Requests

🌱 _If it's your first time contributing:_ In your terminal, create a new branch by typing `git checkout -b <YOUR_BRANCH_NAME-dev>` .

🪴 _If you've contributed before:_
In your terminal, change into your development branch by typing: `git checkout <YOUR_BRANCH_NAME>` .

1. Confirm that you're on your development branch by running `git status` .
2. Make your changes.
3. After making any changes to the codebase, stage the changes by typing `git add .` into your terminal.
4. Commit the changes with `git commit -m "your commit message"` .
5. Push the changes to your branch with `git push` .
6. Navigate to the repo on Github, confirm your changes are updated on your branch, then navigate to Pull Requests > New Pull Request.
7. Select your branch to compare. Review the changes to make sure your changes are correct, and click "Create Pull Request".
8. Give your pull request a title and meaningful description on the changes that you've implemented.
9. Finally, select "Create Pull Request" again so that project owners can review the changes.

## Deployment // Dependencies

❗ TBD
