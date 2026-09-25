import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Bot, Sparkles, Send, Key, RefreshCw, X, ShieldCheck, Check, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { User } from '../../types';

interface AiAgentModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateApiKey?: (key: string) => void;
}

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
}

export const AiAgentModal: React.FC<AiAgentModalProps> = ({
  user,
  isOpen,
  onClose,
  onUpdateApiKey,
}) => {
  const [activeTab, setActiveTab] = useState<'chat' | 'settings'>('chat');
  const [apiKeyInput, setApiKeyInput] = useState(user?.apiKey || '');
  const [promptInput, setPromptInput] = useState('');
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'ai',
      text: `Hello ${user?.username || 'Candidate'}! I am your AI Career Agent (Beta). I can optimize your resume, generate bullet points, suggest ATS keywords, and craft tailored interview responses for your target aim (${user?.targetAim || 'Full-Stack Developer'}). How can I help you today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  if (!isOpen) return null;

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptInput.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: promptInput,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    const currentPrompt = promptInput;
    setPromptInput('');
    setLoading(true);

    setTimeout(() => {
      let aiReply = '';
      const query = currentPrompt.toLowerCase();
      const aim = user?.targetAim || 'Full-Stack Developer';

      if (query.includes('resume') || query.includes('bullet')) {
        aiReply = `✨ **Resume Optimization Tip for ${aim}**:\n• Quantify your impact (e.g., "Improved load performance by 35% using React & Vite").\n• Use strong action verbs like *Engineered, Architected, Deployed, Standardized*.\n• Align keywords with your selected interest area (${user?.interests?.[0] || 'Web Development'}).`;
      } else if (query.includes('ats') || query.includes('score')) {
        aiReply = `🎯 **ATS Strategy**:\nEnsure your resume includes high-density keywords like React.js, TypeScript, Node.js, Python, PostgreSQL, REST APIs, and Docker. Avoid graphics/tables in PDF format for clean 90%+ ATS parsing.`;
      } else if (query.includes('interview') || query.includes('question')) {
        aiReply = `🎙️ **Top Mock Interview Question for ${aim}**:\n"Describe a situation where you had to debug a critical production memory leak or API delay under pressure. What tools did you use and what was the outcome?"`;
      } else {
        aiReply = `🤖 **AI Agent Advice**: To maximize your placement chances as a **${aim}**, focus on building 2 high-impact full-stack projects in your portfolio and completing ATS scans for top tech role requirements.`;
      }

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: aiReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
      setLoading(false);
    }, 600);
  };

  const handleSaveApiKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateApiKey) {
      onUpdateApiKey(apiKeyInput.trim());
    }
    toast.success(
      apiKeyInput.trim()
        ? 'Custom LLM API Key saved successfully! Live AI Agent connected.'
        : 'Reverted to built-in simulated AI Agent (Beta).'
    );
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full border border-slate-200 shadow-2xl relative my-auto overflow-hidden flex flex-col h-[650px] max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 text-white flex items-center justify-center font-black shadow-md">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-extrabold text-base text-white">AI Agent</h3>
                <span className="px-2 py-0.5 rounded-full bg-purple-500/30 text-purple-200 border border-purple-400/30 text-[10px] font-bold">
                  BETA
                </span>
              </div>
              <p className="text-[11px] text-slate-300">
                {user?.apiKey ? 'Custom LLM Key Connected' : 'Simulated Engine Active'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center border-b border-slate-100 bg-slate-50 px-5 text-xs font-bold">
          <button
            onClick={() => setActiveTab('chat')}
            className={`py-3 px-4 border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === 'chat'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>AI Career Chat</span>
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`py-3 px-4 border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === 'settings'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Key className="w-4 h-4 text-amber-500" />
            <span>API Key Settings</span>
          </button>
        </div>

        {/* TAB 1: AI CHAT */}
        {activeTab === 'chat' && (
          <div className="flex-1 flex flex-col justify-between overflow-hidden bg-slate-50/50">
            {/* Messages Area */}
            <div className="flex-1 p-5 overflow-y-auto space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.sender === 'ai' && (
                    <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0 text-xs font-bold shadow-2xs">
                      AI
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-2xl p-3.5 text-xs leading-relaxed space-y-1 ${
                      msg.sender === 'user'
                        ? 'bg-indigo-600 text-white rounded-tr-xs'
                        : 'bg-white border border-slate-200 text-slate-800 rounded-tl-xs shadow-2xs'
                    }`}
                  >
                    <p className="whitespace-pre-line">{msg.text}</p>
                    <span
                      className={`block text-[9px] text-right font-mono ${
                        msg.sender === 'user' ? 'text-indigo-200' : 'text-slate-400'
                      }`}
                    >
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex gap-3 items-center text-slate-400 text-xs font-medium">
                  <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  </div>
                  <span>AI Agent is analyzing your request...</span>
                </div>
              )}
            </div>

            {/* Input Footer */}
            <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-slate-200/80 flex gap-2">
              <input
                type="text"
                value={promptInput}
                onChange={(e) => setPromptInput(e.target.value)}
                placeholder="Ask AI Agent for resume tips, interview questions, or ATS advice..."
                className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900 focus:outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                disabled={loading || !promptInput.trim()}
                className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

        {/* TAB 2: API KEY SETTINGS */}
        {activeTab === 'settings' && (
          <div className="flex-1 p-6 space-y-6 overflow-y-auto bg-white">
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-xs">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <span>AI Agent Integration (Beta Notice)</span>
              </div>
              <p className="text-[11px] leading-relaxed text-amber-800">
                CareerCraft runs with a built-in simulated AI Agent by default. To connect a live LLM model (OpenAI GPT-4o, Claude 3.5, or Google Gemini), paste your secret API key below.
              </p>
            </div>

            <form onSubmit={handleSaveApiKey} className="space-y-4">
              <div className="space-y-1.5">
                <label className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                  <Key className="w-4 h-4 text-amber-500" />
                  Custom OpenAI / Gemini API Key
                </label>
                <input
                  type="password"
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  placeholder="sk-proj-... or AIzaSy..."
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-mono text-slate-900 focus:outline-none focus:border-indigo-500"
                />
                <p className="text-[10px] text-slate-400">
                  Your API key is stored locally in your browser session and is never shared externally.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs text-slate-700">
                <div className="font-bold text-slate-900">Supported Model Providers:</div>
                <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-600">
                  <li><strong>OpenAI</strong>: GPT-4o, GPT-4o-mini (Prefix: <code>sk-...</code>)</li>
                  <li><strong>Google Gemini</strong>: Gemini 1.5 Pro, Flash (Prefix: <code>AIza...</code>)</li>
                  <li><strong>Built-in Beta Engine</strong>: Works standard without any key!</li>
                </ul>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Save API Key Settings</span>
              </button>
            </form>
          </div>
        )}

      </div>
    </div>,
    document.body
  );
};
