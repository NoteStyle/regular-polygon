# Polygon Escape: Space Unit 6 Math Quest 🚀📐

A gamified Year 5 regular polygons escape room and interactive math assessment based on the Malaysian KSSR Mathematics Unit 6 (Space) syllabus (Pages 217–218).

---

## 🌐 Viewing on GitHub Pages

If you are seeing a blank page or 404 on GitHub, follow these quick steps:

### 1. Enable GitHub Pages in Repository Settings
1. Open your repository on GitHub.
2. Go to **Settings** (tab at the top right of the repo).
3. In the left sidebar, click **Pages** (under the "Code and automation" section).
4. Under **Build and deployment** > **Source**:
   * Select **GitHub Actions** from the dropdown menu (recommended).
5. Once selected, pushing any commit to `main` or `master` will automatically trigger the deployment workflow in `.github/workflows/deploy.yml` and publish your website!

### 2. Manual Workflow Trigger
1. Go to the **Actions** tab on your GitHub repository.
2. Click on **Deploy to GitHub Pages** in the left sidebar.
3. Click **Run workflow** > **Run workflow**.
4. Once completed (green checkmark), your live URL will appear (e.g. `https://<username>.github.io/<repository-name>/`).

---

## 💻 Local Development

To run this app on your computer:

```bash
# 1. Install dependencies
npm install

# 2. Start local development server
npm run dev

# 3. Build for production
npm run build
```

---

## 📚 Curriculum Standards Covered

* **Standard 6.1.1 (Regular Polygons)**:
  * Identifying closed regular polygons with equal straight sides, equal interior angles, corners (vertices), symmetrical axes, and diagonals.
  * **Challenge A**: 6 straight sides, equal length, 6 symmetrical axes (*Regular Hexagon*).
  * **Challenge B**: 3 straight sides, equal interior angles, 0 diagonals (*Equilateral Triangle*).
  * **Challenge C**: 7 corners, equal length, 14 diagonals (*Regular Heptagon*).
  * Table completion & diagonal formula $n(n-3)/2$.
