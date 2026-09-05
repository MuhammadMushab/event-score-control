// Published Google Sheets data sources.
const LEADERBOARD_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQK8871Xrx1jWMWF2414BCL7q4f0rot7yOQLWduaAEx2FievybC3_pehrlJRvwCeOjF2EKBaQjrKl5g/pubhtml?gid=0&single=true';
const EVENTS_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQK8871Xrx1jWMWF2414BCL7q4f0rot7yOQLWduaAEx2FievybC3_pehrlJRvwCeOjF2EKBaQjrKl5g/pubhtml?gid=571751519&single=true';
const UPDATES_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQK8871Xrx1jWMWF2414BCL7q4f0rot7yOQLWduaAEx2FievybC3_pehrlJRvwCeOjF2EKBaQjrKl5g/pubhtml?gid=774956356&single=true';

// Hardcoded event links: event name → URL or { url, displayText }
const EVENT_LINKS = {
    'ares-1: mission recovery': 'ares1.horizon.local',
    'the bug bang': 'bugbang.horizon.local',
    'bug-bang': 'bugbang.horizon.local',
    'SOC Destroyer Station': {
        url: 'https://soc-destroyer-dashboard1.onrender.com/',
        displayText: 'soc-destroyer.horizon.local'
    },
    'Mission: NAS Hijack': 'missionhijack.horizon.local',
    'astro doxx': 'doxx.horizon.local',
    'gn-11 enigma': 'Enigma.horizon.local',
    'bankrupt': 'bank.horizon.local',
    'dots of destiny': 'cosmicsignals.horizon.local',
    'silent circuits': 'cosmicsignals.horizon.local',
    'into the void': 'void.horizon.local'
};

const CLEAN_ROUTES = {
    '/index.html': '/',
    '/leaderboard.html': '/leaderboard',
    '/events.html': '/events',
    '/updates.html': '/updates',
    '/admin.html': '/mission-control'
};

function cleanRoutePath(pathname) {
    if (pathname === '/' || pathname === '') return 'index.html';
    if (pathname.endsWith('/')) pathname = pathname.slice(0, -1);
    const route = pathname.split('/').pop();
    return `${route}.html`;
}

function redirectLegacyHtmlUrl() {
    const cleanPath = CLEAN_ROUTES[window.location.pathname];
    if (cleanPath && window.location.protocol.startsWith('http')) {
        window.location.replace(cleanPath + window.location.search + window.location.hash);
    }
}

redirectLegacyHtmlUrl();

function getAdminConfig() {
    return window.CYBER_ADMIN_CONFIG || {};
}

function getAdminSession() {
    try {
        return JSON.parse(sessionStorage.getItem('cyberAdminSession') || 'null');
    } catch {
        return null;
    }
}

function isAdminSessionValid() {
    const session = getAdminSession();
    return Boolean(session?.authenticated && session.expiresAt && Date.now() < session.expiresAt);
}

function clearAdminSession() {
    sessionStorage.removeItem('cyberAdminSession');
    localStorage.removeItem('isAdmin');
}

