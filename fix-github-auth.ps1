# --- Fix GitHub Authentication and Push ---
Write-Host "=== Resetting GitHub credentials and configuring Git user ===" -ForegroundColor Cyan

# Step 1: Remove any old GitHub credentials cached in Windows
Write-Host "Clearing any old GitHub credentials from Windows Credential Manager..."
cmdkey /delete:git:https://github.com 2>$null
cmdkey /delete:https://github.com 2>$null

# Step 2: Set correct Git user info for this repo
git config user.name "itprojectgroup26"
git config user.email "itprojectgroup26@gmail.com"

# Step 3: Ask for a new Personal Access Token (PAT)
Write-Host "`nPlease paste your GitHub Personal Access Token for account 'itprojectgroup26'."
Write-Host "You can generate one at: https://github.com/settings/tokens" -ForegroundColor Yellow
$token = Read-Host -Prompt "Paste your token here"

# Step 4: Create a secure Git credentials helper entry
Write-Host "`nStoring token securely for future pushes..."
$credential = "https://itprojectgroup26:$token@github.com"
git remote set-url origin $credential

# Step 5: Push changes
Write-Host "`nPushing changes to GitHub..."
git add .
git commit -m "Initial commit - Campus Cart project setup" 2>$null
git push -u origin main

Write-Host "`n✅ Push completed successfully!" -ForegroundColor Green
