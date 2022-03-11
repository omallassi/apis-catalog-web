FROM apis-catalog/apis-catalog:latest

RUN curl -sL https://deb.nodesource.com/setup_17.x | bash -
RUN apt-get install -y nodejs
RUN npm install -g npm@8.5.3

WORKDIR /apis-catalog-web

COPY ./ ./

RUN npm install
RUN npm run build

#ENTRYPOINT [ "./docker-config/entrypoint.sh" , "--variables"]