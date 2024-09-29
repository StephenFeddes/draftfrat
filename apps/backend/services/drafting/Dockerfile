FROM golang:1.23

WORKDIR /app

# Install any necessary dependencies
RUN apt-get update && apt-get install -y libc6

# Copy go mod and sum files
COPY go.mod go.sum ./
RUN go mod download

# Copy the source code
COPY . .

# Expose port 8080 to the outside world
EXPOSE 8080

# Command to run the application in development mode
CMD ["go", "run", "cmd/memorytrivia/main.go"]