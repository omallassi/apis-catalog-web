FROM apis-catalog/apis-catalog:latest

RUN curl -sL https://deb.nodesource.com/setup_17.x | bash -
RUN apt-get install -y nodejs
RUN npm install -g npm@8.5.3

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