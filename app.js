/* app.js */
// Mock data and interactions for the frontend

// --- Global Data Initialization ---
const DEFAULT_USERS = [
    { name: 'Faculty User', id: 'fac1', email: 'fac1@classtrack.edu', password: 'password', role: 'Faculty', status: 'Active', dept: 'Digital Arts', inCharge: true },
    { name: 'Student User', id: 'stu1', email: 'stu1@classtrack.edu', password: 'password', role: 'Student', status: 'Active', dept: 'Digital Arts' },
    { name: 'Alex Doe', id: '20CS01', email: 'alex.doe@classtrack.edu', password: 'password123', role: 'Student', status: 'Active', dept: 'BA MULTIMEDIA' },
    { name: 'Prof. Smith', id: 'EMP1042', email: 'smith.faculty@classtrack.edu', password: 'password123', role: 'Faculty', status: 'Active', dept: 'BA ANIMATION & VISUAL EFFECTS', inCharge: true },
    { name: 'Brian Jones', id: '20CS02', email: 'brian.jones@classtrack.edu', password: 'password123', role: 'Student', status: 'Suspended', dept: 'BA ANIMATION & GRAPHIC DESIGN' },
    { name: 'Dr. Emily Watson', id: 'EMP1099', email: 'emily.faculty@classtrack.edu', password: 'password123', role: 'Faculty', status: 'Active', dept: 'BSC FASHION', inCharge: false },
    { name: 'Dr. Sarah Connor', id: 'HOD001', email: 'sarah.hod@classtrack.edu', password: 'password123', role: 'HOD', status: 'Active', dept: 'BA MULTIMEDIA' },
    { name: 'Principal Miller', id: 'PRIN01', email: 'principal@classtrack.edu', password: 'password123', role: 'Principal', status: 'Active', dept: 'Administration' },
    { name: 'John Office', id: 'OFF01', email: 'office@classtrack.edu', password: 'password123', role: 'Office', status: 'Active', dept: 'Administration' }
];

// Initialize localStorage with correct ClassTrack defaults conditionally
const existingUsers = localStorage.getItem('admin_users');
if (!existingUsers || existingUsers === '[]' || existingUsers === 'null') {
    localStorage.setItem('admin_users', JSON.stringify(DEFAULT_USERS));
    console.log("System: Admin users initialized with ClassTrack defaults.");
}

// Initialize Attendance Data
if (!localStorage.getItem('attendance_records')) {
    localStorage.setItem('attendance_records', JSON.stringify({}));
}


function handleLogin(e) {
    e.preventDefault();
    const btn = document.getElementById('loginBtn');
    const regNumber = document.getElementById('regNumber').value.trim();
    const password = document.getElementById('password').value;
    const errorDiv = document.getElementById('loginError');
    
    // Hide previous errors
    if(errorDiv) errorDiv.style.display = 'none';

    // Animate button
    const btnText = btn.querySelector('.btn-text');
    const originalText = btnText.innerText;
    btnText.innerText = 'Signing in...';
    btn.style.opacity = '0.8';

    // Simulate API call
    setTimeout(() => {
        const savedUsers = JSON.parse(localStorage.getItem('admin_users') || JSON.stringify(DEFAULT_USERS));
        
        // Ensure test users are available even if localStorage is stale
        const testUsers = [
            { id: 'fac1', password: 'password', name: 'Faculty User', role: 'Faculty', dept: 'Digital Arts', inCharge: true },
            { id: 'stu1', password: 'password', name: 'Student User', role: 'Student', dept: 'Digital Arts' }
        ];
        
        // Admin hardcoded check
        if (regNumber.toLowerCase() === 'admin') {
           if (password === 'admin123') {
                localStorage.setItem('nexus_user', JSON.stringify({ name: 'Super Admin', id: 'admin', role: 'admin' }));
                window.location.href = 'admin.html';
                return;
           } else {
               showLoginError('Invalid Admin Password');
               resetBtn();
               return;
           }
        }

        const allUsers = [...savedUsers, ...testUsers];
        const user = allUsers.find(u => u.id.toLowerCase() === regNumber.toLowerCase());
        
        if (user && user.password === password) {
            if (user.status === 'Suspended') {
                showLoginError('Your account has been suspended. Contact Admin.');
                resetBtn();
                return;
            }
            localStorage.setItem('nexus_user', JSON.stringify({
                id: user.id,
                name: user.name,
                role: user.role.toLowerCase(),
                dept: user.dept,
                inCharge: user.inCharge || false
            }));
            
            // Auto redirect based on role
            const role = user.role.toLowerCase();
            if (role === 'student') {
                window.location.href = 'student.html';
            } else if (role === 'faculty') {
                window.location.href = 'teacher.html';
            } else if (role === 'admin') {
                window.location.href = 'admin.html';
            } else if (role === 'hod') {
                window.location.href = 'hod.html';
            } else if (role === 'principal') {
                window.location.href = 'principal.html';
            } else if (role === 'office') {
                window.location.href = 'office.html';
            }
        } else {
            showLoginError('Invalid ID or Password');
            resetBtn();
        }
    }, 800);

    function showLoginError(msg) {
        if(errorDiv) {
            errorDiv.innerText = msg;
            errorDiv.style.display = 'block';
        }
    }

    function resetBtn() {
        btnText.innerText = originalText;
        btn.style.opacity = '1';
    }
}

