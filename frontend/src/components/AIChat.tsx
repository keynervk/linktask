import { useState } from 'react';
import api from '../services/api';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface Props {
  projectName: string;
  tasks: { title: string; status: string }[];
}

export default function AIChat({ projectName, tasks }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    const tasksSummary = tasks.map(t => `- ${t.title} (${t.status})`).join('\n');

    try {
      const response = await api.post('/tasks/ai', {
        messages: newMessages,
        systemPrompt: `Eres un asistente de gestión de proyectos integrado en LinkTask.
Estás ayudando con el proyecto "${projectName}".
Las tareas actuales son:
${tasksSummary || 'No hay tareas aún.'}
Responde siempre en español, de forma concisa y útil.`,
      });

      const assistantMessage: Message = {
        role: 'assistant',
        content: response.data.content[0].text,
      };
      setMessages([...newMessages, assistantMessage]);
    } catch (err) {
      setMessages([...newMessages, { role: 'assistant', content: 'Error al conectar con la IA. Intenta de nuevo.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 mt-8">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">🤖</span>
        <h3 className="text-white font-semibold text-lg">Asistente IA</h3>
        <span className="bg-indigo-500/30 text-indigo-300 text-xs px-2 py-1 rounded-full border border-indigo-500/30">LLaMA 3</span>
      </div>

      <div className="space-y-3 max-h-80 overflow-y-auto mb-4 pr-1">
        {messages.length === 0 && (
          <p className="text-white/30 text-sm text-center py-6">
            Pregúntame algo sobre tu proyecto 💡
          </p>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs lg:max-w-md px-4 py-2.5 rounded-2xl text-sm ${
              msg.role === 'user'
                ? 'bg-indigo-600 text-white rounded-br-sm'
                : 'bg-white/15 text-white/90 rounded-bl-sm'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white/15 text-white/50 px-4 py-2.5 rounded-2xl rounded-bl-sm text-sm">
              Pensando...
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          placeholder="Escribe tu pregunta..."
          className="flex-1 bg-white/10 border border-white/20 text-white placeholder-white/40 rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-400 transition text-sm"
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white px-4 py-2.5 rounded-xl transition font-medium text-sm"
        >
          Enviar
        </button>
      </div>
    </div>
  );
}