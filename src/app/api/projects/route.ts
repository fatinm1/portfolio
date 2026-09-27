import { NextRequest, NextResponse } from 'next/server';
import { initDatabase, getProjects, addProject } from '@/lib/database';
import { requireAdmin } from '@/lib/auth';
import { validateProjectInput } from '@/lib/security';

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
  const unauthorized = await requireAdmin(req);
  if (unauthorized) return unauthorized;

  try {
    const body = await req.json();

    const validationError = validateProjectInput(body);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    await ensureDatabase();

    await addProject(body);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error adding project:', error);
    return NextResponse.json({ error: 'Failed to add project' }, { status: 500 });
  }
} 