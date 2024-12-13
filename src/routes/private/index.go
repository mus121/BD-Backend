package private

import (
	"BD-APPLIACTION/src/controllers/aiService"
	"BD-APPLIACTION/src/controllers/followprofile"

	"github.com/gin-gonic/gin"
)

func Linkedfollowprofile(r *gin.Engine) {
	r.POST("/api/linkedinProfile", followprofile.ConnectionProfile)
	r.GET("/api/linkedinProfile", followprofile.GetConnectionProfile)
	r.POST("/api/aiService", aiService.SuggestProfiles)
}
