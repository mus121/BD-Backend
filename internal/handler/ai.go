package handler

import (
	"context"
	"net/http"
	"time"

	"BD-Backend/internal/models"
	"BD-Backend/internal/service/ai"
	"BD-Backend/pkg/logger"

	"github.com/gin-gonic/gin"
)

type AIHandler struct {
	aiService ai.Service
	logger    *logger.Logger
}

func NewAIHandler(aiService ai.Service, logger *logger.Logger) *AIHandler {
	return &AIHandler{
		aiService: aiService,
		logger:    logger,
	}
}

func (h *AIHandler) HandleFindPerson(c *gin.Context) {
	var req models.FindPersonRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		h.logger.Error("Invalid request data", "error", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request data"})
		return
	}

	ctx, cancel := context.WithTimeout(c.Request.Context(), 30*time.Second)
	defer cancel()

	result, err := h.aiService.FindPerson(ctx, req)
	if err != nil {
		h.logger.Error("Failed to find person", "error", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to process request"})
		return
	}

	c.JSON(http.StatusOK, result)
}

func (h *AIHandler) HandleSimilarProfiles(c *gin.Context) {
	var req models.SimilarProfilesRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		h.logger.Error("Invalid request data", "error", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request data"})
		return
	}

	ctx, cancel := context.WithTimeout(c.Request.Context(), 30*time.Second)
	defer cancel()

	result, err := h.aiService.FindSimilarProfiles(ctx, req)
	if err != nil {
		h.logger.Error("Failed to find similar profiles", "error", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to process request"})
		return
	}

	c.JSON(http.StatusOK, result)
}
