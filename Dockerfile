# Use a base image with g++
FROM gcc:13

# Set working directory
WORKDIR /app

# Copy source code
COPY . .

# Compile the C++ program
RUN g++ -o airline main.cpp

# Command to run the program
CMD ["./airline"]
