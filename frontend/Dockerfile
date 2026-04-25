# ---- Frontend Dockerfile ----
# Multi-stage build: build with Node, serve with Nginx.

# Stage 1: Build the React/Vite application
FROM node:20-alpine AS build

WORKDIR /app

# Accept the API URL as a build argument (/api for production with ingress)
ARG VITE_API_URL="/api"
ENV VITE_API_URL=$VITE_API_URL

# Copy package files first to leverage Docker layer caching
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the source code
COPY . .

# Build the production bundle (Vite bakes VITE_* env vars at build time)
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:stable-alpine

# Copy the built assets from the build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom Nginx config to handle SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
