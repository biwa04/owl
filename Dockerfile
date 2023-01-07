FROM denoland/deno:latest

WORKDIR /app

USER deno

COPY deps.ts .
RUN deno cache deps.ts

ADD . .

RUN deno cache main.ts

CMD ["run", "--allow-net", "--allow-read", "main.ts"]
