package aiServiceSimilarProfiles

import (
	"bytes"
	"encoding/json"
	"io/ioutil"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

type Identifier struct {
	EntityURN        string `json:"entity_urn"`
	PublicIdentifier string `json:"public_identifier" binding:"required"`
}

type AiSimilarProfilesRequest struct {
	Identifiers []Identifier `json:"identifiers" binding:"required"`
}

func AiSimilarProfiles(ctx *gin.Context) {
	// Log the raw body of the request
	bodyBytes, err := ioutil.ReadAll(ctx.Request.Body)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Failed to read request body"})
		return
	}

	// Log the incoming request for debugging
	log.Printf("Raw Request Body: %s", string(bodyBytes))

	// Parse the request body
	var req AiSimilarProfilesRequest
	if err := json.Unmarshal(bodyBytes, &req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request data"})
		return
	}

	// Ensure Identifiers is provided and not empty
	if len(req.Identifiers) == 0 {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "At least one identifier is required"})
		return
	}

	// Validate each identifier
	for _, identifier := range req.Identifiers {
		if identifier.PublicIdentifier == "" {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": "Each identifier must have a non-empty public_identifier"})
			return
		}
	}

	// Prepare the payload for the external API
	payload := map[string]interface{}{
		"identifiers": req.Identifiers,
	}

	// Encode the payload to JSON
	jsonPayload, err := json.Marshal(payload)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to encode request payload"})
		return
	}

	// Make a POST request to the external API
	apiURL := "https://ai-bd-production-620091903831.us-central1.run.app/find_similar_profile"
	resp, err := http.Post(apiURL, "application/json", bytes.NewBuffer(jsonPayload))
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to call external API"})
		return
	}
	defer resp.Body.Close()

	// Read and parse the response from the external API
	respBody, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to read API response"})
		return
	}

	// Log the external API response for debugging
	log.Printf("Payload sent to external API: %v", string(jsonPayload))
	log.Printf("External API Response: %s", string(respBody))

	// Return the API response to the frontend
	ctx.Data(resp.StatusCode, "application/json", respBody)
}
