import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  Save,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  History,
  FileText,
  User,
  GraduationCap,
  Briefcase,
  FolderGit2,
  Code2,
  Award,
  Layers,
  Sparkles,
  ArrowLeft,
} from 'lucide-react';
import { SortableItem } from './SortableItem';
import { PDFPreview } from '../preview/PDFPreview';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Modal } from '../../components/ui/modal';
import { resumeApi, documentApi, templateApi } from '../../services/api';
import { Resume, GeneratedDocument, Template, ResumeVersion } from '../../types';
import { toast } from 'sonner';

export const ResumeEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [resume, setResume] = useState<Resume | null>(null);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [document, setDocument] = useState<GeneratedDocument | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');

  // Versions Modal
  const [isVersionModalOpen, setIsVersionModalOpen] = useState(false);
  const [versions, setVersions] = useState<ResumeVersion[]>([]);
  const [versionTitle, setVersionTitle] = useState('');

  // Expandable Section Collapses
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    personal: true,
    summary: true,
    experience: true,
    education: true,
    projects: true,
    skills: true,
    certifications: true,
    custom: true,
  });

  const toggleSection = (sec: string) => {
    setExpandedSections((prev) => ({ ...prev, [sec]: !prev[sec] }));
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const loadResumeData = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      const data = await resumeApi.getById(id);
      setResume(data);
      const tmpls = await templateApi.getAll();
      setTemplates(tmpls);
    } catch {
      toast.error('Failed to load resume document');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadResumeData();
  }, [loadResumeData]);

  // Auto-Save handler
  const saveResume = async (updated: Partial<Resume>) => {
    if (!id || !resume) return;
    setSaving(true);
    try {
      const saved = await resumeApi.update(id, updated);
      setResume(saved);
    } catch {
      toast.error('Auto-save failed');
    } finally {
      setSaving(false);
    }
  };

  // Generate PDF handler
  const handleGeneratePDF = async () => {
    if (!id) return;
    setGenerating(true);
    try {
      const doc = await documentApi.generatePDF(id);
      setDocument(doc);
      toast.success('PDF Compilation Successful!');
    } catch {
      toast.error('Failed to compile PDF');
    } finally {
      setGenerating(false);
    }
  };

  // Drag and Drop Section Reordering
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!resume || !over || active.id === over.id) return;

    const currentOrder = resume.section_order || [
      'personal',
      'summary',
      'education',
      'experience',
      'projects',
      'skills',
      'certifications',
    ];
    const oldIndex = currentOrder.indexOf(active.id.toString());
    const newIndex = currentOrder.indexOf(over.id.toString());

    if (oldIndex !== -1 && newIndex !== -1) {
      const newOrder = arrayMove(currentOrder, oldIndex, newIndex);
      const updated = { ...resume, section_order: newOrder };
      setResume(updated);
      saveResume({ section_order: newOrder });
      toast.success('Section order updated!');
    }
  };

  // Version Management
  const handleCreateVersion = async () => {
    if (!id) return;
    try {
      await resumeApi.createVersion(id, versionTitle || undefined);
      toast.success('Version saved!');
      setVersionTitle('');
      const verList = await resumeApi.getVersions(id);
      setVersions(verList);
    } catch {
      toast.error('Failed to create version');
    }
  };

  const handleRestoreVersion = async (versionId: number) => {
    if (!id) return;
    try {
      const restored = await resumeApi.restoreVersion(id, versionId);
      setResume(restored);
      toast.success('Version restored!');
      setIsVersionModalOpen(false);
    } catch {
      toast.error('Failed to restore version');
    }
  };

  const openVersionModal = async () => {
    if (!id) return;
    setIsVersionModalOpen(true);
    const verList = await resumeApi.getVersions(id);
    setVersions(verList);
  };

  if (loading || !resume) {
    return (
      <div className="h-[calc(100vh-3.5rem)] flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-2">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-slate-300 border-t-slate-900" />
          <p className="text-sm font-medium text-slate-600">Loading Resume Editor...</p>
        </div>
      </div>
    );
  }

  const personal = resume.personal_info || {
    full_name: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    github: '',
    portfolio: '',
    summary: '',
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col bg-slate-50 overflow-hidden">
      {/* Top Professional Editor Header */}
      <header className="h-14 px-4 bg-white border-b border-slate-200 flex items-center justify-between shrink-0 z-30">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-1.5 hover:bg-slate-100 rounded-md text-slate-500 transition-colors"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={resume.title}
              onChange={(e) => {
                const title = e.target.value;
                setResume({ ...resume, title });
                saveResume({ title });
              }}
              className="font-bold text-slate-900 text-sm bg-transparent border border-transparent hover:border-slate-300 focus:border-slate-900 rounded px-2 py-1 focus:outline-none transition-colors"
            />
            <span className="hidden sm:inline-block text-xs text-slate-400">|</span>
            <input
              type="text"
              placeholder="Target Role (e.g. Backend Dev)"
              value={resume.target_role || ''}
              onChange={(e) => {
                const target_role = e.target.value;
                setResume({ ...resume, target_role });
                saveResume({ target_role });
              }}
              className="hidden sm:inline-block text-xs text-slate-500 bg-transparent border border-transparent hover:border-slate-300 focus:border-slate-900 rounded px-2 py-0.5 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-400">
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? 'Saving...' : 'Auto-saved'}</span>
          </div>

          {/* Template Selector */}
          <select
            value={resume.template || ''}
            onChange={(e) => {
              const template = parseInt(e.target.value);
              setResume({ ...resume, template });
              saveResume({ template });
            }}
            className="text-xs bg-slate-100 border border-slate-200 rounded px-2.5 py-1.5 font-medium text-slate-800 focus:outline-none"
          >
            {templates.map((t) => (
              <option key={t.id} value={t.id}>
                Template: {t.name}
              </option>
            ))}
          </select>

          <Button
            variant="outline"
            size="sm"
            onClick={openVersionModal}
            icon={<History className="w-3.5 h-3.5" />}
          >
            Versions
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={handleGeneratePDF}
            isLoading={generating}
            icon={<Sparkles className="w-3.5 h-3.5" />}
          >
            Generate PDF
          </Button>
        </div>
      </header>

      {/* Mobile Tab Switcher */}
      <div className="md:hidden flex border-b border-slate-200 bg-white">
        <button
          onClick={() => setActiveTab('edit')}
          className={`flex-1 py-2 text-xs font-bold ${
            activeTab === 'edit'
              ? 'border-b-2 border-slate-900 text-slate-900'
              : 'text-slate-500'
          }`}
        >
          Edit Form
        </button>
        <button
          onClick={() => setActiveTab('preview')}
          className={`flex-1 py-2 text-xs font-bold ${
            activeTab === 'preview'
              ? 'border-b-2 border-slate-900 text-slate-900'
              : 'text-slate-500'
          }`}
        >
          PDF Preview
        </button>
      </div>

      {/* Main Split Pane Layout */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
        {/* Left Column: Form Editor */}
        <div
          className={`md:col-span-6 lg:col-span-6 h-full overflow-y-auto p-4 sm:p-6 space-y-6 ${
            activeTab === 'preview' ? 'hidden md:block' : 'block'
          }`}
        >
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={
                resume.section_order || [
                  'personal',
                  'summary',
                  'education',
                  'experience',
                  'projects',
                  'skills',
                  'certifications',
                ]
              }
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-4">
                {(
                  resume.section_order || [
                    'personal',
                    'summary',
                    'education',
                    'experience',
                    'projects',
                    'skills',
                    'certifications',
                  ]
                ).map((secKey) => {
                  if (secKey === 'personal') {
                    return (
                      <SortableItem key="personal" id="personal">
                        <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
                          <div
                            onClick={() => toggleSection('personal')}
                            className="flex items-center justify-between p-4 bg-slate-50/80 border-b border-slate-100 cursor-pointer select-none"
                          >
                            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                              <User className="w-4 h-4 text-slate-700" /> Personal Information
                            </div>
                            {expandedSections.personal ? (
                              <ChevronUp className="w-4 h-4 text-slate-400" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-slate-400" />
                            )}
                          </div>
                          {expandedSections.personal && (
                            <div className="p-4 space-y-3">
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <Input
                                  label="Full Name"
                                  value={personal.full_name}
                                  onChange={(e) => {
                                    const updatedP = {
                                      ...personal,
                                      full_name: e.target.value,
                                    };
                                    setResume({ ...resume, personal_info: updatedP });
                                    saveResume({ personal_info: updatedP });
                                  }}
                                />
                                <Input
                                  label="Email"
                                  type="email"
                                  value={personal.email}
                                  onChange={(e) => {
                                    const updatedP = {
                                      ...personal,
                                      email: e.target.value,
                                    };
                                    setResume({ ...resume, personal_info: updatedP });
                                    saveResume({ personal_info: updatedP });
                                  }}
                                />
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <Input
                                  label="Phone"
                                  value={personal.phone}
                                  onChange={(e) => {
                                    const updatedP = {
                                      ...personal,
                                      phone: e.target.value,
                                    };
                                    setResume({ ...resume, personal_info: updatedP });
                                    saveResume({ personal_info: updatedP });
                                  }}
                                />
                                <Input
                                  label="Location"
                                  value={personal.location}
                                  onChange={(e) => {
                                    const updatedP = {
                                      ...personal,
                                      location: e.target.value,
                                    };
                                    setResume({ ...resume, personal_info: updatedP });
                                    saveResume({ personal_info: updatedP });
                                  }}
                                />
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <Input
                                  label="LinkedIn URL"
                                  value={personal.linkedin}
                                  onChange={(e) => {
                                    const updatedP = {
                                      ...personal,
                                      linkedin: e.target.value,
                                    };
                                    setResume({ ...resume, personal_info: updatedP });
                                    saveResume({ personal_info: updatedP });
                                  }}
                                />
                                <Input
                                  label="GitHub URL"
                                  value={personal.github}
                                  onChange={(e) => {
                                    const updatedP = {
                                      ...personal,
                                      github: e.target.value,
                                    };
                                    setResume({ ...resume, personal_info: updatedP });
                                    saveResume({ personal_info: updatedP });
                                  }}
                                />
                                <Input
                                  label="Portfolio URL"
                                  value={personal.portfolio}
                                  onChange={(e) => {
                                    const updatedP = {
                                      ...personal,
                                      portfolio: e.target.value,
                                    };
                                    setResume({ ...resume, personal_info: updatedP });
                                    saveResume({ personal_info: updatedP });
                                  }}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </SortableItem>
                    );
                  }

                  if (secKey === 'summary') {
                    return (
                      <SortableItem key="summary" id="summary">
                        <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
                          <div
                            onClick={() => toggleSection('summary')}
                            className="flex items-center justify-between p-4 bg-slate-50/80 border-b border-slate-100 cursor-pointer select-none"
                          >
                            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                              <FileText className="w-4 h-4 text-slate-700" /> Professional Summary
                            </div>
                            {expandedSections.summary ? (
                              <ChevronUp className="w-4 h-4 text-slate-400" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-slate-400" />
                            )}
                          </div>
                          {expandedSections.summary && (
                            <div className="p-4">
                              <Textarea
                                label="Summary"
                                maxChars={400}
                                value={personal.summary}
                                onChange={(e) => {
                                  const updatedP = {
                                    ...personal,
                                    summary: e.target.value,
                                  };
                                  setResume({ ...resume, personal_info: updatedP });
                                  saveResume({ personal_info: updatedP });
                                }}
                                helperText="Concise 2-3 sentence overview highlighting core competencies and domain experience."
                              />
                            </div>
                          )}
                        </div>
                      </SortableItem>
                    );
                  }

                  if (secKey === 'experience') {
                    const exps = resume.experiences || [];
                    return (
                      <SortableItem key="experience" id="experience">
                        <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
                          <div
                            onClick={() => toggleSection('experience')}
                            className="flex items-center justify-between p-4 bg-slate-50/80 border-b border-slate-100 cursor-pointer select-none"
                          >
                            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                              <Briefcase className="w-4 h-4 text-slate-700" /> Experience ({exps.length})
                            </div>
                            {expandedSections.experience ? (
                              <ChevronUp className="w-4 h-4 text-slate-400" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-slate-400" />
                            )}
                          </div>
                          {expandedSections.experience && (
                            <div className="p-4 space-y-4">
                              {exps.map((exp, idx) => (
                                <div
                                  key={idx}
                                  className="p-3 bg-slate-50/50 border border-slate-200 rounded-md space-y-3"
                                >
                                  <div className="flex justify-between items-center">
                                    <span className="text-xs font-bold text-slate-700">
                                      Entry #{idx + 1}
                                    </span>
                                    <button
                                      onClick={() => {
                                        const newExps = exps.filter((_, i) => i !== idx);
                                        setResume({ ...resume, experiences: newExps });
                                        saveResume({ experiences: newExps });
                                      }}
                                      className="text-red-500 hover:text-red-700 text-xs"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    <Input
                                      label="Company"
                                      value={exp.company}
                                      onChange={(e) => {
                                        const newExps = [...exps];
                                        newExps[idx].company = e.target.value;
                                        setResume({ ...resume, experiences: newExps });
                                        saveResume({ experiences: newExps });
                                      }}
                                    />
                                    <Input
                                      label="Position"
                                      value={exp.position}
                                      onChange={(e) => {
                                        const newExps = [...exps];
                                        newExps[idx].position = e.target.value;
                                        setResume({ ...resume, experiences: newExps });
                                        saveResume({ experiences: newExps });
                                      }}
                                    />
                                  </div>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    <Input
                                      label="Start Date"
                                      value={exp.start_date}
                                      onChange={(e) => {
                                        const newExps = [...exps];
                                        newExps[idx].start_date = e.target.value;
                                        setResume({ ...resume, experiences: newExps });
                                        saveResume({ experiences: newExps });
                                      }}
                                    />
                                    <Input
                                      label="End Date"
                                      value={exp.end_date}
                                      onChange={(e) => {
                                        const newExps = [...exps];
                                        newExps[idx].end_date = e.target.value;
                                        setResume({ ...resume, experiences: newExps });
                                        saveResume({ experiences: newExps });
                                      }}
                                    />
                                  </div>
                                  <Textarea
                                    label="Bullet Points (one per line)"
                                    value={(exp.description_bullets || []).join('\n')}
                                    onChange={(e) => {
                                      const newExps = [...exps];
                                      newExps[idx].description_bullets = e.target.value
                                        .split('\n')
                                        .filter(Boolean);
                                      setResume({ ...resume, experiences: newExps });
                                      saveResume({ experiences: newExps });
                                    }}
                                  />
                                </div>
                              ))}
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-full"
                                icon={<Plus className="w-3.5 h-3.5" />}
                                onClick={() => {
                                  const newExps = [
                                    ...exps,
                                    {
                                      company: 'New Company',
                                      position: 'Software Engineer',
                                      location: '',
                                      start_date: '2023',
                                      end_date: 'Present',
                                      is_current: true,
                                      description_bullets: ['Engineered scalable microservices'],
                                      order: exps.length,
                                    },
                                  ];
                                  setResume({ ...resume, experiences: newExps });
                                  saveResume({ experiences: newExps });
                                }}
                              >
                                Add Experience Entry
                              </Button>
                            </div>
                          )}
                        </div>
                      </SortableItem>
                    );
                  }

                  if (secKey === 'education') {
                    const eds = resume.educations || [];
                    return (
                      <SortableItem key="education" id="education">
                        <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
                          <div
                            onClick={() => toggleSection('education')}
                            className="flex items-center justify-between p-4 bg-slate-50/80 border-b border-slate-100 cursor-pointer select-none"
                          >
                            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                              <GraduationCap className="w-4 h-4 text-slate-700" /> Education ({eds.length})
                            </div>
                            {expandedSections.education ? (
                              <ChevronUp className="w-4 h-4 text-slate-400" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-slate-400" />
                            )}
                          </div>
                          {expandedSections.education && (
                            <div className="p-4 space-y-4">
                              {eds.map((ed, idx) => (
                                <div
                                  key={idx}
                                  className="p-3 bg-slate-50/50 border border-slate-200 rounded-md space-y-3"
                                >
                                  <div className="flex justify-between items-center">
                                    <span className="text-xs font-bold text-slate-700">
                                      Education #{idx + 1}
                                    </span>
                                    <button
                                      onClick={() => {
                                        const newEds = eds.filter((_, i) => i !== idx);
                                        setResume({ ...resume, educations: newEds });
                                        saveResume({ educations: newEds });
                                      }}
                                      className="text-red-500 hover:text-red-700 text-xs"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    <Input
                                      label="Institution"
                                      value={ed.institution}
                                      onChange={(e) => {
                                        const newEds = [...eds];
                                        newEds[idx].institution = e.target.value;
                                        setResume({ ...resume, educations: newEds });
                                        saveResume({ educations: newEds });
                                      }}
                                    />
                                    <Input
                                      label="Degree"
                                      value={ed.degree}
                                      onChange={(e) => {
                                        const newEds = [...eds];
                                        newEds[idx].degree = e.target.value;
                                        setResume({ ...resume, educations: newEds });
                                        saveResume({ educations: newEds });
                                      }}
                                    />
                                  </div>
                                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                    <Input
                                      label="Field of Study"
                                      value={ed.field_of_study}
                                      onChange={(e) => {
                                        const newEds = [...eds];
                                        newEds[idx].field_of_study = e.target.value;
                                        setResume({ ...resume, educations: newEds });
                                        saveResume({ educations: newEds });
                                      }}
                                    />
                                    <Input
                                      label="Dates"
                                      value={`${ed.start_date} - ${ed.end_date}`}
                                      onChange={(e) => {
                                        const newEds = [...eds];
                                        const parts = e.target.value.split('-');
                                        newEds[idx].start_date = parts[0] ? parts[0].trim() : '';
                                        newEds[idx].end_date = parts[1] ? parts[1].trim() : '';
                                        setResume({ ...resume, educations: newEds });
                                        saveResume({ educations: newEds });
                                      }}
                                    />
                                    <Input
                                      label="GPA"
                                      value={ed.gpa}
                                      onChange={(e) => {
                                        const newEds = [...eds];
                                        newEds[idx].gpa = e.target.value;
                                        setResume({ ...resume, educations: newEds });
                                        saveResume({ educations: newEds });
                                      }}
                                    />
                                  </div>
                                </div>
                              ))}
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-full"
                                icon={<Plus className="w-3.5 h-3.5" />}
                                onClick={() => {
                                  const newEds = [
                                    ...eds,
                                    {
                                      institution: 'University',
                                      degree: 'B.S.',
                                      field_of_study: 'Computer Science',
                                      start_date: '2020',
                                      end_date: '2024',
                                      gpa: '3.8',
                                      description: '',
                                      order: eds.length,
                                    },
                                  ];
                                  setResume({ ...resume, educations: newEds });
                                  saveResume({ educations: newEds });
                                }}
                              >
                                Add Education Entry
                              </Button>
                            </div>
                          )}
                        </div>
                      </SortableItem>
                    );
                  }

                  if (secKey === 'projects') {
                    const projs = resume.projects || [];
                    return (
                      <SortableItem key="projects" id="projects">
                        <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
                          <div
                            onClick={() => toggleSection('projects')}
                            className="flex items-center justify-between p-4 bg-slate-50/80 border-b border-slate-100 cursor-pointer select-none"
                          >
                            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                              <FolderGit2 className="w-4 h-4 text-slate-700" /> Projects ({projs.length})
                            </div>
                            {expandedSections.projects ? (
                              <ChevronUp className="w-4 h-4 text-slate-400" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-slate-400" />
                            )}
                          </div>
                          {expandedSections.projects && (
                            <div className="p-4 space-y-4">
                              {projs.map((pr, idx) => (
                                <div
                                  key={idx}
                                  className="p-3 bg-slate-50/50 border border-slate-200 rounded-md space-y-3"
                                >
                                  <div className="flex justify-between items-center">
                                    <span className="text-xs font-bold text-slate-700">
                                      Project #{idx + 1}
                                    </span>
                                    <button
                                      onClick={() => {
                                        const newProjs = projs.filter((_, i) => i !== idx);
                                        setResume({ ...resume, projects: newProjs });
                                        saveResume({ projects: newProjs });
                                      }}
                                      className="text-red-500 hover:text-red-700 text-xs"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    <Input
                                      label="Project Name"
                                      value={pr.name}
                                      onChange={(e) => {
                                        const newProjs = [...projs];
                                        newProjs[idx].name = e.target.value;
                                        setResume({ ...resume, projects: newProjs });
                                        saveResume({ projects: newProjs });
                                      }}
                                    />
                                    <Input
                                      label="Technologies (comma separated)"
                                      value={(pr.technologies || []).join(', ')}
                                      onChange={(e) => {
                                        const newProjs = [...projs];
                                        newProjs[idx].technologies = e.target.value
                                          .split(',')
                                          .map((s) => s.trim())
                                          .filter(Boolean);
                                        setResume({ ...resume, projects: newProjs });
                                        saveResume({ projects: newProjs });
                                      }}
                                    />
                                  </div>
                                  <Textarea
                                    label="Bullet Points"
                                    value={(pr.bullet_points || []).join('\n')}
                                    onChange={(e) => {
                                      const newProjs = [...projs];
                                      newProjs[idx].bullet_points = e.target.value
                                        .split('\n')
                                        .filter(Boolean);
                                      setResume({ ...resume, projects: newProjs });
                                      saveResume({ projects: newProjs });
                                    }}
                                  />
                                </div>
                              ))}
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-full"
                                icon={<Plus className="w-3.5 h-3.5" />}
                                onClick={() => {
                                  const newProjs = [
                                    ...projs,
                                    {
                                      name: 'ResumeForge Platform',
                                      description: 'Document engineering app',
                                      technologies: ['React', 'Django', 'LaTeX'],
                                      github_url: '',
                                      live_url: '',
                                      bullet_points: ['Built LaTeX rendering pipeline'],
                                      order: projs.length,
                                    },
                                  ];
                                  setResume({ ...resume, projects: newProjs });
                                  saveResume({ projects: newProjs });
                                }}
                              >
                                Add Project Entry
                              </Button>
                            </div>
                          )}
                        </div>
                      </SortableItem>
                    );
                  }

                  if (secKey === 'skills') {
                    const sks = resume.skills || [];
                    return (
                      <SortableItem key="skills" id="skills">
                        <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
                          <div
                            onClick={() => toggleSection('skills')}
                            className="flex items-center justify-between p-4 bg-slate-50/80 border-b border-slate-100 cursor-pointer select-none"
                          >
                            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                              <Code2 className="w-4 h-4 text-slate-700" /> Skills & Categorized Expertise ({sks.length})
                            </div>
                            {expandedSections.skills ? (
                              <ChevronUp className="w-4 h-4 text-slate-400" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-slate-400" />
                            )}
                          </div>
                          {expandedSections.skills && (
                            <div className="p-4 space-y-4">
                              {sks.map((sk, idx) => (
                                <div
                                  key={idx}
                                  className="p-3 bg-slate-50/50 border border-slate-200 rounded-md space-y-2"
                                >
                                  <div className="flex justify-between items-center">
                                    <Input
                                      label="Category Name"
                                      value={sk.category_name}
                                      onChange={(e) => {
                                        const newSks = [...sks];
                                        newSks[idx].category_name = e.target.value;
                                        setResume({ ...resume, skills: newSks });
                                        saveResume({ skills: newSks });
                                      }}
                                    />
                                    <button
                                      onClick={() => {
                                        const newSks = sks.filter((_, i) => i !== idx);
                                        setResume({ ...resume, skills: newSks });
                                        saveResume({ skills: newSks });
                                      }}
                                      className="text-red-500 hover:text-red-700 text-xs ml-2 mt-5"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                  <Input
                                    label="Skills List (comma separated)"
                                    value={(sk.skills_list || []).join(', ')}
                                    onChange={(e) => {
                                      const newSks = [...sks];
                                      newSks[idx].skills_list = e.target.value
                                        .split(',')
                                        .map((s) => s.trim())
                                        .filter(Boolean);
                                      setResume({ ...resume, skills: newSks });
                                      saveResume({ skills: newSks });
                                    }}
                                  />
                                </div>
                              ))}
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-full"
                                icon={<Plus className="w-3.5 h-3.5" />}
                                onClick={() => {
                                  const newSks = [
                                    ...sks,
                                    {
                                      category_name: 'Frameworks & Tools',
                                      skills_list: ['React', 'Django', 'PostgreSQL', 'Docker'],
                                      order: sks.length,
                                    },
                                  ];
                                  setResume({ ...resume, skills: newSks });
                                  saveResume({ skills: newSks });
                                }}
                              >
                                Add Skill Category
                              </Button>
                            </div>
                          )}
                        </div>
                      </SortableItem>
                    );
                  }

                  if (secKey === 'certifications') {
                    const certs = resume.certifications || [];
                    return (
                      <SortableItem key="certifications" id="certifications">
                        <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
                          <div
                            onClick={() => toggleSection('certifications')}
                            className="flex items-center justify-between p-4 bg-slate-50/80 border-b border-slate-100 cursor-pointer select-none"
                          >
                            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                              <Award className="w-4 h-4 text-slate-700" /> Certifications ({certs.length})
                            </div>
                            {expandedSections.certifications ? (
                              <ChevronUp className="w-4 h-4 text-slate-400" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-slate-400" />
                            )}
                          </div>
                          {expandedSections.certifications && (
                            <div className="p-4 space-y-4">
                              {certs.map((c, idx) => (
                                <div
                                  key={idx}
                                  className="p-3 bg-slate-50/50 border border-slate-200 rounded-md space-y-2"
                                >
                                  <div className="flex justify-between items-center">
                                    <Input
                                      label="Certification Name"
                                      value={c.name}
                                      onChange={(e) => {
                                        const newC = [...certs];
                                        newC[idx].name = e.target.value;
                                        setResume({ ...resume, certifications: newC });
                                        saveResume({ certifications: newC });
                                      }}
                                    />
                                    <button
                                      onClick={() => {
                                        const newC = certs.filter((_, i) => i !== idx);
                                        setResume({ ...resume, certifications: newC });
                                        saveResume({ certifications: newC });
                                      }}
                                      className="text-red-500 hover:text-red-700 text-xs ml-2 mt-5"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    <Input
                                      label="Issuer"
                                      value={c.issuer}
                                      onChange={(e) => {
                                        const newC = [...certs];
                                        newC[idx].issuer = e.target.value;
                                        setResume({ ...resume, certifications: newC });
                                        saveResume({ certifications: newC });
                                      }}
                                    />
                                    <Input
                                      label="Issue Date"
                                      value={c.issue_date}
                                      onChange={(e) => {
                                        const newC = [...certs];
                                        newC[idx].issue_date = e.target.value;
                                        setResume({ ...resume, certifications: newC });
                                        saveResume({ certifications: newC });
                                      }}
                                    />
                                  </div>
                                </div>
                              ))}
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-full"
                                icon={<Plus className="w-3.5 h-3.5" />}
                                onClick={() => {
                                  const newC = [
                                    ...certs,
                                    {
                                      name: 'AWS Certified Developer',
                                      issuer: 'Amazon Web Services',
                                      issue_date: '2024',
                                      credential_url: '',
                                      order: certs.length,
                                    },
                                  ];
                                  setResume({ ...resume, certifications: newC });
                                  saveResume({ certifications: newC });
                                }}
                              >
                                Add Certification
                              </Button>
                            </div>
                          )}
                        </div>
                      </SortableItem>
                    );
                  }

                  return null;
                })}
              </div>
            </SortableContext>
          </DndContext>
        </div>

        {/* Right Column: PDF Preview Canvas */}
        <div
          className={`md:col-span-6 lg:col-span-6 h-full ${
            activeTab === 'edit' ? 'hidden md:block' : 'block'
          }`}
        >
          <PDFPreview
            document={document}
            onGenerate={handleGeneratePDF}
            isGenerating={generating}
          />
        </div>
      </div>

      {/* Version Management Modal */}
      <Modal
        isOpen={isVersionModalOpen}
        onClose={() => setIsVersionModalOpen(false)}
        title="Resume Versions & History"
        maxWidth="md"
      >
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Version title (e.g. Version 2 - Tailored for Acme)"
              value={versionTitle}
              onChange={(e) => setVersionTitle(e.target.value)}
            />
            <Button
              variant="primary"
              size="sm"
              onClick={handleCreateVersion}
              icon={<Plus className="w-3.5 h-3.5" />}
            >
              Save Version
            </Button>
          </div>

          <div className="divide-y divide-slate-100 max-h-60 overflow-auto border border-slate-200 rounded-md">
            {versions.map((ver) => (
              <div
                key={ver.id}
                className="p-3 flex items-center justify-between hover:bg-slate-50 transition-colors"
              >
                <div>
                  <div className="font-bold text-slate-900 text-xs">{ver.title}</div>
                  <div className="text-[11px] text-slate-400">
                    Saved on {new Date(ver.created_at).toLocaleString()}
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRestoreVersion(ver.id)}
                >
                  Restore
                </Button>
              </div>
            ))}
            {versions.length === 0 && (
              <div className="p-4 text-center text-xs text-slate-400">
                No versions saved yet. Click "Save Version" to snapshot state.
              </div>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};
