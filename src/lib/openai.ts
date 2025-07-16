import OpenAI from 'openai';
import { getProjects } from './database';

// Only create OpenAI client if API key is available
const createOpenAIClient = () => {
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key_here') {
    return null;
  }
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
};

const openai = createOpenAIClient();

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export class ChatbotService {
  private static async getSystemPrompt(): Promise<string> {
    try {
      const projects = await getProjects();
      
      const projectsContext = projects.length > 0 
        ? projects.map(p => `- ${p.name}: ${p.description} (Technologies: ${p.technologies.join(', ')})`).join('\n')
        : 'No projects available yet.';

      return `You are Fatin Mojumder's AI assistant. You help people learn about Fatin and his work.

FATIN'S PROFILE:
- Name: Fatin Mojumder
- Title: Senior CS Major at UMBC
- Tagline: "Building smart systems for real-world impact"
- Key Skills: Python (4 years), C++ (3 years), React (2 years), TensorFlow (2.5 years), Machine Learning, Web Development
- Interests: AI/ML, Software Engineering, Problem Solving
- Goals: Building smart systems that make real-world impact, particularly interested in AI/ML applications

FATIN'S PROJECTS:
${projectsContext}

INSTRUCTIONS:
1. Be helpful, friendly, and professional
2. Answer questions about Fatin's skills, experience, projects, and goals
3. If asked about specific projects, provide details from the project list
4. If asked about skills, mention both technical skills and years of experience
5. If asked about contact info, direct them to the Contact page
6. If asked about resume, mention he's a Senior CS Major at UMBC and direct them to contact him
7. Keep responses concise but informative
8. If you don't know something specific, say so and suggest they contact Fatin directly

Remember: You're representing Fatin professionally, so be enthusiastic about his work and skills!`;
    } catch (error) {
      console.error('Error getting projects for context:', error);
      return `You are Fatin Mojumder's AI assistant. Fatin is a Senior CS Major at UMBC passionate about building smart systems for real-world impact.`;
    }
  }

  static async generateResponse(userMessage: string, conversationHistory: ChatMessage[] = []): Promise<string> {
    try {
      // If no OpenAI client is available, use fallback immediately
      if (!openai) {
        return this.getFallbackResponse(userMessage);
      }

      const systemPrompt = await this.getSystemPrompt();
      
      const messages: ChatMessage[] = [
        { role: 'system', content: systemPrompt },
        ...conversationHistory,
        { role: 'user', content: userMessage }
      ];

      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: messages as any,
        max_tokens: 300,
        temperature: 0.7,
        presence_penalty: 0.1,
        frequency_penalty: 0.1,
      });

      return completion.choices[0]?.message?.content || 'Sorry, I couldn\'t generate a response right now.';
    } catch (error) {
      console.error('OpenAI API error:', error);
      
      // Fallback to keyword-based responses if OpenAI fails
      return this.getFallbackResponse(userMessage);
    }
  }

  private static async getFallbackResponse(userMessage: string): Promise<string> {
    const lowerMessage = userMessage.toLowerCase();
    
    try {
      const projects = await getProjects();
      
      if (lowerMessage.includes('who') && lowerMessage.includes('fatin')) {
        return `Fatin Mojumder is a Senior CS Major at UMBC. He's passionate about building smart systems for real-world impact, with expertise in AI/ML, software engineering, and web development.`;
      }
      
      if (lowerMessage.includes('skill') || lowerMessage.includes('technology')) {
        return `Fatin's key skills include Python (4 years), C++ (3 years), React (2 years), TensorFlow (2.5 years), Machine Learning, and Web Development. He's particularly strong in AI/ML and software engineering.`;
      }
      
      if (lowerMessage.includes('project')) {
        if (projects.length === 0) {
          return `Fatin is currently working on building his project portfolio. Check back soon for updates!`;
        }
        const projectNames = projects.map((p: any) => p.name).join(', ');
        return `Fatin has worked on several projects including: ${projectNames}. You can find more details about each project on the Projects page.`;
      }
      
      if (lowerMessage.includes('resume') || lowerMessage.includes('experience')) {
        return `Fatin is a Senior CS Major at UMBC with a strong foundation in computer science and practical experience in software development. You can contact him for his full resume.`;
      }
      
      if (lowerMessage.includes('contact') || lowerMessage.includes('email')) {
        return `You can reach Fatin through the Contact page on this website, or connect with him on LinkedIn and GitHub.`;
      }
      
      if (lowerMessage.includes('goal') || lowerMessage.includes('future')) {
        return `Fatin is focused on building smart systems that make a real-world impact. He's particularly interested in AI/ML applications and software engineering challenges.`;
      }

      return `I'm Fatin's AI assistant! I can help you learn about Fatin's skills, projects, experience, and goals. Feel free to ask me anything about him or his work.`;
    } catch (error) {
      return `I'm Fatin's AI assistant! I can help you learn about Fatin's skills, projects, experience, and goals. Feel free to ask me anything about him or his work.`;
    }
  }
} 