function resetAllData() {
    if (confirm("This will clear all saved users, subjects, and attendance records and reset to defaults. Continue?")) {
        localStorage.clear();
        alert("Data reset successful. The page will now reload.");
        window.location.reload();
    }
}

function checkClassInCharge() {
    const user = JSON.parse(localStorage.getItem('nexus_user') || '{}');
    if (user.role === 'faculty' && !user.inCharge) {
        const content = document.querySelector('.dashboard-content');
        if (content) {
            content.innerHTML = `
                <div style="text-align: center; padding: 100px 20px;">
                    <i class="ri-lock-2-line" style="font-size: 5rem; color: var(--danger); margin-bottom: 20px; display: block;"></i>
                    <h1 style="color: white; margin-bottom: 10px;">Access Restricted</h1>
                    <p style="color: var(--text-secondary); max-width: 500px; margin: 0 auto;">
                        Only designated <strong>Class In-Charge</strong> faculty can access this section. 
                        Please contact the administrator to update your designation.
                    </p>
                    <button class="btn-primary" onclick="window.location.href='teacher.html'" style="margin-top: 30px;">Return to Dashboard</button>
                </div>
            `;
        }
    }
}

// Student Dashboard Functions
function renderStudentLog() {
    const tbody = document.getElementById('studentAttendanceTable');
    if(!tbody) return;

    // Helper to render a badge
    const getBadge = (hourObj) => {
        if (!hourObj) return '<span class="grid-badge badge-not-set">TIME TABLE NOT SET!</span>';
        
        let badgeClass = 'badge-not-entered';
        let text = hourObj.sub; // Default show subject name
        
        switch(hourObj.state) {
            case 'present': badgeClass = 'badge-present'; break;
            case 'absent': badgeClass = 'badge-absent'; break;
            case 'not-set': 
                badgeClass = 'badge-not-set'; 
                text = 'TIME TABLE NOT SET!'; 
                break;
            case 'suspended': 
                badgeClass = 'badge-suspended'; 
                text = 'NO CLASS'; 
                break;
            case 'not-entered':
                badgeClass = 'badge-not-entered';
                break;
        }

        return `<span class="grid-badge ${badgeClass}">${text}</span>`;
    };

    const getPersistentSemesterData = () => {
        const stored = localStorage.getItem('student_semester_log');
        let dataPack;
        
        if (stored) {
            dataPack = JSON.parse(stored);
        } else {
            // Initial generation
            const data = [];
            let currentDate = new Date('2025-08-01T00:00:00');
            const endDate = new Date('2026-01-31T00:00:00');
            const subjects = getSubjects();
            let totalP = 0; let totalA = 0;

            while (currentDate <= endDate) {
                const dayOfWeek = currentDate.getDay();
                if (dayOfWeek !== 0 && dayOfWeek !== 6) {
                    const dateStr = currentDate.toISOString().split('T')[0];
                    const hours = [];
                    for(let i=0; i<5; i++) {
                        const rand = Math.random();
                        let state = rand > 0.85 ? 'absent' : 'present';
                        let sub = subjects[i % subjects.length];
                        if (state === 'present') totalP++; else totalA++;
                        hours.push({ sub, state });
                    }
                    data.push({ date: dateStr, hours });
                }
                currentDate.setDate(currentDate.getDate() + 1);
            }
            data.sort((a,b) => new Date(b.date) - new Date(a.date));
            dataPack = { log: data, stats: { p: totalP, a: totalA } };
            localStorage.setItem('student_semester_log', JSON.stringify(dataPack));
        }

        // --- ENHANCEMENT: Ensure "today" and "recent days" up to real-world time are added ---
        const todayStr = new Date().toISOString().split('T')[0];
        const newestLogDate = dataPack.log.length > 0 ? dataPack.log[0].date : '2025-01-01';
        
        if (todayStr > newestLogDate) {
            // Add today if missing, so unshifting from Faculty save has somewhere to go or is visible
            const existing = dataPack.log.find(r => r.date === todayStr);
            if (!existing) {
                const dummyRecord = { date: todayStr, hours: Array(5).fill({ sub: 'Not Marked', state: 'not-entered' }) };
                dataPack.log.unshift(dummyRecord);
                localStorage.setItem('student_semester_log', JSON.stringify(dataPack));
            }
        }

        return dataPack;
    };

    const semesterData = getPersistentSemesterData();
    
    // Update DOM Stats
    document.getElementById('totalPresentHours').innerText = semesterData.stats.p;
    document.getElementById('totalAbsentHours').innerText = semesterData.stats.a;
    
    const totalWorkingDaysEl = document.getElementById('totalWorkingDays');
    if(totalWorkingDaysEl) {
        totalWorkingDaysEl.innerText = semesterData.log.length;
    }
    
    const totalCounted = semesterData.stats.p + semesterData.stats.a;
    const percentage = totalCounted > 0 ? ((semesterData.stats.p / totalCounted) * 100).toFixed(1) : 0;
    document.getElementById('overallPercentage').innerText = percentage + '%';

    // Update DOM Table
    tbody.innerHTML = semesterData.log.map(record => `
        <tr>
            <td>${record.date}</td>
            <td>${getBadge(record.hours[0])}</td>
            <td>${getBadge(record.hours[1])}</td>
            <td>${getBadge(record.hours[2])}</td>
            <td>${getBadge(record.hours[3])}</td>
            <td>${getBadge(record.hours[4])}</td>
        </tr>
    `).join('');
}


