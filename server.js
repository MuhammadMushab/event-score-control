const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 25666;
const PUBLIC_DIR = __dirname;
const SETTINGS_FILE = path.join(__dirname, 'settings.json');

const DEFAULT_SETTINGS = {
    leaderboardEnabled: true,
    eventsEnabled: true,
    updatesEnabled: true,
    announcement: ''
};

function getSettings() {
    try {
        if (fs.existsSync(SETTINGS_FILE)) {
            const data = fs.readFileSync(SETTINGS_FILE, 'utf8');
            return { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
        }
    } catch (e) {
        console.error('Error reading settings.json:', e);
    }
    return { ...DEFAULT_SETTINGS };
}

function saveSettings(settings) {
    try {
        fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2), 'utf8');
        return true;
    } catch (e) {
        console.error('Error saving settings.json:', e);
        return false;
    }
}

const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.mp4': 'video/mp4',
    '.webm': 'video/webm',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf'
};

const server = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, HEAD');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    const urlObj = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    let pathname = decodeURIComponent(urlObj.pathname);

    // API Routes for Global Settings
    if (pathname === '/api/settings' || pathname === '/settings.json') {
        if (req.method === 'GET' || req.method === 'HEAD') {
            const settings = getSettings();
            const body = JSON.stringify(settings);
            res.writeHead(200, {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache, no-store, must-revalidate'
            });
            if (req.method === 'HEAD') {
                res.end();
            } else {
                res.end(body);
            }
            return;
        }

        if (req.method === 'POST') {
            let body = '';
            req.on('data', chunk => { body += chunk; });
            req.on('end', () => {
                try {
                    const parsed = JSON.parse(body);
                    const current = getSettings();
                    const updated = {
                        leaderboardEnabled: parsed.leaderboardEnabled !== undefined ? Boolean(parsed.leaderboardEnabled) : current.leaderboardEnabled,
                        eventsEnabled: parsed.eventsEnabled !== undefined ? Boolean(parsed.eventsEnabled) : current.eventsEnabled,
                        updatesEnabled: parsed.updatesEnabled !== undefined ? Boolean(parsed.updatesEnabled) : current.updatesEnabled,
                        announcement: parsed.announcement !== undefined ? String(parsed.announcement) : current.announcement
                    };
                    if (saveSettings(updated)) {
                        res.writeHead(200, {
                            'Content-Type': 'application/json',
                            'Cache-Control': 'no-cache, no-store, must-revalidate'
                        });
                        res.end(JSON.stringify({ success: true, settings: updated }));
                    } else {
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ error: 'Failed to write settings' }));
                    }
                } catch (err) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Invalid JSON body' }));
                }
            });
            return;
        }
    }

    // Clean URL redirects
    const cleanRedirects = {
        '/leaderboard.html': '/leaderboard',
        '/events.html': '/events',
        '/updates.html': '/updates',
        '/admin.html': '/mission-control'
    };

    if (cleanRedirects[pathname]) {
        res.writeHead(301, { 'Location': cleanRedirects[pathname] });
        res.end();
        return;
    }

    // Resolve paths matching Nginx routes
    let filePath;
    if (pathname === '/' || pathname === '') {
        filePath = path.join(PUBLIC_DIR, 'index.html');
    } else if (pathname === '/leaderboard' || pathname === '/leaderboard/') {
        filePath = path.join(PUBLIC_DIR, 'leaderboard', 'index.html');
    } else if (pathname === '/events' || pathname === '/events/') {
        filePath = path.join(PUBLIC_DIR, 'events', 'index.html');
    } else if (pathname === '/updates' || pathname === '/updates/') {
        filePath = path.join(PUBLIC_DIR, 'updates', 'index.html');
    } else if (pathname === '/mission-control' || pathname === '/mission-control/') {
        filePath = path.join(PUBLIC_DIR, 'mission-control', 'index.html');
    } else {
        filePath = path.join(PUBLIC_DIR, pathname);
    }

    const resolvedPath = path.resolve(filePath);
    if (!resolvedPath.startsWith(path.resolve(PUBLIC_DIR))) {
        res.writeHead(403);
        res.end('Forbidden');
        return;
    }

    fs.stat(resolvedPath, (err, stats) => {
        if (err || !stats.isFile()) {
            const notFoundPath = path.join(PUBLIC_DIR, '404.html');
            if (fs.existsSync(notFoundPath)) {
                res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
                fs.createReadStream(notFoundPath).pipe(res);
            } else {
                res.writeHead(404);
                res.end('Not Found');
            }
            return;
        }

        const ext = path.extname(resolvedPath).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';

        // Video Range Request handling
        if (ext === '.mp4' || ext === '.webm') {
            const range = req.headers.range;
            const fileSize = stats.size;

            if (range) {
                const parts = range.replace(/bytes=/, "").split("-");
                const start = parseInt(parts[0], 10);
                const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
                const chunksize = (end - start) + 1;
                const fileStream = fs.createReadStream(resolvedPath, { start, end });

                res.writeHead(206, {
                    'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                    'Accept-Ranges': 'bytes',
                    'Content-Length': chunksize,
                    'Content-Type': contentType,
                });
                fileStream.pipe(res);
                return;
            }
        }

        const isDynamic = ['.html', '.js', '.json', '.css'].includes(ext);
        res.writeHead(200, {
            'Content-Type': contentType,
            'Content-Length': stats.size,
            'Cache-Control': isDynamic ? 'no-cache, no-store, must-revalidate' : 'public, max-age=3600'
        });

        if (req.method === 'HEAD') {
            res.end();
        } else {
            fs.createReadStream(resolvedPath).pipe(res);
        }
    });
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on http://0.0.0.0:${PORT}`);
});
