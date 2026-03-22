const fs = require('fs');
const path = require('path');

const dir = 'c:\\Users\\aju85\\.gemini\\antigravity\\scratch\\attendance_app';

// 1. Create teacher_profile.html
let tSettings = fs.readFileSync(path.join(dir, 'teacher_settings.html'), 'utf8');
tSettings = tSettings.replace('<title>ClassTrack | Settings</title>', '<title>ClassTrack | Profile</title>');
tSettings = tSettings.replace('<h1 class="page-title">Settings</h1>', '<h1 class="page-title">Profile</h1>');
tSettings = tSettings.replace(/<li class="active"><a href="teacher_settings.html">/g, '<li><a href="teacher_settings.html">');
fs.writeFileSync(path.join(dir, 'teacher_profile.html'), tSettings, 'utf8');

// 2. Create student_settings.html
let sProfile = fs.readFileSync(path.join(dir, 'student_profile.html'), 'utf8');
sProfile = sProfile.replace('<title>ClassTrack | Student Profile</title>', '<title>ClassTrack | System Settings</title>');
sProfile = sProfile.replace('<h1 class="page-title">My Profile</h1>', '<h1 class="page-title">System Settings</h1>');
sProfile = sProfile.replace(/<li class="active"><a href="student_profile.html">/g, '<li><a href="student_profile.html">');
fs.writeFileSync(path.join(dir, 'student_settings.html'), sProfile, 'utf8');

// 3. Inject links into all Teacher files
const teacherFiles = ['teacher.html', 'teacher_classes.html', 'teacher_daily_attendance.html', 'teacher_reports.html', 'teacher_settings.html', 'teacher_profile.html'];
for (const file of teacherFiles) {
    let p = path.join(dir, file);
    let content = fs.readFileSync(p, 'utf8');
    
    // Check if hasn't been added yet
    if (!content.includes('teacher_profile.html') || file === 'teacher_profile.html') {
        const linkToAdd = `<li><a href="teacher_profile.html"><i class="ri-user-settings-line"></i> Profile</a></li>\n            `;
        content = content.replace(/(<li><a href="teacher_settings\.html">)/g, linkToAdd + '$1');
        content = content.replace(/(<li class="active"><a href="teacher_settings\.html">)/g, linkToAdd + '$1');
        
        if (file === 'teacher_profile.html') {
             content = content.replace('<li><a href="teacher_profile.html">', '<li class="active"><a href="teacher_profile.html">');
        }
        
        fs.writeFileSync(p, content, 'utf8');
        console.log(`Updated Teacher Nav: ${file}`);
    }
}

// 4. Inject links into all Student files
const studentFiles = ['student.html', 'student_attendance.html', 'student_daily_attendance.html', 'student_profile.html', 'student_timetable.html', 'student_settings.html'];
for (const file of studentFiles) {
    let p = path.join(dir, file);
    let content = fs.readFileSync(p, 'utf8');
    
    if (!content.includes('student_settings.html') || file === 'student_settings.html') {
        const linkToAdd = `\n            <li><a href="student_settings.html"><i class="ri-settings-4-line"></i> Settings</a></li>`;
        
        content = content.replace(/(<li><a href="student_profile\.html">.*?<\/a><\/li>)/g, '$1' + linkToAdd);
        content = content.replace(/(<li class="active"><a href="student_profile\.html">.*?<\/a><\/li>)/g, '$1' + linkToAdd);
        
        if (file === 'student_settings.html') {
            content = content.replace('<li><a href="student_settings.html">', '<li class="active"><a href="student_settings.html">');
        }
        
        fs.writeFileSync(p, content, 'utf8');
        console.log(`Updated Student Nav: ${file}`);
    }
}