function sha256Hex(ascii) {
    const K = [
        0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
        0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
        0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
        0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
        0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
        0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
        0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
        0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
    ];

    function rotr(n, b) {
        return (n >>> b) | (n << (32 - b));
    }

    let H = [
        0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
        0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19
    ];

    const utf8 = unescape(encodeURIComponent(ascii || ''));
    const bytes = [];
    for (let i = 0; i < utf8.length; i++) {
        bytes.push(utf8.charCodeAt(i));
    }

    const bitLength = bytes.length * 8;
    bytes.push(0x80);
    while ((bytes.length % 64) !== 56) {
        bytes.push(0);
    }

    const highBits = Math.floor(bitLength / 0x100000000);
    const lowBits = bitLength >>> 0;
    bytes.push((highBits >>> 24) & 0xff, (highBits >>> 16) & 0xff, (highBits >>> 8) & 0xff, highBits & 0xff);
    bytes.push((lowBits >>> 24) & 0xff, (lowBits >>> 16) & 0xff, (lowBits >>> 8) & 0xff, lowBits & 0xff);

    const W = new Array(64);
    for (let i = 0; i < bytes.length; i += 64) {
        for (let t = 0; t < 16; t++) {
            W[t] = (bytes[i + t * 4] << 24) | (bytes[i + t * 4 + 1] << 16) | (bytes[i + t * 4 + 2] << 8) | bytes[i + t * 4 + 3];
        }
        for (let t = 16; t < 64; t++) {
            const s0 = rotr(W[t - 15], 7) ^ rotr(W[t - 15], 18) ^ (W[t - 15] >>> 3);
            const s1 = rotr(W[t - 2], 17) ^ rotr(W[t - 2], 19) ^ (W[t - 2] >>> 10);
            W[t] = (W[t - 16] + s0 + W[t - 7] + s1) | 0;
        }

        let [a, b, c, d, e, f, g, h] = H;

        for (let t = 0; t < 64; t++) {
            const S1 = rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25);
            const ch = (e & f) ^ ((~e) & g);
            const temp1 = (h + S1 + ch + K[t] + W[t]) | 0;
            const S0 = rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22);
            const maj = (a & b) ^ (a & c) ^ (b & c);
            const temp2 = (S0 + maj) | 0;

            h = g;
            g = f;
            f = e;
            e = (d + temp1) | 0;
            d = c;
            c = b;
            b = a;
            a = (temp1 + temp2) | 0;
        }

        H[0] = (H[0] + a) | 0;
        H[1] = (H[1] + b) | 0;
        H[2] = (H[2] + c) | 0;
        H[3] = (H[3] + d) | 0;
        H[4] = (H[4] + e) | 0;
        H[5] = (H[5] + f) | 0;
        H[6] = (H[6] + g) | 0;
        H[7] = (H[7] + h) | 0;
    }

    return H.map(x => (x >>> 0).toString(16).padStart(8, '0')).join('');
}

// Cross-tab real-time synchronization
let settingsChannel;
try {
    settingsChannel = new BroadcastChannel('cyber_olympics_settings_channel');
    settingsChannel.onmessage = (event) => {
        if (event.data) {
            localStorage.setItem('cyberOlympicsSettings', JSON.stringify(event.data));
            checkSettings();
        }
    };
} catch (e) {}

window.addEventListener('storage', (e) => {
    if (e.key === 'cyberOlympicsSettings') {
        checkSettings();
    }
});

// Mobile Navigation Toggle & Page Initialization
document.addEventListener('DOMContentLoaded', async () => {
    // Admin Access Control: Redirect if on mission-control page and not logged in
    const isAdminPage = window.location.pathname === '/mission-control' || window.location.pathname.endsWith('/mission-control/');
    const isAdmin = isAdminSessionValid();

    if (isAdminPage && !isAdmin) {
        const loginScreen = document.getElementById('loginScreen');
        if (!loginScreen) {
            window.location.href = '/';
            return;
        }
    }

    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // Check system settings first
    const settings = await checkSettings();

    // Only load content if the section is enabled
    const page = cleanRoutePath(window.location.pathname);

    if (document.getElementById('leaderboardBody')) {
        if (settings.leaderboardEnabled) {
            loadLeaderboard();
            window._leaderboardInterval = setInterval(loadLeaderboard, 5000);
        }
    }

    if (document.getElementById('eventsGrid')) {
        if (settings.eventsEnabled) {
            loadEvents();
            window._eventsInterval = setInterval(loadEvents, 5000);
        }
    }

    if (document.getElementById('updatesContainer')) {
        if (settings.updatesEnabled) {
            loadUpdates();
            window._updatesInterval = setInterval(loadUpdates, 5000);
        }
    }

    // Check for loginScreen or adminContent to init admin logic
    if (document.getElementById('loginScreen') || document.getElementById('adminContent')) {
        initAdminPanel();
    }
});

// Global System Settings Management
const DEFAULT_SETTINGS = {
    leaderboardEnabled: true,
    eventsEnabled: true,
    updatesEnabled: true,
    announcement: ''
};

async function fetchGlobalSettings() {
    try {
        const res = await fetch('/api/settings', { cache: 'no-store' });
        if (res.ok) {
            const data = await res.json();
            localStorage.setItem('cyberOlympicsSettings', JSON.stringify(data));
            return { ...DEFAULT_SETTINGS, ...data };
        }
    } catch (e) {
        // API not available, proceed to local/cached storage
    }

    try {
        const cached = JSON.parse(localStorage.getItem('cyberOlympicsSettings'));
        if (cached && typeof cached === 'object') {
            return { ...DEFAULT_SETTINGS, ...cached };
        }
    } catch {}

    return DEFAULT_SETTINGS;
}

