package config

import (
	"log"
	"os"
	"time"

	"github.com/joho/godotenv"
	"github.com/spf13/viper"
)

type Config struct {
	Server   ServerConfig
	Database DatabaseConfig
	Google   GoogleConfig
	JWT      JWTConfig
}

type ServerConfig struct {
	Port         string
	Mode         string
	ReadTimeout  time.Duration
	WriteTimeout time.Duration
}

type DatabaseConfig struct {
	Host     string
	Port     string
	User     string
	Password string
	DBName   string
	SSLMode  string
}

type GoogleConfig struct {
	ClientID     string
	ClientSecret string
	RedirectURL  string
}

type JWTConfig struct {
	SecretKey          string
	RefreshSecretKey   string
	AccessTokenExpiry  time.Duration
	RefreshTokenExpiry time.Duration
}

func LoadConfig() (*Config, error) {
	// Load .env file
	if err := godotenv.Load(".env"); err != nil {
		log.Printf("Could not load .env file: %v", err)
	}

	// Use Viper to read environment variables
	viper.AutomaticEnv()

	// Load config.yaml
	viper.SetConfigType("yaml")
	viper.AddConfigPath(".")
	viper.AddConfigPath("./config")
	viper.SetConfigName("config")

	if err := viper.ReadInConfig(); err != nil {
		log.Printf("Could not read config.yaml: %v", err)
	}

	// Populate the config struct
	var config Config
	if err := viper.Unmarshal(&config); err != nil {
		return nil, err
	}

	// Parse durations for server and JWT settings
	config.Server.ReadTimeout, _ = time.ParseDuration(viper.GetString("server.readTimeout"))
	config.Server.WriteTimeout, _ = time.ParseDuration(viper.GetString("server.writeTimeout"))
	config.JWT.AccessTokenExpiry, _ = time.ParseDuration(viper.GetString("jwt.accessTokenExpiry"))
	config.JWT.RefreshTokenExpiry, _ = time.ParseDuration(viper.GetString("jwt.refreshTokenExpiry"))

	// Override fields with environment variables if they exist
	config.Server.Port = os.Getenv("PORT")
	config.Database.Host = os.Getenv("DB_HOST")
	config.Database.Port = os.Getenv("DB_PORT")
	config.Database.User = os.Getenv("DB_USER")
	config.Database.Password = os.Getenv("DB_PASSWORD")
	config.Database.DBName = os.Getenv("DB_NAME")
	config.Database.SSLMode = os.Getenv("DB_SSL_MODE")
	config.JWT.SecretKey = os.Getenv("JWT_SECRET")
	config.Google.ClientID = os.Getenv("GOOGLE_CLIENT_ID")
	config.Google.ClientSecret = os.Getenv("GOOGLE_CLIENT_SECRET")
	config.Google.RedirectURL = os.Getenv("GOOGLE_CALLBACK_URL")

	return &config, nil
}
