package followprofile

import (
	"BD-APPLIACTION/src/config"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

func Connectionprofile(ctx *gin.Context) {
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
	fmt.Println("Body", body)
	// Step 3: Insert data into linkedinprofile table
	query := `
		INSERT INTO linkedinprofile (user_id, publicidentifier, entityUrn, is_connected)
		VALUES ($1, $2, $3, $4)
	`
	result := config.DB.Exec(query, userID, body.PublicIdentifier, body.EntityUrn, body.IsConnected)
	if result.Error != nil {
		fmt.Printf("Database error: %v\n", result.Error)
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Database operation failed"})
		return
	}

	// Step 4: Respond with success
	ctx.JSON(http.StatusOK, gin.H{"message": "Profile saved successfully"})
}

func GetConnectionProfile(ctx *gin.Context) {
	// Step 1: Retrieve user ID from cookie
	userID := "107565970179157192661"
	// userID, err := ctx.Cookie("user_id")
	// if err != nil {
	// 	ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized: User ID not found"})
	// 	return
	// }

	// Step 2: Query the database to fetch profile data
	var profiles []struct {
		PublicIdentifier string `json:"publicIdentifier" gorm:"column:publicidentifier"`
	}

	query := `
        SELECT publicidentifier
        FROM linkedinprofile
        WHERE user_id = $1
    `
	if err := config.DB.Debug().Raw(query, userID).Scan(&profiles).Error; err != nil {
		fmt.Printf("Database error: %v\n", err)
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve profile data"})
		return
	}

	// Step 3: Respond with the profile data
	ctx.JSON(http.StatusOK, gin.H{"profiles": profiles})
}
