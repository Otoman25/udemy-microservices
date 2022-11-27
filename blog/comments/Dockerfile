# Use an existing docker image as a base
FROM node:14-alpine

WORKDIR /usr/app

# Copying package.json first to allow caching of package.json & npm install
COPY ./package.json ./
# Download and install dependencies
RUN npm install

# Copying all files after npm install to keep valid caching of dependencies
COPY ./ ./

# Tell image what to do when first started
CMD ["npm", "start"]

# Currently not working - cannot resolve host IP