import { execSync } from 'child_process'

export function initGit() {
  execSync('git init', { stdio: 'pipe' })
  execSync('git add --all', { stdio: 'pipe' })
  execSync('git commit -m "Initial commit from Create Yuki Stack"', {
    stdio: 'pipe',
  })
}
