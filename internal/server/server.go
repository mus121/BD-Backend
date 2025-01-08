package server

import (
	"context"
	"fmt"
	"net/http"

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
	router := gin.New()

	// Set up middleware
	router.Use(gin.Recovery())
	router.Use(middleware.CORSMiddleware())

	return &Server{
		config: cfg,
		router: router,
		logger: logger,
	}
}

func (s *Server) setupRoutes(
	authHandler *handler.AuthHandler,
	linkedInHandler *handler.LinkedInHandler,
	authMiddleware gin.HandlerFunc,
) {
	// Public routes
	public := s.router.Group("/api")
	{
		auth := public.Group("/auth")
		{
			auth.GET("/google/login", authHandler.HandleGoogleLogin)
			auth.GET("/google/callback", authHandler.HandleGoogleCallback)
			auth.GET("/logout", authHandler.HandleLogout)
		}
	}

	// Protected routes
	private := s.router.Group("/api")
	private.Use(authMiddleware)
	{
		linkedin := private.Group("/linkedin")
		{
			linkedin.POST("/profile", linkedInHandler.HandleConnectionProfile)
			linkedin.GET("/connections", linkedInHandler.HandleGetConnections)
		}
	}
}

func (s *Server) Start() error {
	s.httpServer = &http.Server{
		Addr:    fmt.Sprintf(":%s", s.config.Server.Port),
		Handler: s.router,
	}

	s.logger.Info("Starting server on port " + s.config.Server.Port)
	return s.httpServer.ListenAndServe()
}

func (s *Server) Shutdown(ctx context.Context) error {
	return s.httpServer.Shutdown(ctx)
}
