FROM node:8.7.0
#RUN apt-get update && apt-get install -y cron
RUN mkdir /app
WORKDIR /app
ADD . .
RUN yarn
#CMD env > /etc/environment && service cron start && service cron status && crontab .crontab && crontab -l && npm start
CMD npm start