// Check and apply system settings globally across all pages
async function checkSettings() {
    const settings = await fetchGlobalSettings();
    const page = cleanRoutePath(window.location.pathname);

    // Hide or show nav links based on global settings
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === '/leaderboard') link.style.display = settings.leaderboardEnabled ? '' : 'none';
        if (href === '/events') link.style.display = settings.eventsEnabled ? '' : 'none';
        if (href === '/updates') link.style.display = settings.updatesEnabled ? '' : 'none';
    });

    if ((page === 'leaderboard.html' || page === 'leaderboard') && !settings.leaderboardEnabled) {
        showDisabledMessage('Leaderboard is currently disabled.');
        if (window._leaderboardInterval) clearInterval(window._leaderboardInterval);
    }
    if ((page === 'events.html' || page === 'events') && !settings.eventsEnabled) {
        showDisabledMessage('Events are currently disabled.');
        if (window._eventTimers) window._eventTimers.forEach(clearInterval);
    }
    if ((page === 'updates.html' || page === 'updates') && !settings.updatesEnabled) {
        showDisabledMessage('Updates are currently disabled.');
        if (window._updatesInterval) clearInterval(window._updatesInterval);
    }

    // Handle global announcement
    if (page !== 'mission-control.html' && page !== 'mission-control') {
        if (settings.announcement && settings.announcement.trim() !== '') {
            displayAnnouncement(settings.announcement.trim());
        } else {
            removeAnnouncement();
        }
    }

    return settings;
}

// Poll global settings every 3 seconds for real-time updates across all users
setInterval(checkSettings, 3000);

function showDisabledMessage(message) {
    const existing = document.getElementById('disabledMessageContainer');
    if (existing) return; // Already showing message

    const main = document.querySelector('main') || document.querySelector('.container') || document.body;

    if (main) {
        main.innerHTML = `
            <div id="disabledMessageContainer" class="glass-card fade-in" style="text-align: center; margin: 10vh auto; max-width: 500px; padding: 2.5rem 1.5rem;">
                <h2 style="color: #fff; margin-bottom: 1rem;">System Notice</h2>
                <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">${message}</p>
                <a href="/" class="btn btn-outline" style="display: inline-block; font-size: 0.85rem;">Return Home</a>
            </div>
        `;
    }
}

function displayAnnouncement(msg) {
    let announcementBar = document.getElementById('globalAnnouncementBar');
    if (!announcementBar) {
        announcementBar = document.createElement('div');
        announcementBar.id = 'globalAnnouncementBar';
        announcementBar.style.background = 'linear-gradient(90deg, var(--accent-blue), var(--accent-purple))';
        announcementBar.style.color = '#fff';
        announcementBar.style.textAlign = 'center';
        announcementBar.style.padding = '0.5rem';
        announcementBar.style.fontWeight = '600';
        announcementBar.style.position = 'sticky';
        announcementBar.style.top = '0';
        announcementBar.style.zIndex = '101';
        document.body.insertBefore(announcementBar, document.body.firstChild);
    }
    announcementBar.textContent = `Announcement: ${msg}`;
    announcementBar.style.display = 'block';
}

function removeAnnouncement() {
    const announcementBar = document.getElementById('globalAnnouncementBar');
    if (announcementBar) {
        announcementBar.style.display = 'none';
    }
}

function toCsvUrl(url) {
    const parsedUrl = new URL(url);
    parsedUrl.pathname = parsedUrl.pathname.replace('/pubhtml', '/pub');
    parsedUrl.searchParams.set('output', 'csv');
    parsedUrl.searchParams.set('_ts', String(Date.now()));
    return parsedUrl.toString();
}

function parseCSV(text) {
    const rows = [];
    let row = [];
    let cell = '';
    let inQuotes = false;

    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        const next = text[i + 1];

        if (char === '"' && inQuotes && next === '"') {
            cell += '"';
            i++;
        } else if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            row.push(cell.trim());
            cell = '';
        } else if ((char === '\n' || char === '\r') && !inQuotes) {
            if (char === '\r' && next === '\n') i++;
            row.push(cell.trim());
            if (row.some(value => value !== '')) rows.push(row);
            row = [];
            cell = '';
        } else {
            cell += char;
        }
    }

    row.push(cell.trim());
    if (row.some(value => value !== '')) rows.push(row);
    return rows;
}

