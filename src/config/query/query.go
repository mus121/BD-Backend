package query

import (
	"BD-APPLIACTION/src/config"
	"fmt"
	"log"
	"time"
)

// Struct for request body
type ConnectionProfileRequest struct {
	PublicIdentifier string `json:"publicIdentifier" binding:"required"`
	EntityUrn        string `json:"entityUrn" binding:"required"`
	IsConnected      bool   `json:"isConnected"`
}

// Saves session data to the database.
func SaveSessionData(userId, email, sessionToken, refreshToken string, sessionTTL, refreshTTL time.Duration) error {
	db := config.DB
	query := `
		INSERT INTO users (id ,email, session_token, refresh_token, session_expires_at, refresh_expires_at, created_at, updated_at)
		VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())
		ON CONFLICT (email) DO UPDATE SET
			session_token = EXCLUDED.session_token,
			refresh_token = EXCLUDED.refresh_token,
			session_expires_at = EXCLUDED.session_expires_at,
			refresh_expires_at = EXCLUDED.refresh_expires_at,
			updated_at = NOW()
	`
	result := db.Exec(query, userId, email, sessionToken, refreshToken, time.Now().Add(sessionTTL), time.Now().Add(refreshTTL))
	if result.Error != nil {
		log.Printf("Database error while saving session data: %v", result.Error)
		return result.Error
	}
	return nil
}

// Save connection profile data to the database
func SaveConnectionProfile(userID string, body *ConnectionProfileRequest) error {
	query := `
		INSERT INTO linkedinprofile (user_id, publicidentifier, entityUrn, is_connected)
		VALUES ($1, $2, $3, $4)
	`
	result := config.DB.Exec(query, userID, body.PublicIdentifier, body.EntityUrn, body.IsConnected)
	if result.Error != nil {
		fmt.Printf("Database error: %v\n", result.Error)
		return result.Error
	}
	return nil
}
