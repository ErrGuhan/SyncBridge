'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  User, 
  Phone, 
  MapPin, 
  Mail, 
  Lock, 
  Briefcase, 
  Building2, 
  FileText, 
  UploadCloud, 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft, 
  ShieldCheck, 
  Award,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { MOCK_COOPERATIVES, MOCK_CATEGORIES } from '@/data/mockData';

export default function WorkerRegistrationForm() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  // Form State
  const [formData, setFormData] = useState({
    // Step 1: Basic Info
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    password: '',
    address: 'Indiranagar, Bengaluru',
    latitude: 12.9716,
    longitude: 77.5946,
    gpsDetected: true,

    // Step 2: Skills & Cooperative Affiliation
    cooperativeId: MOCK_COOPERATIVES[0].id,
    trade: 'Electrician',
    experienceYears: 5,
    hourlyRate: 350,
    selectedSkills: ['Three-Phase Wiring', 'Circuit Diagnostics', 'Smart Home Setup'] as string[],

    // Step 3: Documents
    aadhaarNumber: '',
    aadhaarFileUploaded: true,
    certificateTitle: 'State ITI Wireman License (Class A)',
    certificateFileUploaded: true,
    unionMembershipNumber: 'FED-2026-8910'
  });

  const availableSkillsForTrade: Record<string, string[]> = {
    Electrician: ['Three-Phase Wiring', 'Circuit Diagnostics', 'Smart Home Setup', 'Inverter Systems', 'MCB Box Installation', 'Solar Panel Wiring'],
    Plumber: ['PPR & CPVC Pipe Jointing', 'Drainage Unclogging', 'Pressure Booster Pumps', 'RO Filter Servicing', 'Sanitaryware Fitting'],
    'Caregiver & Nursing': ['Geriatric Care', 'Vitals & BP Monitoring', 'Post-Op Assistance', 'Bedridden Patient Care', 'Physiotherapy Assist'],
    Carpenter: ['Modular Furniture', 'Hardwood Carving', 'Door Frame Fitting', 'Lock & Hardware Installation', 'Laminate Polishing'],
    'Appliance Repair': ['Inverter AC Maintenance', 'PCB Diagnostics', 'Refrigerator Gas Refill', 'Washing Machine Drum Balancing'],
    'Deep Cleaning': ['Full House Sanitization', 'Sofa & Carpet Extraction', 'Kitchen Degreasing', 'High-Pressure Grout Wash'],
    'Painter & Decorator': ['Texture Painting', 'Waterproof Damp Guard', 'Airless Spray Painting', 'Wood Staining'],
    'Mason & Construction': ['Vitrified Tile Laying', 'Waterproofing Screed', 'Brickwork & Mortar', 'Plaster of Paris']
  };

  const handleSkillToggle = (skill: string) => {
    setFormData(prev => {
      const exists = prev.selectedSkills.includes(skill);
      if (exists) {
        return { ...prev, selectedSkills: prev.selectedSkills.filter(s => s !== skill) };
      } else {
        return { ...prev, selectedSkills: [...prev.selectedSkills, skill] };
      }
    });
  };

  const detectLocation = () => {
    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setFormData(prev => ({
            ...prev,
            latitude: parseFloat(pos.coords.latitude.toFixed(4)),
            longitude: parseFloat(pos.coords.longitude.toFixed(4)),
            gpsDetected: true
          }));
        },
        () => {
          // Fallback location for demo
          setFormData(prev => ({
            ...prev,
            latitude: 12.9784,
            longitude: 77.6408,
            gpsDetected: true
          }));
        }
      );
    }
  };

  const nextStep = () => {
    if (currentStep === 1) {
      if (!formData.firstName || !formData.phone) {
        alert('Please provide your name and mobile phone number to proceed.');
        return;
      }
    }
    setCurrentStep(prev => Math.min(prev + 1, 3));
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API registration call to backend User Service (Port 3001)
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1200);
  };

  return (
    <div className="max-w-3xl mx-auto py-4 sm:py-8 space-y-8 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel text-xs font-semibold text-emerald-300 border-emerald-500/30">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Labour Cooperative Member Onboarding</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
          Join the Democratic Gig Federation
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
          Take home <strong className="text-emerald-400">80%</strong> of client payments directly into your wallet. 
          Gain voting rights, accident insurance, and retirement mutual aid through your cooperative.
        </p>
      </div>

      {/* Multi-Step Progress Tracker */}
      <div className="glass-panel p-4 rounded-2xl border border-white/10">
        <div className="grid grid-cols-3 gap-2 relative">
          
          {/* Step 1 */}
          <div className="flex flex-col items-center text-center space-y-1.5">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm transition-all ${
              currentStep === 1 
                ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/30 ring-2 ring-cyan-400' 
                : currentStep > 1 
                  ? 'bg-emerald-500 text-slate-950 font-bold' 
                  : 'bg-slate-800 text-slate-400'
            }`}>
              {currentStep > 1 ? <CheckCircle className="w-5 h-5" /> : '1'}
            </div>
            <span className={`text-xs font-medium ${currentStep >= 1 ? 'text-white' : 'text-slate-500'}`}>
              Basic Info
            </span>
            <span className="text-[10px] text-slate-400 hidden sm:inline">Identity & GPS</span>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col items-center text-center space-y-1.5">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm transition-all ${
              currentStep === 2 
                ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/30 ring-2 ring-cyan-400' 
                : currentStep > 2 
                  ? 'bg-emerald-500 text-slate-950 font-bold' 
                  : 'bg-slate-800 text-slate-400'
            }`}>
              {currentStep > 2 ? <CheckCircle className="w-5 h-5" /> : '2'}
            </div>
            <span className={`text-xs font-medium ${currentStep >= 2 ? 'text-white' : 'text-slate-500'}`}>
              Skills & Coop
            </span>
            <span className="text-[10px] text-slate-400 hidden sm:inline">Affiliation & Trade</span>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col items-center text-center space-y-1.5">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm transition-all ${
              currentStep === 3 
                ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/30 ring-2 ring-cyan-400' 
                : isSubmitted
                  ? 'bg-emerald-500 text-slate-950 font-bold'
                  : 'bg-slate-800 text-slate-400'
            }`}>
              {isSubmitted ? <CheckCircle className="w-5 h-5" /> : '3'}
            </div>
            <span className={`text-xs font-medium ${currentStep === 3 ? 'text-white' : 'text-slate-500'}`}>
              Verification
            </span>
            <span className="text-[10px] text-slate-400 hidden sm:inline">Aadhaar & Licenses</span>
          </div>
        </div>
      </div>

      {/* Form Card Container */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
        
        {isSubmitted ? (
          /* Success Screen */
          <div className="text-center py-8 space-y-6 animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 bg-emerald-500/20 border-2 border-emerald-400 rounded-3xl mx-auto flex items-center justify-center text-emerald-400 shadow-xl shadow-emerald-500/20">
              <Sparkles className="w-10 h-10 animate-bounce" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Application Submitted Successfully!
              </h2>
              <p className="text-sm text-slate-300 max-w-md mx-auto">
                Welcome, <strong>{formData.firstName || 'Worker Member'}</strong>! Your membership application has been routed to the{' '}
                <strong className="text-cyan-300">
                  {MOCK_COOPERATIVES.find(c => c.id === formData.cooperativeId)?.name}
                </strong>{' '}
                for verification.
              </p>
            </div>

            {/* Preview Member ID Card */}
            <div className="max-w-md mx-auto p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-950 to-cyan-950 border border-cyan-500/40 text-left shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div>
                  <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider">
                    Member Provisional ID
                  </span>
                  <p className="text-base font-bold text-white">
                    {formData.firstName} {formData.lastName}
                  </p>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-medium">
                  PENDING VERIFICATION
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 text-[10px]">Trade / Skill</span>
                  <p className="text-white font-medium">{formData.trade}</p>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px]">Base Rate</span>
                  <p className="text-emerald-300 font-medium">₹{formData.hourlyRate}/hr</p>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-400 text-[10px]">Cooperative Society</span>
                  <p className="text-white font-medium truncate">
                    {MOCK_COOPERATIVES.find(c => c.id === formData.cooperativeId)?.name}
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
                <span>GPS Radius: 10km Haversine</span>
                <span className="text-cyan-400 font-mono">ID: SB-{Math.floor(100000 + Math.random() * 900000)}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <Link
                href="/services"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm transition-all"
              >
                Browse Services Platform
              </Link>
              <Link
                href="/dashboard"
                className="w-full sm:w-auto px-6 py-3 rounded-xl glass-panel text-white font-semibold text-sm hover:border-cyan-400/40 transition-all"
              >
                Go to Admin Verification Queue
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* STEP 1: Basic Info */}
            {currentStep === 1 && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div className="border-b border-white/10 pb-3">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <User className="w-5 h-5 text-cyan-400" />
                    <span>Step 1: Personal Details & Location</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Your direct contact and physical base coordinates for 10km client geo-matching.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      First Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Ramesh"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="w-full glass-input px-3.5 py-2.5 rounded-xl text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Kumar"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="w-full glass-input px-3.5 py-2.5 rounded-xl text-sm"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Mobile Phone (SMS & Booking Alerts) *
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="tel"
                        placeholder="+91 98450 12345"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full glass-input pl-10 pr-3.5 py-2.5 rounded-xl text-sm"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="email"
                        placeholder="worker@gmail.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full glass-input pl-10 pr-3.5 py-2.5 rounded-xl text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Location & GPS Detection */}
                <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-rose-400" />
                      <span>Home Base Location (Coordinates)</span>
                    </label>
                    <button
                      type="button"
                      onClick={detectLocation}
                      className="text-xs px-2.5 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/30 transition-colors"
                    >
                      Detect Live GPS
                    </button>
                  </div>

                  <input
                    type="text"
                    placeholder="Locality / Address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full glass-input px-3.5 py-2 rounded-xl text-sm"
                  />

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="bg-slate-950/60 px-3 py-2 rounded-xl border border-white/5">
                      <span className="text-slate-400 block text-[10px]">Latitude</span>
                      <span className="text-cyan-300 font-mono font-medium">{formData.latitude}</span>
                    </div>
                    <div className="bg-slate-950/60 px-3 py-2 rounded-xl border border-white/5">
                      <span className="text-slate-400 block text-[10px]">Longitude</span>
                      <span className="text-cyan-300 font-mono font-medium">{formData.longitude}</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-3">
                  <button
                    type="button"
                    onClick={nextStep}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all"
                  >
                    <span>Proceed to Skills & Cooperative</span>
                    <ArrowRight className="w-4 h-4 text-slate-950" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Skills & Cooperative Affiliation */}
            {currentStep === 2 && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div className="border-b border-white/10 pb-3">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-cyan-400" />
                    <span>Step 2: Skills & Cooperative Affiliation</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Select your registered Labour Cooperative Society and specialized service trades.
                  </p>
                </div>

                {/* Cooperative Society Selection */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-cyan-400" />
                    <span>Affiliated Cooperative Society *</span>
                  </label>
                  <select
                    value={formData.cooperativeId}
                    onChange={(e) => setFormData({ ...formData, cooperativeId: e.target.value })}
                    className="w-full glass-input px-3.5 py-2.5 rounded-xl text-sm"
                  >
                    {MOCK_COOPERATIVES.map((coop) => (
                      <option key={coop.id} value={coop.id} className="bg-slate-900 text-white">
                        {coop.name} ({coop.district} • {coop.members} members)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Primary Trade */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Primary Trade Category *
                    </label>
                    <select
                      value={formData.trade}
                      onChange={(e) => {
                        const newTrade = e.target.value;
                        setFormData({ 
                          ...formData, 
                          trade: newTrade,
                          selectedSkills: (availableSkillsForTrade[newTrade] || []).slice(0, 3)
                        });
                      }}
                      className="w-full glass-input px-3.5 py-2.5 rounded-xl text-sm"
                    >
                      {MOCK_CATEGORIES.map((cat) => (
                        <option key={cat.id} value={cat.name} className="bg-slate-900 text-white">
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Years of Field Experience
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={45}
                      value={formData.experienceYears}
                      onChange={(e) => setFormData({ ...formData, experienceYears: parseInt(e.target.value) || 1 })}
                      className="w-full glass-input px-3.5 py-2.5 rounded-xl text-sm"
                    />
                  </div>
                </div>

                {/* Hourly Rate */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Base Hourly Billing Rate (₹/hour)
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min={150}
                      max={1200}
                      step={25}
                      value={formData.hourlyRate}
                      onChange={(e) => setFormData({ ...formData, hourlyRate: parseInt(e.target.value) })}
                      className="flex-1 accent-cyan-400"
                    />
                    <span className="text-base font-bold text-cyan-300 bg-slate-900 px-3 py-1 rounded-xl border border-white/10 min-w-[100px] text-center">
                      ₹{formData.hourlyRate}/hr
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Your estimated take-home: <strong className="text-emerald-400">₹{(formData.hourlyRate * 0.8).toFixed(0)}/hr</strong> (80% direct payout).
                  </p>
                </div>

                {/* Skill Chips */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">
                    Specialized Competencies (Click to toggle)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {(availableSkillsForTrade[formData.trade] || []).map((skill) => {
                      const isSelected = formData.selectedSkills.includes(skill);
                      return (
                        <button
                          key={skill}
                          type="button"
                          onClick={() => handleSkillToggle(skill)}
                          className={`text-xs px-3 py-1.5 rounded-xl border transition-all ${
                            isSelected
                              ? 'bg-cyan-500/25 border-cyan-400 text-cyan-200 font-semibold shadow-sm'
                              : 'bg-slate-900/60 border-white/10 text-slate-400 hover:text-white'
                          }`}
                        >
                          {isSelected ? '✓ ' : '+ '}
                          {skill}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-4 py-2.5 rounded-xl glass-panel text-slate-300 hover:text-white text-xs sm:text-sm font-medium flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>

                  <button
                    type="button"
                    onClick={nextStep}
                    className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all"
                  >
                    <span>Proceed to Verification</span>
                    <ArrowRight className="w-4 h-4 text-slate-950" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Document Upload */}
            {currentStep === 3 && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div className="border-b border-white/10 pb-3">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <FileText className="w-5 h-5 text-cyan-400" />
                    <span>Step 3: Document Upload & Verification</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Upload official identity documents and trade certifications for Cooperative verification.
                  </p>
                </div>

                {/* Aadhaar Verification */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-300">
                    Aadhaar Card Number *
                  </label>
                  <input
                    type="text"
                    placeholder="XXXX - XXXX - 1234"
                    defaultValue="4821 9012 3456"
                    className="w-full glass-input px-3.5 py-2.5 rounded-xl text-sm font-mono"
                    required
                  />

                  {/* Dropzone for Aadhaar */}
                  <div className="border-2 border-dashed border-cyan-500/30 rounded-2xl p-4 text-center bg-slate-900/40 hover:bg-slate-900/70 transition-colors cursor-pointer flex flex-col items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center">
                      <UploadCloud className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-medium text-white block">
                        aadhaar_card_front_back.pdf
                      </span>
                      <span className="text-[10px] text-emerald-400 font-semibold flex items-center justify-center gap-1 mt-0.5">
                        <CheckCircle className="w-3 h-3" /> Ready for verification (1.4 MB)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Trade Certification / License */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-300">
                    Trade Certification / Technical License *
                  </label>
                  <input
                    type="text"
                    value={formData.certificateTitle}
                    onChange={(e) => setFormData({ ...formData, certificateTitle: e.target.value })}
                    className="w-full glass-input px-3.5 py-2.5 rounded-xl text-sm"
                    required
                  />

                  {/* Dropzone for Certificate */}
                  <div className="border-2 border-dashed border-teal-500/30 rounded-2xl p-4 text-center bg-slate-900/40 hover:bg-slate-900/70 transition-colors cursor-pointer flex flex-col items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center">
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-medium text-white block">
                        govt_iti_trade_license.pdf
                      </span>
                      <span className="text-[10px] text-emerald-400 font-semibold flex items-center justify-center gap-1 mt-0.5">
                        <CheckCircle className="w-3 h-3" /> Ready for verification (2.1 MB)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Cooperative Membership ID */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Existing Cooperative Society Membership Number (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.unionMembershipNumber}
                    onChange={(e) => setFormData({ ...formData, unionMembershipNumber: e.target.value })}
                    className="w-full glass-input px-3.5 py-2.5 rounded-xl text-sm font-mono"
                    placeholder="e.g. COOP-BLR-8910"
                  />
                </div>

                {/* Cooperative Charter Agreement */}
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-white/10 text-xs text-slate-400 space-y-1">
                  <div className="flex items-center gap-1.5 text-cyan-300 font-semibold">
                    <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>Cooperative Federation Member Charter</span>
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    By submitting, you agree to democratic member representation, peer skill reviews, and contribution to the 5% Worker Welfare Mutual Aid Fund.
                  </p>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-between pt-3">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-4 py-2.5 rounded-xl glass-panel text-slate-300 hover:text-white text-xs sm:text-sm font-medium flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/25 hover:brightness-110 active:scale-98 transition-all"
                  >
                    {isSubmitting ? (
                      <span>Submitting Registration...</span>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 text-slate-950" />
                        <span>Submit Application for Verification</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

          </form>
        )}

      </div>
    </div>
  );
}
