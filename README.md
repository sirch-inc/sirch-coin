# SirchCoin Frontend Dashboard

## Overview
This is the frontend dashboard for SirchCoin, written in React/JSX and uses the `Vite.js` command-line toolchain. The SirchCoin dashboard allows users to login to their accounts, send coins, purchase coins, etc. The interface is meant to be extremely simple and mimic the actions & functionality of an ATM machine

### Services
Ask a developer for invites to access any of these services.
* Auth:  Currently using SupaBase built-in auth/access.
* Backend:  SupaBase is our backend-as-a-service which runs a Postgres DB and has a number of edge functions to handle frontend and webhook requests.
* Email:  SendGrid manages our email (some of which is emitted from SupaBase).  Basic plan currently owned by Jeff.
* Payments:  Stripe is our payment provider.  Josh can provied access.
* Webhost:  Netlify is our web host.  Basic plan currently owned by Jeff.
* Domain/DNS:  Godaddy (for now).  Josh can provide access if necessary.

### Hosts
* [test.sirchcoin.com](https://test.sirchcoin.com) is for testing in our "dev/test" sandboxes.  Autodeploys.
* [staging.sirchcoin.com](https://staging.sirchcoin.com) is for testing in our "production" environment  Autodeploys.
* [sirchcoin.com](https://sirchcoin.com) is our production environment.  Must be deployed manually in Netlify.


# Developer Quickstart

## Prerequisites (one-time-chores)

1. Install the latest (long-term stable) `node.js` suite, which includes `npm`.
1. Install VS Code or an IDE of your choice.
1. Install the latest `git` tools for your platform.
1. Install whatever other `git` tools you like (`GitHub Desktop` for example).
1. After an invite by the team, configure your platform credentials to connect to the `sirch-inc` GitHub organization (which might require RSA keys, etc).
1. Configure your `git` tools to use those credentials.
1. Using your `git` tools, fetch and pull down the latest version of the `sirch-inc/sirch-coin` github repository onto your local machine.
1. In a terminal, change into the `sirch-coin` directory where you pulled/downloaded the source code, then run `code .` to open in VS Code.
1. Create an `.env.local` text file with the necessary keys (ask a developer for these). NOTE: These may change over time!

## Generating a Token for Auth

❗ TBD, need to test & confirm

## Building and running the latest Development build locally (day-to-day)

1. Use your `git` tools to pull down the latest code from the `sirch-coin` repo.
1. In your terminal, type `npm ci` to install a clean set of the latest dependencies (from `package-lock.json`). ON FAILURE: consult a developer.
1. Type `npm run dev` to run the project on localhost. ON FAILURE: consult a developer.
1. OPTIONAL: you can also run in other environments (test, staging, production) using `npm run <environment>`.  You will need to create appropriate `.env.<environment>.local` files.

## Previewing a Production build locally (as needed)

1. Create an `.env.production.local` text file with the necessary keys (ask a developer for these). NOTE: These may change over time!
1. Type `npm run build-production` to build the production version.
1. Type `npm run preview` to run the project on localhost. ON FAILURE: consult a developer.
1. OPTIONAL: you can also "build" for other environments (test, staging) using `npm run build-<environment>`.  You will need to create appropriate `.env.<environment>.local` files.

## Deployment / Dependencies

### Deployment Status
* [Test](https://test.sirchcoin.com): [![Netlify Status](https://api.netlify.com/api/v1/badges/b698fbd0-b01b-43a5-8aa7-7586633a38a6/deploy-status)](https://app.netlify.com/sites/test-sirchcoin/deploys)
* [Staging](https://staging.sirchcoin.com): [![Netlify Status](https://api.netlify.com/api/v1/badges/90674d93-cbc6-4a1e-8324-2616cc59ff07/deploy-status)](https://app.netlify.com/sites/staging-sirch-coin/deploys)
* [Production](https://sirchcoin.com): [![Netlify Status](https://api.netlify.com/api/v1/badges/a61cc530-886d-4ceb-b386-bc37b9cddc78/deploy-status)](https://app.netlify.com/sites/sirch-coin/deploys)

