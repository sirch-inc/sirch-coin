# SirchCoin Frontend Dashboard: Quickstart

This is the frontend dashboard for SirchCoin, written in React/JSX and uses the create-react-app command-line toolchain. The SirchCoin dashboard allows users to login to their accounts, send coins, deposit coins, etc. The interface is meant to be extremely simple and mimic the actions & functionality of an ATM machine.

## Prerequisites (one-time-chores)

1. Install the latest (long-term stable) node.js suite, which includes npm.
2. Install the latest git tools for your platform.
3. Install whatever other git tools you like (github for example).
4. After an invite by the team, configure your platform credentials to connect to the sirch github account (which might require RSA keys, etc).
5. Configure your git tools to use those credentials.
6. Using your git tools, fetch and pull down the latest version of the `sirch-inc/sirch-coin` github repository onto your local machine.
7. In a terminal, change into the `sirch-coin` directory where you pulled/downloaded the source code, then run `code .` to open in VS Code.
8. Create an .env text file with the necessary keys (ask a developer for these). NOTE: These may change over time!

## Building the latest (day-to-day)

1. Use your `git` tools to pull down the latest code from the `sirch-coin` repo.
2. In your terminal, type `npm i` to install the latest dependencies. ON FAILURE: consult a developer.
3. Type `npm start` to run the project on [http://localhost:3000](http://localhost:3000). ON FAILURE: consult a developer.

## Making Changes & Submitting Pull Requests

If it's your first time contributing:
In your terminal, create a new branch by typing `git checkout -b YOUR_BRANCH_NAME-dev` .

If you've contributed before:
In your terminal, change into your development branch by typing: `git checkout YOUR_BRANCH_NAME` .

1. Confirm that you're on your development branch by running `git status` .
2. Make your changes.
3. After making any changes to the codebase, stage the changes by typing `git add .` into your terminal.
4. Commit the changes with `git commit -m "[COMMIT-MESSAGE-HERE]"` .
5. Push the changes to your branch with `git push` .
6. Navigate to the repo on Github, confirm your changes are updated on your branch, then navigate to Pull Requests > New Pull Request
7. Select your branch to compare, and then click Create Pull Request.
8. Give your pull request a title and meaningful description on the changes that you've implemented. Review the changes to make sure your changes are correct.
9.

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
