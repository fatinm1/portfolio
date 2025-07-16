import React from "react";

export default function SkillsPage() {
  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Skills</h1>
      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2">
        {/* Example skill card */}
        <div className="glass p-6">
          <h2 className="font-semibold text-xl mb-2">Languages</h2>
          <div className="mb-4">
            <div className="flex justify-between mb-1">
              <span>Python</span>
              <span>4 years</span>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full">
              <div className="h-2 bg-cyan-400 rounded-full w-4/5" />
            </div>
          </div>
          <div className="mb-4">
            <div className="flex justify-between mb-1">
              <span>C++</span>
              <span>3 years</span>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full">
              <div className="h-2 bg-blue-400 rounded-full w-3/5" />
            </div>
          </div>
        </div>
        <div className="glass p-6">
          <h2 className="font-semibold text-xl mb-2">Frameworks</h2>
          <div className="mb-4">
            <div className="flex justify-between mb-1">
              <span>React</span>
              <span>2 years</span>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full">
              <div className="h-2 bg-purple-400 rounded-full w-2/5" />
            </div>
          </div>
          <div className="mb-4">
            <div className="flex justify-between mb-1">
              <span>TensorFlow</span>
              <span>2.5 years</span>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full">
              <div className="h-2 bg-pink-400 rounded-full w-1/2" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 