FROM node:20.9.0-bookworm-slim AS builder
WORKDIR /apis-catalog-web-clone
COPY ./ ./
RUN npm install && npm run build

FROM ghcr.io/omallassi/apis-catalog:master AS runner

#RUN apt-get update && \
#    apt-get install -y ca-certificates curl gnupg && \
#    mkdir -p /etc/apt/keyrings && \
#    curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg && \
#    echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_20.x nodistro main" | tee /etc/apt/sources.list.d/nodesource.list && \
#    apt-get update && \
#    apt-get install nodejs -y

#WORKDIR /apis-catalog-web

COPY --from=builder /apis-catalog-web-clone/build /apis-catalog-web/build

#RUN npm install && npm run build
#--production 

# RUN npm run build
#ENTRYPOINT [ "./docker-config/entrypoint.sh" , "--variables"]