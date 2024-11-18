package helper

import (
	"BD-APPLIACTION/src/config/google"
	"BD-APPLIACTION/src/config/query"
	"BD-APPLIACTION/src/utils/googleAuth"
	"context"
	"encoding/json"
	"fmt"
	"os"
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

	// Combine the basic and profile data
	userData["location"] = extractLocation(profileData)
	userData["education"] = extractEducation(profileData)

	// Check and add the profile image URL
	if imageURL, ok := userData["picture"].(string); ok {
		userData["image"] = imageURL
	}

	return userData, nil
}

// Extracts location from profile data
func extractLocation(profileData map[string]interface{}) interface{} {
	// If the "locations" field exists, extract the first location
	if locations, ok := profileData["locations"].([]interface{}); ok && len(locations) > 0 {
		return locations[0]
	}
	return nil
}

// Extracts education (organizations) from profile data
func extractEducation(profileData map[string]interface{}) interface{} {
	if organizations, ok := profileData["organizations"].([]interface{}); ok {
		for _, org := range organizations {
			orgMap := org.(map[string]interface{})
			if orgMap["type"] == "school" {
				return orgMap["name"]
			}
		}
	}
	return nil
}

// Validates user email and checks if it's from a blocked domain.
func ValidateUserEmail(c *gin.Context, userData map[string]interface{}) bool {
	email, ok := userData["email"].(string)
	return ok && !googleAuth.Isblockeddomain(email)
}

func SetSession(c *gin.Context, userData map[string]interface{}) error {
	email := userData["email"].(string)
	accessToken, err := googleAuth.Generatejwt(email, 15*time.Minute)
	if err != nil {
		return err
	}
	refreshToken, err := googleAuth.Generaterefreshtoken(email, 7*24*time.Hour)
	if err != nil {
		return err
	}

	// Save the basic information (email, accessToken, refreshToken, etc.)
	setCookie(c, "session_token", accessToken, 15*60)
	setCookie(c, "refresh_token", refreshToken, 7*24*60*60)
	setCookie(c, "user_email", email, 7*24*60*60)
	if name, ok := userData["name"].(string); ok {
		setCookie(c, "user_name", name, 7*24*60*60)
	}

	// Store additional information (location, education)
	if location, ok := userData["location"].(string); ok {
		setCookie(c, "user_location", location, 7*24*60*60)
	}
	if education, ok := userData["education"].(string); ok {
		setCookie(c, "user_education", education, 7*24*60*60)
	}

	// Set the user's profile image if available
	if image, ok := userData["image"].(string); ok {
		setCookie(c, "user_image", image, 7*24*60*60)
	}

	// Save session data to the database (if needed)
	return query.SaveSessionData(email, accessToken, refreshToken, 15*time.Minute, 7*24*time.Hour)
}

func setCookie(c *gin.Context, name, value string, maxAge int) {
	c.SetCookie(name, value, maxAge, "/", os.Getenv("DOMAIN"), false, true)
}

// Clears all session-related cookies.
func ClearSessionCookies(c *gin.Context) {
	for _, cookie := range []string{"session_token", "refresh_token", "user_email", "user_name"} {
		c.SetCookie(cookie, "", -1, "/", os.Getenv("DOMAIN"), false, true)
	}
}