async function fetchSheetRows(url) {
    const response = await fetch(toCsvUrl(url), {
        cache: 'no-store',
        headers: {
            'Pragma': 'no-cache',
            'Cache-Control': 'no-cache, no-store, max-age=0'
        }
    });
    if (!response.ok) {
        throw new Error(`Google Sheets request failed: ${response.status}`);
    }

    const text = await response.text();
    return parseCSV(text);
}

async function fetchLeaderboardSheet() {
    const rows = await fetchSheetRows(LEADERBOARD_URL);
    const bodyRows = rows.slice(1);
    const data = bodyRows
        .map((cells, index) => {
            const team = cells?.[0] || '-';
            const score = cells?.[cells.length - 1] || 0;

            return {
                rank: index + 1,
                team,
                score: Number(String(score).replace(/,/g, '')) || 0
            };
        })
        .filter(item => item.team !== '-' && item.score !== 0);

    data.sort((a, b) => b.score - a.score);
    data.forEach((item, i) => {
        item.rank = i + 1;
    });

    console.log('Final leaderboard:', data);
    return data;
}

async function fetchEventsSheet() {
    const rows = await fetchSheetRows(EVENTS_URL);
    return rows.slice(1)
        .map(cells => {
            const startDate = (cells?.[2] || '').trim();
            const startTime = (cells?.[3] || '').trim();
            const endDate = (cells?.[4] || '').trim();
            const endTime = (cells?.[5] || '').trim();
            const start = startDate && startTime ? `${startDate} ${startTime}` : (startDate || startTime || '-');
            const end = endDate && endTime ? `${endDate} ${endTime}` : (endDate || endTime || '-');

            return {
                name: cells?.[0] || 'Unknown Event',
                sector: cells?.[1] || 'General',
                start,
                end,
                status: cells?.[6] || 'Upcoming'
            };
        })
        .filter(event => event.name !== 'Unknown Event');
}

