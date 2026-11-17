FROM node:24-alpine
WORKDIR /app
RUN chown node:node /app
COPY --chown=node:node package.json package-lock.json ./
COPY --chown=node:node src ./src
COPY --chown=node:node scripts/check.mjs scripts/build.mjs ./scripts/
USER node
RUN npm run build
EXPOSE 3000
ENV NODE_ENV=production
CMD ["node", "dist/src/server.js"]
