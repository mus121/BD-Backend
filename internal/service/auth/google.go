package auth

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"BD-Backend/config"
	"BD-Backend/internal/models"
	"BD-Backend/internal/repository"
	"BD-Backend/pkg/logger"

	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
)

type GoogleAuthService interface {
	GetAuthURL(state string) string
	HandleCallback(ctx context.Context, code string) (*models.User, error)
	ValidateToken(ctx context.Context, token string) (bool, error)
}

type googleAuthService struct {
	config   *config.Config
	oauthCfg *oauth2.Config
	userRepo repository.UserRepository
	logger   *logger.Logger
}

func NewGoogleAuthService(
	cfg *config.Config,
	userRepo repository.UserRepository,
	logger *logger.Logger,
) GoogleAuthService {
	oauthCfg := &oauth2.Config{
		ClientID:     cfg.Google.ClientID,
		ClientSecret: cfg.Google.ClientSecret,
		RedirectURL:  cfg.Google.RedirectURL,
		Scopes: []string{
			"https://www.googleapis.com/auth/userinfo.email",
			"https://www.googleapis.com/auth/userinfo.profile",
		},
		Endpoint: google.Endpoint,
	}

	return &googleAuthService{
		config:   cfg,
		oauthCfg: oauthCfg,
		userRepo: userRepo,
		logger:   logger,
	}
}

func (s *googleAuthService) GetAuthURL(state string) string {
	return s.oauthCfg.AuthCodeURL(state)
}

func (s *googleAuthService) HandleCallback(ctx context.Context, code string) (*models.User, error) {
	token, err := s.oauthCfg.Exchange(ctx, code)
	if err != nil {
		return nil, fmt.Errorf("failed to exchange token: %w", err)
	}

	userInfo, err := s.getUserInfo(ctx, token.AccessToken)
	if err != nil {
		return nil, fmt.Errorf("failed to get user info: %w", err)
	}

	user, err := s.userRepo.FindByEmail(ctx, userInfo.Email)
	if err != nil {
		// Create new user if not exists
		user = &models.User{
			ID:               userInfo.Sub,
			Email:            userInfo.Email,
			SessionToken:     token.AccessToken,
			RefreshToken:     token.RefreshToken,
			SessionExpiresAt: time.Now().Add(s.config.JWT.AccessTokenExpiry),
			RefreshExpiresAt: time.Now().Add(s.config.JWT.RefreshTokenExpiry),
		}
		if err := s.userRepo.Create(ctx, user); err != nil {
			return nil, fmt.Errorf("failed to create user: %w", err)
		}
	} else {
		// Update existing user
		user.SessionToken = token.AccessToken
		user.RefreshToken = token.RefreshToken
		user.SessionExpiresAt = time.Now().Add(s.config.JWT.AccessTokenExpiry)
		user.RefreshExpiresAt = time.Now().Add(s.config.JWT.RefreshTokenExpiry)
		if err := s.userRepo.Update(ctx, user); err != nil {
			return nil, fmt.Errorf("failed to update user: %w", err)
		}
	}

	return user, nil
}

type GoogleUserInfo struct {
	Sub   string `json:"sub"`
	Email string `json:"email"`
	Name  string `json:"name"`
}

func (s *googleAuthService) getUserInfo(ctx context.Context, accessToken string) (*GoogleUserInfo, error) {
	resp, err := http.Get("https://www.googleapis.com/oauth2/v3/userinfo?access_token=" + accessToken)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	var userInfo GoogleUserInfo
	if err := json.NewDecoder(resp.Body).Decode(&userInfo); err != nil {
		return nil, err
	}

	return &userInfo, nil
}

func (s *googleAuthService) ValidateToken(ctx context.Context, token string) (bool, error) {
	user, err := s.userRepo.FindBySessionToken(ctx, token)
	if err != nil {
		return false, err
	}

	return time.Now().Before(user.SessionExpiresAt), nil
}
