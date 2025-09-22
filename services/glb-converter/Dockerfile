FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

# Install system dependencies for GLTF processing
RUN apt-get update && apt-get install -y \
    libgl1 \
    libxi6 \
    libgconf-2-4 \
    && rm -rf /var/lib/apt/lists/*

COPY . .

ENV PORT=3001
EXPOSE 3001

CMD ["node", "index.js"]
