FROM node:20

WORKDIR usr/src/app

RUN npm install -g pnpm

COPY package*.json ./

RUN pnpm install

COPY . .

CMD ["pnpm", "exec", "ts-node", "-r", "tsconfig-paths/register", "src/apps/shadowing/index.ts"]