// Teacher Dashboard Functions
const rosterData = [
    { id: '20CS01', name: 'Alex Doe', prev: '85%' },
    { id: '20CS02', name: 'Brian Smith', prev: '92%' },
    { id: '20CS03', name: 'Charlie Brown', prev: '78%' },
    { id: '20CS04', name: 'Diana Prince', prev: '100%' },
    { id: '20CS05', name: 'Evan Wright', prev: '65%' }
];

let currentAttendance = {};

function switchAttendanceMode(mode) {
    const subTab = document.getElementById('tab-subject');
    const dailyTab = document.getElementById('tab-daily');
    const subCard = document.getElementById('subjectFilterCard');
    const dailyCard = document.getElementById('dailyFilterCard');
    const rosterSection = document.getElementById('rosterSection');

    if (mode === 'subject') {
        subTab.classList.add('active');
        dailyTab.classList.remove('active');
        subCard.style.display = 'grid';
        dailyCard.style.display = 'none';
    } else {
        dailyTab.classList.add('active');
        subTab.classList.remove('active');
        dailyCard.style.display = 'grid';
        subCard.style.display = 'none';
        
        // Populate in-charge class info
        const user = JSON.parse(localStorage.getItem('nexus_user') || '{}');
        const classes = JSON.parse(localStorage.getItem('admin_classes') || '[]');
        const myClass = classes.find(c => c.inChargeId === user.id);
        const display = document.getElementById('inChargeClassDisplay');
        if (display) display.value = myClass ? myClass.name : "Not Assigned";
    }
    
    // Reset roster view when switching modes
    if (rosterSection) rosterSection.style.display = 'none';
    currentAttendance = {};
}

