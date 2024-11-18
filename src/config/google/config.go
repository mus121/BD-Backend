package google

import (
	"log"
	"os"

	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
)

var GoogleOauthConfig *oauth2.Config

func InitgoogleOAuth() {
	// Load environment variables and log fatal error if any are missing
	clientID, clientSecret, redirectURL := os.Getenv("GOOGLE_CLIENT_ID"), os.Getenv("GOOGLE_CLIENT_SECRET"), os.Getenv("GOOGLE_REDIRECT_URL")
	if clientID == "" || clientSecret == "" || redirectURL == "" {
		log.Fatal("Missing Google OAuth environment variables: set GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and GOOGLE_REDIRECT_URL.")
	}

	// Set up Google OAuth configuration
	GoogleOauthConfig = &oauth2.Config{
		ClientID:     clientID,
		ClientSecret: clientSecret,
		RedirectURL:  redirectURL,
		Scopes:       []string{"https://www.googleapis.com/auth/userinfo.email", "https://www.googleapis.com/auth/userinfo.profile", "https://www.googleapis.com/auth/contacts.readonly"},
		Endpoint:     google.Endpoint,
	}

	log.Println("Google OAuth configuration initialized.")
}
