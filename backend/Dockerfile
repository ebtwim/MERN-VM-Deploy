# Backend Dockerfile
FROM node:20-alpine


WORKDIR /app


COPY package*.json yarn.lock* ./

RUN npm ci --only=production || npm install --only=production


COPY . .


ENV NODE_ENV=production
EXPOSE 6200


CMD ["node", "app.js"]
