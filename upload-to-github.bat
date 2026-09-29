@echo off
set PATH=C:\Program Files\Git\bin;%PATH%
cd /d C:\Users\WIZ\tpq-digital

git config user.name "mujahidmuslim656-sys"
git config user.email "mujahidmuslim656-sys@users.noreply.github.com"
git add .
git commit -F COMMIT_MSG.txt
git remote add origin https://github.com/mujahidmuslim656-sys/Simtaq.git
git branch -M main
git push -u origin main

echo.
echo Upload selesai!
pause
