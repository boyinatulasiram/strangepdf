export interface ToolMetadata {
  id: string;
  name: string;
  category: 'conversion' | 'organization' | 'optimization' | 'editing' | 'security' | 'ocr';
  description: string;
  icon: string;
  popular?: boolean;
  acceptedFormats: string;
  multipleFiles?: boolean;
  endpoint: string;
}

export const TOOLS: ToolMetadata[] = [
  // Conversion
  {
    id: 'word-to-pdf',
    name: 'Word to PDF',
    category: 'conversion',
    description: 'Convert DOC and DOCX documents into clean, standard PDF files.',
    icon: 'FileText',
    popular: true,
    acceptedFormats: '.doc,.docx',
    endpoint: '/api/convert/word-to-pdf'
  },
  {
    id: 'pdf-to-word',
    name: 'PDF to Word',
    category: 'conversion',
    description: 'Extract and convert PDF pages into editable Microsoft Word DOCX documents.',
    icon: 'FileCode',
    popular: true,
    acceptedFormats: '.pdf',
    endpoint: '/api/convert/pdf-to-word'
  },
  {
    id: 'jpg-to-pdf',
    name: 'JPG to PDF',
    category: 'conversion',
    description: 'Turn JPG, PNG, and WebP images into a single or multi-page PDF.',
    icon: 'Image',
    popular: true,
    acceptedFormats: '.jpg,.jpeg,.png,.webp,.bmp',
    multipleFiles: true,
    endpoint: '/api/convert/jpg-to-pdf'
  },
  {
    id: 'pdf-to-jpg',
    name: 'PDF to JPG',
    category: 'conversion',
    description: 'Extract PDF pages as high-resolution JPG image files in individual or ZIP formats.',
    icon: 'FileImage',
    popular: true,
    acceptedFormats: '.pdf',
    endpoint: '/api/convert/pdf-to-jpg'
  },
  {
    id: 'excel-to-pdf',
    name: 'Excel to PDF',
    category: 'conversion',
    description: 'Convert Excel spreadsheets (XLS, XLSX) into formatted PDF reports.',
    icon: 'Sheet',
    acceptedFormats: '.xlsx,.xls',
    endpoint: '/api/convert/excel-to-pdf'
  },
  {
    id: 'pdf-to-excel',
    name: 'PDF to Excel',
    category: 'conversion',
    description: 'Detect and extract tabular document data directly into editable Excel sheets.',
    icon: 'Table',
    acceptedFormats: '.pdf',
    endpoint: '/api/convert/pdf-to-excel'
  },
  {
    id: 'powerpoint-to-pdf',
    name: 'PowerPoint to PDF',
    category: 'conversion',
    description: 'Convert presentation slide decks (PPT, PPTX) into PDF documents.',
    icon: 'Presentation',
    acceptedFormats: '.pptx,.ppt',
    endpoint: '/api/convert/powerpoint-to-pdf'
  },
  {
    id: 'pdf-to-powerpoint',
    name: 'PDF to PowerPoint',
    category: 'conversion',
    description: 'Turn your PDF pages into presentation-ready PowerPoint slides.',
    icon: 'Layers',
    acceptedFormats: '.pdf',
    endpoint: '/api/convert/pdf-to-powerpoint'
  },

  // Organization
  {
    id: 'merge-pdf',
    name: 'Merge PDF',
    category: 'organization',
    description: 'Combine multiple PDF documents into a single organized file in any order.',
    icon: 'GitMerge',
    popular: true,
    acceptedFormats: '.pdf',
    multipleFiles: true,
    endpoint: '/api/organize/merge'
  },
  {
    id: 'split-pdf',
    name: 'Split PDF',
    category: 'organization',
    description: 'Separate one PDF into independent pages or custom page ranges.',
    icon: 'Scissors',
    acceptedFormats: '.pdf',
    endpoint: '/api/organize/split'
  },
  {
    id: 'rotate-pdf',
    name: 'Rotate PDF',
    category: 'organization',
    description: 'Rotate individual or all pages by 90, 180, or 270 degrees.',
    icon: 'RotateCw',
    acceptedFormats: '.pdf',
    endpoint: '/api/organize/rotate'
  },
  {
    id: 'reorder-pdf',
    name: 'Reorder PDF',
    category: 'organization',
    description: 'Drag and rearrange PDF pages with interactive visual thumbnail previews.',
    icon: 'ArrowDownUp',
    acceptedFormats: '.pdf',
    endpoint: '/api/organize/reorder'
  },

  // Optimization
  {
    id: 'compress-pdf',
    name: 'Compress PDF',
    category: 'optimization',
    description: 'Reduce PDF file size with Low, Recommended, or Extreme genuine optimization.',
    icon: 'Minimize2',
    popular: true,
    acceptedFormats: '.pdf',
    endpoint: '/api/optimization/compress'
  },
  {
    id: 'repair-pdf',
    name: 'Repair PDF',
    category: 'optimization',
    description: 'Analyze and reconstruct damaged, corrupted, or unreadable PDF files.',
    icon: 'Wrench',
    acceptedFormats: '.pdf',
    endpoint: '/api/optimization/repair'
  },

  // Editing
  {
    id: 'add-text',
    name: 'Add Text',
    category: 'editing',
    description: 'Insert custom text, annotations, and notes onto any PDF page with custom colors.',
    icon: 'Type',
    acceptedFormats: '.pdf',
    endpoint: '/api/edit/add-text'
  },
  {
    id: 'page-numbers',
    name: 'Page Numbers',
    category: 'editing',
    description: 'Add clean page numbering with customizable positions and numbering formats.',
    icon: 'Hash',
    acceptedFormats: '.pdf',
    endpoint: '/api/edit/page-numbers'
  },
  {
    id: 'watermark',
    name: 'Watermark',
    category: 'editing',
    description: 'Stamp custom text or image watermarks with precise opacity and angle controls.',
    icon: 'Stamp',
    acceptedFormats: '.pdf',
    endpoint: '/api/edit/watermark'
  },
  {
    id: 'sign-pdf',
    name: 'Sign PDF',
    category: 'editing',
    description: 'Draw or upload a visual signature and stamp it precisely onto any document page.',
    icon: 'PenTool',
    acceptedFormats: '.pdf',
    endpoint: '/api/edit/sign'
  },

  // Security
  {
    id: 'protect-pdf',
    name: 'Protect PDF',
    category: 'security',
    description: 'Lock your PDF with strong industry-standard AES password encryption.',
    icon: 'Lock',
    acceptedFormats: '.pdf',
    endpoint: '/api/security/protect'
  },
  {
    id: 'remove-pdf-password',
    name: 'Remove PDF Password',
    category: 'security',
    description: 'Authenticate with your password and unlock your PDF for permanently unrestricted use.',
    icon: 'Unlock',
    acceptedFormats: '.pdf',
    endpoint: '/api/security/unlock'
  },
  {
    id: 'change-pdf-password',
    name: 'Change PDF Password',
    category: 'security',
    description: 'Verify your existing password and update your PDF with a new strong password.',
    icon: 'Key',
    acceptedFormats: '.pdf',
    endpoint: '/api/security/change-password'
  },
  {
    id: 'remove-pdf-restrictions',
    name: 'Remove Restrictions',
    category: 'security',
    description: 'Remove authorized printing, copying, and modification restrictions from PDFs.',
    icon: 'ShieldOff',
    acceptedFormats: '.pdf',
    endpoint: '/api/security/remove-restrictions'
  },

  // OCR
  {
    id: 'ocr',
    name: 'OCR PDF',
    category: 'ocr',
    description: 'Extract text from scanned PDF documents and image pages with OCR technology.',
    icon: 'ScanText',
    acceptedFormats: '.pdf',
    endpoint: '/api/ocr/extract-text'
  }
];
