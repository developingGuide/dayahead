// Destructure createClient from the global Supabase object
const { createClient } = window.supabase;

// Create your client
const supabaseClient = createClient(
  "https://aserazwykkmznreqjzbd.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFzZXJhend5a2ttem5yZXFqemJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1NTQ3MDMsImV4cCI6MjA3NTEzMDcwM30.-lze9Sxq9WxWO4dg_pudJ4NlC3tlUt1edYiVWmVpc2I"
);

const params = new URLSearchParams(window.location.search);
const access_token = params.get("access_token");
const refresh_token = params.get("refresh_token");
const type = params.get("type");

const message = document.getElementById("message");

if (type !== "recovery" || !access_token || !refresh_token) {
  message.textContent = "Invalid or expired reset link.";
  message.style.color = "red";
}

// Button handler
document.getElementById("resetBtn").addEventListener("click", async () => {
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

  // 🔑 Set session using the tokens from the URL
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