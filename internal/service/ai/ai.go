package ai

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"

	"BD-Backend/config"
	"BD-Backend/internal/models"
	"BD-Backend/pkg/logger"
)

type Service interface {
	FindPerson(ctx context.Context, req models.FindPersonRequest) (*models.FindPersonResponse, error)
	FindSimilarProfiles(ctx context.Context, req models.SimilarProfilesRequest) (*models.SimilarProfilesResponse, error)
}

type aiService struct {
	config *config.Config
	client *http.Client
	logger *logger.Logger
}

func NewAIService(cfg *config.Config, logger *logger.Logger) Service {
	return &aiService{
		config: cfg,
		client: &http.Client{
			Timeout: cfg.AI.Timeout,
		},
		logger: logger,
	}
}

func (s *aiService) FindPerson(ctx context.Context, req models.FindPersonRequest) (*models.FindPersonResponse, error) {
	url := fmt.Sprintf("%s/find_person", s.config.AI.BaseURL)
	return s.makeRequest(ctx, url, req)
}

func (s *aiService) FindSimilarProfiles(ctx context.Context, req models.SimilarProfilesRequest) (*models.SimilarProfilesResponse, error) {
	url := fmt.Sprintf("%s/find_similar_profile", s.config.AI.BaseURL)
	return s.makeRequest(ctx, url, req)
}

func (s *aiService) makeRequest(ctx context.Context, url string, payload interface{}) (interface{}, error) {
	jsonData, err := json.Marshal(payload)
	if err != nil {
		return nil, fmt.Errorf("failed to marshal request: %w", err)
	}

	req, err := http.NewRequestWithContext(ctx, "POST", url, bytes.NewBuffer(jsonData))
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %w", err)
	}

	req.Header.Set("Content-Type", "application/json")

	resp, err := s.client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("failed to make request: %w", err)
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("failed to read response: %w", err)
	}

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("API request failed with status %d: %s", resp.StatusCode, string(body))
	}

	var result interface{}
	if err := json.Unmarshal(body, &result); err != nil {
		return nil, fmt.Errorf("failed to unmarshal response: %w", err)
	}

	return result, nil
}
