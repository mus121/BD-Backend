package aiService

import (
	"bytes"
	"encoding/json"
	"io/ioutil"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

type SuggestProfilesRequest struct {
	EntityURN        string `json:"entity_urn"`
	PublicIdentifier string `json:"public_identifier" binding:"required"`
}

func SuggestProfiles(ctx *gin.Context) {
	// Parse the request body
	var req SuggestProfilesRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request data"})
		return
	}

	if req.PublicIdentifier == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "PublicIdentifier is required"})
		return
	}

	// Prepare the payload for the external API
	payload := map[string]string{
		"entity_urn":        req.EntityURN,
		"public_identifier": req.PublicIdentifier,
	}
	jsonPayload, err := json.Marshal(payload)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to encode request payload"})
		return
	}

	// Make a POST request to the external API
	apiURL := "https://ai-bd-production-620091903831.us-central1.run.app/bd/find_person"
	resp, err := http.Post(apiURL, "application/json", bytes.NewBuffer(jsonPayload))

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to call external API"})
		return
	}
	defer resp.Body.Close()

	// Read and parse the response from the external API
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to read API response"})
		return
	}

	// Log the external API response for debugging
	log.Printf("Payload sent to external API: %v", string(jsonPayload))
	log.Printf("External API Response: %s", string(body))

	// Return the API response to the frontend
	ctx.Data(resp.StatusCode, "application/json", body)
}
