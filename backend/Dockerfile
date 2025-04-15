FROM node:20

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy tsconfig first for the build
COPY tsconfig.json ./

# Copy source files
COPY src/ ./src/
COPY prisma/ ./prisma/

# Generate Prisma client
RUN npx prisma generate

# Build TypeScript - explicitly show output
RUN echo "Building TypeScript..." && \
    npx tsc && \
    echo "TypeScript build complete" && \
    ls -la dist/

# Copy remaining files
COPY . .

# Create entrypoint script
RUN echo '#!/bin/bash' > /entrypoint.sh && \
    echo 'set -e' >> /entrypoint.sh && \
    echo 'echo "Directory listing:"' >> /entrypoint.sh && \
    echo 'ls -la' >> /entrypoint.sh && \
    echo 'echo "Source files:"' >> /entrypoint.sh && \
    echo 'ls -la src/' >> /entrypoint.sh && \
    echo 'echo "Compiled files:"' >> /entrypoint.sh && \
    echo 'ls -la dist/ || echo "No dist directory"' >> /entrypoint.sh && \
    echo 'echo "Waiting for database..."' >> /entrypoint.sh && \
    echo 'sleep 3' >> /entrypoint.sh && \
    echo 'echo "Running migrations..."' >> /entrypoint.sh && \
    echo 'npx prisma migrate deploy' >> /entrypoint.sh && \
    echo 'echo "Starting application..."' >> /entrypoint.sh && \
    echo 'npm start' >> /entrypoint.sh && \
    chmod +x /entrypoint.sh

EXPOSE 8000

CMD ["/entrypoint.sh"]