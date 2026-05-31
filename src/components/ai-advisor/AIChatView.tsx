'use client';

import { useState, useRef, useEffect } from 'react';
import { useAppStore } from '@/store/appStore';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Send, Bot, User, Trash2, AlertCircle } from 'lucide-react';
import type { AIMessage } from '@/types';

const QUICK_QUESTIONS = [
  'Co si můžu dát dnes k večeři s 0g sacharidů?',
  'Jak zvýšit příjem bílkovin bez masa?',
  'Proč nemohu hubnout přes plateau?',
  'Jaké svačiny jsou vhodné pro nízkosacharidový den?',
  'Kolik bílkovin potřebuji pro udržení svalů?',
  'Doporučeš levné zdroje bílkovin?',
];

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}

export function AIChatView() {
  const { profile, macroTargets, aiMessages, addAIMessage, clearAIMessages } = useAppStore();
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [aiMessages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;
    setError(null);

    const userMsg: AIMessage = {
      id: uuidv4(),
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };
    addAIMessage(userMsg);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/ai-advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          profile,
          macroTargets,
          history: aiMessages.slice(-10),
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Chyba při komunikaci s AI');
      }

      const data = await response.json();
      const aiMsg: AIMessage = {
        id: uuidv4(),
        role: 'assistant',
        content: data.reply,
        timestamp: new Date().toISOString(),
      };
      addAIMessage(aiMsg);
    } catch (err: any) {
      setError(err.message || 'Nastala chyba. Zkontroluj připojení nebo API klíč.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] lg:h-[calc(100vh-6rem)] animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Bot size={24} className="text-green-600" />
            AI Výživový rádce
          </h1>
          <p className="text-sm text-slate-500">Zeptej se na cokoli ohledně výživy a hubnutí</p>
        </div>
        {aiMessages.length > 0 && (
          <button
            onClick={clearAIMessages}
            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
            title="Smazat konverzaci"
          >
            <Trash2 size={18} />
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 mb-4 scrollbar-hide">
        {aiMessages.length === 0 ? (
          <div className="space-y-4">
            <Card>
              <CardContent className="p-4 text-center">
                <Bot size={40} className="text-green-500 mx-auto mb-2" />
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">Ahoj! Jsem tvůj AI výživový rádce.</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Zeptej se mě na cokoli ohledně jídla, hubnutí nebo výživy.
                  {profile && ` Vím o tvém profilu a cílech.`}
                </p>
              </CardContent>
            </Card>

            <div>
              <p className="text-xs font-medium text-slate-500 mb-2">Rychlé otázky:</p>
              <div className="flex flex-wrap gap-2">
                {QUICK_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    onClick={() => sendMessage(q)}
                    className="text-xs px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full hover:bg-green-50 dark:hover:bg-green-900/20 hover:border-green-300 hover:text-green-700 dark:hover:text-green-400 transition-colors text-slate-700 dark:text-slate-300"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-start gap-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl p-3 text-xs text-amber-800 dark:text-amber-300">
              <AlertCircle size={14} className="shrink-0 mt-0.5" />
              <span>AI rádce poskytuje obecné rady, nenahrazuje lékaře ani nutričního specialistu.</span>
            </div>
          </div>
        ) : (
          <>
            {aiMessages.map((msg) => (
              <div key={msg.id} className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${msg.role === 'user' ? 'bg-green-600' : 'bg-slate-700 dark:bg-slate-600'}`}>
                  {msg.role === 'user'
                    ? <User size={16} className="text-white" />
                    : <Bot size={16} className="text-white" />
                  }
                </div>
                <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                  msg.role === 'user'
                    ? 'bg-green-600 text-white rounded-tr-sm'
                    : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-sm border border-slate-100 dark:border-slate-700 rounded-tl-sm'
                }`}>
                  <div className="whitespace-pre-wrap leading-relaxed">{msg.content}</div>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-start gap-3">
                <div className="shrink-0 w-8 h-8 rounded-full bg-slate-700 dark:bg-slate-600 flex items-center justify-center">
                  <Bot size={16} className="text-white" />
                </div>
                <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                  <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <div key={i} className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl p-3 text-sm text-red-700 dark:text-red-300 flex items-center gap-2">
                <AlertCircle size={14} />
                {error}
              </div>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="flex items-end gap-2">
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Zeptej se na cokoli... (Enter = odeslat)"
          rows={1}
          className="flex-1 px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none text-sm leading-relaxed"
          style={{ minHeight: '44px', maxHeight: '120px' }}
          onInput={(e) => {
            const t = e.currentTarget;
            t.style.height = 'auto';
            t.style.height = Math.min(t.scrollHeight, 120) + 'px';
          }}
        />
        <Button type="submit" disabled={!input.trim() || loading} size="md" className="shrink-0">
          <Send size={16} />
        </Button>
      </form>
    </div>
  );
}
