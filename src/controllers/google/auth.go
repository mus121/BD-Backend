package google

import (
	"BD-APPLIACTION/src/config/google"
	"BD-APPLIACTION/src/services/helper"
	"context"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
)

// Redirects user to Google's OAuth2 login.
func Handlegooglelogin(c *gin.Context) {
	state := helper.GenerateStateOauthCookie(c)
	c.Redirect(http.StatusTemporaryRedirect, google.GoogleOauthConfig.AuthCodeURL(state))
}

// Processes OAuth callback, validates state, retrieves user info, and sets session.
func Handlegooglecallback(c *gin.Context) {
	if !helper.ValidateOAuthState(c) || !exchangeTokenAndSetSession(c) {
		c.Redirect(http.StatusTemporaryRedirect, os.Getenv("AUTH_PAGE_URL"))
		return
	}
	c.Redirect(http.StatusTemporaryRedirect, os.Getenv("HOME_PAGE_URL"))
}

func exchangeTokenAndSetSession(c *gin.Context) bool {
	token, err := google.GoogleOauthConfig.Exchange(context.Background(), c.Query("code"))
	if err != nil {
		return false
	}

	userData, err := helper.FetchUserInfo(token)
	if err != nil || !helper.ValidateUserEmail(c, userData) || helper.SetSession(c, userData) != nil {
		c.Redirect(http.StatusTemporaryRedirect, os.Getenv("DOMAIN_BLOCKED_URL"))
		return false
	}
	return true
}

// Logs out by clearing session cookies.
func Handlelogout(c *gin.Context) {
	helper.ClearSessionCookies(c)
	c.JSON(http.StatusOK, gin.H{"message": "Successfully logged out"})
}
