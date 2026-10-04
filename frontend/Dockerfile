# ============ Stage 1: Build React app with Node 20 ============
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source
COPY . .

# Build production bundle
RUN npm run build

# ============ Stage 2: Serve with Nginx ============
FROM nginx:alpine

# Copy built React app
COPY --from=build /app/dist /usr/share/nginx/html

# Copy Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]