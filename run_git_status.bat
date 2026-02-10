@echo off
set "HOME=C:\Users\Ahmed"
echo Running git status... > git_status_output.txt
git status >> git_status_output.txt 2>&1
echo Done. >> git_status_output.txt
