import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dbPath = join(__dirname, 'portfolio.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error connecting to database:', err.message);
  } else {
    console.log('Connected to SQLite database.');
    initializeDatabase();
  }
});

function initializeDatabase() {
  db.run(`
    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      details TEXT,
      image TEXT,
      github TEXT,
      web TEXT
    )
  `, (err) => {
    if (err) {
      console.error('Error creating table:', err.message);
    } else {
      seedData();
    }
  });
}

function seedData() {
  db.get("SELECT COUNT(*) as count FROM projects", (err, row) => {
    if (err) {
       console.error('Error checking projects count:', err.message);
       return;
    }
    if (row.count === 0) {
      const projects = [
        {
          title: "Tomato",
          details: "This project is a simple food ordering website built using React. It allows users to browse through a menu of food items, add items to their cart, and place an order. The website is responsive and adapts well to different screen sizes.",
          image: "/tomato.png",
          github: "https://github.com/Vishnu-Vijayan-2002/React-main-project-front-end-design.git",
          web: "https://react-main-project-front-end-4i53-nn1s6hk2r.vercel.app/"
        },
        {
          title: "React Quiz App",
          details: "Interactive Quizzes: Engage in thought-provoking questions on various topics. React-powered UI: Building a responsive and sleek user interface with React components. Score Tracking: Challenge yourself and track your quiz performance.",
          image: "/quizapp.png",
          github: "https://github.com/Vishnu-Vijayan-2002/react-quiz-app.git",
          web: "https://react-quiz-app-zeta-blue.vercel.app/"
        },
        {
          title: "Gym Website",
          details: "A Responsive 💪🏽Gym site Website blending HTML, CSS, Bootstrap and javascript",
          image: "/file.png",
          github: "https://github.com/Vishnu-Vijayan-2002/befit-gym.git",
          web: "https://befit-gym.vercel.app/"
        },
        {
          title: "News-Hub",
          details: "Real-time News Updates: Stay informed with the latest headlines fetched dynamically. JSON Server Magic: Leveraging the simplicity and flexibility of JSON Server for seamless data management. User-Friendly Interface: A clean and intuitive design for a smooth browsing experience",
          image: "/news.png",
          github: "https://github.com/Vishnu-Vijayan-2002/React-news-hub-web",
          web: "https://react-news-hub-web.vercel.app/"
        }
      ];

      const stmt = db.prepare("INSERT INTO projects (title, details, image, github, web) VALUES (?, ?, ?, ?, ?)");
      projects.forEach(p => {
        stmt.run(p.title, p.details, p.image, p.github, p.web);
      });
      stmt.finalize();
      console.log('Seeded projects into database.');
    }
  });
}

export default db;
