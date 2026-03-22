const fs = require('fs');

const profileContent = `
        <section class="dashboard-content">
            <h1 class="page-title">Personal Profile</h1>
            <div class="grid-2" style="display: grid; grid-template-columns: 1fr 2fr; gap: 24px;">
                <!-- Left Column -->
                <div class="card" style="text-align: center; padding: 2rem;">
                    <div style="position: relative; display: inline-block;">
                        <img src="https://ui-avatars.com/api/?name=User&background=ff6b00&color=fff" class="avatar" style="width: 120px; height: 120px; font-size: 2rem; border-radius: 50%; border: 4px solid var(--border-color); margin-bottom: 1rem;">
                        <span style="position: absolute; bottom: 20px; right: 0; background: var(--accent-primary); width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; border: 2px solid var(--bg-card);"><i class="ri-camera-fill"></i></span>
                    </div>
                    <h2 style="font-size: 1.4rem; margin-bottom: 0.2rem;" class="dyn-name">Alex Doe</h2>
                    <p style="color: var(--text-secondary); margin-bottom: 1.5rem;" class="dyn-reg">ID: 20XXBCD123</p>
                    <div style="display: flex; gap: 10px; justify-content: center;">
                        <span class="grid-badge badge-present">Active Status</span>
                    </div>
                </div>

                <!-- Right Column -->
                <div class="card">
                    <h3 style="margin-bottom: 1.5rem; border-bottom: 1px solid var(--border-color); padding-bottom: 1rem;"><i class="ri-user-settings-line"></i> Identifiable Information</h3>
                    <form>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem;">
                            <div class="input-group">
                                <label>Full Legal Name</label>
                                <input type="text" class="dyn-name" value="Alex Doe" readonly style="opacity: 0.7;">
                            </div>
                            <div class="input-group">
                                <label>Institutional ID</label>
                                <input type="text" class="dyn-reg" value="20XXBCD123" readonly style="opacity: 0.7;">
                            </div>
                        </div>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem;">
                            <div class="input-group">
                                <label>Primary Email</label>
                                <input type="email" value="alex@classtrack.edu" placeholder="mail@domain.com">
                            </div>
                            <div class="input-group">
                                <label>Mobile Phone</label>
                                <input type="tel" placeholder="+1 (555) 000-0000">
                            </div>
                        </div>
                        <div class="input-group" style="margin-bottom: 2rem;">
                            <label>Residential Address</label>
                            <textarea rows="3" style="width: 100%; background: rgba(0,0,0,0.2); border: 1px solid var(--border-color); padding: 12px 16px; border-radius: var(--radius-sm); color: var(--text-primary); outline: none; resize: none;" placeholder="123 Campus Layout..."></textarea>
                        </div>
                        <button type="button" class="btn-primary" style="float: right;">Save Profile Data</button>
                    </form>
                </div>
            </div>
        </section>
`;

const settingsContent = `
        <section class="dashboard-content">
            <h1 class="page-title">App Settings</h1>
            
            <div class="grid-2" style="display: grid; grid-template-columns: 1fr; gap: 24px; max-width: 800px;">
                <div class="card">
                    <h3 style="margin-bottom: 1.5rem; border-bottom: 1px solid var(--border-color); padding-bottom: 1rem;"><i class="ri-shield-keyhole-line"></i> Security & Access</h3>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                        <div>
                            <h4 style="margin-bottom: 4px;">Two-Factor Authentication (2FA)</h4>
                            <p style="font-size: 0.85rem; color: var(--text-secondary);">Require a code from an authenticator app when logging in.</p>
                        </div>
                        <label class="switch" style="position: relative; display: inline-block; width: 44px; height: 24px;">
                            <input type="checkbox" style="opacity: 0; width: 0; height: 0;">
                            <span class="slider" style="position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(255,255,255,0.1); transition: .4s; border-radius: 34px;"></span>
                        </label>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 1rem; border-top: 1px solid rgba(255,255,255,0.05);">
                        <div>
                            <h4 style="margin-bottom: 4px;">Change Password</h4>
                            <p style="font-size: 0.85rem; color: var(--text-secondary);">Update your current authentication credentials.</p>
                        </div>
                        <button class="btn-secondary">Update Password</button>
                    </div>
                </div>

                <div class="card">
                    <h3 style="margin-bottom: 1.5rem; border-bottom: 1px solid var(--border-color); padding-bottom: 1rem;"><i class="ri-paint-line"></i> Appearance & UI</h3>
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 1rem;">
                        <div style="border: 2px solid var(--accent-primary); padding: 1rem; border-radius: var(--radius-sm); text-align: center; cursor: pointer; background: rgba(0,0,0,0.2);">
                            <i class="ri-moon-fill" style="font-size: 1.5rem; color: var(--accent-primary); margin-bottom: 0.5rem; display: block;"></i>
                            <span style="font-weight: 600;">Dark Mode</span>
                        </div>
                        <div style="border: 1px solid var(--border-color); padding: 1rem; border-radius: var(--radius-sm); text-align: center; cursor: not-allowed; opacity: 0.5;">
                            <i class="ri-sun-line" style="font-size: 1.5rem; margin-bottom: 0.5rem; display: block;"></i>
                            <span>Light Mode</span>
                        </div>
                        <div style="border: 1px solid var(--border-color); padding: 1rem; border-radius: var(--radius-sm); text-align: center; cursor: not-allowed; opacity: 0.5;">
                            <i class="ri-computer-line" style="font-size: 1.5rem; margin-bottom: 0.5rem; display: block;"></i>
                            <span>System Default</span>
                        </div>
                    </div>
                    <p style="font-size: 0.85rem; color: var(--text-secondary);">Currently locked to "Glass Dark Form" per institutional mandate.</p>
                </div>
            </div>
        </section>
`;

// Helper to replace section
function replaceSection(file, newContent) {
    if (!fs.existsSync(file)) return;
    let html = fs.readFileSync(file, 'utf8');
    const startIdx = html.indexOf('<section class="dashboard-content">');
    const endIdx = html.indexOf('</section>', startIdx);
    
    if (startIdx !== -1 && endIdx !== -1) {
        html = html.substring(0, startIdx) + newContent + html.substring(endIdx + 10);
        fs.writeFileSync(file, html);
        console.log('Rebuilt ' + file);
    }
}

replaceSection('teacher_profile.html', profileContent);
replaceSection('student_profile.html', profileContent);

replaceSection('teacher_settings.html', settingsContent);
replaceSection('student_settings.html', settingsContent);

