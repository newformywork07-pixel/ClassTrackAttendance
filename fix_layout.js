const fs = require('fs');

const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let changed = false;

    // Remove ?v= query strings from JS and CSS
    if (content.match(/\.(css|js)\?v=\d+/)) {
        content = content.replace(/\.(css|js)\?v=\d+/g, '.$1');
        changed = true;
    }

    // Fix missing </div> between </main> and <footer
    if (content.match(/<\/main>\s*<footer/)) {
        content = content.replace(/<\/main>\s*<footer/g, '</main>\n    </div>\n    <footer');
        changed = true;
    }

    // Apply standard site-footer class
    if (content.includes('<footer style="text-align: center; padding: 20px;')) {
        content = content.replace(/<footer style="[^"]+">([\s\S]*?)<\/footer>/g, '<footer class="site-footer">$1</footer>');
        changed = true;
    }

    if (changed) {
        fs.writeFileSync(file, content);
        console.log('Fixed DOM logic for ' + file);
    }
});
