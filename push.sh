# COMMIT MESSAGE
echo Commit message?
read msg
echo ""

# PUSH ALL FILES
git add -A
git commit -m "$msg"
git push origin master