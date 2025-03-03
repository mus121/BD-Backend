package models

import (
	"time"

	"gorm.io/gorm"
)

type User struct {
	ID               string `gorm:"primaryKey"`
	Email            string `gorm:"uniqueIndex;not null"`
	SessionToken     string `gorm:"type:text"`
	RefreshToken     string `gorm:"type:text"`
	SessionExpiresAt time.Time
	RefreshExpiresAt time.Time
	CreatedAt        time.Time
	UpdatedAt        time.Time
	DeletedAt        gorm.DeletedAt `gorm:"index"`
}

type LinkedInProfile struct {
	ID               uint   `gorm:"primaryKey"`
	UserID           string `gorm:"not null"`
	PublicIdentifier string `gorm:"not null"`
	EntityURN        string `gorm:"not null"`
	IsConnected      bool   `gorm:"default:false"`
	CreatedAt        time.Time
	UpdatedAt        time.Time
	DeletedAt        gorm.DeletedAt `gorm:"index"`
	User             User           `gorm:"foreignKey:UserID"`
}
