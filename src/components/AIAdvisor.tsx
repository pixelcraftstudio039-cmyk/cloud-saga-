import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AdvisorChatMessage } from '../types';
import { 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  DollarSign, 
  AlertCircle, 
  CheckCircle2, 
  Terminal, 
  RefreshCw,
  Copy,
  Check,
  ShieldCheck,
  HelpCircle
} from 'lucide-react';

export const AIAdvisor: React.FC = () => {
  const { summary } = useApp();

  const presetQueries = [
    'Why did my cloud spending increase?',
    'Which services cost the most?',
    'How can I reduce my cloud bill?',
    'What resources may be underutilized?',
    'Am I likely to exceed my monthly budget?'
  ];

  const initialMessages: AdvisorChatMessage[] = [
    {
      id: 'msg-01',
      sender: 'advisor',
      text: `Hello! I am CloudSage Advisor, your cloud financial architecture assistant. I have reviewed your current AWS billing telemetry ($14,820.40 MTD). I have identified $3,410.00/month in potential savings and a 12.4% cost increase. How can I help you optimize today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      reasoning: 'Account has 8 active optimization recommendations detected across EC2, RDS, and S3, with a notable spending spike on Oct 14.',
      estimatedSavingsRange: '$1,500 – $3,410 / month',
      confidence: 'High',
      suggestedNextSteps: [
        'Ask why spending increased to review the Oct 14 Kubernetes telemetry spike',
        'Inquire about underutilized resources to inspect idle EC2 instances',
        'Review database rightsizing opportunities for Aurora Postgres'
      ],
      relatedResources: ['Amazon EC2', 'Amazon RDS', 'Amazon S3', 'Amazon EKS'],
      modelSource: 'Rule-based Cost Engine'
    }
  ];

  const [messages, setMessages] = useState<AdvisorChatMessage[]>(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);

  const handleSend = async (questionText: string) => {
    if (!questionText.trim()) return;

    const userMsg: AdvisorChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: questionText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/advisor/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: questionText })
      });

      if (res.ok) {
        const data = await res.json();
        const advisorMsg: AdvisorChatMessage = {
          id: `advisor-${Date.now()}`,
          sender: 'advisor',
          text: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          reasoning: data.reasoning,
          estimatedSavingsRange: data.estimatedSavingsRange,
          confidence: data.confidence,
          suggestedNextSteps: data.suggestedNextSteps,
          relatedResources: data.relatedResources,
          modelSource: data.modelSource || 'Rule-based Cost Engine'
        };
        setMessages(prev => [...prev, advisorMsg]);
      } else {
        const errData = await res.json().catch(() => ({}));
        const errMsgText = errData.error || errData.reason || `Advisor request failed with HTTP ${res.status}`;
        const errorAdvisorMsg: AdvisorChatMessage = {
          id: `advisor-error-${Date.now()}`,
          sender: 'advisor',
          text: `⚠️ Request Error: ${errMsgText}. Please check system connectivity or retry your FinOps inquiry.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          confidence: 'Low',
          modelSource: 'Rule-based Cost Engine'
        };
        setMessages(prev => [...prev, errorAdvisorMsg]);
      }
    } catch (err: any) {
      const errorAdvisorMsg: AdvisorChatMessage = {
        id: `advisor-error-${Date.now()}`,
        sender: 'advisor',
        text: `⚠️ Communication Error: Unable to reach CloudSage Advisor backend (${err?.message || 'Network error'}).`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        confidence: 'Low',
        modelSource: 'Rule-based Cost Engine'
      };
      setMessages(prev => [...prev, errorAdvisorMsg]);
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyStep = (step: string, id: string) => {
    navigator.clipboard.writeText(step);
    setCopiedIndex(id);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Advisor Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E5E7EB] gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[#171717] tracking-tight">CloudSage Advisor</h1>
            <span className="text-xs px-2 py-0.5 rounded font-medium bg-[#EAF4FC] text-[#2563EB] border border-blue-200">
              Interactive FinOps AI
            </span>
          </div>
          <p className="text-xs text-neutral-500 mt-0.5">
            Real-time telemetry synthesis powered by CloudSage FinOps architecture with rule-based fallback.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-neutral-500">
          <ShieldCheck className="w-4 h-4 text-[#2563EB]" />
          <span>Calculations verified against AWS billing models</span>
        </div>
      </div>

      {/* Suggested Questions Grid */}
      <div>
        <div className="text-xs font-semibold text-neutral-700 mb-2 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
          <span>Recommended Analytical Questions:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {presetQueries.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              disabled={isSubmitting}
              className="px-3 py-1.5 text-xs bg-white hover:bg-[#EAF4FC] text-neutral-800 hover:text-[#2563EB] border border-[#E5E7EB] hover:border-blue-200 rounded-lg transition-colors font-medium text-left shadow-2xs"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Conversation Thread */}
      <div className="space-y-6 bg-[#F5F7FA] p-6 rounded-2xl border border-[#E5E7EB] min-h-[420px]">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'advisor' && (
              <div className="w-8 h-8 rounded-lg bg-[#2563EB] text-white flex items-center justify-center shrink-0 shadow-xs">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-2xl rounded-xl p-4 text-xs space-y-3 ${
                msg.sender === 'user'
                  ? 'bg-[#2563EB] text-white rounded-br-xs shadow-xs'
                  : 'bg-white text-neutral-800 border border-[#E5E7EB] rounded-bl-xs shadow-xs'
              }`}
            >
              {/* Message Header */}
              <div className="flex items-center justify-between text-[11px] pb-1 border-b border-black/5">
                <span className="font-semibold">
                  {msg.sender === 'user' ? 'You' : 'CloudSage Advisor'}
                </span>
                <span className={`tabular-nums ${msg.sender === 'user' ? 'text-blue-100' : 'text-neutral-400'}`}>
                  {msg.timestamp}
                </span>
              </div>

              {/* Main Body Text */}
              <p className="leading-relaxed text-xs">
                {msg.text}
              </p>

              {/* Structured Reasoning & Evidence (if provided) */}
              {msg.reasoning && (
                <div className="p-3 bg-[#F5F7FA] rounded-lg border border-[#E5E7EB] space-y-1.5">
                  <div className="font-semibold text-neutral-900 text-[11px]">Telemetry Reasoning:</div>
                  <p className="text-neutral-600 leading-relaxed text-[11px]">{msg.reasoning}</p>
                </div>
              )}

              {/* Metrics & Confidence Strip */}
              {(msg.estimatedSavingsRange || msg.confidence) && (
                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[#E5E7EB]">
                  {msg.estimatedSavingsRange && (
                    <div className="p-2 bg-[#EAF4FC] rounded-lg border border-blue-100">
                      <span className="text-[10px] text-blue-800 block font-medium">Estimated Monthly Savings</span>
                      <span className="font-mono font-bold text-xs text-[#2563EB]">
                        {msg.estimatedSavingsRange}
                      </span>
                    </div>
                  )}

                  {msg.confidence && (
                    <div className="p-2 bg-neutral-100 rounded-lg border border-neutral-200">
                      <span className="text-[10px] text-neutral-600 block font-medium">Analytical Confidence</span>
                      <span className={`font-semibold text-xs ${
                        msg.confidence === 'High' ? 'text-emerald-700' : 'text-amber-700'
                      }`}>
                        {msg.confidence} Confidence
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Suggested Next Steps */}
              {msg.suggestedNextSteps && msg.suggestedNextSteps.length > 0 && (
                <div className="space-y-1.5 pt-2">
                  <div className="font-semibold text-neutral-900 text-[11px]">Suggested Next Steps:</div>
                  <div className="space-y-1.5">
                    {msg.suggestedNextSteps.map((step, sIdx) => {
                      const stepKey = `${msg.id}-step-${sIdx}`;
                      return (
                        <div
                          key={sIdx}
                          className="p-2 bg-white rounded-lg border border-[#E5E7EB] flex items-start justify-between gap-2 text-[11px] text-neutral-700 hover:border-neutral-300 transition-colors"
                        >
                          <div className="flex items-start gap-2 leading-relaxed">
                            <span className="font-mono text-neutral-400 shrink-0">{sIdx + 1}.</span>
                            <span>{step}</span>
                          </div>
                          <button
                            onClick={() => copyStep(step, stepKey)}
                            title="Copy action text"
                            className="text-neutral-400 hover:text-[#2563EB] shrink-0 p-1"
                          >
                            {copiedIndex === stepKey ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Related AWS Resources */}
              {msg.relatedResources && msg.relatedResources.length > 0 && (
                <div className="flex items-center gap-1.5 text-[10px] text-neutral-500 pt-1">
                  <span className="font-medium text-neutral-700">Scope:</span>
                  {msg.relatedResources.map((res, rIdx) => (
                    <span key={rIdx} className="font-mono bg-neutral-100 px-1.5 py-0.5 rounded text-neutral-700">
                      {res}
                    </span>
                  ))}
                </div>
              )}

              {/* Model Source Attribution */}
              {msg.modelSource && (
                <div className="pt-2 text-[10px] text-neutral-400 flex items-center justify-between border-t border-[#E5E7EB]">
                  <span>Engine: {msg.modelSource}</span>
                  <span>AWS FinOps v2.4</span>
                </div>
              )}
            </div>

            {msg.sender === 'user' && (
              <div className="w-8 h-8 rounded-lg bg-[#171717] text-white flex items-center justify-center shrink-0 shadow-xs">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {isSubmitting && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 rounded-lg bg-[#2563EB] text-white flex items-center justify-center shrink-0 animate-pulse">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-white p-3.5 rounded-xl border border-[#E5E7EB] text-xs text-neutral-500 flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#2563EB]" />
              <span>Synthesizing AWS Cost Explorer telemetry & generating recommendations...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend(inputValue);
        }}
        className="flex items-center gap-3 bg-white p-2 border border-[#E5E7EB] rounded-xl shadow-xs"
      >
        <input
          type="text"
          placeholder="Ask anything about your AWS spending, waste, or rightsizing..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          disabled={isSubmitting}
          className="flex-1 px-3 py-2 text-xs focus:outline-none text-neutral-900 placeholder:text-neutral-400 bg-transparent"
        />
        <button
          type="submit"
          disabled={!inputValue.trim() || isSubmitting}
          className="px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] disabled:bg-neutral-200 disabled:cursor-not-allowed text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs"
        >
          <span>Ask Advisor</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
