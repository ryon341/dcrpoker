'use strict';

const { getHostPlan } = require('../services/billingService');

// Feature -> minimum plan level required
const FEATURE_REQUIREMENTS = {
  sms_send:    'level2',
  sms_receive: 'level3',
  seat_tools:  'level3',
};

const FEATURE_FLAGS = {
  sms_send:    'canSendSms',
  sms_receive: 'canReceiveSms',
  seat_tools:  'canUseSeatTools',
};

const REQUIRED_LEVEL_LABEL = {
  level2: 'Level 2 (Pro)',
  level3: 'Level 3 (Elite)',
};

/**
 * requirePlanFeature('seat_tools') — returns Express middleware that blocks the
 * request with 403 if the authenticated host's plan doesn't include the feature.
 */
function requirePlanFeature(featureName) {
  const flag = FEATURE_FLAGS[featureName];
  const requiredLevel = FEATURE_REQUIREMENTS[featureName];

  if (!flag) {
    throw new Error(`requirePlanFeature: unknown feature "${featureName}"`);
  }

  return async function planFeatureGuard(req, res, next) {
    const hostUserId = req.user && req.user.id;
    if (!hostUserId) {
      return res.status(401).json({ ok: false, error: 'Not authenticated' });
    }

    try {
      const plan = await getHostPlan(hostUserId);

      if (!plan[flag]) {
        const label = REQUIRED_LEVEL_LABEL[requiredLevel] || requiredLevel;
        return res.status(403).json({
          ok:    false,
          error: `This feature requires ${label} or higher.`,
          requiredPlan: requiredLevel,
        });
      }

      next();
    } catch (err) {
      console.error('[requirePlanFeature] Error checking plan:', err.message);
      return res.status(500).json({ ok: false, error: 'Could not verify plan level' });
    }
  };
}

module.exports = { requirePlanFeature };
