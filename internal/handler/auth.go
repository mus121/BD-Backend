package handler

import (
	"net/http"

	"BD-Backend/internal/service/auth"
	"BD-Backend/pkg/logger"

	"github.com/gin-gonic/gin"
)

type AuthHandler struct {
	authService auth.GoogleAuthService
	logger      *logger.Logger
}

func NewAuthHandler(authService auth.GoogleAuthService, logger *logger.Logger) *AuthHandler {
	return &AuthHandler{
		authService: authService,
		logger:      logger,
	}
}

func (h *AuthHandler) HandleGoogleLogin(c *gin.Context) {
	state := generateStateToken()
	c.SetCookie("oauth_state", state, 3600, "/", "", false, true)

	authURL := h.authService.GetAuthURL(state)
	c.Redirect(http.StatusTemporaryRedirect, authURL)
}

func generateStateToken() string {
	return "new"
}

func (h *AuthHandler) HandleGoogleCallback(c *gin.Context) {
	state, err := c.Cookie("oauth_state")
	if err != nil || state != c.Query("state") {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid state parameter"})
		return
	}

	code := c.Query("code")
	user, err := h.authService.HandleCallback(c, code)
	if err != nil {
		h.logger.Error("Failed to handle Googlecallback", "error", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to authenticate"})
		return
	}

	// Set cookies
	c.SetCookie("session_token", user.SessionToken, int(15), "/", "", false, true)
	c.SetCookie("user_id", user.ID, int(15), "/", "", false, true)

	c.Redirect(http.StatusTemporaryRedirect, "/dashboard")
}

func (h *AuthHandler) HandleLogout(c *gin.Context) {
	// Clear cookies
	c.SetCookie("session_token", "", -1, "/", "", false, true)
	c.SetCookie("user_id", "", -1, "/", "", false, true)
	c.SetCookie("oauth_state", "", -1, "/", "", false, true)

	c.JSON(http.StatusOK, gin.H{"message": "Successfully logged out"})
}
