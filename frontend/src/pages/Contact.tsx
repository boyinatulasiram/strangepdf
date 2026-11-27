import React, { useState } from 'react';
import { Mail, Send, Radio, CheckCircle, Terminal } from 'lucide-react';

export const Contact: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="text-center space-y-2">
        <span className="text-xs font-mono font-bold text-strange-crimson uppercase tracking-widest">
          RADIO STATION CONTACT FREQUENCY
        </span>
        <h1 className="font-heading text-4xl sm:text-5xl text-strange-blood tracking-wide">
          CONTACT HAWKINS LAB
        </h1>
        <p className="text-xs font-mono text-strange-dark/70">
          Got feedback, feature ideas, or encountered a bizarre document anomaly? Send a transmission.
        </p>
      </div>

      <div className="bg-strange-card border-2 border-strange-tan rounded-2xl p-8 shadow-retro-lg">
        {submitted ? (
          <div className="text-center py-10 space-y-4">
            <div className="w-14 h-14 bg-strange-lime/30 text-strange-blood border-2 border-strange-lime rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="font-heading text-3xl text-strange-blood">TRANSMISSION RECEIVED</h3>
            <p className="text-xs font-mono text-strange-dark/80 max-w-sm mx-auto">
              Thank you for contacting StrangePDF. Our operators have logged your message into the Hawkins terminal.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
            <div>
              <label className="block text-strange-blood font-bold mb-1">OPERATOR NAME:</label>
              <input
                required
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Chief Hopper"
                className="w-full p-3 bg-strange-cream border border-strange-tan rounded focus:border-strange-crimson focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-strange-blood font-bold mb-1">CONTACT FREQUENCY (EMAIL):</label>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="hopper@hawkinspd.org"
                className="w-full p-3 bg-strange-cream border border-strange-tan rounded focus:border-strange-crimson focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-strange-blood font-bold mb-1">DISPATCH MESSAGE:</label>
              <textarea
                required
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe your inquiry or suggested document transformation..."
                className="w-full p-3 bg-strange-cream border border-strange-tan rounded focus:border-strange-crimson focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-strange-crimson hover:bg-strange-blood text-strange-cream font-mono font-bold text-sm rounded-lg border-2 border-strange-blood shadow-retro-crimson hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>SEND TRANSMISSION</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
