package repository

import (
	"BD-Backend/internal/models"
	"context"

	"gorm.io/gorm"
)

type LinkedInProfileRepository interface {
	Create(ctx context.Context, profile *models.LinkedInProfile) error
	Update(ctx context.Context, profile *models.LinkedInProfile) error
	FindByUserID(ctx context.Context, userID string) ([]models.LinkedInProfile, error)
	ToggleConnection(ctx context.Context, userID, publicIdentifier string, isConnected bool) error
}

type linkedInRepository struct {
	db *gorm.DB
}

func NewLinkedInRepository(db *gorm.DB) LinkedInProfileRepository {
	return &linkedInRepository{db: db}
}

func (r *linkedInRepository) Create(ctx context.Context, profile *models.LinkedInProfile) error {
	return r.db.WithContext(ctx).Create(profile).Error
}

func (r *linkedInRepository) Update(ctx context.Context, profile *models.LinkedInProfile) error {
	return r.db.WithContext(ctx).Save(profile).Error
}

func (r *linkedInRepository) FindByUserID(ctx context.Context, userID string) ([]models.LinkedInProfile, error) {
	var profiles []models.LinkedInProfile
	if err := r.db.WithContext(ctx).Where("user_id = ? AND is_connected = true", userID).Find(&profiles).Error; err != nil {
		return nil, err
	}
	return profiles, nil
}

func (r *linkedInRepository) ToggleConnection(ctx context.Context, userID, publicIdentifier string, isConnected bool) error {
	return r.db.WithContext(ctx).
		Model(&models.LinkedInProfile{}).
		Where("user_id = ? AND public_identifier = ?", userID, publicIdentifier).
		Update("is_connected", isConnected).
		Error
}
