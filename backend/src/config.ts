import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(__dirname, "../.env") });

const config = {
  port: process.env.PORT || 8000,
  jwt: {
    secret: process.env.JWT_SECRET,
    accessTokenExpiry: process.env.JWT_ACCESS_TOKEN_EXPIRY || "15M",
    refreshTokenExpiry: process.env.JWT_REFRESH_TOKEN_EXPIRY || "24H",
  },
  G_OAuth: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    redirectUri: process.env.GOOGLE_REDIRECT_URI,
  },
  mailer: {
    email: process.env.NODE_MAILER_EMAIL,
    password: process.env.NODE_MAILER_PASSWORD,
  },
  frontendUrl: process.env.FRONTEND_URL,
};

export default config;
