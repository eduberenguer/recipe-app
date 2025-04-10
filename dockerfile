# Usa una imagen base de Go para construir PocketBase
FROM golang:1.18 AS build

WORKDIR /app

# Copia los archivos de tu aplicación
COPY . .

# Instala PocketBase
RUN wget https://github.com/pocketbase/pocketbase/releases/download/v0.8.3/pocketbase_0.8.3_linux_amd64.tar.gz \
    && tar -xvzf pocketbase_0.8.3_linux_amd64.tar.gz

# Usa una imagen más ligera para correr PocketBase
FROM alpine:3.15

WORKDIR /app

# Copia PocketBase desde el contenedor anterior
COPY --from=build /app/pocketbase /usr/local/bin/pocketbase

# Expon los puertos
EXPOSE 10000

CMD ["pocketbase", "serve", "--http=0.0.0.0:10000"]
