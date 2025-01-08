package middleware

import (
	"BD-Backend/internal/service/auth"
	"net/http"

	"github.com/gin-gonic/gin"
)

func AuthMiddleware(authService auth.GoogleAuthService) gin.HandlerFunc {
	return func(c *gin.Context) {
		token, err := c.Cookie("session_token")
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "No authentication token"})
			c.Abort()
			return
		}

		valid, err := authService.ValidateToken(c, token)
		if err != nil || !valid {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid or expired token"})
			c.Abort()
			return
		}

		c.Next()
	}
}