function loadClassRoster(mode = 'subject') {
    let classSel, subSel, periodSel;
    
    if (mode === 'subject') {
        classSel = document.getElementById('classSelector').value;
        subSel = document.getElementById('subjectSelector').value;
        periodSel = document.getElementById('periodSelector').value;
        if(!classSel || !subSel || !periodSel) return alert('Please select Class, Period, and Subject');
    } else {
        const user = JSON.parse(localStorage.getItem('nexus_user') || '{}');
        const classes = JSON.parse(localStorage.getItem('admin_classes') || '[]');
        const myClass = classes.find(c => c.inChargeId === user.id);
        if (!myClass) return alert("You are not assigned as In-Charge of any class.");
        
        classSel = myClass.name;
        subSel = "Daily Attendance";
        periodSel = document.getElementById('dailyTypeSelector').value; // 'morning' or 'noon'
    }

    const btn = mode === 'subject' ? document.getElementById('loadRosterBtn') : event.target;
    const originalText = btn.innerHTML;
    btn.innerHTML = 'Loading...';

    setTimeout(() => {
        document.getElementById('rosterSection').style.display = 'block';
        btn.innerHTML = originalText;
        
        // Filter students by class/dept
        // In this mock, we'll assume all students in DEFAULT_USERS who match the department of the class
        const adminUsers = JSON.parse(localStorage.getItem('admin_users') || '[]');
        const classes = JSON.parse(localStorage.getItem('admin_classes') || '[]');
        const clsObj = classes.find(c => c.name === classSel);
        
        const filteredStudents = adminUsers.filter(u => u.role === 'Student' && (!clsObj || u.dept === clsObj.dept));
        
        // Update global rosterData for the table renderer
        window.currentRoster = filteredStudents.map(s => ({ id: s.id, name: s.name, prev: '---' }));

        // Load existing records if any
        const dateStr = new Date().toISOString().split('T')[0];
        const records = JSON.parse(localStorage.getItem('attendance_records') || '{}');
        
        if (records[dateStr] && records[dateStr][classSel] && records[dateStr][classSel][periodSel]) {
            currentAttendance = records[dateStr][classSel][periodSel].data;
        } else {
            currentAttendance = {}; 
            window.currentRoster.forEach(s => currentAttendance[s.id] = 'p');
        }

        renderRoster();
        updateCounts();
    }, 600);
}

function renderRoster() {
    const tbody = document.getElementById('rosterTbody');
    if(!tbody) return;

    // Initialize all as present by default ONLY if currentAttendance is empty
    if(Object.keys(currentAttendance).length === 0) {
        rosterData.forEach(student => currentAttendance[student.id] = 'p');
    }

    const roster = window.currentRoster || rosterData;
    tbody.innerHTML = roster.map(student => `
        <tr>
            <td><strong>${student.id}</strong></td>
            <td>${student.name}</td>
            <td style="color: var(--text-secondary)">${student.prev}</td>
            <td>
                <div class="toggle-group">
                    <button class="toggle-btn ${currentAttendance[student.id] === 'p' ? 'active p' : ''}" 
                            onclick="setAttendance('${student.id}', 'p')">P</button>
                    <button class="toggle-btn ${currentAttendance[student.id] === 'a' ? 'active a' : ''}" 
                            onclick="setAttendance('${student.id}', 'a')">A</button>
                </div>
            </td>
        </tr>
    `).join('');
}

function setAttendance(id, status) {
    currentAttendance[id] = status;
    renderRoster();
    updateCounts();
}

function markAll(status) {
    const val = status === 'present' ? 'p' : 'a';
    const roster = window.currentRoster || rosterData;
    roster.forEach(student => currentAttendance[student.id] = val);
    renderRoster();
    updateCounts();
}

function updateCounts() {
    let p = 0, a = 0;
    Object.values(currentAttendance).forEach(val => {
        if(val === 'p') p++;
        else if(val === 'a') a++;
    });
    const cp = document.getElementById('countPresent');
    const ca = document.getElementById('countAbsent');
    if(cp) cp.innerText = p;
    if(ca) ca.innerText = a;
}

