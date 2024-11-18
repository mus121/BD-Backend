package users

import (
	"time"
)

type User struct {
	ID           uint   `gorm:"primaryKey"`
	Email        string `gorm:"uniqueIndex;not null"`
	SessionToken string `gorm:"type:text"`
	RefreshToken string `gorm:"type:text"`
	CreatedAt    time.Time
	UpdatedAt    time.Time
}
