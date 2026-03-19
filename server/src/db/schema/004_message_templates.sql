-- 004_message_templates.sql
-- Host-owned reusable message templates for Level 1 manual messaging

CREATE TABLE IF NOT EXISTS message_templates (
  id            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  host_user_id  BIGINT UNSIGNED NOT NULL,
  name          VARCHAR(120)    NOT NULL,
  channel       VARCHAR(20)     NOT NULL DEFAULT 'sms',
  subject       VARCHAR(255)    NULL,
  body          TEXT            NOT NULL,
  is_active     TINYINT(1)      NOT NULL DEFAULT 1,
  created_at    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  CONSTRAINT fk_msg_tmpl_host FOREIGN KEY (host_user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_msg_tmpl_host    (host_user_id),
  INDEX idx_msg_tmpl_channel (channel),
  INDEX idx_msg_tmpl_active  (is_active)
);
