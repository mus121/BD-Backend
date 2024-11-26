package helper

import (
	"BD-APPLIACTION/src/config/google"
	"BD-APPLIACTION/src/config/query"
	"BD-APPLIACTION/src/utils/googleAuth"
	"context"
	"encoding/json"
	"fmt"
	"os"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"golang.org/x/oauth2"
)

// Generates and stores a state parameter for OAuth in a cookie.
func GenerateStateOauthCookie(c *gin.Context) string {
	state := googleAuth.GenerateStateOauthCookie()
	c.SetCookie("oauthstate", state, 3600, "/", "localhost", false, true)
	return state
}

// Checks if the OAuth state matches the stored cookie value.
func ValidateOAuthState(c *gin.Context) bool {
	state, err := c.Cookie("oauthstate")
	return err == nil && c.Query("state") == state
}

// Fetches user info from Google APIs using the access token
func FetchUserInfo(token *oauth2.Token) (map[string]interface{}, error) {
	client := google.GoogleOauthConfig.Client(context.Background(), token)

	// Fetch basic user info
	resp, err := client.Get("https://www.googleapis.com/oauth2/v2/userinfo")
	if err != nil {
		return nil, err
	}
	defer func() {
		if closeErr := resp.Body.Close(); closeErr != nil {
			fmt.Println("Error closing response body:", closeErr)
		}
	}()

	var userData map[string]interface{}
	if err := json.NewDecoder(resp.Body).Decode(&userData); err != nil {
		return nil, err
	}

	// Fetch extended user profile using Google People API
	profileResp, err := client.Get("https://people.googleapis.com/v1/people/me?personFields=addresses,biographies,organizations,locations")
	if err != nil {
		return nil, err
	}
	defer func() {
		if closeErr := profileResp.Body.Close(); closeErr != nil {
			// Log the error if needed or handle it as appropriate
			fmt.Println("Error closing profile response body:", closeErr)
		}
	}()

	var profileData map[string]interface{}
	if err := json.NewDecoder(profileResp.Body).Decode(&profileData); err != nil {
		return nil, err
	}

	return userData, nil
}

// Validates user email and checks if it's from a blocked domain.
func ValidateUserEmail(c *gin.Context, userData map[string]interface{}) bool {
	email, ok := userData["email"].(string)
	return ok && !googleAuth.Isblockeddomain(email)
}

// Sets the session cookies and saves session-related data.
func SetSession(c *gin.Context, userData map[string]interface{}) error {
	email, ok := userData["email"].(string)
	if !ok {
		return fmt.Errorf("invalid user email")
	}

	// Generate access and refresh tokens
	accessToken, err := googleAuth.Generatejwt(email, 15*time.Minute)
	if err != nil {
		return err
	}
	refreshToken, err := googleAuth.Generaterefreshtoken(email, 7*24*time.Hour)
	if err != nil {
		return err
	}

	// Save session-related cookies
	setCookie(c, "session_token", accessToken, 15*60)       // 15 minutes
	setCookie(c, "refresh_token", refreshToken, 7*24*60*60) // 7 days
	setCookie(c, "user_email", email, 7*24*60*60)           // 7 days
	// Save userId if available (ensure it's a string)
	if userId, ok := userData["id"].(string); ok {

		setCookie(c, "user_id", userId, 7*24*60*60)
	} else if userId, ok := userData["id"].(int); ok {
		setCookie(c, "user_id", strconv.Itoa(userId), 7*24*60*60)
	}
	// Save optional user attributes like name
	if name, ok := userData["name"].(string); ok {
		setCookie(c, "user_name", name, 7*24*60*60) // 7 days
	}

	// Save session data to the database
	return query.SaveSessionData(userData["id"].(string), email, accessToken, refreshToken, 15*time.Minute, 7*24*time.Hour)
}

// Sets a secure cookie with the given parameters.
func setCookie(c *gin.Context, name, value string, maxAge int) {
	// Check if the environment is production to enable secure cookies
	secure := os.Getenv("ENV") == "production"
	domain := os.Getenv("DOMAIN")

	// Set cookie with secure flag if in production
	c.SetCookie(name, value, maxAge, "/", domain, secure, true)
}

// Clears all session-related cookies.
func ClearSessionCookies(c *gin.Context) {
	for _, cookie := range []string{"session_token", "refresh_token", "user_email", "user_name", "user_id"} {
		c.SetCookie(cookie, "", -1, "/", os.Getenv("DOMAIN"), false, true)
	}
}
