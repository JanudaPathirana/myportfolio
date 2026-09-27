# Personal Portfolio Website

A modern, responsive, and high-fidelity portfolio website built with HTML, CSS, JavaScript, and Tailwind CSS. Tailored for software engineering students to highlight projects, academic milestones, and skills.

## 🚀 Live Demo
Once hosted on GitHub Pages, add your live link here:
`https://<your-username>.github.io/<your-repo-name>/`

## ✨ Features
- 🌓 **Dynamic Theme System**: Seamless toggle between dark and light themes with automatic system preference detection and `localStorage` persistence.
- ⚡ **Interactive Filtering**: Seamlessly filter project cards by category (Web Apps, Mobile Apps, CLI Systems) with smooth transitions.
- ✍️ **Typewriter Subtitle**: Animated intro title sequence in the Hero section.
- 📬 **Validated Form Integration**: Custom feedback form with inline validation checks and responsive Toast Alert notifications.
- 🎨 **Glassmorphism Design**: Semi-transparent elevated components, glowing decorative backdrops, custom scrollbars, and sleek scroll progress bars.

## 🛠️ Technology Stack
- **Structure**: Semantic HTML5
- **Styling**: Tailwind CSS & Vanilla CSS (animations, scrollbars, and variables)
- **Logic**: Vanilla ES6+ JavaScript
- **Icons**: FontAwesome v6
- **Typography**: Google Fonts (Outfit & JetBrains Mono)

---

## 🌐 How to Host on GitHub Pages (Free)

Since this is a static website, you can host it for free using **GitHub Pages** in just a few steps:

### Step 1: Initialize Git and Commit Locally
Run these commands in your project directory terminal:
```bash
git init
git add .
git commit -m "feat: initial commit of portfolio site"
```

### Step 2: Create a GitHub Repository
1. Go to your [GitHub account](https://github.com/) and create a new **public** repository (e.g., name it `portfolio` or `my-portfolio`).
2. Do **not** check "Initialize this repository with a README" (as we already have files).

### Step 3: Link and Push Your Code
Copy the command block under *"…or push an existing repository from the command line"* from your new GitHub repo page, or run:
```bash
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo-name>.git
git push -u origin main
```
*(Replace `<your-username>` and `<your-repo-name>` with your actual GitHub username and repository name).*

### Step 4: Enable GitHub Pages
1. Go to your repository page on GitHub.
2. Click on the ⚙️ **Settings** tab.
3. On the left sidebar, click on **Pages** (under the "Code and automation" section).
4. Under **Build and deployment**, set the **Source** dropdown to `Deploy from a branch`.
5. Under **Branch**, select `main` (and leave the folder path as `/ (root)`).
6. Click **Save**.

Within 1-2 minutes, GitHub will build your site. You will see a banner at the top of the Pages settings page showing: 
> "Your site is live at `https://<your-username>.github.io/<your-repo-name>/`"
