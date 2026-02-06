import os
import shutil

git_dir = r"C:\Users\piyus\OneDrive\Desktop\JobSprint\.git"

# Files to remove
merge_files = ["MERGE_HEAD", "MERGE_MODE", "MERGE_MSG", ".MERGE_MSG.swp", "AUTO_MERGE"]

for file in merge_files:
    file_path = os.path.join(git_dir, file)
    if os.path.exists(file_path):
        try:
            os.remove(file_path)
            print(f"Removed: {file}")
        except Exception as e:
            print(f"Error removing {file}: {e}")

print("\nMerge cleanup completed!")

# Now try to push
import subprocess
os.chdir(r"C:\Users\piyus\OneDrive\Desktop\JobSprint")
result = subprocess.run(["git", "status"], capture_output=True, text=True)
print("\nGit Status:")
print(result.stdout)
if result.stderr:
    print("Errors:", result.stderr)

result = subprocess.run(["git", "push", "--force", "origin", "main"], capture_output=True, text=True)
print("\nPush Result:")
print(result.stdout)
if result.stderr:
    print("Errors:", result.stderr)
print("Return code:", result.returncode)
