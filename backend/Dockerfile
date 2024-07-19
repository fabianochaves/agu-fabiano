# Usando a imagem oficial do PHP 8.1
FROM php:8.1-fpm

# Instalar extensões necessárias
RUN apt-get update && apt-get install -y \
    libpq-dev \
    libzip-dev \
    zip \
    unzip \
    && docker-php-ext-install pdo_mysql zip

# Instalar Vi (Vim)
RUN apt-get update && apt-get install -y vim

# Instalar Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Instalar Symfony CLI
RUN curl -sS https://get.symfony.com/cli/installer | bash \
    && mv /root/.symfony5/bin/symfony /usr/local/bin/symfony

# Configurar o diretório de trabalho
WORKDIR /var/www

# Copiar arquivos da aplicação
COPY . .

# Instalar dependências do Symfony
ENV COMPOSER_ALLOW_SUPERUSER=1

# Configuração do Composer para permitir o plugin symfony/runtime
#RUN composer config --no-plugins allow-plugins.symfony/runtime true

# Instala as dependências do Composer
#RUN composer install --no-interaction --optimize-autoloader

# Configurar o PATH para incluir o Symfony CLI
#ENV PATH="/root/.symfony5/bin:${PATH}"

# Comando padrão para iniciar o container
CMD ["php-fpm"]
