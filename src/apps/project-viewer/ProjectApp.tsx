import { useState } from 'react';
import { projectData } from '../../content';

interface ProjectAppProps {
  windowId: string;
  projectId?: string;
}

export function ProjectApp({ windowId: _windowId, projectId }: ProjectAppProps) {
  const [activeTab, setActiveTab] = useState<'info' | 'preview'>('info');
  const project = projectData.find(p => p.id === projectId);

  if (!project) {
    return (
      <div className="flex w-full h-full bg-white items-center justify-center text-black font-['Tahoma'] p-4">
        <div className="flex flex-col items-center max-w-sm text-center">
          <span className="text-4xl mb-4">❌</span>
          <h2 className="font-bold text-lg text-red-600 mb-2">Project Not Found</h2>
          <p className="text-sm">The requested project '{projectId}' could not be located in the content registry.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full bg-[#ece9d8] font-['Tahoma'] text-black select-none">
      {/* Header */}
      <div className="flex items-center p-3 border-b border-[#a0a0a0] bg-gradient-to-b from-[#ffffff] to-[#d4d0c8]">
        <img src={project.icon} alt={project.name} className="w-10 h-10 mr-4 drop-shadow-md" />
        <div className="flex-1">
          <h2 className="text-xl font-bold leading-tight">{project.name}</h2>
          <p className="text-xs text-gray-600 mt-[2px]">{project.shortDescription}</p>
        </div>
        <div className="ml-4 flex flex-col space-y-1 items-end">
           {project.status && (
              <span className={`text-[10px] uppercase font-bold px-2 py-[2px] rounded border ${project.status === 'deployed' ? 'bg-green-100 text-green-700 border-green-300' : 'bg-yellow-100 text-yellow-700 border-yellow-300'}`}>
                {project.status}
              </span>
           )}
           {project.deploymentUrl && (
             <button 
               onClick={() => window.open(project.deploymentUrl, '_blank', 'noopener,noreferrer')}
               className="px-3 py-1 bg-[#ece9d8] border border-[#716f64] rounded hover:bg-[#c1d2ee] active:bg-[#98b4e2] text-xs font-bold shadow-[1px_1px_0_white_inset]"
             >
               Launch App ↗
             </button>
           )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex px-2 pt-2 bg-[#ece9d8] border-b border-[#a0a0a0]">
        <button 
          onClick={() => setActiveTab('info')}
          className={`px-4 py-1 text-xs border border-[#a0a0a0] border-b-0 rounded-t-sm bg-white font-bold relative top-[1px] ${activeTab === 'info' ? 'z-10' : 'bg-[#ece9d8] text-gray-600 hover:bg-[#f5f4ea] z-0 top-[2px] h-[22px]'}`}
        >
          Project Details
        </button>
        <button 
          onClick={() => setActiveTab('preview')}
          className={`px-4 py-1 text-xs border border-[#a0a0a0] border-b-0 rounded-t-sm bg-white font-bold relative top-[1px] ml-1 ${activeTab === 'preview' ? 'z-10' : 'bg-[#ece9d8] text-gray-600 hover:bg-[#f5f4ea] z-0 top-[2px] h-[22px]'}`}
        >
          Preview / App
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 bg-white relative overflow-auto">
        {activeTab === 'info' && (
          <div className="p-6">
            <h3 className="font-bold text-[#003399] border-b border-[#0ea0ed] pb-1 mb-4">About {project.name}</h3>
            <p className="text-sm mb-6 leading-relaxed whitespace-pre-line">{project.longDescription}</p>

            <h3 className="font-bold text-[#003399] border-b border-[#0ea0ed] pb-1 mb-4">Technologies</h3>
            <div className="flex flex-wrap gap-2 mb-6">
              {project.techStack.map(tech => (
                <span key={tech} className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-xs">{tech}</span>
              ))}
            </div>

            <h3 className="font-bold text-[#003399] border-b border-[#0ea0ed] pb-1 mb-4">Links</h3>
            <ul className="text-sm space-y-2">
              {project.repoUrl && (
                <li>
                  <span className="font-bold mr-2">Repository:</span>
                  <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{project.repoUrl}</a>
                </li>
              )}
              {project.deploymentUrl && (
                <li>
                  <span className="font-bold mr-2">Live Demo:</span>
                  <a href={project.deploymentUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{project.deploymentUrl}</a>
                </li>
              )}
            </ul>
          </div>
        )}

        {activeTab === 'preview' && (
          <div className="w-full h-full flex flex-col">
            {project.embeddable && project.deploymentUrl ? (
              <iframe 
                src={project.deploymentUrl} 
                className="w-full h-full border-none flex-1"
                title={`${project.name} Application`}
                sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
              />
            ) : (
               <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 p-8 text-center">
                <div className="bg-white border border-gray-300 shadow-md p-8 rounded-lg max-w-md flex flex-col items-center">
                  <span className="text-4xl mb-4">🖥️</span>
                  <h3 className="text-xl font-bold mb-2 text-gray-800">Preview Not Available</h3>
                  <p className="text-sm text-gray-600 mb-6">
                    This project is configured as external-only. It cannot be safely embedded inside this simulated environment due to browser security restrictions or application design.
                  </p>
                  <div className="w-full h-[1px] bg-gray-200 mb-6"></div>
                  {project.deploymentUrl ? (
                    <button 
                      onClick={() => window.open(project.deploymentUrl, '_blank', 'noopener,noreferrer')}
                      className="px-6 py-2 bg-[#0ea0ed] text-white font-bold rounded shadow hover:bg-[#33b8fb] active:bg-[#003399]"
                    >
                      Open Live App ↗
                    </button>
                  ) : (
                    <p className="text-sm font-bold text-gray-500">No deployment URL provided.</p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
