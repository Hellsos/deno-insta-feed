FROM hayd/alpine-deno:1.5.2

EXPOSE 8000

WORKDIR /app

USER deno

COPY --chown=deno . .

#### Run `docker run` command described in readme for server
