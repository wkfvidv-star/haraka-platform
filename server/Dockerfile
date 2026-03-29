FROM node:20-alpine
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (npm install works without package-lock.json)
RUN npm install --omit=dev

# Copy prisma schema and generate client
COPY prisma ./prisma/
RUN npx prisma generate

# Copy all source files
COPY index.js ./
COPY routes ./routes/
COPY controllers ./controllers/
COPY middleware ./middleware/
COPY utils ./utils/
COPY services ./services/

EXPOSE 3001
CMD ["node", "index.js"]
