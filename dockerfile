FROM node:18.13.0-alpine
ADD . /app
WORKDIR /app
RUN npm install\
    && npm install typescript@4.9.5 -g
COPY . .
RUN npm run prebuild
RUN tsc
RUN ls
EXPOSE 8000
CMD npm start