function saveAttendance() {
    const btn = document.getElementById('saveAttendanceBtn');
    
    // Determine mode based on active tab
    const isDaily = document.getElementById('tab-daily').classList.contains('active');
    
    let classSel, subSel, periodSel;
    if (isDaily) {
        const user = JSON.parse(localStorage.getItem('nexus_user') || '{}');
        const classes = JSON.parse(localStorage.getItem('admin_classes') || '[]');
        const myClass = classes.find(c => c.inChargeId === user.id);
        classSel = myClass.name;
        subSel = "Daily Attendance";
        periodSel = document.getElementById('dailyTypeSelector').value;
    } else {
        classSel = document.getElementById('classSelector').value;
        subSel = document.getElementById('subjectSelector').selectedOptions[0].text;
        periodSel = document.getElementById('periodSelector').value;
    }
    
    btn.classList.add('loading');
    
    const attendanceRecords = JSON.parse(localStorage.getItem('attendance_records') || '{}');
    const dateStr = new Date().toISOString().split('T')[0];
    
    if (!attendanceRecords[dateStr]) attendanceRecords[dateStr] = {};
    if (!attendanceRecords[dateStr][classSel]) attendanceRecords[dateStr][classSel] = {};
    
    attendanceRecords[dateStr][classSel][periodSel] = {
        subject: subSel,
        data: currentAttendance,
        timestamp: new Date().getTime()
    };

    localStorage.setItem('attendance_records', JSON.stringify(attendanceRecords));
    
    // Mock update for Alex Doe in his persistence log
    updateStudentPersistenceOnSave(currentAttendance, subSel, periodSel);

    setTimeout(() => {
        btn.classList.remove('loading');
        document.getElementById('successModal').classList.add('active');
    }, 1000);
}

function updateStudentPersistenceOnSave(attendance, subject, period) {
    const semesterLog = localStorage.getItem('student_semester_log');
    if (!semesterLog) return; // Wait for student view to initialize or do nothing
    
    const semesterData = JSON.parse(semesterLog);
    const dateStr = new Date().toISOString().split('T')[0];
    const periodIndex = parseInt(period) - 1;

    let dayRecord = semesterData.log.find(r => r.date === dateStr);
    if (!dayRecord) {
        dayRecord = { date: dateStr, hours: Array(5).fill({ sub: null, state: 'not-entered' }) };
        semesterData.log.unshift(dayRecord);
    }

    // For simplicity, we update student Alex Doe (20CS01) if present in the attendance list
    if (attendance['20CS01']) {
        const state = attendance['20CS01'] === 'p' ? 'present' : 'absent';
        dayRecord.hours[periodIndex] = { sub: subject, state: state };
        
        // Recalculate stats
        let p = 0, a = 0;
        semesterData.log.forEach(r => {
            r.hours.forEach(h => {
                if(h.state === 'present') p++;
                if(h.state === 'absent') a++;
            });
        });
        semesterData.stats = { p, a };
        localStorage.setItem('student_semester_log', JSON.stringify(semesterData));
    }
}

function closeModal() {
    document.getElementById('successModal').classList.remove('active');
    // Reset view
    document.getElementById('rosterSection').style.display = 'none';
    currentAttendance = {};
    document.getElementById('classSelector').value = '';
    document.getElementById('subjectSelector').value = '';
    const periodSel = document.getElementById('periodSelector');
    if(periodSel) periodSel.value = '';
}


// --- Dynamic Subject Management & Schedule Logic ---

const DEFAULT_SUBJECTS = [
    "Database Management Systems",
    "Computer Networks",
    "Operating Systems",
    "Artificial Intelligence",
    "Software Engineering",
    "Cloud Computing"
];

function getSubjects() {
    const adminSubjects = JSON.parse(localStorage.getItem('admin_subjects') || '[]');
    const user = JSON.parse(localStorage.getItem('nexus_user') || '{}');
    
    if (user.role === 'faculty') {
        // Faculty only sees subjects assigned to them
        const assigned = adminSubjects.filter(s => s.facultyId === user.id).map(s => s.name);
        return assigned.length > 0 ? assigned : ["No Assigned Subjects"];
    }
    
    // Students see subjects according to their department
    const deptSubjects = adminSubjects.filter(s => s.dept === user.dept).map(s => s.name);
    return deptSubjects.length > 0 ? deptSubjects : DEFAULT_SUBJECTS;
}

// Render dynamic inputs in teacher settings
function renderSubjectInputs() {
    const container = document.getElementById('subjectInputsContainer');
    if(!container) return; // Only run on settings page

    const currentSubjects = getSubjects();
    container.innerHTML = currentSubjects.map((sub, index) => `
        <div class="form-group" style="margin-bottom: 12px;">
            <label style="font-size: 0.8rem;">Subject ${index + 1}</label>
            <input type="text" id="subjectInput_${index}" value="${sub}" placeholder="Enter subject name">
        </div>
    `).join('');
}