// Load Leaderboard
async function loadLeaderboard() {
    const tableBody = document.getElementById('leaderboardBody');
    const headRow = document.getElementById('leaderboardHeadRow');
    if (!tableBody) return;

    try {
        const data = await fetchLeaderboardSheet();

        if (headRow) {
            headRow.innerHTML = `
                <th class="rank">Rank</th>
                <th>Team Name</th>
                <th class="score">Score</th>
            `;
        }

        tableBody.innerHTML = '';

        if (!data.length) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="3" class="empty-state">No data available</td>
                </tr>
            `;
            return;
        }

        data.forEach((row, index) => {
            const rankClass = index < 3 ? `top-3 rank-${index + 1}` : '';
            const tr = document.createElement('tr');
            tr.className = `lb-row ${rankClass} fade-in`;
            tr.style.animationDelay = `${index * 0.08}s`;

            const rankCell = document.createElement('td');
            rankCell.className = `rank ${rankClass}`;
            rankCell.textContent = row.rank;

            const teamCell = document.createElement('td');
            teamCell.className = `team ${rankClass}`;
            teamCell.textContent = row.team;

            const scoreCell = document.createElement('td');
            scoreCell.className = `score ${rankClass}`;
            scoreCell.textContent = row.score;

            tr.appendChild(rankCell);
            tr.appendChild(teamCell);
            tr.appendChild(scoreCell);

            tableBody.appendChild(tr);
        });
    } catch (error) {
        console.error("Error loading leaderboard:", error);
        tableBody.innerHTML = `
            <tr>
                <td colspan="3" class="empty-state">No data available</td>
            </tr>
        `;
    }
}

// Parse event date and time string into a local Date object.
// Handles "DD/MM/YYYY HH:MM am/pm", "DD/MM/YYYY, HH:MM am/pm", "HH:MM", "YYYY-MM-DD HH:MM", etc.
function parseEventDateTime(value) {
    const text = (value || '').trim();
    if (!text || text === '-' || text === '--:--') return null;

    const cleanText = text.replace(/,/g, ' ').replace(/\s+/g, ' ');
    let year, month, day, hour = 0, minute = 0;

    const ddmmyyyyMatch = cleanText.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})(?:\s+(\d{1,2}):(\d{2})(?::\d{2})?\s*(am|pm)?)?$/i);
    const yyyymmddMatch = cleanText.match(/^(\d{4})[/-](\d{1,2})[/-](\d{1,2})(?:\s+(\d{1,2}):(\d{2})(?::\d{2})?\s*(am|pm)?)?$/i);
    const timeOnlyMatch = cleanText.match(/^(\d{1,2}):(\d{2})(?::\d{2})?\s*(am|pm)?$/i);

    if (ddmmyyyyMatch) {
        day = Number(ddmmyyyyMatch[1]);
        month = Number(ddmmyyyyMatch[2]);
        year = Number(ddmmyyyyMatch[3]);
        if (ddmmyyyyMatch[4]) {
            hour = Number(ddmmyyyyMatch[4]);
            minute = Number(ddmmyyyyMatch[5]);
            const meridiem = (ddmmyyyyMatch[6] || '').toLowerCase();
            if (meridiem === 'pm' && hour < 12) hour += 12;
            if (meridiem === 'am' && hour === 12) hour = 0;
        }
    } else if (yyyymmddMatch) {
        year = Number(yyyymmddMatch[1]);
        month = Number(yyyymmddMatch[2]);
        day = Number(yyyymmddMatch[3]);
        if (yyyymmddMatch[4]) {
            hour = Number(yyyymmddMatch[4]);
            minute = Number(yyyymmddMatch[5]);
            const meridiem = (yyyymmddMatch[6] || '').toLowerCase();
            if (meridiem === 'pm' && hour < 12) hour += 12;
            if (meridiem === 'am' && hour === 12) hour = 0;
        }
    } else if (timeOnlyMatch) {
        hour = Number(timeOnlyMatch[1]);
        minute = Number(timeOnlyMatch[2]);
        const meridiem = (timeOnlyMatch[3] || '').toLowerCase();
        if (meridiem === 'pm' && hour < 12) hour += 12;
        if (meridiem === 'am' && hour === 12) hour = 0;

        const base = new Date();
        year = base.getFullYear();
        month = base.getMonth() + 1;
        day = base.getDate();
    } else {
        return null;
    }

    return new Date(year, month - 1, day, hour, minute, 0, 0);
}

// Format seconds into HH:MM:SS
function formatHMS(totalSeconds) {
    if (totalSeconds <= 0) return '00:00:00';
    const h = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
    const m = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
    const s = String(totalSeconds % 60).padStart(2, '0');
    return `${h}:${m}:${s}`;
}

// Load Events - all cards go to a single grid
async function loadEvents() {
    const eventsGrid = document.getElementById('eventsGrid');
    if (!eventsGrid) return;

    try {
        const data = await fetchEventsSheet();

        eventsGrid.innerHTML = '';
        if (window._eventTimers) window._eventTimers.forEach(clearInterval);
        window._eventTimers = [];

        data.forEach((event, index) => {
            const rawStatus = (event.status || '').trim();
            const initialStatus = rawStatus || 'Upcoming';
            const statusClass = initialStatus.toLowerCase().replace(/\s+/g, '-');
            const timerId = `event-timer-${index}`;

            const col = document.createElement('div');
            col.className = 'event-card fade-in';
            col.style.animationDelay = `${index * 0.05}s`;

            col.innerHTML = `
                <div class="event-card-header">
                    <span class="event-name">${event.name}</span>
                    <span class="status ${statusClass}">${initialStatus}</span>
                </div>
                <div class="event-card-times">
                    <span class="event-time-label">Start</span>
                    <span class="event-time-value">${event.start || '--:--'}</span>
                    <span class="event-time-label">End</span>
                    <span class="event-time-value">${event.end || '--:--'}</span>
                </div>
                <div class="event-card-footer">
                    <span class="sector-badge">${event.sector || 'General'}</span>
                    <span class="event-card-countdown" id="${timerId}">--:--:--</span>
                </div>
            `;
            eventsGrid.appendChild(col);

            // Add clickable link structure if event name matches EVENT_LINKS
            const normalizedEventName = (event.name || '').trim().toLowerCase();
            const eventLinkEntry = EVENT_LINKS[normalizedEventName] || EVENT_LINKS[event.name];
            let linkBadge = null;
            let targetUrl = null;

            if (eventLinkEntry) {
                targetUrl = typeof eventLinkEntry === 'object' ? eventLinkEntry.url : eventLinkEntry;
                const displayText = typeof eventLinkEntry === 'object' ? eventLinkEntry.displayText : eventLinkEntry;

                linkBadge = document.createElement('span');
                linkBadge.className = 'event-link-badge';
                linkBadge.title = displayText;
                linkBadge.textContent = displayText;
                linkBadge.style.display = 'none'; // Hidden by default, only shown when RUNNING

                const footer = col.querySelector('.event-card-footer');
                if (footer) {
                    col.insertBefore(linkBadge, footer);
                }

                col.addEventListener('click', () => {
                    // Only navigate if event is currently RUNNING
                    if (col.classList.contains('event-card--linked') && targetUrl) {
                        const url = targetUrl.startsWith('http') ? targetUrl : `http://${targetUrl}`;
                        window.open(url, '_blank', 'noopener,noreferrer');
                    }
                });
            }

            // Timer logic using user device time
            let startDate = parseEventDateTime(event.start);
            let endDate = parseEventDateTime(event.end);
            if (startDate && endDate && endDate <= startDate) {
                endDate = new Date(endDate.getTime() + 24 * 60 * 60 * 1000);
            }
            const fallbackStatus = rawStatus.toLowerCase();

            function tick() {
                const el = document.getElementById(timerId);
                if (!el) return;
                const statusEl = col.querySelector('.status');
                const now = new Date();
                let displayStatus = 'UPCOMING';
                let countdownText = '-';
                let countdownClass = 'timer-muted';

                if (!startDate || !endDate) {
                    if (fallbackStatus === 'ended') {
                        displayStatus = 'ENDED';
                        countdownText = 'Ended';
                        countdownClass = 'timer-ended';
                    } else if (fallbackStatus === 'running') {
                        displayStatus = 'RUNNING';
                        countdownClass = 'timer-running';
                    }
                } else if (now >= endDate) {
                    displayStatus = 'ENDED';
                    countdownText = 'Ended';
                    countdownClass = 'timer-ended';
                } else if (now >= startDate) {
                    const diff = Math.max(0, Math.floor((endDate - now) / 1000));
                    displayStatus = 'RUNNING';
                    countdownText = diff > 0 ? `Ends in ${formatHMS(diff)}` : 'Ending...';
                    countdownClass = 'timer-running';
                } else {
                    const diff = Math.max(0, Math.floor((startDate - now) / 1000));
                    countdownText = diff > 0 ? `Starts in ${formatHMS(diff)}` : 'Starting...';
                    countdownClass = 'timer-upcoming';
                }

                if (statusEl) {
                    statusEl.textContent = displayStatus;
                    statusEl.className = `status ${displayStatus.toLowerCase()}`;
                }
                el.textContent = countdownText;
                el.className = `event-card-countdown ${countdownClass}`;

                // Only show link badge and enable card click when status is RUNNING
                if (eventLinkEntry) {
                    if (displayStatus === 'RUNNING') {
                        col.classList.add('event-card--linked');
                        col.style.cursor = 'pointer';
                        if (linkBadge) linkBadge.style.display = 'flex';
                    } else {
                        col.classList.remove('event-card--linked');
                        col.style.cursor = 'default';
                        if (linkBadge) linkBadge.style.display = 'none';
                    }
                }
            }

            tick();
            const interval = setInterval(tick, 1000);
            window._eventTimers.push(interval);
        });
    } catch (error) {
        console.error("Error loading events:", error);
    }
}


