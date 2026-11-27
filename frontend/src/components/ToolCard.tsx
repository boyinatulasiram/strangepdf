import React from 'react';
import * as Icons from 'lucide-react';
import { ToolMetadata } from '../data/tools';

interface ToolCardProps {
  tool: ToolMetadata;
  onClick: () => void;
}

export const ToolCard: React.FC<ToolCardProps> = ({ tool, onClick }) => {
  // Dynamically resolve lucide icon
  const IconComponent = (Icons as any)[tool.icon] || Icons.FileText;

  return (
    <button
      onClick={onClick}
      className="group text-left relative flex flex-col justify-between p-6 bg-strange-card border-2 border-strange-tan rounded-xl shadow-retro hover:shadow-retro-crimson hover:-translate-y-1 hover:-translate-x-0.5 transition-all duration-200 overflow-hidden"
    >
      {/* Decorative corner tag for popular items */}
      {tool.popular && (
        <span className="absolute top-0 right-0 bg-strange-crimson text-strange-cream text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-bl-lg uppercase tracking-wider border-l border-b border-strange-blood">
          POPULAR
        </span>
      )}

      <div>
        {/* Icon Container */}
        <div className="w-12 h-12 rounded-lg bg-strange-cream border border-strange-tan flex items-center justify-center text-strange-crimson group-hover:bg-strange-crimson group-hover:text-strange-cream group-hover:rotate-6 transition-all duration-300 shadow-sm mb-4">
          <IconComponent className="w-6 h-6" />
        </div>

        {/* Title */}
        <h3 className="font-heading text-2xl tracking-wide text-strange-blood group-hover:text-strange-crimson transition-colors">
          {tool.name}
        </h3>

        {/* Description */}
        <p className="mt-2 text-xs font-body text-strange-dark/80 line-clamp-2 leading-relaxed">
          {tool.description}
        </p>
      </div>

      {/* Footer / Badge */}
      <div className="mt-5 pt-3 border-t border-strange-tan/40 flex items-center justify-between text-[11px] font-mono text-strange-tan group-hover:text-strange-blood transition-colors">
        <span className="uppercase">{tool.category}</span>
        <span className="flex items-center gap-1 font-bold">
          OPEN <Icons.ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
        </span>
      </div>
    </button>
  );
};
