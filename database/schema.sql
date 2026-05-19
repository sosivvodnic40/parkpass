-- ParkPass PostgreSQL Schema
-- Version 1.0

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ENUM types
CREATE TYPE user_role AS ENUM ('user', 'park_manager', 'admin');
CREATE TYPE club_tier AS ENUM ('bronze', 'silver', 'gold', 'platinum');
CREATE TYPE booking_status AS ENUM ('pending', 'paid', 'cancelled', 'completed');
CREATE TYPE favorite_type AS ENUM ('park', 'attraction');

-- USERS
CREATE TABLE users (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email           VARCHAR(255) UNIQUE NOT NULL,
    password_hash   VARCHAR(255) NOT NULL,
    first_name      VARCHAR(100),
    last_name       VARCHAR(100),
    avatar_url      TEXT,
    role            user_role DEFAULT 'user',
    club_tier       club_tier DEFAULT 'bronze',
    loyalty_points  INTEGER DEFAULT 0,
    preferred_lang  VARCHAR(5) DEFAULT 'ru',
    preferred_currency VARCHAR(3) DEFAULT 'EUR',
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- PARKS
CREATE TABLE parks (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug            VARCHAR(150) UNIQUE NOT NULL,
    name            VARCHAR(255) NOT NULL,
    description     TEXT,
    country         VARCHAR(100) NOT NULL,
    city            VARCHAR(100) NOT NULL,
    address         TEXT,
    latitude        DECIMAL(10, 8),
    longitude       DECIMAL(11, 8),
    cover_image     TEXT,
    hero_video_url  TEXT,
    theme_config    JSONB DEFAULT '{}',
    rating_avg      DECIMAL(3, 2) DEFAULT 0,
    review_count    INTEGER DEFAULT 0,
    price_from      DECIMAL(10, 2),
    opening_hours   JSONB,
    is_featured     BOOLEAN DEFAULT FALSE,
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ATTRACTIONS
CREATE TABLE attractions (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    park_id         UUID NOT NULL REFERENCES parks(id) ON DELETE CASCADE,
    slug            VARCHAR(150) NOT NULL,
    name            VARCHAR(255) NOT NULL,
    description     TEXT,
    image_url       TEXT,
    category        VARCHAR(50),
    min_height_cm   INTEGER,
    min_age         INTEGER,
    intensity       SMALLINT CHECK (intensity BETWEEN 1 AND 5),
    duration_min    INTEGER,
    avg_wait_min    INTEGER DEFAULT 0,
    requires_fast_pass BOOLEAN DEFAULT FALSE,
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (park_id, slug)
);

-- TICKET TYPES (products)
CREATE TABLE ticket_types (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    park_id         UUID NOT NULL REFERENCES parks(id) ON DELETE CASCADE,
    name            VARCHAR(150) NOT NULL,
    description     TEXT,
    price           DECIMAL(10, 2) NOT NULL,
    currency        VARCHAR(3) DEFAULT 'EUR',
    valid_days      INTEGER DEFAULT 1,
    includes_fast_pass BOOLEAN DEFAULT FALSE,
    quota_daily     INTEGER,
    is_active       BOOLEAN DEFAULT TRUE
);

-- BOOKINGS
CREATE TABLE bookings (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID NOT NULL REFERENCES users(id),
    park_id         UUID NOT NULL REFERENCES parks(id),
    ticket_type_id  UUID NOT NULL REFERENCES ticket_types(id),
    visit_date      DATE NOT NULL,
    guests_adult    SMALLINT DEFAULT 1,
    guests_child    SMALLINT DEFAULT 0,
    total_amount    DECIMAL(10, 2) NOT NULL,
    currency        VARCHAR(3) DEFAULT 'EUR',
    status          booking_status DEFAULT 'pending',
    qr_code         TEXT,
    payment_ref     VARCHAR(255),
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- REVIEWS
CREATE TABLE reviews (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID NOT NULL REFERENCES users(id),
    park_id         UUID NOT NULL REFERENCES parks(id),
    attraction_id   UUID REFERENCES attractions(id) ON DELETE SET NULL,
    rating          SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    title           VARCHAR(200),
    body            TEXT,
    visit_date      DATE,
    is_verified     BOOLEAN DEFAULT FALSE,
    is_approved     BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (user_id, park_id, attraction_id)
);

-- FAVORITES
CREATE TABLE favorites (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    item_type       favorite_type NOT NULL,
    park_id         UUID REFERENCES parks(id) ON DELETE CASCADE,
    attraction_id   UUID REFERENCES attractions(id) ON DELETE CASCADE,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (user_id, item_type, park_id, attraction_id)
);

-- INDEXES
CREATE INDEX idx_parks_city ON parks(city);
CREATE INDEX idx_parks_country ON parks(country);
CREATE INDEX idx_parks_rating ON parks(rating_avg DESC);
CREATE INDEX idx_attractions_park ON attractions(park_id);
CREATE INDEX idx_bookings_user ON bookings(user_id);
CREATE INDEX idx_bookings_date ON bookings(visit_date);
CREATE INDEX idx_reviews_park ON reviews(park_id);
CREATE INDEX idx_favorites_user ON favorites(user_id);
