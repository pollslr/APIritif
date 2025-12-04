FROM node:latest

EXPOSE 3000

WORKDIR /usr/src/app/

ADD package.json ./
RUN npm install

ADD app/ ./app/
ADD public/ ./public/
ADD tsconfig.json next-env.d.ts next.config.ts postcss.config.mjs ./
RUN npm run build

CMD ["npm", "start"]
