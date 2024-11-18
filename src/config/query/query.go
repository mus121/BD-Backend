package query

import (
	"BD-APPLIACTION/src/config"
	"log"
	"time"
)

// Saves session data to the database.
func SaveSessionData(email, sessionToken, refreshToken string, sessionTTL, refreshTTL time.Duration) error {
	db := config.DB
	query := `
		INSERT INTO users (email, session_token, refresh_token, session_expires_at, refresh_expires_at, created_at, updated_at)
		VALUES (?, ?, ?, ?, ?, NOW(), NOW())
		ON CONFLICT (email) DO UPDATE SET
			session_token = EXCLUDED.session_token,
			refresh_token = EXCLUDED.refresh_token,
			session_expires_at = EXCLUDED.session_expires_at,
			refresh_expires_at = EXCLUDED.refresh_expires_at,
			updated_at = NOW()
	`
	result := db.Exec(query, email, sessionToken, refreshToken, time.Now().Add(sessionTTL), time.Now().Add(refreshTTL))
	if result.Error != nil {
		log.Printf("Database error while saving session data: %v", result.Error)
		return result.Error
	}
	return nil
}
