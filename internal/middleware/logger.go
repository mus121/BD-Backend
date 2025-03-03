package middleware

import (
	"time"

	"BD-Backend/pkg/logger"

	"github.com/gin-gonic/gin"
)

func RequestLogger(log *logger.Logger) gin.HandlerFunc {
	return func(c *gin.Context) {
		start := time.Now()
		path := c.Request.URL.Path
		query := c.Request.URL.RawQuery

		c.Next()

		end := time.Now()
		latency := end.Sub(start)

		if len(c.Errors) > 0 {
			// Log errors
			for _, e := range c.Errors.Errors() {
				log.Error("Request error",
					"method", c.Request.Method,
					"path", path,
					"query", query,
					"status", c.Writer.Status(),
					"latency", latency,
					"error", e,
				)
			}
		} else {
			// Log successful requests
			log.Info("Request processed",
				"method", c.Request.Method,
				"path", path,
				"query", query,
				"status", c.Writer.Status(),
				"latency", latency,
			)
		}
	}
}
