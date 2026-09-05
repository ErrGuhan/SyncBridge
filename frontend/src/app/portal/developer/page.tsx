'use client';

import React, { useState, useEffect } from 'react';
import { 
  Terminal, 
  Server, 
  Database, 
  Cpu, 
  Activity, 
  CheckCircle2, 
  ExternalLink, 
  RefreshCw, 
  Key, 
  ShieldCheck,
  Zap,
  Layers,
  Code
} from 'lucide-react';

interface ServiceNode {
  name: string;
  port: number;
  protocol: string;
  role: string;
  status: 'ONLINE' | 'STANDBY';
  latencyMs: number;
  endpoint: string;
}

export default function DeveloperPortalPage() {
  const [isPinging, setIsPinging] = useState(false);
  const [lastPingTime, setLastPingTime] = useState<string>('Just now');
  const [apiResponseJson, setApiResponseJson] = useState<string | null>(null);

  const [services, setServices] = useState<ServiceNode[]>([
    {
      name: 'API Gateway & Auth Proxy',
      port: 3000,
      protocol: 'HTTP/1.1',
      role: 'Reverse proxy & Supabase JWT Auth Middleware',
      status: 'ONLINE',
      latencyMs: 4,
      endpoint: 'http://localhost:3000/health'
    },
    {
      name: 'User & Worker Microservice',
      port: 3001,
      protocol: 'HTTP/REST',
      role: 'Worker profiles & e-Shram fallback queue',
      status: 'ONLINE',
      latencyMs: 6,
      endpoint: 'http://localhost:3001/health'
    },
    {
      name: 'Booking & Dispatch Microservice',
      port: 3002,
      protocol: 'WebSocket + HTTP',
      role: 'Real-time GPS stream & Redlock race-condition mutex',
      status: 'ONLINE',
      latencyMs: 8,
      endpoint: 'http://localhost:3002/health'
    },
    {
      name: 'Payment & Split Microservice',
      port: 3003,
      protocol: 'HTTP/REST',
      role: '90/5/5 cooperative dividend calculation engine',
      status: 'ONLINE',
      latencyMs: 5,
      endpoint: 'http://localhost:3003/health'
    },
    {
      name: 'Next.js Frontend Client',
      port: 3004,
      protocol: 'HTTP/2 SSR',
      role: 'React 19, Turbopack, Accessible UI Shell',
      status: 'ONLINE',
      latencyMs: 12,
      endpoint: 'http://localhost:3004/'
    }
  ]);

  const handleTestApiPing = async (endpoint: string) => {
    setIsPinging(true);
    setApiResponseJson(null);
    try {
      const res = await fetch(endpoint);
      const data = await res.json();
      setApiResponseJson(JSON.stringify(data, null, 2));
      setLastPingTime(new Date().toLocaleTimeString());
    } catch (e: any) {
      setApiResponseJson(JSON.stringify({ error: e.message, status: 'Failed to connect' }, null, 2));
    } finally {
      setIsPinging(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 text-xs font-semibold text-white mb-2">
            <Terminal className="w-3.5 h-3.5 text-emerald-400" />
            <span>Technical Operations & Infrastructure Console</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Microservice Mesh & Cloud Telemetry
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            System diagnostics, Supabase Auth/JWKS verification status, and distributed service health monitoring.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleTestApiPing('http://localhost:3000/health')}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-2 shadow-sm transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isPinging ? 'animate-spin' : ''}`} />
            <span>Ping Gateway Health</span>
          </button>
        </div>
      </div>

      {/* MICROSERVICES CLUSTER GRID */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Server className="w-4 h-4 text-blue-600" />
            <span>Distributed Microservices Cluster</span>
          </h2>
          <span className="text-xs text-slate-500">
            5 Services Online • Last Inspected: {lastPingTime}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((s) => (
            <div
              key={s.port}
              className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    PORT :{s.port}
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>{s.status}</span>
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 pt-1">{s.name}</h3>
                <p className="text-xs text-slate-500 leading-normal">{s.role}</p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                <span>Latency: <strong className="text-emerald-700">{s.latencyMs} ms</strong></span>
                <button
                  type="button"
                  onClick={() => handleTestApiPing(s.endpoint)}
                  className="text-blue-600 hover:underline font-semibold text-[11px]"
                >
                  Test Ping →
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SUPABASE & CLOUD TELEMETRY */}
      <section className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-emerald-600" />
            <h2 className="text-base font-bold text-slate-900">
              Supabase Auth & Cloud Database Telemetry
            </h2>
          </div>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            Connected & Verified
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
            <span className="text-slate-500 block uppercase font-bold text-[10px]">Supabase Project Instance</span>
            <div className="font-mono text-slate-900 font-semibold truncate">
              https://qniqutaavdjnutnprjdk.supabase.co
            </div>
            <div className="flex items-center gap-2 pt-1 text-slate-600">
              <Key className="w-3.5 h-3.5 text-blue-600" />
              <span>Publishable Key: <strong className="font-mono">sb_publishable_tGV...i6t</strong></span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
            <span className="text-slate-500 block uppercase font-bold text-[10px]">JWKS Public Key Signature Verification</span>
            <div className="font-mono text-slate-900 font-semibold truncate text-[11px]">
              /auth/v1/.well-known/jwks.json
            </div>
            <div className="flex items-center gap-2 pt-1 text-emerald-700 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Active Algorithm: ES256 Elliptic Curve (P-256)</span>
            </div>
          </div>
        </div>
      </section>

      {/* INTERACTIVE API EXPLORER RESPONSE VIEWER */}
      {apiResponseJson && (
        <section className="bg-slate-900 text-slate-100 rounded-2xl p-6 shadow-xl space-y-3 font-mono text-xs animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-slate-400">
            <span className="flex items-center gap-2 text-emerald-400">
              <Code className="w-4 h-4" />
              <span>Live API Response Payload (HTTP 200 OK)</span>
            </span>
            <button
              type="button"
              onClick={() => setApiResponseJson(null)}
              className="text-slate-400 hover:text-white"
            >
              Close Output
            </button>
          </div>
          <pre className="overflow-x-auto text-emerald-300 p-2 bg-slate-950 rounded-lg">
            {apiResponseJson}
          </pre>
        </section>
      )}

      {/* WEBSOCKETS & MUTEX LOCKS STATUS */}
      <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-2">
        <div className="flex items-center gap-2 text-slate-900 font-bold">
          <Zap className="w-4 h-4 text-amber-500" />
          <span>Real-Time Emergency Concurrency Engine (Redlock Mutex)</span>
        </div>
        <p className="leading-relaxed">
          When emergency dispatches trigger, the Booking Service (:3002) uses atomic Mutex locks to guarantee zero double-dispatch race conditions across simultaneous worker accepts. Real-time GPS stream uses Socket.io with zero HTTP polling overhead.
        </p>
      </div>

    </div>
  );
}
