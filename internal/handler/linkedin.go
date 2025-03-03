package handler

import (
	"net/http"

	"BD-Backend/internal/models"
	"BD-Backend/internal/repository"
	"BD-Backend/pkg/logger"

	"github.com/gin-gonic/gin"
)

type LinkedInHandler struct {
	linkedInRepo repository.LinkedInProfileRepository
	logger       *logger.Logger
}

func NewLinkedInHandler(linkedInRepo repository.LinkedInProfileRepository, logger *logger.Logger) *LinkedInHandler {
	return &LinkedInHandler{
		linkedInRepo: linkedInRepo,
		logger:       logger,
	}
}

type ConnectionProfileRequest struct {
	PublicIdentifier string `json:"publicIdentifier" binding:"required"`
	EntityUrn        string `json:"entityUrn" binding:"required"`
	IsConnected      bool   `json:"isConnected"`
}

func (h *LinkedInHandler) HandleConnectionProfile(c *gin.Context) {
	userID := c.GetString("user_id")
	if userID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	var req ConnectionProfileRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request data"})
		return
	}

	profile := &models.LinkedInProfile{
		UserID:           userID,
		PublicIdentifier: req.PublicIdentifier,
		EntityURN:        req.EntityUrn,
		IsConnected:      req.IsConnected,
	}

	if err := h.linkedInRepo.Create(c, profile); err != nil {
		h.logger.Error("Failed to save profile", "error", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save profile"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Profile updated successfully"})
}

func (h *LinkedInHandler) HandleGetConnections(c *gin.Context) {
	userID := c.GetString("user_id")
	if userID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	profiles, err := h.linkedInRepo.FindByUserID(c, userID)
	if err != nil {
		h.logger.Error("Failed to fetch profiles", "error", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch profiles"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"profiles": profiles})
}
