FROM node:20

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

COPY . .

# Install Playwright dependencies and browsers
RUN npx playwright install-deps
RUN npx playwright install

CMD ["node", "index.js"]
