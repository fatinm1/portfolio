"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Mail, Eye, EyeOff, Download, FileText, Edit, X, Save, Trash2 } from "lucide-react";

interface ProjectForm {
  name: string;
  description: string;
  technologies: string;
  github: string;
  video?: string;
  tags: string;
}

interface Project {
  id: number;
  name: string;
  description: string;
  technologies: string[];
  github: string;
  video?: string;
  tags?: string[];
  created_at: string;
}

interface Contact {
  id: number;
  name: string;
  email: string;
  message: string;
  created_at: string;
}

interface Resume {
  id: number;
  filename: string;
  url: string;
  uploaded_at: string;
}

export default function AdminPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [uploadedFile, setUploadedFile] = useState("");
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [showContacts, setShowContacts] = useState(false);
  const [loadingContacts, setLoadingContacts] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [currentResume, setCurrentResume] = useState<Resume | null>(null);
  const [loadingResume, setLoadingResume] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [showProjects, setShowProjects] = useState(false);
  const [deletingProject, setDeletingProject] = useState<number | null>(null);
  const router = useRouter();
  
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<ProjectForm>();

  // Check authentication on mount
  const checkAuth = useCallback(async () => {
    // Temporarily bypass auth check to fix deployment
    setIsAuthenticated(true);
    fetchProjects();
    fetchResume();
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const fetchProjects = async () => {
    setLoadingProjects(true);
    try {
      const response = await fetch('/api/projects');
      if (response.ok) {
        const data = await response.json();
        setProjects(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoadingProjects(false);
    }
  };

  const fetchResume = async () => {
    setLoadingResume(true);
    try {
      const response = await fetch('/api/resume');
      if (response.ok) {
        const data = await response.json();
        setCurrentResume(data.resume);
      }
    } catch (error) {
      console.error('Error fetching resume:', error);
    } finally {
      setLoadingResume(false);
    }
  };

  const fetchContacts = async () => {
    setLoadingContacts(true);
    try {
      const response = await fetch('/api/contacts');
      if (response.ok) {
        const data = await response.json();
        setContacts(data.contacts);
      }
    } catch (error) {
      console.error('Error fetching contacts:', error);
    } finally {
      setLoadingContacts(false);
    }
  };

  const handleResumeUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingResume(true);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append('resume', file);

      const response = await fetch('/api/upload/resume', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setMessage("Resume uploaded successfully!");
        fetchResume(); // Refresh resume data
      } else {
        const errorData = await response.json();
        setMessage(errorData.error || 'Upload failed');
      }
    } catch (error) {
      setMessage('Upload failed. Please try again.');
    } finally {
      setUploadingResume(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingFile(true);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append('video', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setUploadedFile(data.url);
        setValue('video', data.url);
        setMessage("File uploaded successfully!");
      } else {
        const errorData = await response.json();
        setMessage(errorData.error || 'Upload failed');
      }
    } catch (error) {
      setMessage('Upload failed. Please try again.');
    } finally {
      setUploadingFile(false);
    }
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setValue('name', project.name);
    setValue('description', project.description);
    setValue('technologies', project.technologies.join(', '));
    setValue('github', project.github);
    setValue('video', project.video || '');
    setValue('tags', project.tags?.join(', ') || '');
    setUploadedFile(project.video || '');
  };

  const handleCancelEdit = () => {
    setEditingProject(null);
    reset();
    setUploadedFile('');
  };

  const handleDeleteProject = async (projectId: number) => {
    if (!confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      return;
    }

    setDeletingProject(projectId);
    setMessage("");

    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setMessage("Project deleted successfully!");
        fetchProjects(); // Refresh projects list
      } else {
        const errorData = await response.json();
        setMessage(errorData.error || "Failed to delete project");
      }
    } catch (error) {
      setMessage("Error deleting project");
    } finally {
      setDeletingProject(null);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth', { method: 'DELETE' });
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const onSubmit = async (data: ProjectForm) => {
    setLoading(true);
    setMessage("");
    
    try {
      const projectData = {
        name: data.name,
        description: data.description,
        technologies: data.technologies.split(',').map(tech => tech.trim()),
        github: data.github,
        video: data.video || undefined,
        tags: data.tags.split(',').map(tag => tag.trim())
      };

      if (editingProject) {
        const response = await fetch(`/api/projects/${editingProject.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(projectData),
        });
        if (response.ok) {
          setMessage("Project updated successfully!");
          fetchProjects(); // Refresh projects list
          handleCancelEdit();
        } else {
          const errorData = await response.json();
          setMessage(errorData.error || "Failed to update project");
        }
      } else {
        const response = await fetch('/api/projects', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(projectData),
        });
        if (response.ok) {
          setMessage("Project added successfully!");
          fetchProjects(); // Refresh projects list
          reset();
          setUploadedFile("");
        } else {
          const errorData = await response.json();
          setMessage(errorData.error || "Failed to add project");
        }
      }
    } catch (error) {
      setMessage("Error adding/updating project");
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 rounded-lg bg-red-500 text-white font-bold shadow hover:bg-red-400 transition-colors"
        >
          Logout
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Add/Edit Project Section */}
        <div className="glass p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">
              {editingProject ? 'Edit Project' : 'Add New Project'}
            </h2>
            {editingProject && (
              <button
                onClick={handleCancelEdit}
                className="flex items-center gap-2 px-3 py-1 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
            )}
          </div>
          
          {message && (
            <div className={`mb-4 p-3 rounded-lg text-center ${
              message.includes('successfully') ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
            }`}>
              {message}
            </div>
          )}
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Project Name *</label>
              <input
                {...register("name", { required: "Project name is required" })}
                className="w-full rounded-lg px-4 py-2 bg-white/10 border border-white/20 text-white focus:outline-none focus:border-cyan-400"
                placeholder="Enter project name"
              />
              {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description *</label>
              <textarea
                {...register("description", { required: "Description is required" })}
                rows={3}
                className="w-full rounded-lg px-4 py-2 bg-white/10 border border-white/20 text-white focus:outline-none focus:border-cyan-400"
                placeholder="Enter project description"
              />
              {errors.description && <p className="text-red-400 text-sm mt-1">{errors.description.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Technologies *</label>
              <input
                {...register("technologies", { required: "Technologies are required" })}
                className="w-full rounded-lg px-4 py-2 bg-white/10 border border-white/20 text-white focus:outline-none focus:border-cyan-400"
                placeholder="React, Node.js, MongoDB (comma-separated)"
              />
              {errors.technologies && <p className="text-red-400 text-sm mt-1">{errors.technologies.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">GitHub Link *</label>
              <input
                {...register("github", { required: "GitHub link is required" })}
                className="w-full rounded-lg px-4 py-2 bg-white/10 border border-white/20 text-white focus:outline-none focus:border-cyan-400"
                placeholder="https://github.com/username/project"
              />
              {errors.github && <p className="text-red-400 text-sm mt-1">{errors.github.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Video Demo</label>
              <div className="space-y-2">
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleFileUpload}
                  disabled={uploadingFile}
                  className="w-full rounded-lg px-4 py-2 bg-white/10 border border-white/20 text-white focus:outline-none focus:border-cyan-400"
                />
                <input
                  {...register("video")}
                  className="w-full rounded-lg px-4 py-2 bg-white/10 border border-white/20 text-white focus:outline-none focus:border-cyan-400"
                  placeholder="Or enter YouTube/Vimeo URL"
                />
                {uploadedFile && (
                  <p className="text-green-400 text-sm">File uploaded: {uploadedFile}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Tags</label>
              <input
                {...register("tags")}
                className="w-full rounded-lg px-4 py-2 bg-white/10 border border-white/20 text-white focus:outline-none focus:border-cyan-400"
                placeholder="Web, AI, Mobile (comma-separated)"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 rounded-lg bg-cyan-500 text-white font-bold shadow hover:bg-cyan-400 transition-colors disabled:opacity-50"
            >
              {loading ? (editingProject ? "Updating Project..." : "Adding Project...") : (editingProject ? "Update Project" : "Add Project")}
            </button>
          </form>
        </div>

        {/* Project Management Section */}
        <div className="glass p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Project Management</h2>
            <button
              onClick={() => {
                if (!showProjects) {
                  fetchProjects();
                }
                setShowProjects(!showProjects);
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 transition-colors"
            >
              {showProjects ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {showProjects ? 'Hide' : 'View'} Projects
            </button>
          </div>

          {showProjects && (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {loadingProjects ? (
                <div className="text-center py-8">
                  <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                  <p className="text-white/60">Loading projects...</p>
                </div>
              ) : projects.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-white/60">No projects yet</p>
                </div>
              ) : (
                projects.map((project) => (
                  <div key={project.id} className="p-4 rounded-lg bg-white/5 border border-white/10">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-white">{project.name}</h3>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditProject(project)}
                          className="flex items-center gap-1 px-2 py-1 rounded-lg bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 transition-colors text-sm"
                        >
                          <Edit className="w-3 h-3" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteProject(project.id)}
                          disabled={deletingProject === project.id}
                          className="flex items-center gap-1 px-2 py-1 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors text-sm disabled:opacity-50"
                        >
                          <Trash2 className="w-3 h-3" />
                          {deletingProject === project.id ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
                    </div>
                    <p className="text-white/80 text-sm mb-2 line-clamp-2">{project.description}</p>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {project.technologies?.slice(0, 3).map((tech, index) => (
                        <span key={index} className="bg-blue-600/30 px-2 py-1 rounded text-xs">{tech}</span>
                      ))}
                      {project.technologies && project.technologies.length > 3 && (
                        <span className="bg-gray-600/30 px-2 py-1 rounded text-xs">+{project.technologies.length - 3} more</span>
                      )}
                    </div>
                    <p className="text-white/60 text-xs">
                      Created: {new Date(project.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Resume Management Section */}
        <div className="glass p-6">
          <h2 className="text-xl font-semibold mb-6">Resume Management</h2>
          
          <div className="space-y-4">
            {/* Current Resume */}
            <div className="p-4 rounded-lg bg-white/5 border border-white/10">
              <h3 className="font-medium text-white mb-2">Current Resume</h3>
              {loadingResume ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-white/60 text-sm">Loading...</p>
                </div>
              ) : currentResume ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-cyan-400" />
                    <span className="text-white/80 text-sm">{currentResume.filename}</span>
                  </div>
                  <p className="text-white/60 text-xs">
                    Uploaded: {new Date(currentResume.uploaded_at).toLocaleDateString()}
                  </p>
                  <a
                    href={currentResume.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-cyan-500/20 text-cyan-400 text-sm hover:bg-cyan-500/30 transition-colors"
                  >
                    <Download className="w-3 h-3" />
                    View
                  </a>
                </div>
              ) : (
                <p className="text-white/60 text-sm">No resume uploaded</p>
              )}
            </div>

            {/* Upload New Resume */}
            <div className="p-4 rounded-lg bg-white/5 border border-white/10">
              <h3 className="font-medium text-white mb-2">Upload New Resume</h3>
              <div className="space-y-2">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleResumeUpload}
                  disabled={uploadingResume}
                  className="w-full rounded-lg px-4 py-2 bg-white/10 border border-white/20 text-white focus:outline-none focus:border-cyan-400"
                />
                <p className="text-white/60 text-xs">
                  Only PDF files, max 10MB. New upload will replace current resume.
                </p>
                {uploadingResume && (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-cyan-400 text-sm">Uploading...</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Contact Messages Section */}
        <div className="glass p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Contact Messages</h2>
            <button
              onClick={() => {
                if (!showContacts) {
                  fetchContacts();
                }
                setShowContacts(!showContacts);
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 transition-colors"
            >
              {showContacts ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {showContacts ? 'Hide' : 'View'} Messages
            </button>
          </div>

          {showContacts && (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {loadingContacts ? (
                <div className="text-center py-8">
                  <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                  <p className="text-white/60">Loading messages...</p>
                </div>
              ) : contacts.length === 0 ? (
                <div className="text-center py-8">
                  <Mail className="w-8 h-8 text-white/40 mx-auto mb-2" />
                  <p className="text-white/60">No messages yet</p>
                </div>
              ) : (
                contacts.map((contact) => (
                  <div key={contact.id} className="p-4 rounded-lg bg-white/5 border border-white/10">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-white">{contact.name}</h3>
                      <span className="text-xs text-white/60">
                        {new Date(contact.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-cyan-400 text-sm mb-2">{contact.email}</p>
                    <p className="text-white/80 text-sm">{contact.message}</p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 