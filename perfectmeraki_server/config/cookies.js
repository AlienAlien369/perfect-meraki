// Cross-origin (Vercel frontend, Render backend) requires SameSite=None + Secure
// in production; localhost dev over http can't use Secure cookies.
const isProd = process.env.NODE_ENV === "production";

const refreshCookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? "none" : "lax",
  path: "/api/auth",
  maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
};

module.exports = { refreshCookieOptions };
