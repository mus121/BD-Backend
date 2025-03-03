package models

type FindPersonRequest struct {
	EntityURN        string `json:"entity_urn"`
	PublicIdentifier string `json:"public_identifier" binding:"required"`
}

type FindPersonResponse struct {
	// Add response fields based on actual API response
	Status  string      `json:"status"`
	Data    interface{} `json:"data"`
	Message string      `json:"message"`
}

type SimilarProfilesRequest struct {
	Identifiers []Identifier `json:"identifiers" binding:"required,min=1"`
}

type Identifier struct {
	EntityURN        string `json:"entity_urn"`
	PublicIdentifier string `json:"public_identifier" binding:"required"`
}

type SimilarProfilesResponse struct {
	// Add response fields based on actual API response
	Status  string      `json:"status"`
	Data    interface{} `json:"data"`
	Message string      `json:"message"`
}
