import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'portfolio',
  port: parseInt(process.env.DB_PORT || '3306'),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

interface ProjectRow {
  id: number;
  name: string;
  description: string;
  technologies: string;
  github: string;
  video: string | null;
  tags: string | null;
  created_at: Date;
}

interface AdminRow {
  id: number;
  username: string;
  password_hash: string;
  created_at: Date;
}

interface ContactRow {
  id: number;
  name: string;
  email: string;
  message: string;
  created_at: Date;
}

interface ResumeRow {
  id: number;
  filename: string;
  url: string;
  uploaded_at: Date;
}

// Initialize database
export const initDatabase = async (): Promise<void> => {
  try {
    const connection = await pool.getConnection();
    
    // Create projects table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS projects (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        technologies JSON NOT NULL,
        github VARCHAR(500) NOT NULL,
        video VARCHAR(500),
        tags JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create admin users table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create contacts table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS contacts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create resume table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS resume (
        id INT AUTO_INCREMENT PRIMARY KEY,
        filename VARCHAR(255) NOT NULL,
        url VARCHAR(500) NOT NULL,
        uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Check if default admin user exists
    const [adminRows] = await connection.execute(
      'SELECT COUNT(*) as count FROM admin_users'
    );
    const adminCount = (adminRows as any)[0].count;

    if (adminCount === 0) {
      const defaultPassword = 'Bd2222Mo?'; // Default admin password
      const hash = await bcrypt.hash(defaultPassword, 10);
      
      await connection.execute(
        'INSERT INTO admin_users (username, password_hash) VALUES (?, ?)',
        ['fatinm1', hash]
      );
      console.log('Default admin user created successfully');
    }

    connection.release();
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
};

// Database operations
export const getProjects = async (): Promise<any[]> => {
  try {
    const [rows] = await pool.execute('SELECT * FROM projects ORDER BY created_at DESC');
    return (rows as ProjectRow[]).map(row => ({
      ...row,
      technologies: typeof row.technologies === 'string' ? JSON.parse(row.technologies) : row.technologies,
      tags: row.tags ? (typeof row.tags === 'string' ? JSON.parse(row.tags) : row.tags) : []
    }));
  } catch (error) {
    console.error('Error getting projects:', error);
    throw error;
  }
};

export const addProject = async (project: any): Promise<void> => {
  try {
    await pool.execute(
      'INSERT INTO projects (name, description, technologies, github, video, tags) VALUES (?, ?, ?, ?, ?, ?)',
      [
        project.name,
        project.description,
        JSON.stringify(project.technologies),
        project.github,
        project.video || null,
        JSON.stringify(project.tags || [])
      ]
    );
  } catch (error) {
    console.error('Error adding project:', error);
    throw error;
  }
};

export const verifyAdmin = async (username: string, password: string): Promise<boolean> => {
  try {
    const [rows] = await pool.execute(
      'SELECT password_hash FROM admin_users WHERE username = ?',
      [username]
    );
    
    if ((rows as AdminRow[]).length === 0) {
      return false;
    }
    
    const row = (rows as AdminRow[])[0];
    return await bcrypt.compare(password, row.password_hash);
  } catch (error) {
    console.error('Error verifying admin:', error);
    return false;
  }
};

// Contact form functions
export const saveContact = async (contact: { name: string; email: string; message: string }): Promise<void> => {
  try {
    await pool.execute(
      'INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)',
      [contact.name, contact.email, contact.message]
    );
  } catch (error) {
    console.error('Error saving contact:', error);
    throw error;
  }
};

export const getContacts = async (): Promise<ContactRow[]> => {
  try {
    const [rows] = await pool.execute('SELECT * FROM contacts ORDER BY created_at DESC');
    return rows as ContactRow[];
  } catch (error) {
    console.error('Error getting contacts:', error);
    throw error;
  }
};

// Resume functions
export const saveResume = async (resume: { filename: string; url: string }): Promise<void> => {
  try {
    // First, clear any existing resume entries
    await pool.execute('DELETE FROM resume');
    
    // Then insert the new resume
    await pool.execute(
      'INSERT INTO resume (filename, url) VALUES (?, ?)',
      [resume.filename, resume.url]
    );
  } catch (error) {
    console.error('Error saving resume:', error);
    throw error;
  }
};

export const getCurrentResume = async (): Promise<ResumeRow | null> => {
  try {
    const [rows] = await pool.execute('SELECT * FROM resume ORDER BY uploaded_at DESC LIMIT 1');
    const resumeRows = rows as ResumeRow[];
    return resumeRows.length > 0 ? resumeRows[0] : null;
  } catch (error) {
    console.error('Error getting current resume:', error);
    throw error;
  }
}; 