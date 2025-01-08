package middleware

import (
	"errors"
	"net/http"
	"strings"

	"BD-Backend/internal/service/auth"
	"BD-Backend/pkg/logger"

	"github.com/gin-gonic/gin"
)

func AuthMiddleware(authService auth.GoogleAuthService, logger *logger.Logger) gin.HandlerFunc {
	return func(c *gin.Context) {
		token, err := extractToken(c)
		if err != nil {
			logger.Error("Auth token missing or invalid", "error", err)
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Authentication required"})
			c.Abort()
			return
		}

		user, err := authService.ValidateToken(c.Request.Context(), token)
		if err != nil {
			logger.Error("Token validation failed", "error", err)
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid or expired token"})
			c.Abort()
			return
		}

		// Set user info in context
		c.Set("user_id", user.ID)
		c.Set("user_email", user.Email)

		c.Next()
	}
}

func extractToken(c *gin.Context) (string, error) {
	token := c.GetHeader("Authorization")
	if token == "" {
		// Try cookie if header is not present
		var err error
		token, err = c.Cookie("session_token")
		if err != nil {
			return "", errors.New("no authentication token provided")
		}
		return token, nil
	}

	// Remove Bearer prefix if present
	token = strings.TrimPrefix(token, "Bearer ")
	return token, nil
}