// Save dynamic subjects - Removed as subjects are now managed by Admin only
function saveSubjects() {
    console.log("Subject management moved to Admin Panel.");
    alert("Please contact administrator to manage subjects.");
}

// Populate the subject dropdown in teacher dashboard
function populateSubjectDropdown() {
    const dropdown = document.getElementById('subjectSelector');
    if(!dropdown) return; 

    const subjects = getSubjects();
    dropdown.innerHTML = `<option value="" disabled selected>Choose a subject</option>` +
        subjects.map((sub, index) => `<option value="sub_${index}">${sub}</option>`).join('');

    // Also populate Class Selector for Subject-wise
    const classDropdown = document.getElementById('classSelector');
    if (classDropdown) {
        const classes = JSON.parse(localStorage.getItem('admin_classes') || '[]');
        classDropdown.innerHTML = `<option value="" disabled selected>Choose a class</option>` + 
            classes.map(c => `<option value="${c.name}">${c.name} (${c.dept})</option>`).join('');
    }
}

// Validate date/time constraints (run on teacher dashboard)
function validateScheduleConstraints() {
    const btn = document.getElementById('loadRosterBtn');
    if(!btn) return;

    // Run a check every second to disable the button on weekends
    setInterval(() => {
        const now = new Date();
        const day = now.getDay(); // 0 is Sunday, 6 is Saturday
        
        // 5 working days check (disable on weekends)
        const dateEl = document.getElementById('currentDate');
        if(day === 0 || day === 6) {
            btn.disabled = true;
            btn.style.opacity = '0.5';
            btn.title = "Attendance marking is disabled on weekends.";
            if (dateEl && !dateEl.innerText.includes("(Weekend - Locked)")) {
                dateEl.innerText += " (Weekend - Locked)";
            }
            return;
        }

        btn.disabled = false;
        btn.style.opacity = '1';
        btn.title = "";
        if (dateEl) {
            dateEl.innerText = dateEl.innerText.replace(" (Weekend - Locked)", "");
        }
    }, 1000);
}

