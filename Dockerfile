FROM node:22-bookworm-slim

WORKDIR /app

RUN corepack enable

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .

EXPOSE 5173

CMD ["yarn", "run", "dev", "--host", "0.0.0.0"]
