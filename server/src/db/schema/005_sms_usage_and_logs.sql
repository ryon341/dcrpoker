-- 005_sms_usage_and_logs.sql
-- SMS message log + monthly usage tracking for Level 2 outbound messaging

-- Add plan_level to users for tier tracking (1 = Level 1 free, 2 = Level 2 paid)
ALTER TABLE users
  ADD COLUMN plan_level INT NOT NULL DEFAULT 1;

-- sms_messages: one row per individual SMS send attempt
CREATE TABLE IF NOT EXISTS sms_messages (
  id                  BIGINT UNSIGNED  NOT NULL AUTO_INCREMENT,
  host_user_id        BIGINT UNSIGNED  NOT NULL,
  to_phone            VARCHAR(30)      NOT NULL,
  message_body        TEXT             NOT NULL,
  provider            VARCHAR(50)      NOT NULL DEFAULT 'twilio',
  provider_message_id VARCHAR(255)     NULL,
  status              VARCHAR(30)      NOT NULL DEFAULT 'queued',
  error_message       VARCHAR(255)     NULL,
  created_at          DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  CONSTRAINT fk_sms_msg_host FOREIGN KEY (host_user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_sms_msg_host      (host_user_id),
  INDEX idx_sms_msg_status    (status),
  INDEX idx_sms_msg_created   (created_at)
);

-- sms_usage: monthly counter per host (one row per host per month)
CREATE TABLE IF NOT EXISTS sms_usage (
  id             BIGINT UNSIGNED  NOT NULL AUTO_INCREMENT,
  host_user_id   BIGINT UNSIGNED  NOT NULL,
  year           INT              NOT NULL,
  month          INT              NOT NULL,
  messages_sent  INT              NOT NULL DEFAULT 0,
  created_at     DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     DATETIME         NULL ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  CONSTRAINT fk_sms_usage_host FOREIGN KEY (host_user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE INDEX uniq_sms_usage_host_month (host_user_id, year, month)
);
