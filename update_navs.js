const fs = require('fs');
const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));
files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let changed = false;

    // Fix CSS query strings
    if (content.includes('styles.css?')) {
        content = content.replace(/href="styles\.css\?[^"]+"/g, 'href="styles.css"');
        changed = true;
    }

    // Add Profile and Settings to teacher pages
    if (file.startsWith('teacher') && file !== 'teacher_profile.html' && file !== 'teacher_settings.html') {
        if (!content.includes('teacher_profile.html')) {
            // Find the end of nav-links ul
            content = content.replace(/<\/ul>\s*<div class="logout-wrapper">/g, 
            '    <li><a href="teacher_profile.html"><i class="ri-user-settings-line"></i> Profile</a></li>\n            <li><a href="teacher_settings.html"><i class="ri-settings-line"></i> Settings</a></li>\n        </ul>\n        <div class="logout-wrapper">');
            changed = true;
        }
    }

    // Add Profile and Settings to student pages
    if (file.startsWith('student') && file !== 'student_profile.html' && file !== 'student_settings.html') {
        if (!content.includes('student_profile.html')) {
            content = content.replace(/<\/ul>\s*<div class="logout-wrapper">/g, 
            '    <li><a href="student_profile.html"><i class="ri-user-settings-line"></i> Profile</a></li>\n            <li><a href="student_settings.html"><i class="ri-settings-4-line"></i> Settings</a></li>\n        </ul>\n        <div class="logout-wrapper">');
            changed = true;
        }
    }

    if (changed) {
        fs.writeFileSync(file, content);
        console.log('Fixed ' + file);
    }
});
