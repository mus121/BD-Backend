package followprofile

import (
	"BD-APPLIACTION/src/config"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

func ConnectionProfile(ctx *gin.Context) {
	// Step 1: Retrieve user ID from cookie
	userID, err := ctx.Cookie("user_id")
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized: User ID not found"})
		return
	}

	// Step 2: Parse request body
	var body struct {
		PublicIdentifier string `json:"publicIdentifier" binding:"required"`
		EntityUrn        string `json:"entityUrn" binding:"required"`
		IsConnected      bool   `json:"isConnected"`
	}
	if err := ctx.ShouldBindJSON(&body); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload"})
		return
	}

	// Step 3: Handle follow or unfollow logic
	if body.IsConnected {
		// Insert or update connection
		query := `
			INSERT INTO linkedinprofile (user_id, publicidentifier, entityUrn, is_connected, deleted_at)
			VALUES ($1, $2, $3, $4, NULL)
			ON CONFLICT (user_id, publicidentifier)
			DO UPDATE SET is_connected = EXCLUDED.is_connected, deleted_at = NULL
		`
		result := config.DB.Exec(query, userID, body.PublicIdentifier, body.EntityUrn, body.IsConnected)
		if result.Error != nil {
			fmt.Printf("Database error during insert/update: %v\n", result.Error)
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Database operation failed"})
			return
		}
	} else {
		// Soft delete connection by setting deleted_at
		query := `
			UPDATE linkedinprofile
			SET is_connected = false, deleted_at = NOW()
			WHERE user_id = $1 AND publicidentifier = $2
		`
		result := config.DB.Exec(query, userID, body.PublicIdentifier)
		if result.RowsAffected == 0 {
			ctx.JSON(http.StatusNotFound, gin.H{"error": "Record not found for deletion"})
			return
		}
		if result.Error != nil {
			fmt.Printf("Database error during update: %v\n", result.Error)
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Database operation failed"})
			return
		}
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "Profile updated successfully"})
}

// GetConnectionProfile retrieves all connected profiles for the logged-in user
func GetConnectionProfile(ctx *gin.Context) {
	// Step 1: Retrieve user ID from cookie
	userID, err := ctx.Cookie("user_id")
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized: User ID not found"})
		return
	}

	// Step 2: Query the database for connected profiles
	var profiles []struct {
		PublicIdentifier string `json:"publicIdentifier" gorm:"column:publicidentifier"`
		EntityUrn        string `json:"entityUrn" gorm:"column:entityUrn"`
	}

	query := `
        SELECT publicidentifier, entityUrn
        FROM linkedinprofile
        WHERE user_id = $1 AND is_connected = TRUE
    `
	if err := config.DB.Debug().Raw(query, userID).Scan(&profiles).Error; err != nil {
		fmt.Printf("Database error: %v\n", err)
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve profile data"})
		return
	}

	// Step 3: Respond with the profiles
	ctx.JSON(http.StatusOK, gin.H{"profiles": profiles})
}
