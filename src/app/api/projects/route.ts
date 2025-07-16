import { NextRequest, NextResponse } from 'next/server';
import { initDatabase, getProjects, addProject } from '@/lib/database';

let dbInitialized = false;

const ensureDatabase = async () => {
  if (!dbInitialized) {
    await initDatabase();
    dbInitialized = true;
  }
};

export async function GET() {
  try {
    await ensureDatabase();
    const projects = await getProjects();
    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ error: 'Failed to load projects' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await ensureDatabase();
    const body = await req.json();
    
    // Validate required fields
    if (!body.name || !body.description || !body.technologies || !body.github) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await addProject(body);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error adding project:', error);
    return NextResponse.json({ error: 'Failed to add project' }, { status: 500 });
  }
} 