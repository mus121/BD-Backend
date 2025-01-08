.PHONY: build run test lint migrate-up migrate-down docker-up docker-down setup

build:
	go build -o bin/main cmd/main.go

run:
	go run cmd/main.go

test:
	go test -v -race -cover ./...

lint:
	golangci-lint run

migrate-up:
	migrate -path migrations -database "postgres://postgres:root@localhost:5432/app_db?sslmode=disable" up

migrate-down:
	migrate -path migrations -database "postgres://postgres:root@localhost:5432/app_db?sslmode=disable" down

docker-up:
	docker-compose up -d

docker-down:
	docker-compose down

setup:
	go install github.com/golangci/golangci-lint/cmd/golangci-lint@latest
	go install -tags 'postgres' github.com/golang-migrate/migrate/v4/cmd/migrate@latest