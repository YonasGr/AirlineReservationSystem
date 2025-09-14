# Use Node.js as the base image
FROM node:20

# Set working directory inside container
WORKDIR /app

# Copy package.json and package-lock.json first
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all project files
COPY . .

# Build the app (if needed, e.g., Vite/Next.js build step)
RUN npm run build

# Expose the app port (change if your server uses a different one)
EXPOSE 3000

# Start the server
CMD ["npm", "run", "start"]
