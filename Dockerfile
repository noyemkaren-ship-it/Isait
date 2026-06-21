FROM node:20-alpine
RUN apk add --no-cache build-base python3
WORKDIR /server
COPY server/package.json server/package-lock.json ./
RUN npm install
EXPOSE 3000
CMD npm run dev