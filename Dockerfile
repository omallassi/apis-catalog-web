FROM ghcr.io/omallassi/apis-catalog:master


RUN apt-get update
RUN apt-get install -y ca-certificates curl gnupg
RUN mkdir -p /etc/apt/keyrings
RUN curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg

RUN echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_20.x nodistro main" | tee /etc/apt/sources.list.d/nodesource.list

RUN apt-get update
RUN apt-get install nodejs -y

# RUN curl -sL https://deb.nodesource.com/setup_21.x | bash -
# RUN apt-get install -y nodejs
# RUN npm install -g npm@9.7.2

WORKDIR /apis-catalog-web

COPY ./ ./

# TODO
# instancier ./docker-config/config-template.json > CONFIG .json 
# and subsenv 
# all of this in the entrypoint and that should be ok

# RUN REACT_APP_DOMAIN=${DOMAIN} \ 
#   REACT_APP_API_KEY=${API_KEY} \ 
#   npm run build 

RUN npm install
# RUN npm run build

#ENTRYPOINT [ "./docker-config/entrypoint.sh" , "--variables"]