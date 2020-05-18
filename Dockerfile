FROM nginx:alpine

WORKDIR /usr/share/nginx/html/

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY ./dist/syg-client/ .

RUN chmod 777 *

COPY ./docker-entrypoint.sh .
RUN chmod +x ./docker-entrypoint.sh

COPY /nginx.conf /etc/nginx/conf.d/default.conf

ENTRYPOINT ["./docker-entrypoint.sh"]  
