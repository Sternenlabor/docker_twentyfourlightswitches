
FROM node:12-slim

WORKDIR /app

# Copy over the whole src folder content to /app/src/
COPY ./src/ ./

# Make a clean npm install and only install modules needed for production
RUN ls -la && cat package.json && npm ci --only=production

# Copy over the whole script folder content to /script/
ADD script/ /script/
# Make the start script executeable
RUN chmod +x /script/start.sh

# Enclose with brackets to pass signals like SIGTERM to process
CMD [ "/script/start.sh" ]
