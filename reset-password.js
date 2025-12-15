// Parse tokens from either the query string or the URL fragment (hash)
const message = document.getElementById("message");
const resetBtn = document.getElementById("resetBtn");

function getUrlParams() {
  let params = new URLSearchParams(window.location.search);
  // Supabase recovery links often place tokens in the hash (#)
  if (!params.has("access_token") && window.location.hash) {
    params = new URLSearchParams(window.location.hash.slice(1));
  }
  return params;
}

const params = getUrlParams();
const access_token = params.get("access_token");
const refresh_token = params.get("refresh_token");
const type = params.get("type");

// Provide placeholders — DO NOT commit your real keys here. Replace with your values.
const SUPABASE_URL = "https://aserazwykkmznreqjzbd.supabase.co"; // e.g. https://xyzcompany.supabase.co
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFzZXJhend5a2ttem5yZXFqemJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1NTQ3MDMsImV4cCI6MjA3NTEzMDcwM30.-lze9Sxq9WxWO4dg_pudJ4NlC3tlUt1edYiVWmVpc2I"; // your anon/public key

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  message.textContent = "Supabase credentials are not set. Please set SUPABASE_URL and SUPABASE_ANON_KEY in reset-password.js.";
  message.style.color = "red";
  resetBtn.disabled = true;
} else {
  // Destructure createClient from the global Supabase object
  const { createClient } = window.supabase;
  const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  if (type !== "recovery" || !access_token) {
    message.textContent = "Invalid or expired reset link.";
    message.style.color = "red";
    resetBtn.disabled = true;
  }

  // Button handler
  resetBtn.addEventListener("click", async () => {
    const password = document.getElementById("password").value;
    const confirm = document.getElementById("confirm").value;

    if (!password || password.length < 6) {
      message.textContent = "Password must be at least 6 characters.";
      message.style.color = "red";
      return;
    }

    if (password !== confirm) {
      message.textContent = "Passwords do not match.";
      message.style.color = "red";
      return;
    }

    // 🔑 Set session using the tokens from the URL (refresh_token may be missing in some links)
    const { error: sessionError } = await supabaseClient.auth.setSession({
      access_token,
      refresh_token,
    });

    if (sessionError) {
      message.textContent = `Session error: ${sessionError.message}`;
      message.style.color = "red";
      return;
    }

    // Now update the password
    const { error } = await supabaseClient.auth.updateUser({ password });

    if (error) {
      message.textContent = `Update error: ${error.message}`;
      message.style.color = "red";
    } else {
      message.textContent = "Password updated successfully 🎉";
      message.style.color = "#4CAF50";

      // Redirect after 2 seconds
      setTimeout(() => {
        window.location.href = "https://getdayahead.com";
      }, 2000);
    }
  });
}