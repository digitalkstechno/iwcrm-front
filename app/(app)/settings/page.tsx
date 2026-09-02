'use client';

import React, { useState, useEffect } from 'react';
import { Settings, MessageSquare, Database, ShoppingCart, FolderUp, Calendar, Save, Globe, Key, Phone, CheckCircle2, Link as LinkIcon, Copy } from 'lucide-react';
import { useCRM } from '@/lib/crm-context';
import { encryptData, decryptData } from '@/lib/encryption';
import api from '@/lib/axios';

export default function SettingsPage() {
  const { showToast } = useCRM();
  const [activeTab, setActiveTab] = useState('meta');
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    // Meta / WhatsApp
    metaDomain: '',
    metaPhoneNumberId: '',
    metaWabaId: '',
    metaChannelToken: '',
    metaVerifyToken: 'kapil_crm_meta_token', // Default token matching backend
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      const res: any = await api.get('/v1/api/settings?configType=meta_whatsapp');
      if (res?.data?.encryptedData) {
        const decryptedConfig = decryptData(res.data.encryptedData);
        if (decryptedConfig) {
          setFormData(prev => ({ ...prev, ...decryptedConfig }));
        }
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const encryptedData = encryptData(formData);
      await api.post('/v1/api/settings', {
        configType: 'meta_whatsapp',
        encryptedData
      });
      showToast({ type: 'success', title: 'Configuration Saved', message: 'Your API configurations have been safely encrypted and saved.' });
    } catch (error) {
      console.error('Failed to save settings:', error);
      showToast({ type: 'error', title: 'Error', message: 'Failed to save configuration.' });
    } finally {
      setIsSaving(false);
    }
  };

  const tabs = [
    { id: 'meta', label: 'Meta & WhatsApp', icon: MessageSquare, description: 'Configure WhatsApp Cloud API and webhooks.' },
  ];

  const renderInput = (label: string, icon: React.FC<any>, placeholder: string, key: keyof typeof formData, type = "text") => (
    <div className="space-y-1.5">
      <label className="text-sm font-semibold text-slate-700">{label}</label>
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {React.createElement(icon, { className: "w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" })}
        </div>
        {type === 'textarea' ? (
          <textarea
            value={formData[key]}
            onChange={(e) => setFormData(prev => ({ ...prev, [key]: e.target.value }))}
            rows={4}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all shadow-xs hover:border-slate-300 resize-none"
            placeholder={placeholder}
          />
        ) : (
          <input
            type={type}
            value={formData[key]}
            onChange={(e) => setFormData(prev => ({ ...prev, [key]: e.target.value }))}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all shadow-xs hover:border-slate-300"
            placeholder={placeholder}
          />
        )}
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Settings className="w-8 h-8 text-blue-600" />
            Integrations & Config
          </h1>
          <p className="text-slate-500 mt-1">Manage all your external API connections and environment variables in one place.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving || isLoading}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-5 py-2.5 rounded-xl font-semibold shadow-md shadow-blue-500/20 transition-all disabled:opacity-70"
        >
          {isSaving ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-5 h-5" />}
          <span>{isSaving ? 'Encrypting & Saving...' : 'Save Configuration'}</span>
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Tabs */}
        <div className="lg:w-72 shrink-0 space-y-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full text-left p-4 rounded-2xl transition-all border ${
                activeTab === tab.id
                  ? 'bg-white border-blue-200 shadow-md ring-1 ring-blue-100 scale-[1.02]'
                  : 'bg-transparent border-transparent hover:bg-slate-100 hover:scale-[1.01]'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg transition-colors ${activeTab === tab.id ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'}`}>
                  <tab.icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className={`font-semibold text-sm transition-colors ${activeTab === tab.id ? 'text-blue-900' : 'text-slate-700'}`}>{tab.label}</h3>
                  <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{tab.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/40 p-6 sm:p-8 min-h-[400px]">
            {isLoading ? (
              <div className="h-full flex flex-col items-center justify-center min-h-[300px] text-slate-400">
                <div className="w-8 h-8 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mb-4" />
                <p className="text-sm font-medium">Decrypting Config...</p>
              </div>
            ) : (
              <>
                {activeTab === 'meta' && (
                  <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
                    <div className="border-b border-slate-100 pb-4 mb-6">
                      <h2 className="text-xl font-bold text-slate-900">Meta & WhatsApp Cloud API</h2>
                      <p className="text-sm text-slate-500 mt-1">Configure your WhatsApp Business Account (WABA) credentials to send automated messages.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {renderInput('API Domain', Globe, 'https://graph.facebook.com', 'metaDomain')}
                      {renderInput('Phone Number ID', Phone, 'Enter Phone Number ID', 'metaPhoneNumberId')}
                      {renderInput('WABA ID', Database, 'Enter WhatsApp Business Account ID', 'metaWabaId')}
                      <div className="md:col-span-2">
                        {renderInput('Channel Token', Key, 'Enter channel specific token', 'metaChannelToken', 'textarea')}
                      </div>
                    </div>

                    <div className="mt-8 border-t border-slate-100 pt-6">
                      <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <LinkIcon className="w-5 h-5 text-emerald-500" />
                        Webhook Configuration
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2 space-y-1.5">
                          <label className="text-sm font-semibold text-slate-700">Webhook URL</label>
                          <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Globe className="w-5 h-5 text-slate-400" />
                            </div>
                            <input
                              type="text"
                              readOnly
                              value={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/v1/api/webhook/meta?challenge=`}
                              className="w-full pl-10 pr-12 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-sm focus:outline-none text-slate-600 font-mono"
                            />
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/v1/api/webhook/meta?challenge=`);
                                showToast({ type: 'success', title: 'Copied', message: 'Webhook URL copied to clipboard.' });
                              }}
                              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-blue-600 transition-colors"
                              title="Copy URL"
                            >
                              <Copy className="w-5 h-5" />
                            </button>
                          </div>
                          <p className="text-xs text-slate-500 mt-1">Copy this URL and paste it in your Meta App Dashboard under Webhooks.</p>
                        </div>
                        <div className="md:col-span-2">
                          {renderInput('Verify Token', Key, 'Enter token for Meta webhook verification', 'metaVerifyToken')}
                          <p className="text-xs text-slate-500 mt-1 pl-1">This token must match the one you enter in the Meta App Dashboard.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
          
          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-slate-400 bg-slate-50 py-3 rounded-xl border border-slate-200 border-dashed">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            All sensitive tokens are encrypted before being stored.
          </div>
        </div>

      </div>
    </div>
  );
}
