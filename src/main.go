package main

import (
	"log"
	"os"

	"BD-APPLIACTION/src/config"
	"BD-APPLIACTION/src/config/google"
	"BD-APPLIACTION/src/routes/private"
	"BD-APPLIACTION/src/routes/public"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	// Load environment variables
	if err := godotenv.Load(".env"); err != nil {
		log.Fatal("Error loading .env file")
	}

	// Connect to the database
	config.ConnectDatabase()

	// Initialize Google OAuth
	google.InitgoogleOAuth()

	// Set up Gin router
	router := gin.Default()

	// Add CORS middleware before defining routes
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

	// Define your routes
	public.Googleauth(router)
	private.Linkedfollowprofile(router)

	// Test CORS
	router.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{"message": "CORS works!"})
	})

	// Run server on specified or default port
	port := os.Getenv("PORT")
	if port == "" {
		port = "8000"
	}
	log.Printf("Server is running on port %s", port)
	log.Fatal(router.Run(":" + port))
}
