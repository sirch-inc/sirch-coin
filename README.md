# Sirch Coins Front-End Dashboard

## Overview
This is the front-end dashboard for Sirch Coins, written in React/JSX using the `Vite` (https://vite.dev/) command-line toolchain. The Sirch Coin dashboard allows users to login to their accounts, send coins, purchase coins, etc.. The interface is meant to be extremely simple and mimic the actions & functionality of an ATM machine.

### Services
Ask a developer for invites to access any of these services, if you are working in those areas:
* Auth:  SupaBase built-in authentication/authorization.
* Backend:  SupaBase is our backend-as-a-service which runs a Postgres DB and has a number of edge functions to handle front-end and webhook API requests.  Our backend repo is located here:  https://github.com/sirch-inc/sirch-coin-supabase
* Email:  SendGrid manages our email (some of which is emitted from SupaBase).  Basic plan currently owned by Jeff.
* Payments:  Stripe.  Josh can provide access.
* Webhost:  Netlify.  Basic plan currently owned by Jeff.
* Domain/DNS:  Godaddy (for now).  Josh can provide access if necessary.

### Hosted Environments
* [testallthethings.sirchcoin.com](https://testallthethings.sirchcoin.com) is for testing in our "dev/test" sandboxes.  Autodeploys via Netlify.
* [sirchcoin.com](https://sirchcoin.com) is our production environment.  Deployed manually in Netlify.

### Custom Deployment Environment Flags
The front-end can be configured to conditionally-compile simple, custom landing pages to inform users of system-wide modes.  We have a `Coming Soon` landing page intended for use until we launch, and a `Systems Maintenace` page intended when we need to take down the website for maintenance, major updates, problems, or abuse by hackers.  They are driven by setting one or the other following environment variables to `true` in the Netlify `Environment Variables` section:
```
VITE_IS_COMING_SOON="false"
VITE_IS_OFFLINE="false"
```

# Development Process
1. We currently use Linear (https://linear.app/) to track dev/product tasks, so download the app, get signed on (or invited), and join the "SirchCoins" team.
1. Except for micro-changes (commit directly to `main`), we generally use this process:
    1. Create a branch (from `main` or wherever).  Ideally, name it using the `Copy git branch name` from the Linear task/story you're working on, which helps correlate your changes to Linear. To get this name, open the issue in Linear then press (Command-Shift-.), or use the issue menu to `Copy git branch name`. If you are creating a branch for an untracked issue, name it `UNTRACKED: <details>`.
    1. Modify/commit your changes to your branch.
    1. Push/publish the branch to GitHub.
    1. Create a pull-request and nominate reviewer(s).
    1. (As necessary) Announce your request for review to the reviewer(s).
    1. (Iterate on changes until approved...)
    1. Merge the pull-request. Deployment to TEST is automatic on merge via Netlify, but requires manual operations to publish to PROD.
    1. Delete the GitHub branch (it can be restored later if needed).
    1. After a few minutes, verify your changes deployed to our TEST environment.  Remember to also PR/merge any dependent changes from the `sirch-coin-supabase` project if necessary.
    1. Announce to relevant testers that the changes are present in our TEST environment. Iterate on validating the changes.
    1. When ready for release:
        1. Verify with developers/testers your intention to release:  be careful here as you may be releasing OTHER changes on `main` that aren't production-ready.
        1. Consider ramifications:
            1. Does the backend need to update/migrate user records to support your changes?
            1. Do we need to reset/invalidate caches or CDN's to provide the new functionality?
            1. etc... think through the possible issues...
        1. Create a Tag/Release in GitHub for the project (usually just rev the release number).
        1. MANUALLY deploy the changes to PROD using Netlify.  See a developer for instructions.  Also remember to deploy any dependent changes from `sirch-coin-supabase` as necessary.
        1. Test the release on PROD (be careful!).
        1. Announce the release to our Slack channel, perhaps with a changelog (details to be worked out...).

# Developer Quickstart

## Prerequisites (one-time chores)

### Tools
1. Install the latest (long-term stable) `node.js` suite, which includes `npm`.
1. Install VS Code or an IDE of your choice.
1. Install the latest `git` tools for your platform.
1. Install whatever other `git` tools you like (`GitHub Desktop` for example).
1. After an invite by the team, configure your platform credentials to connect to the `sirch-inc` GitHub organization (which might require RSA keys, etc).
1. Configure your `git` tools to use those credentials.

### Set up Sirch-Coins (Front-End)
1. Pull down the latest version of the `sirch-inc/sirch-coin` github repository onto your local machine (https://github.com/sirch-inc/sirch-coin)
1. In a terminal, change into the `sirch-coin` directory where you pulled/downloaded the source code, then run `code .` to open in VS Code.
1. Create an `.env.local` text file with the necessary keys (ask a developer for these). NOTE: These may change over time!

### Set up Sirch-Coins-Supabase (Back-End)
1. Pull down the latest version of the `sirch-inc/sirch-coin-supabase` github repository onto your local machine (https://github.com/sirch-inc/sirch-coin-supabase)
1. In a terminal, change into the `sirch-coin-supabase` directory where you pulled/downloaded the source code, then run `code .` to open in VS Code.
1. Follow the README there to set up your LOCAL Supabase instance to which the LOCAL Sirch Coins front-end connects in Development mode.

## Building and running the latest Development build locally (day-to-day)
1. Use your `git` tools to pull down the latest code from the `sirch-coin` repo.
1. In your terminal, type `npm ci` to install a clean set of the latest dependencies (from `package-lock.json`). ON FAILURE: consult a developer.
1. Type `npm run dev` to run the project on localhost. ON FAILURE: consult a developer.
1. OPTIONAL: you can also run in other environments (test, production) using `npm run <environment>`.  You will need to create appropriate `.env.<environment>.local` files.

## Previewing a Production build locally (as needed)
1. Create an `.env.production.local` text file with the necessary keys (ask a developer for these). NOTE: These may change over time!
1. Type `npm run build-production` to build the production version.
1. Type `npm run preview` to run the project on localhost. ON FAILURE: consult a developer.
1. OPTIONAL: you can also "build" for other environments (test, prod) using `npm run build-<environment>`.  You will need to create appropriate `.env.<environment>.local` files.

## Deployment / Dependencies
...more info coming soon...

### Deployment Status
* [Test](https://testallthethings.sirchcoin.com): [![Netlify Status](https://api.netlify.com/api/v1/badges/b698fbd0-b01b-43a5-8aa7-7586633a38a6/deploy-status)](https://app.netlify.com/sites/testallthethings-sirch-coin/deploys)
* [Production](https://sirchcoin.com): [![Netlify Status](https://api.netlify.com/api/v1/badges/a61cc530-886d-4ceb-b386-bc37b9cddc78/deploy-status)](https://app.netlify.com/sites/sirch-coin/deploys)

