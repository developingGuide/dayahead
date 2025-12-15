const supabase = supabase.createClient(
  "https://aserazwykkmznreqjzbd.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFzZXJhend5a2ttem5yZXFqemJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1NTQ3MDMsImV4cCI6MjA3NTEzMDcwM30.-lze9Sxq9WxWO4dg_pudJ4NlC3tlUt1edYiVWmVpc2I"
);

// 1️⃣ Read tokens from URL
const params = new URLSearchParams(window.location.search);
const access_token = params.get("access_token");
const refresh_token = params.get("refresh_token");
const type = params.get("type");

const message = document.getElementById("message");

if (type !== "recovery" || !access_token || !refresh_token) {
  message.textContent = "Invalid or expired reset link.";
  message.style.color = "red";
}

// 2️⃣ Handle reset
document.getElementById("resetBtn").onclick = async () => {
  const password = document.getElementById("password").value;
  const confirm = document.getElementById("confirm").value;

  if (!password || password.length < 6) {
    message.textContent = "Password must be at least 6 characters.";
    return;
  }

  if (password !== confirm) {
    message.textContent = "Passwords do not match.";
    return;
  }

  // 3️⃣ Set session FIRST
  const { error: sessionError } = await supabase.auth.setSession({
    access_token,
    refresh_token,
  });

  if (sessionError) {
    message.textContent = sessionError.message;
    return;
  }

  // 4️⃣ Update password
  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    message.textContent = error.message;
    message.style.color = "red";
  } else {
    message.textContent = "Password updated successfully 🎉";
    message.style.color = "#4CAF50";
  }
};
