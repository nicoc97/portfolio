import fs from 'fs';
import path from 'path';

// This script generates a static HTML version with content for better AI parsing
const generateStaticContent = () => {
  const staticHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nico Cruickshank - Web Developer Portfolio</title>
    <meta name="description" content="Full Stack Web Developer specializing in React, TypeScript, Node.js, and modern web technologies">
    <meta name="robots" content="index, follow">
</head>
<body>
    <header>
        <h1>Nico Cruickshank</h1>
        <p>Full Stack Web Developer</p>
    </header>
    
    <main>
        <section id="about">
            <h2>About</h2>
            <p>Experienced web developer specializing in modern web technologies including React, TypeScript, Node.js, and responsive design. Passionate about creating performant, accessible, and user-friendly web applications.</p>
        </section>
        
        <section id="skills">
            <h2>Technical Skills</h2>
            <h3>Frontend Technologies</h3>
            <ul>
                <li>React & React Hooks</li>
                <li>TypeScript & JavaScript (ES6+)</li>
                <li>HTML5 & CSS3</li>
                <li>Tailwind CSS & Responsive Design</li>
                <li>Vite & Modern Build Tools</li>
            </ul>
            
            <h3>Backend Technologies</h3>
            <ul>
                <li>Node.js & Express</li>
                <li>RESTful APIs</li>
                <li>Database Design & Management</li>
            </ul>
            
            <h3>Development Tools</h3>
            <ul>
                <li>Git & Version Control</li>
                <li>Performance Optimization</li>
                <li>Accessibility (WCAG)</li>
                <li>Testing & Debugging</li>
            </ul>
        </section>
        
        <section id="projects">
            <h2>Projects</h2>
            <p>View my interactive project showcase on the main site.</p>
        </section>
        
        <section id="contact">
            <h2>Contact</h2>
            <p>Available for freelance work and full-time opportunities.</p>
            <p>Get in touch through the contact form on the main site.</p>
        </section>
    </main>
    
    <footer>
        <p>&copy; 2025 Nico Cruickshank. All rights reserved.</p>
    </footer>
    
    <!-- Link to interactive version -->
    <script>
        // Redirect to interactive version after AI bots have parsed content
        if (!navigator.userAgent.includes('bot') && !navigator.userAgent.includes('crawler')) {
            // This is likely a human user, redirect to the interactive version
            window.location.href = '/app.html';
        }
    </script>
</body>
</html>`;

  // Write the static version
  fs.writeFileSync(path.join(process.cwd(), 'dist', 'static.html'), staticHTML);
  console.log('Static HTML version generated for AI parsing');
};

export { generateStaticContent };