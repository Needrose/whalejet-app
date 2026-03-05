FROM node:20-alpine

RUN apk add --no-cache python3 py3-pip make g++ gcc

RUN pip3 install wisp-python --break-system-packages || pip3 install wisp-python

ENV NODE_ENV=production
WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./

RUN pnpm install

COPY . .

EXPOSE 8080

CMD ["sh", "-c", "python3 -m wisp.server --host 0.0.0.0 --port 8081 & pnpm start"]