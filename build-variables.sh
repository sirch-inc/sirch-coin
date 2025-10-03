# This script provides environment variables to "npm run" scripts.

# Version details for rendering in the app
export VITE_BUILD_VERSION=`git describe --tags --abbrev=0`
export VITE_BUILD_VERSION_VERBOSE=`git describe --tags --dirty --broken`
