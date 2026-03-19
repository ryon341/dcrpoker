-- 007_billing_and_host_plans.sql
-- Creates host_subscriptions and billing_events tables for TC016.

-- ── host_subscriptions ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS host_subscriptions (
  id                       BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  host_user_id             BIGINT UNSIGNED NOT NULL,
  provider                 VARCHAR(30)     NOT NULL DEFAULT 'paypal',
  provider_subscription_id VARCHAR(255)    NULL,
  provider_plan_id         VARCHAR(255)    NULL,
  plan_level               VARCHAR(20)     NOT NULL DEFAULT 'level1',
  status                   VARCHAR(30)     NOT NULL DEFAULT 'inactive',
  started_at               DATETIME        NULL,
  renews_at                DATETIME        NULL,
  cancelled_at             DATETIME        NULL,
  created_at               DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at               DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  CONSTRAINT fk_hs_user FOREIGN KEY (host_user_id) REFERENCES users(id),

  INDEX idx_hs_host_user_id           (host_user_id),
  INDEX idx_hs_provider_sub_id        (provider_subscription_id),
  INDEX idx_hs_plan_level             (plan_level),
  INDEX idx_hs_status                 (status)
);

-- ── billing_events ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS billing_events (
  id                 BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  host_user_id       BIGINT UNSIGNED NULL,
  provider           VARCHAR(30)     NOT NULL DEFAULT 'paypal',
  event_type         VARCHAR(100)    NOT NULL,
  provider_event_id  VARCHAR(255)    NULL,
  payload_json       LONGTEXT        NULL,
  processed_status   VARCHAR(30)     NOT NULL DEFAULT 'received',
  error_message      VARCHAR(255)    NULL,
  created_at         DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,

  INDEX idx_be_host_user_id    (host_user_id),
  INDEX idx_be_event_type      (event_type),
  INDEX idx_be_provider_evt_id (provider_event_id)
);
