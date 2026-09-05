# Event Score Control

> Open-source event scoring and control portal with live leaderboards, event scheduling, countdowns, announcements, and organizer controls.

Event Score Control is a lightweight web-based platform for managing scores, rankings, event schedules, countdowns, announcements, and public event information from a single portal.

It is designed to be reusable for different types of events, competitions, tournaments, programs, and scoring-based activities.

The application uses a simple architecture based on:

- HTML5
- CSS3
- Vanilla JavaScript
- Google Sheets
- Nginx / Apache / Static Hosting
- Optional Node.js server
- Optional Docker deployment

No traditional database is required for the core scoring and event data.

---

## ✨ Features

### 🏆 Live Leaderboard

Display a live ranking of teams or participants.

Features include:

- Team/participant names
- Individual event scores
- Total scores
- Automatic ranking
- Highlighting of top-ranked participants
- Data loaded directly from Google Sheets

---

### 📅 Event / Mission Board

Display all events or competition activities in a responsive interface.

Each event can contain:

- Event name
- Sector/category
- Start date
- Start time
- End date
- End time
- Event status
- Live countdown

The event status can automatically change depending on the configured start and end time.

Example:

```text
UPCOMING

Event Name
Sector: Alpha

Starts in
02:15:42

After the event ends:

ENDED
📢 Live Updates

Display announcements and updates for participants.

Each update can contain:

Time
Message

Updates are loaded from Google Sheets and displayed in chronological order.

This allows organizers to communicate important information without modifying the website code.

🎛️ Organizer Control Panel

The Control Panel allows organizers to manage public-facing sections.

Available controls include:

Leaderboard visibility
Event/Mission Board visibility
Updates visibility
Global announcement

The settings can be stored locally in the browser and applied across the portal.

🌐 Clean URLs

The application supports clean URLs such as:

/
 /leaderboard
 /events
 /updates
 /mission-control

Instead of requiring users to access:

/leaderboard/index.html
/events/index.html
/updates/index.html

Nginx and Apache configurations are included for clean URL routing.

📱 Responsive Design

The interface is designed to work across:

Desktop
Laptop
Tablet
Mobile

The visual system uses a modern dark glassmorphism design with responsive layouts.

🖥️ Screenshots

Add your project screenshots inside:

docs/screenshots/

Recommended screenshots:

docs/
└── screenshots/
    ├── home.png
    ├── leaderboard.png
    ├── events.png
    ├── updates.png
    └── control-panel.png

Then they can be displayed in this README.

Home

Leaderboard

Events

Updates

Control Panel

🏗️ Architecture

Event Score Control uses a lightweight client-side architecture.

                       ┌────────────────────────┐
                       │      Google Sheets     │
                       │                        │
                       │  Leaderboard            │
                       │  Events                 │
                       │  Live Updates           │
                       └───────────┬────────────┘
                                   │
                                   │ Published CSV
                                   ▼
┌────────────────────────────────────────────────────────────┐
│                         Web Browser                        │
│                                                            │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────────┐  │
│  │  Leaderboard │  │    Events    │  │     Updates     │  │
│  └──────────────┘  └──────────────┘  └─────────────────┘  │
│                                                            │
│                  Vanilla JavaScript                        │
│                                                            │
│        Routing • Data Fetching • Countdown • UI           │
│                                                            │
└────────────────────────────┬───────────────────────────────┘
                             │
                             ▼
                  ┌──────────────────────┐
                  │   Control Panel      │
                  │                      │
                  │ Section Visibility   │
                  │ Global Announcement  │
                  └──────────────────────┘

The project does not require a traditional application database for the core event data.

Competition/event information is maintained in Google Sheets and published as CSV. The browser retrieves the data and renders it dynamically.

🔄 How It Works

The basic workflow is:

Organizer
    │
    ▼
Google Sheets
    │
    ├── Leaderboard
    ├── Events
    └── Live Updates
    │
    ▼
Publish to Web
    │
    ▼
Published CSV
    │
    ▼
Event Score Control
    │
    ├── Live Leaderboard
    ├── Event Board
    ├── Countdown
    └── Updates

The organizer only needs to update the Google Sheet.

The website reads the published data and displays the latest information when the page loads.

🧰 Technology Stack
Technology	Purpose
HTML5	Page structure
CSS3	Styling and responsive layout
Vanilla JavaScript	Application logic
Google Sheets	External data source
CSV	Data transfer format
localStorage	Local application settings
sessionStorage	Admin session
Inter	UI typography
MP4	Optional background media
Nginx	Web server / reverse proxy
Apache	Alternative web server
Node.js	Optional application server
Docker	Optional container deployment
📁 Project Structure

A typical project structure looks like:

event-score-control/
│
├── README.md
├── LICENSE
├── CONTRIBUTING.md
├── SECURITY.md
├── .gitignore
│
├── index.html
├── 404.html
├── style.css
├── script.js
├── admin.config.js
├── settings.json
│
├── server.js
├── package.json
│
├── Dockerfile
├── docker-compose.yml
├── nginx.conf
├── .htaccess
│
├── leaderboard/
│   └── index.html
│
├── events/
│   └── index.html
│
├── updates/
│   └── index.html
│
├── mission-control/
│   └── index.html
│
├── assets/
│   ├── images/
│   ├── icons/
│   └── video/
│       └── space.mp4
│
└── docs/
    ├── screenshots/
    └── event-score-template.xlsx
📊 Google Sheets Setup

Event Score Control uses Google Sheets as the data source.

A ready-to-use spreadsheet template is included with the project.

The template allows users to create their own event data without having to manually create the required columns.

Spreadsheet Template

The repository should contain:

docs/event-score-template.xlsx

You can rename the provided spreadsheet template to:

event-score-template.xlsx

Users should use this template for their own deployment.

🚀 Step 1 — Download the Spreadsheet Template

Download:

docs/event-score-template.xlsx

from the repository.

☁️ Step 2 — Upload the Template to Google Drive

Open your Google Drive.

Upload:

event-score-template.xlsx

After uploading:

Right Click
    ↓
Open with
    ↓
Google Sheets

Google Drive will create a Google Sheets version of the template.

You can then rename it to something appropriate for your event.

For example:

My Event 2026 - Score Management
📝 Step 3 — Enter Your Event Data

The spreadsheet contains the required data structure.

The main data sections are:

Leaderboard
Events
LiveUpdates
🏆 Leaderboard Sheet

The Leaderboard sheet contains participant/team scores.

A typical structure is:

Team Name
Event 1
Event 2
Event 3
Event 4
...
TOTAL

Example:

Team Name	Event 1	Event 2	Event 3	TOTAL
Team Alpha	100	80	90	270
Team Beta	90	85	75	250
Team Gamma	70	80	80	230

The website uses the total score to determine the ranking.

Important

Keep the required column structure from the provided template.

If you add or remove columns, make sure the JavaScript configuration supports the change.

📅 Events Sheet

The Events sheet contains the schedule for your event.

Required fields:

Event Name
Sector
Start Date
Start Time
End Date
End Time

Example:

Event Name	Sector	Start Date	Start Time	End Date	End Time
Opening Event	Alpha	2026-10-01	10:00	2026-10-01	11:00
Challenge 1	Beta	2026-10-01	11:30	2026-10-01	13:00
Final Round	Gamma	2026-10-01	15:00	2026-10-01	17:00

The website uses these values to generate the event cards and countdown timers.

📢 LiveUpdates Sheet

The LiveUpdates sheet contains announcements.

Required fields:

Time
Message

Example:

Time	Message
10:00	The event has officially started.
11:30	Challenge 1 is now available.
13:00	Lunch break has started.
15:00	Final round is now open.

The website automatically displays these messages on the Updates page.

🌍 Step 4 — Publish Your Google Sheet

After entering your event data:

Open Google Sheets and select:

File
    ↓
Share
    ↓
Publish to web

Select the required sheet.

Choose:

Comma-separated values (.csv)

Then click:

Publish

Google will provide a published URL.

🔗 Step 5 — Add Your Published URLs

Open:

script.js

Find the Google Sheets configuration.

You will see placeholders similar to:

const LEADERBOARD_URL = 'YOUR_PUBLISHED_LEADERBOARD_URL';
const EVENTS_URL = 'YOUR_PUBLISHED_EVENTS_URL';
const UPDATES_URL = 'YOUR_PUBLISHED_UPDATES_URL';

Replace them with the URLs from your own Google Sheet.

Example:

const LEADERBOARD_URL =
    'YOUR_GOOGLE_SHEET_LEADERBOARD_CSV_URL';

const EVENTS_URL =
    'YOUR_GOOGLE_SHEET_EVENTS_CSV_URL';

const UPDATES_URL =
    'YOUR_GOOGLE_SHEET_UPDATES_CSV_URL';
Important

You should use your own Google Sheet.

Do not use the spreadsheet belonging to another deployment.

Each organization/event should create its own copy of the provided spreadsheet template.

🔄 Complete Google Sheets Workflow
Download Template
       │
       ▼
Upload to Google Drive
       │
       ▼
Open with Google Sheets
       │
       ▼
Enter Event Data
       │
       ├───────────────┐
       │               │
       ▼               ▼
 Leaderboard         Events
       │               │
       └───────┬───────┘
               │
               ▼
          LiveUpdates
               │
               ▼
       Publish to Web
               │
               ▼
        Published CSV
               │
               ▼
         Copy URLs
               │
               ▼
          script.js
               │
               ▼
       Deploy Website
               │
               ▼
              🚀
⚙️ Configuration

Most project configuration is located in:

script.js

Depending on the version of the project, configuration may also be separated into:

admin.config.js
settings.json
🔗 Event Links

If individual events need external links, they can be configured in the JavaScript configuration.

Example:

const EVENT_LINKS = {
    'event name': 'https://example.com/event'
};

This allows an event card to link participants to another platform.

🎛️ Control Panel

The Control Panel is available at:

/mission-control

Depending on the project configuration, this can be renamed to:

/control

The panel provides controls such as:

Leaderboard
    ON / OFF

Events
    ON / OFF

Updates
    ON / OFF

Global Announcement
    __________________________

The settings can be stored in browser storage and applied when the public pages are rendered.

🔐 Security
Important Security Notice

The current Control Panel authentication is implemented on the client side.

This means it should not be treated as a high-security authentication system.

Client-side authentication is suitable for lightweight event administration, but it should not be used to protect sensitive information or critical infrastructure.

For a production system requiring strong authentication, move authentication and authorization to a server-side API.

⚠️ Google Sheets Security

Published Google Sheets data is publicly accessible.

Do not place sensitive information inside the published spreadsheet.

Do not store:

Passwords
API keys
Private participant information
Internal credentials
Confidential data
Secrets

The spreadsheet should contain only information intended to be displayed publicly.

🛡️ Input Sanitization

Any data loaded from an external spreadsheet should be treated as untrusted input.

When displaying Google Sheets data in the browser, prefer:

element.textContent = value;

instead of:

element.innerHTML = value;

unless the content has been properly sanitized.

This is particularly important for:

Event names
Event descriptions
Sectors
Announcement messages
Other spreadsheet-controlled content
🌐 Deployment

Event Score Control can be deployed in several ways.

Option 1 — Static Hosting

Because the frontend consists primarily of static files, it can be deployed on a static hosting service.

Examples include:

Nginx
Apache
CDN / Edge Hosting
Static Web Hosting

No frontend build process is required for the basic application.

🟢 Option 2 — Node.js

If the repository includes the Node.js server:

npm install

Then:

npm start

or:

node server.js

The exact port is determined by the project's server configuration.

🐳 Option 3 — Docker

If Docker configuration is included:

docker compose up -d --build

To stop:

docker compose down
🌐 Nginx

The repository includes:

nginx.conf

Nginx can be used to:

Serve static files
Provide clean URLs
Redirect legacy URLs
Add security headers
Block sensitive files

Example routes:

/
 /leaderboard
 /events
 /updates
 /mission-control
🌐 Apache

Apache deployment can use:

.htaccess

for URL rewriting and redirects.

Example:

/leaderboard.html
        ↓
/leaderboard
🔗 URL Structure
Route	Purpose
/	Main event portal
/leaderboard	Live rankings
/events	Event schedule
/updates	Announcements
/mission-control	Organizer control panel
/404.html	Custom error page
🎨 Design

The project uses a modern dark interface with a glassmorphism-inspired visual system.

Main design characteristics include:

Dark background
Translucent panels
Soft glow effects
Blue/purple accent colors
Responsive cards
Modern typography
Animated visual elements
Optional video background

The design can be customized through:

style.css

CSS custom properties can be used to modify the main theme.

🧪 Local Development

Clone the repository:

git clone https://github.com/YOUR_USERNAME/event-score-control.git

Enter the directory:

cd event-score-control

Configure your Google Sheet URLs.

Then start the project using the supported deployment method.

For a simple static test, you can also serve the directory using a local web server.

📝 Customizing the Project

You can customize:

Website Name

Update the branding in the HTML files.

Colors

Edit:

style.css
Background

Replace the media inside:

assets/video/
Images

Replace images inside:

assets/images/
Icons

Replace icons inside:

assets/icons/
Event Data

Update the Google Sheet.

Leaderboard

Update the Google Sheet.

Announcements

Update the LiveUpdates sheet.

📌 Recommended Setup for a New Event

For a new organization or event:

1. Fork / clone this repository
              ↓
2. Download the spreadsheet template
              ↓
3. Upload template to Google Drive
              ↓
4. Open it with Google Sheets
              ↓
5. Enter your event information
              ↓
6. Publish the required sheets as CSV
              ↓
7. Copy the published URLs
              ↓
8. Add URLs to script.js
              ↓
9. Configure branding
              ↓
10. Test locally
              ↓
11. Deploy
🛠️ Troubleshooting
Leaderboard is empty

Check:

The Google Sheet is published.
The published URL is correct.
The correct sheet is being used.
The column structure matches the template.
The browser can access the published CSV.
Events are not appearing

Check:

Event Name exists.
Start Date is valid.
Start Time is valid.
End Date is valid.
End Time is valid.
The Events sheet is published.
The Events CSV URL is correct.
Updates are not appearing

Check:

Time is provided.
Message is provided.
The LiveUpdates sheet is published.
The correct URL is configured.
Countdown is incorrect

Check:

Date format
Time format
Browser timezone
Start/end values in the spreadsheet
🤝 Contributing

Contributions are welcome.

If you want to contribute:

Fork the repository.
Create a feature branch.
Make your changes.
Test the application.
Commit your changes.
Push the branch.
Open a Pull Request.

Example:

git checkout -b feature/my-feature
git add .
git commit -m "feat: add my feature"
git push origin feature/my-feature
🐛 Reporting Issues

If you find a bug, please create a GitHub Issue.

Include:

Description of the problem
Steps to reproduce
Expected behavior
Actual behavior
Browser
Operating system
Screenshots if applicable

Please do not publish passwords, API keys, private URLs, or other sensitive information in an issue.

🔒 Security Issues

If you discover a security vulnerability, please do not publicly disclose sensitive details in a GitHub Issue.

Instead, use the repository's security reporting mechanism or contact the project maintainer privately.

🛣️ Roadmap

Future improvements may include:

 Server-side authentication
 Role-based access control
 Secure organizer API
 Direct spreadsheet write-back
 Improved data validation
 Input sanitization
 Better caching
 Retry handling
 Automated tests
 CSV parser tests
 Countdown calculation tests
 CI/CD
 More deployment options
 Improved mobile experience
 Multiple event configuration
 Custom themes
📜 License

This project is open source and available under the MIT License.

See the LICENSE file for details.

⭐ Support the Project

If you find Event Score Control useful:

⭐ Star the repository
🍴 Fork the project
🐛 Report bugs
💡 Suggest features
🔧 Submit Pull Requests
📖 Improve the documentation
