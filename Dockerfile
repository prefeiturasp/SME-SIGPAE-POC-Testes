# Use a imagem oficial do Node.js
FROM node:16

# Instala o Xvfb e as bibliotecas necessárias
RUN apt-get update && apt-get install -y \
    xvfb \
    libnss3 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libgtk-3-0 \
    libgbm1 \
    libasound2 \
    libxcomposite1 \
    libxrandr2 \
    libxcursor1 \
    libxdamage1 \
    libxi6 \
    libxtst6 \
    libpango1.0-0 \
    fonts-liberation \
    libappindicator3-1 \
    libxss1 \
    lsb-release \
    wget \
    xdg-utils

# Cria o diretório de trabalho
RUN mkdir -p /SME-SIGPAE-POC-TESTES

# Define o diretório de trabalho
WORKDIR /SME-SIGPAE-POC-TESTES

# Copia os arquivos de pacotes do projeto
COPY package*.json /SME-SIGPAE-POC-TESTES/

# Instala as dependências do projeto
RUN npm install

# Copia todo o código do projeto para o contêiner
COPY . /SME-SIGPAE-POC-TESTES

# Comando para iniciar o Cypress usando o Xvfb
CMD ["xvfb-run", "npx", "cypress", "run"]
