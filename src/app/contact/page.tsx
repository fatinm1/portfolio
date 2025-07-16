"use client";
import React, { useState, useEffect } from "react";
import { Mail, Github, Linkedin, Download, Send, CheckCircle, AlertCircle } from "lucide-react";

interface ContactForm {
  name: string;
  email: string;
  message: string;
}

interface Resume {
  id: number;
  filename: string;
  url: string;
  uploaded_at: string;
}

export default function ContactPage() {
  const [formData, setFormData] = useState<ContactForm>({
    name: '',
    email: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [resume, setResume] = useState<Resume | null>(null);
  const [loadingResume, setLoadingResume] = useState(true);

  useEffect(() => {
    fetchResume();
  }, []);

  const fetchResume = async () => {
    try {
      const response = await fetch('/api/resume');
      if (response.ok) {
        const data = await response.json();
        setResume(data.resume);
      }
    } catch (error) {
      console.error('Error fetching resume:', error);
    } finally {
      setLoadingResume(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setFormData({ name: '', email: '', message: '' });
        // Reset success message after 5 seconds
        setTimeout(() => setSuccess(false), 5000);
      } else {
        setError(data.error || 'Failed to send message');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResumeDownload = () => {
    if (resume) {
      // Create a temporary link and trigger download
      const link = document.createElement('a');
      link.href = resume.url;
      link.download = resume.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Contact Me</h1>
      
      <div className="glass p-8">
        {/* Contact Information */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-6 text-center">Get In Touch</h2>
          <div className="space-y-4">
            <a 
              href="mailto:fatinm1@umbc.edu" 
              className="flex items-center gap-3 p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
            >
              <Mail className="w-5 h-5 text-cyan-400" />
              <div>
                <p className="font-medium text-white">Email</p>
                <p className="text-cyan-400">fatinm1@umbc.edu</p>
              </div>
            </a>
            
            <a 
              href="https://www.linkedin.com/in/fatin-mojumder/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
            >
              <Linkedin className="w-5 h-5 text-cyan-400" />
              <div>
                <p className="font-medium text-white">LinkedIn</p>
                <p className="text-cyan-400">linkedin.com/in/fatin-mojumder</p>
              </div>
            </a>
            
            <a 
              href="https://github.com/fatinm1" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
            >
              <Github className="w-5 h-5 text-cyan-400" />
              <div>
                <p className="font-medium text-white">GitHub</p>
                <p className="text-cyan-400">github.com/fatinm1</p>
              </div>
            </a>
          </div>
        </div>

        {/* Contact Form */}
        <div className="border-t border-white/20 pt-8">
          <h3 className="text-lg font-semibold mb-4">Send a Message</h3>
          
          {success && (
            <div className="mb-4 p-4 rounded-lg bg-green-500/20 border border-green-500/30 flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <p className="text-green-400">Thank you for your message! I'll get back to you soon.</p>
            </div>
          )}

          {error && (
            <div className="mb-4 p-4 rounded-lg bg-red-500/20 border border-red-500/30 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <p className="text-red-400">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Name *</label>
              <input 
                type="text" 
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Your name" 
                className="w-full rounded-lg px-4 py-2 bg-white/10 border border-white/20 text-white focus:outline-none focus:border-cyan-400 transition-colors" 
                required
                disabled={loading}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Email *</label>
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="your@email.com" 
                className="w-full rounded-lg px-4 py-2 bg-white/10 border border-white/20 text-white focus:outline-none focus:border-cyan-400 transition-colors" 
                required
                disabled={loading}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Message *</label>
              <textarea 
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Your message..." 
                className="w-full rounded-lg px-4 py-2 bg-white/10 border border-white/20 text-white focus:outline-none focus:border-cyan-400 transition-colors resize-none" 
                rows={4} 
                required
                disabled={loading}
              />
            </div>
            
            <button 
              type="submit"
              disabled={loading || !formData.name || !formData.email || !formData.message}
              className="w-full px-6 py-3 rounded-lg bg-cyan-500 text-white font-bold shadow hover:bg-cyan-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2" 
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Send Message
                </>
              )}
            </button>
          </form>
        </div>

        {/* Resume Section */}
        <div className="border-t border-white/20 pt-8 mt-8">
          <h3 className="text-lg font-semibold mb-4">Resume</h3>
          <div className="flex items-center gap-3 p-4 rounded-lg bg-white/5 border border-white/10">
            <Download className="w-5 h-5 text-cyan-400" />
            <div className="flex-1">
              {loadingResume ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-white/60">Loading resume...</p>
                </div>
              ) : resume ? (
                <div>
                  <p className="font-medium text-white">Resume</p>
                  <p className="text-white/60 text-sm">
                    Updated: {new Date(resume.uploaded_at).toLocaleDateString()}
                  </p>
                </div>
              ) : (
                <div>
                  <p className="font-medium text-white">Resume</p>
                  <p className="text-white/60 text-sm">No resume uploaded yet</p>
                </div>
              )}
            </div>
            {resume && (
              <button 
                onClick={handleResumeDownload}
                className="px-4 py-2 rounded-lg bg-cyan-500 text-white text-sm hover:bg-cyan-400 transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 