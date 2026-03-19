TASKCARD 040 — Vultr Deployment + Subdomain + Passwordless SSH
Target

Deploy DCR Poker to:

👉 https://dcrpoker.deercreekroad.com
👉 Server: 216.155.139.162

🔐 PART 0 — ONE-TIME LOGIN (MANUAL)

From your local machine:

ssh root@216.155.139.162

Enter password when prompted.

🔑 PART 1 — SETUP PASSWORDLESS SSH (CRITICAL)
On your LOCAL machine:
ssh-keygen -t ed25519 -C "dcrpoker-deploy"

Press enter through prompts (or set passphrase if you want)

Copy key to server:
ssh-copy-id root@216.155.139.162

(enter password one last time)

Test it:
ssh root@216.155.139.162

👉 Should log in with NO password

OPTIONAL (recommended hardening)

On server:

nano /etc/ssh/sshd_config

Set:

PasswordAuthentication no
PermitRootLogin prohibit-password

Then:

systemctl restart ssh
📦 PART 2 — SERVER SETUP

Run on server:

apt update && apt upgrade -y
apt install -y nginx git curl build-essential
Install Node (LTS)
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs
Install PM2
npm install -g pm2
📁 PART 3 — PROJECT DIRECTORY
mkdir -p /var/www/dcrpoker
cd /var/www/dcrpoker
Clone repo
git clone YOUR_REPO_URL .
⚙️ PART 4 — ENV SETUP

Create backend env:

nano server/.env

Fill with:

DB config

Twilio

PayPal

JWT secret

BASE_URL=https://dcrpoker.deercreekroad.com

IMPORTANT

Make sure:

NO localhost URLs remain
🏗 PART 5 — BUILD + START
Backend
cd server
npm install

Start with PM2:

pm2 start index.js --name dcrpoker-api
pm2 save
pm2 startup
Frontend
cd ../app
npm install
npm run build
🌐 PART 6 — NGINX CONFIG

Create config:

nano /etc/nginx/sites-available/dcrpoker
Paste this:
server {
    server_name dcrpoker.deercreekroad.com;

    root /var/www/dcrpoker/app/dist;
    index index.html;

    location / {
        try_files $uri /index.html;
    }

    location /api/ {
        proxy_pass http://localhost:4000/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
Enable site:
ln -s /etc/nginx/sites-available/dcrpoker /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
🌍 PART 7 — DNS SETUP

Create A record:

Host: dcrpoker
Type: A
Value: 216.155.139.162

Wait for propagation.

🔒 PART 8 — SSL (HTTPS)
apt install -y certbot python3-certbot-nginx
certbot --nginx -d dcrpoker.deercreekroad.com
🧪 PART 9 — LIVE TEST

Visit:

👉 https://dcrpoker.deercreekroad.com

Verify:

 app loads

 login works

 create game works

 API calls succeed

 audiobook images load

 no console errors

🔁 PART 10 — REDEPLOY COMMANDS (IMPORTANT)

Next time you update:

cd /var/www/dcrpoker
git pull

cd server
npm install
pm2 restart dcrpoker-api

cd ../app
npm install
npm run build

systemctl restart nginx
✅ ACCEPTANCE CRITERIA

Deployment is complete when:

 SSH works without password

 app accessible at subdomain

 HTTPS enabled

 API works via /api

 no localhost references

 images load correctly

 core flows work

🚀 AFTER THIS

Next taskcard:

👉 TC041 — Soft Launch + Real User Testing

🔥 FINAL NOTE (IMPORTANT)

You now have:

production infrastructure

real domain

monetization active

👉 You are officially at launch stage