// Load Updates
async function loadUpdates() {
    try {
        const rows = await fetchSheetRows(UPDATES_URL);
        const container = document.getElementById("updatesContainer");
        if (!container) return;

        container.innerHTML = "";

        const dataRows = rows.slice(1);

        if (!dataRows || dataRows.length === 0) {
            container.innerHTML = "<p>No updates available</p>";
            return;
        }

        dataRows.forEach((row, index) => {
            const time = row?.[0] || "";
            const message = row?.[1] || "";

            if (!time || !message) return;

            const card = document.createElement('div');
            card.className = 'update-card fade-in';
            card.style.animationDelay = `${index * 0.1}s`;

            card.innerHTML = `
                <div class="update-title">${message}</div>
                <div class="update-time">${time}</div>
            `;

            container.appendChild(card);
        });
    } catch (err) {
        console.error("Updates error:", err);
    }
}

// Init Admin Panel
function initAdminPanel() {
    const loginScreen = document.getElementById('loginScreen');
    const adminContent = document.getElementById('adminContent');
    const loginBtn = document.getElementById('loginBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const passwordInput = document.getElementById('adminPassword');
    const loginError = document.getElementById('loginError');

    const checkAuth = () => {
        const isAdmin = isAdminSessionValid();
        if (isAdmin) {
            if (loginScreen) loginScreen.style.display = 'none';
            if (adminContent) adminContent.style.display = 'block';
        } else {
            if (loginScreen) loginScreen.style.display = 'block';
            if (adminContent) adminContent.style.display = 'none';
        }
    };

    if (loginBtn && passwordInput) {
        const config = getAdminConfig();
        const usernameInput = document.getElementById('adminUsername');
        if (usernameInput && !usernameInput.value) {
            usernameInput.value = config.username || 'CyberOlympics2026';
        }

        const handleLogin = () => {
            const currentConfig = getAdminConfig();
            const inputUser = usernameInput ? usernameInput.value.trim() : '';
            const expectedUser = currentConfig.username || 'CyberOlympics2026';
            const userMatches = !inputUser || inputUser.toLowerCase() === expectedUser.toLowerCase();
            const passwordValue = passwordInput ? passwordInput.value : '';
            const passwordHash = sha256Hex(passwordValue);
            const passwordMatches = passwordHash === currentConfig.passwordHash;

            if (userMatches && passwordMatches) {
                const ttl = (currentConfig.sessionMinutes || 30) * 60 * 1000;
                sessionStorage.setItem('cyberAdminSession', JSON.stringify({
                    authenticated: true,
                    expiresAt: Date.now() + ttl
                }));
                if (loginError) loginError.style.display = 'none';
                passwordInput.value = '';
                checkAuth();
            } else {
                if (loginError) {
                    loginError.textContent = 'Incorrect username or password.';
                    loginError.style.display = 'block';
                }
            }
        };

        loginBtn.addEventListener('click', handleLogin);

        // Add Enter key support to both password and username inputs
        passwordInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') handleLogin();
        });

        if (usernameInput) {
            usernameInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') handleLogin();
            });
        }
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            clearAdminSession();
            checkAuth();
            window.location.href = '/';
        });
    }

    checkAuth();

    fetchGlobalSettings().then(settings => {
        const toggleLeaderboard = document.getElementById('toggleLeaderboard');
        const toggleEvents = document.getElementById('toggleEvents');
        const toggleUpdates = document.getElementById('toggleUpdates');
        const announcementInput = document.getElementById('announcementInput');

        if (toggleLeaderboard) toggleLeaderboard.checked = settings.leaderboardEnabled;
        if (toggleEvents) toggleEvents.checked = settings.eventsEnabled;
        if (toggleUpdates) toggleUpdates.checked = settings.updatesEnabled;
        if (announcementInput) announcementInput.value = settings.announcement || '';
    });

    const toggleLeaderboard = document.getElementById('toggleLeaderboard');
    const toggleEvents = document.getElementById('toggleEvents');
    const toggleUpdates = document.getElementById('toggleUpdates');
    const announcementInput = document.getElementById('announcementInput');
    const saveBtn = document.getElementById('saveSettings');

    if (saveBtn) {
        saveBtn.addEventListener('click', async () => {
            const newSettings = {
                leaderboardEnabled: toggleLeaderboard ? toggleLeaderboard.checked : true,
                eventsEnabled: toggleEvents ? toggleEvents.checked : true,
                updatesEnabled: toggleUpdates ? toggleUpdates.checked : true,
                announcement: announcementInput ? announcementInput.value : ''
            };

            saveBtn.disabled = true;
            saveBtn.textContent = 'Saving...';

            try {
                const res = await fetch('/api/settings', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newSettings)
                });

                if (!res.ok) throw new Error('API save failed');
            } catch (err) {
                console.warn('Could not save to /api/settings, saved to local cache:', err);
            }

            localStorage.setItem('cyberOlympicsSettings', JSON.stringify(newSettings));
            if (settingsChannel) {
                try { settingsChannel.postMessage(newSettings); } catch (e) {}
            }
            saveBtn.disabled = false;
            saveBtn.textContent = 'Apply Configuration';
            alert('Settings applied globally for all users!');
            checkSettings();
        });
    }
}
