# Use the official Golang image as a builder
FROM golang:1.20 as builder

# Set the working directory in the container
WORKDIR /app

# Copy the Go mod and sum files to the container
COPY go.mod go.sum ./

# Download all dependencies. Dependencies will be cached if the go.mod and go.sum files are not changed
RUN go mod download

# Copy the source code to the container
COPY . .

# Build the application
RUN go build -o main src/main.go

# Start a new stage from scratch for the final image
FROM golang:1.20

# Set working directory and copy the executable from builder
WORKDIR /app
COPY --from=builder /app/main .
COPY .env .env

# Expose port 8080 to the outside world
EXPOSE 8000

# Command to run the executable
CMD ["./main"]
