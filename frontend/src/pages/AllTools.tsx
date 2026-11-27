import React, { useState } from 'react';
import { TOOLS, ToolMetadata } from '../data/tools';
import { ToolCard } from '../components/ToolCard';
import { Search, Filter } from 'lucide-react';

interface AllToolsProps {
  onSelectTool: (toolId: string) => void;
}

export const AllTools: React.FC<AllToolsProps> = ({ onSelectTool }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    { id: 'all', label: 'All Tools' },
    { id: 'conversion', label: 'Conversion' },
    { id: 'organization', label: 'Organization' },
    { id: 'optimization', label: 'Optimization' },
    { id: 'editing', label: 'Editing' },
    { id: 'security', label: 'Security' },
    { id: 'ocr', label: 'OCR' }
  ];

  const filteredTools = TOOLS.filter((tool) => {
    const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
    const matchesSearch =
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Title & Search bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b-2 border-strange-tan">
        <div>
          <span className="text-xs font-mono font-bold text-strange-crimson uppercase tracking-widest">
            THE COMPLETE ARCHIVE
          </span>
          <h1 className="font-heading text-4xl sm:text-5xl text-strange-blood tracking-wide mt-1">
            ALL STRANGEPDF TOOLS
          </h1>
        </div>

        {/* Search input */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tools (e.g. compress, word, sign)..."
            className="w-full pl-10 pr-4 py-2.5 bg-strange-card border-2 border-strange-tan rounded-lg text-xs font-mono placeholder:text-strange-tan focus:outline-none focus:border-strange-crimson shadow-retro"
          />
          <Search className="w-4 h-4 text-strange-crimson absolute left-3.5 top-3.5" />
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-lg font-mono font-bold text-xs uppercase tracking-wider shrink-0 transition-all ${
              selectedCategory === cat.id
                ? 'bg-strange-crimson text-strange-cream border-2 border-strange-blood shadow-retro-crimson'
                : 'bg-strange-card text-strange-blood border-2 border-strange-tan hover:bg-strange-cream shadow-sm'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Tool Grid */}
      {filteredTools.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} onClick={() => onSelectTool(tool.id)} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-strange-card border-2 border-dashed border-strange-tan rounded-xl">
          <p className="font-heading text-2xl text-strange-blood">NO STRANGE TOOLS FOUND</p>
          <p className="text-xs font-mono text-strange-tan mt-1">Try searching for something else or clearing filters.</p>
        </div>
      )}

    </div>
  );
};
