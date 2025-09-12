# Etapa de build
FROM node:20-slim AS builder

WORKDIR /app

# Copiamos dependencias primero (cache)
COPY package*.json ./
RUN npm install

# Copiamos el resto del código
COPY . .

ARG port=3001
ENV PORT=$port

# Generamos el build
RUN npm run build


# Etapa de runtime (ligera)
FROM node:20-slim

WORKDIR /app

# Copiamos solo lo necesario
COPY package*.json ./
RUN npm install --omit=dev

# Copiamos el build final
COPY --from=builder /app/dist ./dist

EXPOSE ${PORT}

CMD ["npm", "run", "preview"]
