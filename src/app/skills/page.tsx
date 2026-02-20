import React from "react";

export default function SkillsPage() {
  const skills = {
    programming: [
      { name: "Python", years: 4, color: "bg-cyan-400" },
      { name: "C++", years: 3, color: "bg-blue-400" },
      { name: "Java", years: 2, color: "bg-orange-400" },
      { name: "JavaScript", years: 2, color: "bg-yellow-400" },
      { name: "TypeScript", years: 2, color: "bg-blue-500" },
      { name: "React", years: 2, color: "bg-purple-400" },
      { name: "C", years: 1, color: "bg-gray-400" },
      { name: "HTML", years: 2, color: "bg-red-400" },
      { name: "CSS", years: 2, color: "bg-pink-400" },
      { name: "UI/UX Principles", years: 2, color: "bg-indigo-400" }
    ],
    softwareTools: [
      { name: "Git", years: 3, color: "bg-orange-500" },
      { name: "Figma", years: 2, color: "bg-purple-500" },
      { name: "Jira", years: 1, color: "bg-blue-600" },
      { name: "Visual Studio Code", years: 3, color: "bg-blue-400" },
      { name: "PyCharm", years: 2, color: "bg-green-400" },
      { name: "Fusion 360", years: 1, color: "bg-blue-300" },
      { name: "ArcGIS", years: 1, color: "bg-green-500" },
      { name: "ChatGPT", years: 2, color: "bg-green-600" },
      { name: "Claude", years: 1, color: "bg-orange-600" }
    ],
    frameworks: [
      { name: "Django", years: 2, color: "bg-green-700" },
      { name: "Flask", years: 2, color: "bg-gray-500" },
      { name: "FastAPI", years: 1, color: "bg-green-500" },
      { name: "LangChain", years: 2, color: "bg-blue-600" },
      { name: "LLaMA", years: 1, color: "bg-purple-600" },
      { name: "OpenAI", years: 2, color: "bg-green-600" }
    ],
    databasesDevOps: [
      { name: "MySQL", years: 2, color: "bg-blue-500" },
      { name: "Oracle Database", years: 1, color: "bg-red-500" },
      { name: "PostgreSQL", years: 1, color: "bg-blue-600" },
      { name: "GitHub Actions", years: 1, color: "bg-purple-500" },
      { name: "Docker", years: 1, color: "bg-blue-400" },
      { name: "Jenkins", years: 1, color: "bg-red-600" }
    ]
  };

  const getProgressWidth = (years: number) => {
    const maxYears = 4;
    return `${(years / maxYears) * 100}%`;
  };

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-medium mb-8 text-center">Skills & Experience</h1>
      <div className="grid gap-8 grid-cols-1 lg:grid-cols-2">
        {/* Programming Languages */}
        <div className="bg-white/5 border border-white/10 p-6 rounded-xl">
          <h2 className="font-medium text-xl mb-4 text-[#C8FF00]">Programming Languages</h2>
          <div className="space-y-4">
            {skills.programming.map((skill, index) => (
              <div key={index} className="mb-4">
                <div className="flex justify-between mb-1">
                  <span className="text-white/90">{skill.name}</span>
                  <span className="text-[#C8FF00] font-medium">{skill.years} years</span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full">
                  <div 
                    className={`h-2 ${skill.color} rounded-full transition-all duration-300`}
                    style={{ width: getProgressWidth(skill.years) }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Software & Tools */}
        <div className="bg-white/5 border border-white/10 p-6 rounded-xl">
          <h2 className="font-medium text-xl mb-4 text-[#C8FF00]">Software & Tools</h2>
          <div className="space-y-4">
            {skills.softwareTools.map((skill, index) => (
              <div key={index} className="mb-4">
                <div className="flex justify-between mb-1">
                  <span className="text-white/90">{skill.name}</span>
                  <span className="text-[#C8FF00] font-medium">{skill.years} years</span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full">
                  <div 
                    className={`h-2 ${skill.color} rounded-full transition-all duration-300`}
                    style={{ width: getProgressWidth(skill.years) }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Frameworks & Libraries */}
        <div className="bg-white/5 border border-white/10 p-6 rounded-xl">
          <h2 className="font-medium text-xl mb-4 text-[#C8FF00]">Frameworks & Libraries</h2>
          <div className="space-y-4">
            {skills.frameworks.map((skill, index) => (
              <div key={index} className="mb-4">
                <div className="flex justify-between mb-1">
                  <span className="text-white/90">{skill.name}</span>
                  <span className="text-[#C8FF00] font-medium">{skill.years} years</span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full">
                  <div 
                    className={`h-2 ${skill.color} rounded-full transition-all duration-300`}
                    style={{ width: getProgressWidth(skill.years) }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Databases & DevOps */}
        <div className="bg-white/5 border border-white/10 p-6 rounded-xl">
          <h2 className="font-medium text-xl mb-4 text-[#C8FF00]">Databases & DevOps</h2>
          <div className="space-y-4">
            {skills.databasesDevOps.map((skill, index) => (
              <div key={index} className="mb-4">
                <div className="flex justify-between mb-1">
                  <span className="text-white/90">{skill.name}</span>
                  <span className="text-[#C8FF00] font-medium">{skill.years} years</span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full">
                  <div 
                    className={`h-2 ${skill.color} rounded-full transition-all duration-300`}
                    style={{ width: getProgressWidth(skill.years) }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 