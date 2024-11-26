package linkedprofile

import (
	"BD-APPLIACTION/src/controllers/followprofile"

	"github.com/gin-gonic/gin"
)

func Linkedfollowprofile(r *gin.Engine) {
	r.POST("/api/linkedinProfile", followprofile.Connectionprofile)
	r.GET("/api/linkedinProfile", followprofile.GetConnectionProfile)
}
