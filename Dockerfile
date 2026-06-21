FROM node:20-alpine

# Install build tools needed for better-sqlite3 (and other native modules)
RUN apk add --no-cache build-base python3

WORKDIR /server

COPY server/package.json server/package-lock.json ./

RUN npm install
# ... rest of your file stays the same

EXPOSE 3000
CMD npm start