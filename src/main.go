package main

import (
	"log"
	"os"

	"BD-APPLIACTION/src/config"
	"BD-APPLIACTION/src/config/google"
	"BD-APPLIACTION/src/routes/public/googleAuth"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	// Load environment variables
	if err := godotenv.Load(".env"); err != nil {
		log.Fatal("Error loading .env file")
	}
	config.ConnectDatabase()
	// Initialize Google OAuth
	google.InitgoogleOAuth()

	// Set up Gin router and routes
	r := gin.Default()
	googleAuth.Googleauth(r)

	// Run server on specified or default port
	port := os.Getenv("PORT")
	if port == "" {
		port = "8000"
	}
	log.Fatal(r.Run(":" + port))
}
