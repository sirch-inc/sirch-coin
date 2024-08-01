# Deployment Status
* Test (https://test.sirchcoin.com): [![Netlify Status](https://api.netlify.com/api/v1/badges/b698fbd0-b01b-43a5-8aa7-7586633a38a6/deploy-status)](https://app.netlify.com/sites/test-sirchcoin/deploys)

* Production (https://sirchcoin.com): [![Netlify Status](https://api.netlify.com/api/v1/badges/a61cc530-886d-4ceb-b386-bc37b9cddc78/deploy-status)](https://app.netlify.com/sites/sirch-coin/deploys)

# SirchCoin Frontend Dashboard: Quickstart

This is the frontend dashboard for SirchCoin, written in React/JSX and uses the `Vite.js` command-line toolchain. The SirchCoin dashboard allows users to login to their accounts, send coins, purchase coins, etc. The interface is meant to be extremely simple and mimic the actions & functionality of an ATM machine.

## Prerequisites (one-time-chores)

1. Install the latest (long-term stable) `node.js` suite, which includes `npm`.
1. Install VS Code or an IDE of your choice.
1. Install the latest `git` tools for your platform.
1. Install whatever other `git` tools you like (`GitHub Desktop` for example).
1. After an invite by the team, configure your platform credentials to connect to the `sirch-inc` GitHub organization (which might require RSA keys, etc).
1. Configure your `git` tools to use those credentials.
1. Using your `git` tools, fetch and pull down the latest version of the `sirch-inc/sirch-coin` github repository onto your local machine.
1. In a terminal, change into the `sirch-coin` directory where you pulled/downloaded the source code, then run `code .` to open in VS Code.
1. Create an `.env` text file with the necessary keys (ask a developer for these). NOTE: These may change over time!

## Generating a Token for Auth

❗ TBD, need to test & confirm

## Building and running the latest Development build locally (day-to-day)

1. Use your `git` tools to pull down the latest code from the `sirch-coin` repo.
1. In your terminal, type `npm ci` to install a clean set of the latest dependencies (from `package-lock.json`). ON FAILURE: consult a developer.
1. Type `npm run dev` to run the project on [http://localhost:5175](http://localhost:5173). ON FAILURE: consult a developer.

## Previewing a Production build locally (as needed)

1. Create an `.env.production` text file with the necessary keys (ask a developer for these). NOTE: These may change over time!
1. Type `npm run build` to build the production version.
1. Type `npm run preview` to run the project on [http://localhost:4173](http://localhost:4173/). ON FAILURE: consult a developer.

## Deployment / Dependencies

❗ TBD
