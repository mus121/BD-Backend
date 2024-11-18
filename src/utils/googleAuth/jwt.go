package googleAuth

import (
	"crypto/rand"
	"encoding/base64"
	"log"
	"os"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v4"
)

var jwtSecret = []byte(os.Getenv("JWT_SECRET_KEY"))
var refreshTokenSecret = []byte(os.Getenv("REFRESH_TOKEN_SECRET_KEY"))

type Claims struct {
	Email string `json:"email"`
	jwt.RegisteredClaims
}

type RefreshClaims struct {
	Email string `json:"email"`
	jwt.RegisteredClaims
}

// Generatejwt generates a JWT with the specified expiration time.
func Generatejwt(email string, expiration time.Duration) (string, error) {
	expirationTime := time.Now().Add(expiration)
	claims := Claims{
		Email: email,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expirationTime),
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(jwtSecret)
}

// Generaterefreshtoken generates a refresh token with a longer expiration time.
func Generaterefreshtoken(email string, expiration time.Duration) (string, error) {
	expirationTime := time.Now().Add(expiration)
	refreshClaims := RefreshClaims{
		Email: email,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expirationTime),
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, refreshClaims)
	return token.SignedString(refreshTokenSecret)
}

// SetSessionCookies sets session cookies for the user.
func SetSessionCookies(c *gin.Context, sessionToken, refreshToken, email string) {
	c.SetCookie("session_token", sessionToken, 3600, "/", os.Getenv("DOMAIN"), false, true)
	c.SetCookie("refresh_token", refreshToken, 3600, "/", os.Getenv("DOMAIN"), false, true)
	c.SetCookie("user_email", email, 3600, "/", os.Getenv("DOMAIN"), false, true)
}

// Validatetoken validates the given token string.
func Validatetoken(tokenString string) bool {
	token, err := jwt.ParseWithClaims(tokenString, &Claims{}, func(token *jwt.Token) (interface{}, error) {
		return jwtSecret, nil
	})
	return err == nil && token.Valid
}

// GenerateStateOauthCookie generates a random OAuth state and encodes it in base64.
func GenerateStateOauthCookie() string {
	b := make([]byte, 16)
	if _, err := rand.Read(b); err != nil {
		log.Println("Error generating random state:", err)
		return ""
	}
	return base64.URLEncoding.EncodeToString(b)
}

// Isblockeddomain checks if the user's email domain is blocked.
func Isblockeddomain(email string) bool {
	domain := strings.Split(email, "@")[1]
	blockedDomains := map[string]bool{
		"gmail.com": true, "yahoo.com": true, "outlook.com": true,
		"hotmail.com": true, "live.com": true, "aol.com": true,
	}
	return blockedDomains[domain]
}
