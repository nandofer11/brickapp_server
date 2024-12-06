# Usa una imagen base de Node.js
FROM node:18

# Instala dependencias adicionales para Puppeteer
RUN apt-get update && apt-get install -y \
  ca-certificates \
  fonts-liberation \
  libappindicator3-1 \
  libatk-bridge2.0-0 \
  libatk1.0-0 \
  libcups2 \
  libdrm2 \
  libgbm1 \
  libglib2.0-0 \
  libnspr4 \
  libnss3 \
  libpango1.0-0 \
  libu2f-udev \
  libvulkan1 \
  libasound2 \
  xdg-utils \
  wget \
  --no-install-recommends && \
  apt-get clean && rm -rf /var/lib/apt/lists/*

# Establece el directorio de trabajo
WORKDIR /app

# Copia los archivos de configuración
COPY package*.json ./ 

# Instala las dependencias de la aplicación
RUN npm install

# Copia el resto de los archivos de tu aplicación
COPY . .

# Expone el puerto
EXPOSE 3002

# Comando para iniciar la aplicación
CMD ["node", "index.js"]
