import mysql from 'mysql2/promise';
import type { ResultSetHeader } from 'mysql2/promise';
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
  photo: string | null;
  live_url: string | null;
  tags: string | null;
  status: string | null;
  featured: number;
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
        photo VARCHAR(500),
        live_url VARCHAR(500),
        tags JSON,
        status VARCHAR(50),
        featured TINYINT(1) NOT NULL DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    try {
      const [liveCols] = await connection.execute(
        `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS
         WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'projects' AND COLUMN_NAME = 'live_url'`,
        [dbConfig.database]
      );
      if ((liveCols as { COLUMN_NAME: string }[]).length === 0) {
        await connection.execute("ALTER TABLE projects ADD COLUMN live_url VARCHAR(500) NULL");
      }
    } catch {
      // ignore
    }

    // Add homepage `status` badge and `featured` flag (existing deployments)
    try {
      const [cols] = await connection.execute(
        `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS
         WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'projects' AND COLUMN_NAME IN ('status', 'featured')`,
        [dbConfig.database]
      );
      const existing = (cols as { COLUMN_NAME: string }[]).map((r) => r.COLUMN_NAME);
      if (!existing.includes('status')) {
        await connection.execute("ALTER TABLE projects ADD COLUMN status VARCHAR(50) NULL");
      }
      if (!existing.includes('featured')) {
        await connection.execute("ALTER TABLE projects ADD COLUMN featured TINYINT(1) NOT NULL DEFAULT 0");
      }
    } catch {
      // ignore
    }

    // Migrate legacy `video` column to `photo` (existing deployments)
    try {
      const [colRows] = await connection.execute(
        `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS
         WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'projects' AND COLUMN_NAME IN ('video', 'photo')`,
        [dbConfig.database]
      );
      const colNames = (colRows as { COLUMN_NAME: string }[]).map((r) => r.COLUMN_NAME);
      if (colNames.includes('video') && !colNames.includes('photo')) {
        await connection.execute('ALTER TABLE projects CHANGE video photo VARCHAR(500)');
      }
    } catch {
      // ignore migration errors (e.g. permissions)
    }

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

    // Seed the first admin from env vars only; never ship a default password.
    if (adminCount === 0) {
      const username = process.env.ADMIN_USERNAME;
      const password = process.env.ADMIN_PASSWORD;
      if (username && password && password.length >= 12) {
        const hash = await bcrypt.hash(password, 12);
        await connection.execute(
          'INSERT INTO admin_users (username, password_hash) VALUES (?, ?)',
          [username, hash]
        );
        console.log('Admin user created from ADMIN_USERNAME / ADMIN_PASSWORD');
      } else {
        console.warn('No admin user exists. Set ADMIN_USERNAME and ADMIN_PASSWORD (12+ chars) to create one.');
      }
    }

    connection.release();
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
};

// Database operations
const toProject = (row: ProjectRow) => {
  const r = row as ProjectRow & { video?: string | null };
  return {
    ...row,
    photo: row.photo ?? r.video ?? null,
    technologies: typeof row.technologies === 'string' ? JSON.parse(row.technologies) : row.technologies,
    tags: row.tags ? (typeof row.tags === 'string' ? JSON.parse(row.tags) : row.tags) : [],
    status: row.status ?? null,
    featured: Boolean(row.featured),
  };
};

// Only one project is featured on the homepage at a time.
const clearOtherFeatured = async (keepId: number): Promise<void> => {
  await pool.execute('UPDATE projects SET featured = 0 WHERE id <> ?', [keepId]);
};

export const getProjects = async (): Promise<any[]> => {
  try {
    const [rows] = await pool.execute('SELECT * FROM projects ORDER BY created_at DESC');
    return (rows as ProjectRow[]).map(toProject);
  } catch (error) {
    console.error('Error getting projects:', error);
    throw error;
  }
};

export const addProject = async (project: any): Promise<void> => {
  try {
    const [result] = await pool.execute(
      'INSERT INTO projects (name, description, technologies, github, photo, live_url, tags, status, featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        project.name,
        project.description,
        JSON.stringify(project.technologies),
        project.github,
        project.photo || null,
        project.live_url || null,
        JSON.stringify(project.tags || []),
        project.status?.trim() || null,
        project.featured ? 1 : 0
      ]
    );
    if (project.featured) {
      await clearOtherFeatured((result as ResultSetHeader).insertId);
    }
  } catch (error) {
    console.error('Error adding project:', error);
    throw error;
  }
};

export const getProjectById = async (id: number): Promise<any> => {
  try {
    const [rows] = await pool.execute('SELECT * FROM projects WHERE id = ?', [id]);
    const projectRows = rows as ProjectRow[];
    
    if (projectRows.length === 0) {
      return null;
    }
    
    return toProject(projectRows[0]);
  } catch (error) {
    console.error('Error getting project by ID:', error);
    throw error;
  }
};

export const updateProject = async (id: number, project: any): Promise<void> => {
  try {
    const existing = await getProjectById(id);
    if (!existing) {
      throw new Error('Project not found');
    }
    const has = (key: string) => Object.prototype.hasOwnProperty.call(project, key);
    const photo = has("photo") ? project.photo : existing.photo ?? null;
    const live_url = has("live_url") ? project.live_url : existing.live_url ?? null;
    const status = has("status") ? project.status?.trim() || null : existing.status;
    const featured = has("featured") ? Boolean(project.featured) : existing.featured;

    await pool.execute(
      'UPDATE projects SET name = ?, description = ?, technologies = ?, github = ?, photo = ?, live_url = ?, tags = ?, status = ?, featured = ? WHERE id = ?',
      [
        project.name,
        project.description,
        JSON.stringify(project.technologies),
        project.github,
        photo || null,
        live_url || null,
        JSON.stringify(project.tags || []),
        status,
        featured ? 1 : 0,
        id
      ]
    );
    if (featured) {
      await clearOtherFeatured(id);
    }
  } catch (error) {
    console.error('Error updating project:', error);
    throw error;
  }
};

export const deleteProject = async (id: number): Promise<void> => {
  try {
    await pool.execute('DELETE FROM projects WHERE id = ?', [id]);
  } catch (error) {
    console.error('Error deleting project:', error);
    throw error;
  }
};

const DUMMY_HASH = bcrypt.hashSync('timing-equalizer', 10);

export const verifyAdmin = async (username: string, password: string): Promise<boolean> => {
  try {
    const [rows] = await pool.execute(
      'SELECT password_hash FROM admin_users WHERE username = ?',
      [username]
    );
    
    if ((rows as AdminRow[]).length === 0) {
      // Compare against a dummy hash so unknown usernames take the same time.
      await bcrypt.compare(password, DUMMY_HASH);
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