function updateHeaderInfo() {
    const user = JSON.parse(localStorage.getItem('nexus_user') || '{}');
    const path = window.location.pathname;
    const isPublicPage = path.endsWith('index.html') || path === '/' || path === '';

    if (!user.id && !isPublicPage) {
        window.location.href = 'index.html';
        return;
    }

    // Update Footer Year
    const yearEl = document.getElementById('currentYear');
    if (yearEl) yearEl.innerText = new Date().getFullYear();

    const nameEl = document.getElementById('userName');
    const idEl = document.getElementById('userReg') || document.getElementById('userDept');
    const avatarEl = document.getElementById('userAvatar');

    if (nameEl && user.name) nameEl.innerText = user.name;
    if (idEl) idEl.innerText = user.id || user.dept || '';
    if (avatarEl && user.name) {
        avatarEl.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=ff6b00&color=fff`;
    }

    // Show Daily Attendance tab if user is In-Charge
    const dailyTab = document.getElementById('tab-daily');
    if (dailyTab && user.inCharge) {
        dailyTab.style.display = 'block';
    }
}

// Initialize dynamic features on load
document.addEventListener('DOMContentLoaded', () => {
    updateHeaderInfo();
    
    // Session validation: If user is logged in, sync with master admin_users list
    const sessionUser = JSON.parse(localStorage.getItem('nexus_user') || '{}');
    if (sessionUser.id && sessionUser.id !== 'admin') {
        const adminUsers = JSON.parse(localStorage.getItem('admin_users') || '[]');
        const updatedUser = adminUsers.find(u => u.id === sessionUser.id);
        
        if (!updatedUser) {
            alert('Your account has been removed. Please login again.');
            localStorage.removeItem('nexus_user');
            window.location.href = 'index.html';
            return;
        }

        // Sync session data with master list (name, dept, role, etc. might have changed)
        const syncedUser = {
            id: updatedUser.id,
            name: updatedUser.name,
            role: updatedUser.role.toLowerCase(),
            dept: updatedUser.dept,
            inCharge: updatedUser.inCharge || false
        };
        
        // Only update if something actually changed to avoid unnecessary storage writes
        if (JSON.stringify(syncedUser) !== JSON.stringify(sessionUser)) {
            localStorage.setItem('nexus_user', JSON.stringify(syncedUser));
            console.log("System: Session data synchronized with admin updates.");
            updateHeaderInfo(); // Refresh UI with new data
        }
    }

    populateSubjectDropdown();
    validateScheduleConstraints();

    // Prototype Interaction: Bind unprogrammed buttons to show a professional toast notification or trigger export
    document.querySelectorAll('button:not([onclick]):not([type="submit"]):not([id="loginBtn"])').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const btnText = btn.innerText.toLowerCase();
            
            if (btnText.includes('pdf') || btnText.includes('export') || btnText.includes('download')) {
                showToast('Preparing Document Framework...', 'ri-loader-4-line');
                setTimeout(() => {
                    window.print();
                    showToast('PDF Document Exported.', 'ri-file-pdf-line');
                }, 800);
            } else {
                showToast('Action recorded successfully in preview mode.', 'ri-checkbox-circle-line');
            }
        });
    });
});

// Global Toast Notification System
window.showToast = function(message, icon = 'ri-information-line') {
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }
    
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="${icon}"></i> <span>${message}</span>`;
    
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('fade-out');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
};

function renderStudentDailyLog() {
    const tbody = document.getElementById('studentDailyAttendanceTable');
    if(!tbody) return;

    const getBadge = (state) => {
        let badgeClass = 'badge-not-entered';
        let text = 'NOT MARKED YET';
        if (state === 'present') { badgeClass = 'badge-present'; text = 'PRESENT'; }
        else if (state === 'absent') { badgeClass = 'badge-absent'; text = 'ABSENT'; }
        else if (state === 'suspended') { badgeClass = 'badge-suspended'; text = 'HALF DAY'; }
        return `<span class="grid-badge ${badgeClass}">${text}</span>`;
    };

    const getPersistentDailyData = () => {
        const stored = localStorage.getItem('student_daily_log');
        if (stored) return JSON.parse(stored);

        const data = [];
        let currentDate = new Date('2025-08-01T00:00:00');
        const endDate = new Date('2026-01-31T00:00:00');
        
        while (currentDate <= endDate) {
            const dayOfWeek = currentDate.getDay();
            if (dayOfWeek !== 0 && dayOfWeek !== 6) {
                const dateStr = currentDate.toISOString().split('T')[0];
                
                const randM = Math.random();
                const randA = Math.random();
                let mState = randM > 0.15 ? 'present' : 'absent';
                let aState = randA > 0.15 ? 'present' : 'absent';
                
                if (Math.random() > 0.95) {
                    mState = 'not-entered';
                    aState = 'not-entered';
                }

                let overall = 'PRESENT';
                let oClass = 'badge-present';
                if (mState === 'absent' && aState === 'absent') { overall = 'ABSENT'; oClass = 'badge-absent'; }
                else if (mState === 'absent' || aState === 'absent') { overall = 'HALF DAY'; oClass = 'badge-suspended'; }
                if (mState === 'not-entered' || aState === 'not-entered') { overall = 'NOT MARKED'; oClass = 'badge-not-entered'; }

                data.push({ date: dateStr, mState, aState, overall, oClass });
            }
            currentDate.setDate(currentDate.getDate() + 1);
        }
        data.sort((a,b) => new Date(b.date) - new Date(a.date));
        localStorage.setItem('student_daily_log', JSON.stringify(data));
        return data;
    };

    const dailyData = getPersistentDailyData();
    
    // Check if today needs to be added (if missing)
    const todayStr = new Date().toISOString().split('T')[0];
    if (dailyData.length > 0 && todayStr > dailyData[0].date) {
        const existing = dailyData.find(r => r.date === todayStr);
        if (!existing) {
            dailyData.unshift({ 
                date: todayStr, 
                mState: 'not-entered', 
                aState: 'not-entered', 
                overall: 'NOT MARKED', 
                oClass: 'badge-not-entered' 
            });
            localStorage.setItem('student_daily_log', JSON.stringify(dailyData));
        }
    }
    
    tbody.innerHTML = dailyData.map(record => `
        <tr>
            <td>${record.date}</td>
            <td>${getBadge(record.mState)}</td>
            <td>${getBadge(record.aState)}</td>
            <td><span class="grid-badge ${record.oClass}">${record.overall}</span></td>
        </tr>
    `).join('');
}
