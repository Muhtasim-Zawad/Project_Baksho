# Use Node.js LTS
FROM node:18

# Set work directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy rest of the app
COPY . .

# Expose port
EXPOSE 5000

# Start the app
CMD ["npm", "start"]
