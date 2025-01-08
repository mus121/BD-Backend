package server

import (
	"context"
	"fmt"
	"net/http"
	"time"

	"BD-Backend/config"
	"BD-Backend/internal/handler"
	"BD-Backend/internal/middleware"
	"BD-Backend/pkg/logger"

	"github.com/gin-gonic/gin"
)

type Server struct {
	config     *config.Config
	router     *gin.Engine
	httpServer *http.Server
	logger     *logger.Logger
}

func NewServer(cfg *config.Config, logger *logger.Logger) *Server {
	gin.SetMode(cfg.Server.Mode)
	router := gin.New()

	// Setup middleware
	router.Use(gin.Recovery())
	router.Use(middleware.RequestLogger(logger))
	router.Use(middleware.CORSMiddleware())

	return &Server{
		config: cfg,
		router: router,
		logger: logger,
	}
}

func (s *Server) SetupRoutes(
	authHandler *handler.AuthHandler,
	aiHandler *handler.AIHandler,
	linkedInHandler *handler.LinkedInHandler,
	authMiddleware gin.HandlerFunc,
) {
	// Health check
	s.router.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "ok"})
	})

	// API routes
	api := s.router.Group("/api")
	{
		// Auth routes
		auth := api.Group("/auth")
		{
			auth.GET("/google/login", authHandler.HandleGoogleLogin)
			auth.GET("/google/callback", authHandler.HandleGoogleCallback)
			auth.POST("/logout", authHandler.HandleLogout)
		}

		// Protected routes
		protected := api.Group("")
		protected.Use(authMiddleware)
		{
			// LinkedIn routes
			linkedin := protected.Group("/linkedin")
			{
				linkedin.POST("/profile", linkedInHandler.HandleConnectionProfile)
				linkedin.GET("/connections", linkedInHandler.HandleGetConnections)
			}

			// AI routes
			ai := protected.Group("/ai")
			{
				ai.POST("/find-person", aiHandler.HandleFindPerson)
				ai.POST("/similar-profiles", aiHandler.HandleSimilarProfiles)
			}
		}
	}
}

func (s *Server) Start() error {
	s.httpServer = &http.Server{
		Addr:         fmt.Sprintf(":%s", s.config.Server.Port),
		Handler:      s.router,
		ReadTimeout:  s.config.Server.ReadTimeout,
		WriteTimeout: s.config.Server.WriteTimeout,
		IdleTimeout:  120 * time.Second,
	}

	s.logger.Info("Starting server", "port", s.config.Server.Port)
	if err := s.httpServer.ListenAndServe(); err != nil && err != http.ErrServerClosed {
		return fmt.Errorf("failed to start server: %w", err)
	}

	return nil
}

func (s *Server) Shutdown(ctx context.Context) error {
	s.logger.Info("Shutting down server...")
	return s.httpServer.Shutdown(ctx)
}
