package googleAuth

import (
	"BD-APPLIACTION/src/controllers/google"
	"BD-APPLIACTION/src/middleware"

	"github.com/gin-gonic/gin"
)

func Googleauth(r *gin.Engine) {
	// Routes for Google OAuth process
	r.GET("/auth/google/login", google.Handlegooglelogin)
	r.GET("/auth/google/callback", google.Handlegooglecallback)
	r.GET("/auth/google/logout", google.Handlelogout)

	r.GET("/welcome", middleware.Authmiddleware(), func(c *gin.Context) {
		c.JSON(200, gin.H{"message": "Welcome to the application!"})
	})
}
