const fs = require('fs');

const targets = ['principal.html', 'hod.html', 'office.html'];

targets.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let changed = false;

    // Extract the nav-links block
    const navMatch = content.match(/<ul class="nav-links">([\s\S]*?)<\/ul>/);
    let newSections = '';
    
    if (navMatch) {
        let navHtml = navMatch[1];
        let links = [...navHtml.matchAll(/<a href="#" onclick="switchView\('([^']+)', this\)">/g)];
        
        if(links.length === 0) {
           // Not converted yet, shouldn't happen, but let's grab original
           links = [...navHtml.matchAll(/<a href="#"[^>]*><i class="([^"]+)"><\/i>\s*(.*?)<\/a>/g)];
           links.forEach((match, index) => {
               let iconClass = match[1];
               let name = match[2].trim();
               let slug = index === 0 ? 'dashboard' : name.toLowerCase().replace(/[^a-z0-9]/g, '-');
               
               if (index !== 0 && !content.includes(`id="view-${slug}"`)) {
                   newSections += `
            <section id="view-${slug}" class="admin-view" style="padding: 2rem 3rem;">
                <div class="action-header" style="margin-bottom: 24px;">
                    <h1 class="page-title">${name}</h1>
                    <p style="color: var(--text-secondary); margin-top: 10px;">This module (${name}) is actively being developed.</p>
                </div>
                <div class="card" style="text-align: center; padding: 4rem;">
                    <i class="${iconClass}" style="font-size: 4rem; color: rgba(255,255,255,0.1); margin-bottom: 1rem;"></i>
                    <h2 style="margin-bottom: 1rem;">Coming Soon</h2>
                    <p style="color: var(--text-secondary);">The backend data for ${name} has not been fully mapped for this user tier yet.</p>
                </div>
            </section>\n`;
               }
           });
        } else {
             // Already converted navs, let's just extract the icon and name
             let originalLinks = [...navHtml.matchAll(/<a href="#" onclick="switchView\('([^']+)', this\)"><i class="([^"]+)"><\/i>\s*(.*?)<\/a>/g)];
             originalLinks.forEach((match, index) => {
                 let slug = match[1];
                 let iconClass = match[2];
                 let name = match[3].trim();
                 if (index !== 0 && !content.includes(`id="view-${slug}"`)) {
                     newSections += `
            <section id="view-${slug}" class="admin-view" style="padding: 2rem 3rem;">
                <div class="action-header" style="margin-bottom: 24px;">
                    <h1 class="page-title">${name}</h1>
                    <p style="color: var(--text-secondary); margin-top: 10px;">This module (${name}) is actively being developed.</p>
                </div>
                <div class="card" style="text-align: center; padding: 4rem;">
                    <i class="${iconClass}" style="font-size: 4rem; color: rgba(255,255,255,0.1); margin-bottom: 1rem;"></i>
                    <h2 style="margin-bottom: 1rem;">Coming Soon</h2>
                    <p style="color: var(--text-secondary);">The backend data for ${name} has not been fully mapped for this user tier yet.</p>
                </div>
            </section>\n`;
                 }
             });
        }
    }

    // Insert the new sections right before </div>\n    <footer
    if (newSections && content.includes('</div>\n    <footer class="site-footer">')) {
        content = content.replace('</div>\n    <footer class="site-footer">', newSections + '    </main>\n    </div>\n    <footer class="site-footer">');
        changed = true;
    } else if (newSections) {
        // fallback
        content = content.replace('<footer class="site-footer">', newSections + '    </main>\n    </div>\n    <footer class="site-footer">');
        changed = true;
    }

    if (changed) {
        fs.writeFileSync(file, content);
        console.log('Successfully injected SPA sections into ' + file);
    }
});
