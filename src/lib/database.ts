import sqlite3 from 'sqlite3';
import path from 'path';
import bcrypt from 'bcryptjs';

const DB_PATH = path.join(process.cwd(), 'data', 'portfolio.db');

interface ProjectRow {
  id: number;
  name: string;
  description: string;
  technologies: string;
  github: string;
  video: string | null;
  tags: string | null;
  created_at: string;
}

interface AdminRow {
  id: number;
  username: string;
  password_hash: string;
  created_at: string;
}

interface ContactRow {
  id: number;
  name: string;
  email: string;
  message: string;
  created_at: string;
}

interface ResumeRow {
  id: number;
  filename: string;
  url: string;
  uploaded_at: string;
}

// Initialize database
export const initDatabase = () => {
  return new Promise<void>((resolve, reject) => {
    const db = new sqlite3.Database(DB_PATH, (err) => {
      if (err) {
        reject(err);
        return;
      }

      // Create projects table
      db.run(`
        CREATE TABLE IF NOT EXISTS projects (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          description TEXT NOT NULL,
          technologies TEXT NOT NULL,
          github TEXT NOT NULL,
          video TEXT,
          tags TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `, (err) => {
        if (err) {
          reject(err);
          return;
        }

        // Create admin users table
        db.run(`
          CREATE TABLE IF NOT EXISTS admin_users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `, (err) => {
          if (err) {
            reject(err);
            return;
          }

          // Create contacts table
          db.run(`
            CREATE TABLE IF NOT EXISTS contacts (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              name TEXT NOT NULL,
              email TEXT NOT NULL,
              message TEXT NOT NULL,
              created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
          `, (err) => {
            if (err) {
              reject(err);
              return;
            }

            // Create resume table
            db.run(`
              CREATE TABLE IF NOT EXISTS resume (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                filename TEXT NOT NULL,
                url TEXT NOT NULL,
                uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP
              )
            `, (err) => {
              if (err) {
                reject(err);
                return;
              }

              // Create default admin user if none exists
              db.get('SELECT COUNT(*) as count FROM admin_users', (err, row: any) => {
                if (err) {
                  reject(err);
                  return;
                }

                if (row.count === 0) {
                  const defaultPassword = 'Bd2222Mo?'; // Default admin password
                  bcrypt.hash(defaultPassword, 10, (err, hash) => {
                    if (err) {
                      reject(err);
                      return;
                    }

                    db.run(
                      'INSERT INTO admin_users (username, password_hash) VALUES (?, ?)',
                      ['fatinm1', hash],
                      (err) => {
                        if (err) {
                          reject(err);
                          return;
                        }
                        console.log('Default admin user created successfully');
                        resolve();
                      }
                    );
                  });
                } else {
                  resolve();
                }
              });
            });
          });
        });
      });
    });
  });
};

// Database operations
export const getProjects = (): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(DB_PATH);
    db.all('SELECT * FROM projects ORDER BY created_at DESC', (err, rows: ProjectRow[]) => {
      db.close();
      if (err) {
        reject(err);
        return;
      }
      resolve(rows.map(row => ({
        ...row,
        technologies: JSON.parse(row.technologies),
        tags: row.tags ? JSON.parse(row.tags) : []
      })));
    });
  });
};

export const addProject = (project: any): Promise<void> => {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(DB_PATH);
    db.run(
      'INSERT INTO projects (name, description, technologies, github, video, tags) VALUES (?, ?, ?, ?, ?, ?)',
      [
        project.name,
        project.description,
        JSON.stringify(project.technologies),
        project.github,
        project.video || null,
        JSON.stringify(project.tags || [])
      ],
      (err) => {
        db.close();
        if (err) {
          reject(err);
          return;
        }
        resolve();
      }
    );
  });
};

export const verifyAdmin = (username: string, password: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(DB_PATH);
    db.get(
      'SELECT password_hash FROM admin_users WHERE username = ?',
      [username],
      (err, row: AdminRow | undefined) => {
        db.close();
        if (err) {
          reject(err);
          return;
        }
        if (!row) {
          resolve(false);
          return;
        }
        bcrypt.compare(password, row.password_hash, (err, result) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(result || false);
        });
      }
    );
  });
};

// Contact form functions
export const saveContact = (contact: { name: string; email: string; message: string }): Promise<void> => {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(DB_PATH);
    db.run(
      'INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)',
      [contact.name, contact.email, contact.message],
      (err) => {
        db.close();
        if (err) {
          reject(err);
          return;
        }
        resolve();
      }
    );
  });
};

export const getContacts = (): Promise<ContactRow[]> => {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(DB_PATH);
    db.all('SELECT * FROM contacts ORDER BY created_at DESC', (err, rows: ContactRow[]) => {
      db.close();
      if (err) {
        reject(err);
        return;
      }
      resolve(rows);
    });
  });
};

// Resume functions
export const saveResume = (resume: { filename: string; url: string }): Promise<void> => {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(DB_PATH);
    
    // First, clear any existing resume entries
    db.run('DELETE FROM resume', (err) => {
      if (err) {
        db.close();
        reject(err);
        return;
      }
      
      // Then insert the new resume
      db.run(
        'INSERT INTO resume (filename, url) VALUES (?, ?)',
        [resume.filename, resume.url],
        (err) => {
          db.close();
          if (err) {
            reject(err);
            return;
          }
          resolve();
        }
      );
    });
  });
};

export const getCurrentResume = (): Promise<ResumeRow | null> => {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(DB_PATH);
    db.get('SELECT * FROM resume ORDER BY uploaded_at DESC LIMIT 1', (err, row: ResumeRow | undefined) => {
      db.close();
      if (err) {
        reject(err);
        return;
      }
      resolve(row || null);
    });
  });
}; 