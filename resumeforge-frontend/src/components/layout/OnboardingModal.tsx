import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Sparkles, Target, Compass, CheckCircle2, ArrowRight, Bot, Key, UserCheck, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { User } from '../../types';

interface OnboardingModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onComplete: (updatedUser: User) => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  user,
  isOpen,
  onClose,
  onComplete,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Q&A Answers
  const [role, setRole] = useState(user?.role || 'Fresher / Recent Graduate');
  const [experienceLevel, setExperienceLevel] = useState(user?.experienceLevel || 'Beginner (0-1 yrs)');
  const [targetAim, setTargetAim] = useState(user?.targetAim || 'Full-Stack Developer');
  const [selectedInterests, setSelectedInterests] = useState<string[]>(
    user?.interests && user.interests.length > 0
      ? user.interests
      : ['Web Development', 'Artificial Intelligence']
  );
  const [apiKey, setApiKey] = useState(user?.apiKey || '');

  if (!isOpen) return null;

  const roleOptions = [
    { title: 'Student', desc: 'Currently studying undergrad/postgrad' },
    { title: 'Fresher / Recent Graduate', desc: 'Looking for entry-level opportunities' },
    { title: 'Experienced Professional', desc: 'Looking to level up or switch companies' },
    { title: 'Career Switcher', desc: 'Transitioning from another field into Tech' },
  ];

  const aimOptions = [
    'Full-Stack Developer',
    'Frontend Engineer',
    'Backend Engineer',
    'AI / ML Specialist',
    'Data Scientist',
    'Cloud & DevOps Engineer',
    'UI/UX Designer',
    'Mobile App Developer',
  ];

  const interestOptions = [
    'Web Development',
    'Artificial Intelligence',
    'Cloud & DevOps',
    'Mobile Apps',
    'Data Analytics',
    'Cybersecurity',
    'UI/UX Design',
    'Database Engineering',
  ];

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      if (selectedInterests.length === 1) {
        toast.info('Please select at least one interest.');
        return;
      }
      setSelectedInterests(selectedInterests.filter((i) => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleFinish = () => {
    if (!user) return;
    const updatedUser: User = {
      ...user,
      onboardingCompleted: true,
      role,
      experienceLevel,
      targetAim,
      interests: selectedInterests,
      apiKey: apiKey.trim() || undefined,
    };

    onComplete(updatedUser);
    toast.success(`Welcome aboard! Workspace tailored for ${targetAim}.`);
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full border border-slate-200 shadow-2xl relative my-auto space-y-6 max-h-[90vh] overflow-y-auto">
        
        {/* Step Indicator Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black text-lg shadow-md shadow-indigo-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-heading font-extrabold text-lg text-slate-900">Customize Your Experience</h2>
              <p className="text-xs text-slate-500">Step {step} of 3 • Tell us your career goals</p>
            </div>
          </div>
          
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-full text-xs font-bold text-slate-600">
            <span className={`px-3 py-1 rounded-full transition-all ${step === 1 ? 'bg-indigo-600 text-white shadow-2xs' : ''}`}>1</span>
            <span className={`px-3 py-1 rounded-full transition-all ${step === 2 ? 'bg-indigo-600 text-white shadow-2xs' : ''}`}>2</span>
            <span className={`px-3 py-1 rounded-full transition-all ${step === 3 ? 'bg-indigo-600 text-white shadow-2xs' : ''}`}>3</span>
          </div>
        </div>

        {/* STEP 1: ROLE & EXPERIENCE */}
        {step === 1 && (
          <div className="space-y-5 animate-in fade-in duration-300">
            <div>
              <h3 className="font-heading font-extrabold text-base text-slate-900 flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-indigo-600" />
                What is your current status?
              </h3>
              <p className="text-xs text-slate-500 pt-0.5">Select the option that best describes you.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {roleOptions.map((opt) => {
                const selected = role === opt.title;
                return (
                  <button
                    key={opt.title}
                    type="button"
                    onClick={() => setRole(opt.title)}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                      selected
                        ? 'border-indigo-600 bg-indigo-50/60 shadow-2xs ring-2 ring-indigo-600/20'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900">{opt.title}</span>
                      {selected && <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />}
                    </div>
                    <p className="text-[11px] text-slate-500 pt-1 leading-snug">{opt.desc}</p>
                  </button>
                );
              })}
            </div>

            <div className="space-y-2 pt-2">
              <label className="font-bold text-xs text-slate-700">Experience Level</label>
              <select
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-indigo-500"
              >
                <option value="Beginner (0-1 yrs)">Beginner (0 - 1 years experience)</option>
                <option value="Intermediate (1-3 yrs)">Intermediate (1 - 3 years experience)</option>
                <option value="Advanced (3+ yrs)">Advanced (3+ years experience)</option>
              </select>
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full py-3 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <span>Next: Target Aim & Goals</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STEP 2: TARGET AIM & INTERESTS */}
        {step === 2 && (
          <div className="space-y-5 animate-in fade-in duration-300">
            <div>
              <h3 className="font-heading font-extrabold text-base text-slate-900 flex items-center gap-2">
                <Target className="w-4 h-4 text-indigo-600" />
                What is your target career aim?
              </h3>
              <p className="text-xs text-slate-500 pt-0.5">We will filter job recommendations, ATS tips, and interview questions for this goal.</p>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {aimOptions.map((aim) => {
                const selected = targetAim === aim;
                return (
                  <button
                    key={aim}
                    type="button"
                    onClick={() => setTargetAim(aim)}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all text-center cursor-pointer ${
                      selected
                        ? 'border-indigo-600 bg-indigo-600 text-white shadow-2xs'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {aim}
                  </button>
                );
              })}
            </div>

            <div className="space-y-2 pt-2">
              <label className="font-bold text-xs text-slate-700 flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-indigo-600" />
                Select Your Tech Interests (Filter Content)
              </label>
              <div className="flex flex-wrap gap-2 pt-1">
                {interestOptions.map((interest) => {
                  const selected = selectedInterests.includes(interest);
                  return (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => toggleInterest(interest)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                        selected
                          ? 'bg-purple-600 text-white shadow-2xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {selected ? `✓ ${interest}` : `+ ${interest}`}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setStep(1)}
                className="w-1/3 py-3 rounded-full bg-slate-100 text-slate-700 font-bold text-xs cursor-pointer hover:bg-slate-200"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="w-2/3 py-3 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <span>Next: AI Agent (Beta) Setup</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: AI AGENT BETA SETUP */}
        {step === 3 && (
          <div className="space-y-5 animate-in fade-in duration-300">
            <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-50 via-indigo-50 to-pink-50 border border-purple-200/80 space-y-2">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-purple-600" />
                <h4 className="font-heading font-extrabold text-sm text-purple-950">AI Career Agent (Beta Enabled)</h4>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                CareerCraft includes a built-in simulated AI Agent (Beta) for automated resume bullet rewriting, ATS scoring, and interview feedback out of the box.
              </p>
            </div>

            <div className="space-y-2">
              <label className="font-bold text-xs text-slate-700 flex items-center gap-1.5">
                <Key className="w-4 h-4 text-amber-500" />
                Optional: Custom LLM API Key (OpenAI / Gemini)
              </label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-... or AIza... (Leave empty for built-in Beta Agent)"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
              />
              <p className="text-[11px] text-slate-400">
                You can add or update your custom API key anytime inside Profile Settings or the AI Agent tab.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setStep(2)}
                className="w-1/3 py-3 rounded-full bg-slate-100 text-slate-700 font-bold text-xs cursor-pointer hover:bg-slate-200"
              >
                Back
              </button>
              <button
                onClick={handleFinish}
                className="w-2/3 py-3 rounded-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:opacity-95 text-white font-extrabold text-xs shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Finish & Launch Workspace</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>,
    document.body
  );
};
