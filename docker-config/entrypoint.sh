#!/bin/sh

# Create the config file w/ env var
echo -e "\033[1;32m*** Creating config file [/apis-catalog/config/local.toml] ***\033[0m"

envsubst < "/apis-catalog/config/local-template.toml" > "/apis-catalog/config/local.toml" 
cat /apis-catalog/config/local.toml

# Build the UI
echo -e "\033[1;32m*** Starting apis-catalog-web UI ***\033[0m"

#cat /apis-catalog-web/.env.production
#cd /apis-catalog-web/ && npm run build

# Start the server
echo -e "\033[1;32m*** Starting apis-catalog Server ***\033[0m"
export API_SERVER_CONFIG_FILE=/apis-catalog/config/local.toml
RUST_LOG="info,apis_catalog_server=debug" /apis-catalog/apis_catalog_server