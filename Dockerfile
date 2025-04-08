# Step 1: Use Node.js image as the base
FROM node:16 AS build

# Step 2: Set working directory
WORKDIR /app

# Step 3: Install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Step 4: Copy application files and build the app
COPY . ./
RUN npm run build

# Step 5: Install serve globally to serve the app
RUN npm install -g serve

# Step 6: Expose the port that serve will use (default 5000)
EXPOSE 5000

# Step 7: Serve the built app
CMD ["serve", "-s", "dist", "-l", "5000"]