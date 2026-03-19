-- Migration 008: Referrals, Credits, and Overage Ledger
-- Run: mysql -u root "-pPhinFan#2026" dcrpoker < 008_referrals_credits_and_overage.sql

-- ─── 1. host_referral_codes ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS host_referral_codes (
  id             BIGINT UNSIGNED  NOT NULL AUTO_INCREMENT,
  host_user_id   BIGINT UNSIGNED  NOT NULL,
  referral_code  VARCHAR(50)      NOT NULL,
  is_active      TINYINT(1)       NOT NULL DEFAULT 1,
  created_at     DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  UNIQUE  KEY uq_referral_code   (referral_code),
  INDEX         idx_hrc_host     (host_user_id),
  INDEX         idx_hrc_active   (is_active),
  CONSTRAINT fk_hrc_host FOREIGN KEY (host_user_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ─── 2. host_referrals ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS host_referrals (
  id                      BIGINT UNSIGNED  NOT NULL AUTO_INCREMENT,
  referrer_host_user_id   BIGINT UNSIGNED  NOT NULL,
  referred_host_user_id   BIGINT UNSIGNED  NOT NULL,
  referral_code           VARCHAR(50)      NOT NULL,
  status                  VARCHAR(30)      NOT NULL DEFAULT 'pending',
  created_at              DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at              DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  UNIQUE  KEY uq_referred_host     (referred_host_user_id),
  INDEX         idx_hr_referrer    (referrer_host_user_id),
  INDEX         idx_hr_status      (status),
  CONSTRAINT fk_hr_referrer FOREIGN KEY (referrer_host_user_id) REFERENCES users(id),
  CONSTRAINT fk_hr_referred FOREIGN KEY (referred_host_user_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ─── 3. host_credit_transactions ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS host_credit_transactions (
  id              BIGINT UNSIGNED  NOT NULL AUTO_INCREMENT,
  host_user_id    BIGINT UNSIGNED  NOT NULL,
  type            VARCHAR(30)      NOT NULL,
  amount_cents    INT              NOT NULL,
  description     VARCHAR(255)     NULL,
  reference_type  VARCHAR(50)      NULL,
  reference_id    BIGINT UNSIGNED  NULL,
  created_at      DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  INDEX idx_hct_host           (host_user_id),
  INDEX idx_hct_type           (type),
  INDEX idx_hct_reference_type (reference_type),
  CONSTRAINT fk_hct_host FOREIGN KEY (host_user_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ─── 4. host_overage_ledger ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS host_overage_ledger (
  id                    BIGINT UNSIGNED  NOT NULL AUTO_INCREMENT,
  host_user_id          BIGINT UNSIGNED  NOT NULL,
  year                  INT              NOT NULL,
  month                 INT              NOT NULL,
  included_messages     INT              NOT NULL DEFAULT 0,
  messages_sent         INT              NOT NULL DEFAULT 0,
  overage_messages      INT              NOT NULL DEFAULT 0,
  overage_amount_cents  INT              NOT NULL DEFAULT 0,
  credits_applied_cents INT              NOT NULL DEFAULT 0,
  net_amount_cents      INT              NOT NULL DEFAULT 0,
  status                VARCHAR(30)      NOT NULL DEFAULT 'open',
  created_at            DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at            DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  UNIQUE  KEY uq_hol_host_month (host_user_id, year, month),
  INDEX         idx_hol_status  (status),
  CONSTRAINT fk_hol_host FOREIGN KEY (host_user_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
