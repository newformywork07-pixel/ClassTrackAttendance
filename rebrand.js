const fs = require('fs');
const path = require('path');

const dir = 'c:\\Users\\aju85\\.gemini\\antigravity\\scratch\\attendance_app';

const replacements = [
    { target: /ClassTrack/g, replacement: 'ClassTrack' },
    { target: /ClassTrack Admin/g, replacement: 'ClassTrack Admin' },
    { target: /ClassTrack Faculty/g, replacement: 'ClassTrack Faculty' },
    { target: /ClassTrack Student/g, replacement: 'ClassTrack Student' },
    { target: /ClassTrack Principal/g, replacement: 'ClassTrack Principal' },
    { target: /ClassTrack HOD/g, replacement: 'ClassTrack HOD' },
    { target: /ClassTrack Office/g, replacement: 'ClassTrack Office' },
    { target: /nexus\.edu/g, replacement: 'classtrack.edu' },
    { target: /nexusedu\.in/g, replacement: 'classtrack.edu' },
    { target: /class="main-content"/g, replacement: 'class="main-content"' },
    { target: /ClassTrack Student/g, replacement: 'ClassTrack Student' },
    { target: /ClassTrack/g, replacement: 'ClassTrack' } // Catch-all for remaining like "ClassTrack Teacher" if any, but above are more specific
];

function processDirectory(directory) {
    const files = fs.readdirSync(directory);
    for (const file of files) {
        const fullPath = path.join(directory, file);
        if (fs.statSync(fullPath).isDirectory()) {
            // Ignore node_modules, etc. if any
            if (file !== 'node_modules' && file !== '.git') {
                processDirectory(fullPath);
            }
        } else {
            if (['.html', '.js', '.css', '.md', '.bat'].includes(path.extname(fullPath))) {
                let content = fs.readFileSync(fullPath, 'utf8');
                let changed = false;
                
                // First replace "admin-content"
                if (content.includes('class="main-content"')) {
                    content = content.replace(/class="main-content"/g, 'class="main-content"');
                    changed = true;
                }

                // Temporary specific replacements to avoid double replacement by catch-all
                const textReplacements = [
                    { t: 'ClassTrack', r: 'ClassTrack' },
                    { t: 'ClassTrack Admin', r: 'ClassTrack Admin' },
                    { t: 'ClassTrack Faculty', r: 'ClassTrack Faculty' },
                    { t: 'ClassTrack Student', r: 'ClassTrack Student' },
                    { t: 'ClassTrack Principal', r: 'ClassTrack Principal' },
                    { t: 'ClassTrack HOD', r: 'ClassTrack HOD' },
                    { t: 'ClassTrack Office', r: 'ClassTrack Office' },
                    { t: 'classtrack.edu', r: 'classtrack.edu' },
                    { t: 'classtrack.edu', r: 'classtrack.edu' },
                    { t: 'ClassTrack Student', r: 'ClassTrack Student' },
                    { t: 'ClassTrack', r: 'ClassTrack' }
                ];

                for (let r of textReplacements) {
                    if (content.includes(r.t)) {
                        // Global replace string
                        content = content.split(r.t).join(r.r);
                        changed = true;
                    }
                }

                if (changed) {
                    fs.writeFileSync(fullPath, content, 'utf8');
                    console.log(`Updated: ${file}`);
                }
            }
        }
    }
}

processDirectory(dir);
console.log('ClassTrack Rebranding Complete!');
