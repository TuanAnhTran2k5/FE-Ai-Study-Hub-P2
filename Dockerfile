# STAGE 1: Build static files using Node.js
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci || npm install

COPY . .

# Environment variables for build time
ARG VITE_API_URL=http://223.130.11.23:8080/api
ARG VITE_GOOGLE_CLIENT_ID=852155010975-aree4h5ahmtj2k69o7ruafnj9crp3kq7.apps.googleusercontent.com
ARG VITE_SYSTEM_ADMIN_EMAIL=aistudyhub062026@gmail.com

ENV VITE_API_URL=$VITE_API_URL
ENV VITE_GOOGLE_CLIENT_ID=$VITE_GOOGLE_CLIENT_ID
ENV VITE_SYSTEM_ADMIN_EMAIL=$VITE_SYSTEM_ADMIN_EMAIL

RUN npm run build

# STAGE 2: Serve static files using Nginx
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
