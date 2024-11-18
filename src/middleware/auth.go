package middleware

import (
	"BD-APPLIACTION/src/utils/googleAuth"
	"net/http"

	"github.com/gin-gonic/gin"
)

func Authmiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		token, err := c.Cookie("session_token")
		if err != nil || !googleAuth.Validatetoken(token) {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
			c.Abort()
			return
		}
		c.Next()
	}
}
