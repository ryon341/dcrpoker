require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const pool = require('./src/config/db');
const healthRouter   = require('./src/routes/health');
const dbHealthRouter = require('./src/routes/dbHealth');
const usersRouter    = require('./src/routes/users');
const gamesRouter    = require('./src/routes/games');
const hostsRouter    = require('./src/routes/hosts');
const authRouter            = require('./src/auth/authRoutes');
const hostContactsRouter    = require('./src/routes/hostContacts');
const externalInvitesRouter = require('./src/routes/externalInvites');
const invitesRouter         = require('./src/routes/invites');
const myGamesRouter         = require('./src/routes/myGames');
const myRosterRouter        = require('./src/routes/myRoster');
const playerSearchRouter        = require('./src/routes/playerSearch');
const myPlayersRouter           = require('./src/routes/myPlayers');
const messageTemplatesRouter    = require('./src/routes/messageTemplates');
const smsRouter                 = require('./src/routes/sms');
const smsWebhookRouter          = require('./src/routes/smsWebhook');
const billingRouter             = require('./src/routes/billing');
const paypalWebhookRouter       = require('./src/routes/paypalWebhook');
const creditsRouter             = require('./src/routes/credits');
const referralsRouter           = require('./src/routes/referrals');
const bankrollRouter            = require('./src/routes/bankroll');
const notificationsRouter       = require('./src/routes/notifications');
const publicGamesRouter         = require('./src/routes/publicGames');
const handsRouter               = require('./src/routes/hands');
const arcadeRouter              = require('./src/routes/arcade');

const app = express();
const PORT = process.env.PORT || 4000;

// CORS — allow Expo web dev and production origins
const allowedOrigins = [
  'http://localhost:8081',
  'http://localhost:19006',
  'http://localhost:3000',
  'http://localhost:4000',
  'https://dcrpoker.deercreekroad.com',
  'http://dcrpoker.deercreekroad.com',
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
}));

app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/api', healthRouter);
app.use('/api', dbHealthRouter);
app.use('/api', authRouter);
app.use('/api', usersRouter);
app.use('/api', gamesRouter);
app.use('/api', hostsRouter);
app.use('/api/host-contacts',    hostContactsRouter);
app.use('/api/external-invites', externalInvitesRouter);
app.use('/api/invites',          invitesRouter);
app.use('/api/my/games',         myGamesRouter);
app.use('/api/my/roster',        myRosterRouter);
app.use('/api/player-search',            playerSearchRouter);
app.use('/api/my/players',               myPlayersRouter);
app.use('/api/my/message-templates',     messageTemplatesRouter);
app.use('/api/sms',                      smsRouter);
// Twilio webhook — must be registered before express.json() if we were using a global
// body parser, but since we add urlencoded per-route in smsWebhook.js this is fine here.
app.use('/api/twilio/webhook',           smsWebhookRouter);
app.use('/api/my/billing',               billingRouter);
app.use('/api/paypal/webhook',           paypalWebhookRouter);
app.use('/api/my/credits',               creditsRouter);
app.use('/api/my/referrals',             referralsRouter);
app.use('/api/my/bankroll',              bankrollRouter);
app.use('/api/my/notifications',         notificationsRouter);
app.use('/api/public-games',             publicGamesRouter);
app.use('/api/my/hands',                 handsRouter);
app.use('/api/arcade',                   arcadeRouter);

// Start server and verify DB connection
app.listen(PORT, async () => {
  console.log(`dcrpoker-api running on http://localhost:${PORT}`);
  try {
    await pool.query('SELECT 1');
    console.log('[db] MySQL connection successful');
  } catch (err) {
    console.error('[db] MySQL connection failed:', err.message);
    process.exit(1);
  }
});

