
import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, CheckCircle, ArrowRight, CreditCard, Smartphone } from 'lucide-react';
import { ChatMessage } from '../types';
import { chatWithSupport } from '../services/geminiService';
import { Button } from './Button';

export const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Hello! I am your NairaSense assistant. I can help you analyze spending or make quick transactions like "Send 5k to Mom".' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await chatWithSupport(input, messages);
      setMessages(prev => [...prev, { 
        role: 'model', 
        text: response.text, 
        transactionPreview: response.transactionPreview 
      }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "Sorry, I encountered an error. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmTransaction = (index: number) => {
    setMessages(prev => prev.map((msg, i) => {
      if (i === index && msg.transactionPreview) {
        return {
          ...msg,
          transactionPreview: { ...msg.transactionPreview, status: 'confirmed' }
        };
      }
      return msg;
    }));

    // Simulate system success message
    setTimeout(() => {
       const tx = messages[index].transactionPreview;
       setMessages(prev => [...prev, { 
         role: 'model', 
         text: `✅ Transaction Successful! ₦${tx?.amount.toLocaleString()} has been sent to ${tx?.recipient}. Reference: REF-${Math.random().toString(36).substr(2, 6).toUpperCase()}` 
       }]);
    }, 800);
  };

  const handleCancelTransaction = (index: number) => {
    setMessages(prev => prev.map((msg, i) => {
      if (i === index && msg.transactionPreview) {
        return {
          ...msg,
          transactionPreview: { ...msg.transactionPreview, status: 'cancelled' }
        };
      }
      return msg;
    }));
    
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'model', text: "Transaction cancelled." }]);
    }, 500);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">
      {/* Container to allow interactions only on elements */}
      <div className="pointer-events-auto flex flex-col items-end">
        {isOpen && (
          <div className="bg-white w-80 md:w-96 h-[500px] rounded-2xl shadow-2xl border border-slate-200 mb-4 flex flex-col overflow-hidden animate-fade-in-up">
              {/* Header */}
              <div className="bg-emerald-900 p-4 flex justify-between items-center text-white">
                  <div className="flex items-center gap-3">
                      <div className="bg-white/20 p-1.5 rounded-full backdrop-blur-sm">
                          <Bot className="w-5 h-5 text-emerald-100" />
                      </div>
                      <div>
                        <span className="font-bold block text-sm">NairaSense AI</span>
                        <span className="text-xs text-emerald-300 flex items-center">
                          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full mr-1.5 animate-pulse"></span>
                          Assistant Online
                        </span>
                      </div>
                  </div>
                  <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-1 rounded transition-colors">
                      <X className="w-5 h-5" />
                  </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
                  {messages.map((msg, idx) => (
                      <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                          <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                              msg.role === 'user' 
                              ? 'bg-emerald-600 text-white rounded-br-none' 
                              : 'bg-white text-slate-700 border border-slate-200 rounded-bl-none'
                          }`}>
                              {msg.text}
                          </div>

                          {/* Transaction Card */}
                          {msg.transactionPreview && (
                            <div className={`mt-2 max-w-[85%] bg-white rounded-xl border-2 overflow-hidden shadow-md animate-fade-in ${
                              msg.transactionPreview.status === 'confirmed' ? 'border-emerald-200' : 
                              msg.transactionPreview.status === 'cancelled' ? 'border-slate-200 opacity-60' : 'border-emerald-500'
                            }`}>
                              <div className="bg-slate-50 p-3 border-b border-slate-100 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                   <div className={`p-1.5 rounded-lg ${msg.transactionPreview.type === 'airtime' ? 'bg-orange-100 text-orange-600' : 'bg-emerald-100 text-emerald-600'}`}>
                                      {msg.transactionPreview.type === 'airtime' ? <Smartphone size={16} /> : <CreditCard size={16} />}
                                   </div>
                                   <span className="text-xs font-bold text-slate-700 uppercase">{msg.transactionPreview.type}</span>
                                </div>
                                <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                                  msg.transactionPreview.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' : 
                                  msg.transactionPreview.status === 'cancelled' ? 'bg-slate-200 text-slate-500' : 'bg-amber-100 text-amber-700'
                                }`}>
                                  {msg.transactionPreview.status}
                                </span>
                              </div>
                              <div className="p-4">
                                 <p className="text-xs text-slate-500 mb-1">Total Amount</p>
                                 <p className="text-2xl font-bold text-slate-900 mb-4">₦{msg.transactionPreview.amount.toLocaleString()}</p>
                                 
                                 <div className="flex justify-between items-center text-sm mb-4">
                                   <span className="text-slate-500">Recipient</span>
                                   <span className="font-semibold text-slate-800">{msg.transactionPreview.recipient}</span>
                                 </div>
                                 
                                 {msg.transactionPreview.status === 'pending' && (
                                   <div className="flex gap-2 mt-2">
                                     <button 
                                       onClick={() => handleCancelTransaction(idx)}
                                       className="flex-1 py-2 rounded-lg border border-slate-300 text-slate-600 text-xs font-bold hover:bg-slate-50 transition-colors"
                                     >
                                       Cancel
                                     </button>
                                     <button 
                                       onClick={() => handleConfirmTransaction(idx)}
                                       className="flex-1 py-2 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors flex items-center justify-center"
                                     >
                                       Pay Now <ArrowRight className="w-3 h-3 ml-1" />
                                     </button>
                                   </div>
                                 )}
                                 
                                 {msg.transactionPreview.status === 'confirmed' && (
                                    <div className="flex items-center justify-center gap-2 py-2 text-emerald-600 font-bold text-sm bg-emerald-50 rounded-lg">
                                       <CheckCircle className="w-4 h-4" /> Paid Successfully
                                    </div>
                                 )}
                              </div>
                            </div>
                          )}
                      </div>
                  ))}
                  {isLoading && (
                      <div className="flex justify-start">
                          <div className="bg-white border border-slate-200 p-3 rounded-2xl rounded-bl-none shadow-sm">
                              <div className="flex gap-1.5">
                                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-75"></span>
                                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-150"></span>
                              </div>
                          </div>
                      </div>
                  )}
                  <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-3 bg-white border-t border-slate-100 flex gap-2 items-center">
                  <input 
                      type="text" 
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                      placeholder='Try "Send 5k to Tunde"...'
                      className="flex-1 bg-slate-100 border-transparent focus:bg-white focus:border-emerald-300 rounded-full px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
                  />
                  <button 
                      onClick={handleSend}
                      disabled={isLoading || !input.trim()}
                      className="p-2.5 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                  >
                      <Send className="w-4 h-4" />
                  </button>
              </div>
          </div>
        )}

        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="h-14 w-14 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-xl shadow-emerald-900/20 flex items-center justify-center transition-all transform hover:scale-110 active:scale-95 group"
        >
          {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-7 h-7 group-hover:animate-pulse" />}
        </button>
      </div>
    </div>
  );
};
