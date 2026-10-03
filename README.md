# Portfolio Website

A responsive personal portfolio and resume website built using HTML5, CSS3, and vanilla JavaScript.

The website showcases my academic background, technical skills, internships, projects, activities, and provides a functional contact system with an admin dashboard for retrieving submitted messages.

##  Live Website

The portfolio is deployed using GitHub Pages.

**Repository:**  
https://github.com/PrabhSaran-07/Portfolio

---

##  Features

###  Portfolio Sections

- Hero / Introduction section
- About Me
- Education
- Internships
- Technical Skills
- Projects
- Extra-Curricular Activities
- Contact Me

###  Contact Form

The website includes a functional contact form where visitors can submit:

- Name
- Email address
- Message

Submitted messages are sent to the backend and stored in Google Sheets.

###  Google Sheets Integration

Google Sheets is used as the database for contact form responses.

The website communicates with a Google Apps Script Web App that:

- Receives contact form submissions
- Stores responses in Google Sheets
- Returns stored responses to the website
- Provides the admin login functionality

###  Admin Dashboard

The portfolio contains a protected Admin Login section.

After successful authentication, the administrator can:

- Access the User Responses dashboard
- View submitted messages
- View sender names
- View email addresses
- View submission timestamps

The Admin Login section remains hidden until it is accessed through the navigation.

###  Light / Dark Theme

A theme toggle is included to switch between:

- Light mode
- Dark mode

The selected theme is saved in the browser using `localStorage`.

###  Responsive Design

The website is designed to work across:

- Desktop
- Laptop
- Tablet
- Mobile devices

###  UI Features

- Sticky navigation bar
- Smooth scrolling
- Responsive mobile navigation
- Scroll reveal animations
- Interactive buttons
- Card-based layouts
- Modern typography
- Responsive contact form
- Theme switching

---

##  Technologies Used

### Frontend

- HTML5
- CSS3
- JavaScript (ES6+)

### Backend / Data Storage

- Google Apps Script
- Google Sheets

### Deployment

- GitHub
- GitHub Pages

No frontend framework or build tool is required.

---

##  Project Structure

```text
Portfolio/
│
├── index.html       # Main portfolio webpage
├── style.css        # Website styling and responsive design
├── script.js        # Website functionality and API communication
│
├── README.md        # Project documentation
├── LICENSE.txt      # MIT License
└── .gitattributes   # Git configuration
