CREATE TABLE linkedinprofile (
    id SERIAL PRIMARY KEY, 
    user_id VARCHAR(255) NOT NULL, 
    publicidentifier VARCHAR(255) NOT NULL, 
    entityurn VARCHAR(255) NOT NULL, 
    is_connected BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP, 

    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id)
);
