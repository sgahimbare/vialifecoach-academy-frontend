import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

function loadEnvFile(fileName) {
  const envPath = path.join(projectRoot, fileName);
  if (!fs.existsSync(envPath)) return;

  const content = fs.readFileSync(envPath, "utf8");
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const eqIndex = trimmed.indexOf("=");
    if (eqIndex === -1) continue;

    const key = trimmed.slice(0, eqIndex).trim();
    let value = trimmed.slice(eqIndex + 1).trim();

    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }

    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
}

loadEnvFile(".env");
loadEnvFile(".env.local");

const API = process.env.API_BASE_URL || process.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
  throw new Error("Missing ADMIN_EMAIL or ADMIN_PASSWORD in .env/.env.local");
}

async function run() {
  const login = await fetch(`${API}/admin/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
  });
  if (!login.ok) throw new Error(`Login failed: ${login.status}`);
  const loginData = await login.json();
  const token = loginData.accessToken;
  const cookie = login.headers.get("set-cookie") || "";

  const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json", Cookie: cookie };
  const checks = [
    ["/admin/dashboard", "GET"],
    ["/admin/analytics/kpis", "GET"],
    ["/admin/quiz-policy", "GET"],
    ["/admin/quiz-policy/compliance", "GET"],
    ["/admin/reports/revenue", "GET"],
    ["/admin/audit-logs", "GET"],
    ["/admin/media/assets", "GET"],
    ["/admin/support/tickets", "GET"],
  ];

  for (const [path, method] of checks) {
    const res = await fetch(`${API}${path}`, { method, headers });
    if (!res.ok) throw new Error(`Failed ${method} ${path}: ${res.status}`);
    console.log("ok", method, path);
  }

  const logout = await fetch(`${API}/admin/auth/logout`, { method: "DELETE", headers });
  if (!logout.ok && logout.status !== 204) throw new Error(`Logout failed: ${logout.status}`);
  console.log("ok DELETE /admin/auth/logout");
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
