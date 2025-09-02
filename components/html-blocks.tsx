'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Plus, 
  Type, 
  Image, 
  List, 
  Quote, 
  Code, 
  Video, 
  Mail,
  Phone,
  MapPin,
  Star,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';

interface HTMLBlock {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  html: string;
  category: 'text' | 'media' | 'layout' | 'contact' | 'features' | 'alerts';
}

const htmlBlocks: HTMLBlock[] = [
  // Text blocks
  {
    id: 'heading',
    name: 'Heading',
    description: 'Large title text',
    icon: Type,
    category: 'text',
    html: '<h1 class="text-4xl font-bold text-gray-900 mb-4">Your Heading Here</h1>'
  },
  {
    id: 'subheading',
    name: 'Subheading',
    description: 'Medium title text',
    icon: Type,
    category: 'text',
    html: '<h2 class="text-2xl font-semibold text-gray-800 mb-3">Your Subheading Here</h2>'
  },
  {
    id: 'paragraph',
    name: 'Paragraph',
    description: 'Regular text content',
    icon: Type,
    category: 'text',
    html: '<p class="text-gray-700 mb-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>'
  },
  {
    id: 'quote',
    name: 'Quote',
    description: 'Highlighted quote text',
    icon: Quote,
    category: 'text',
    html: '<blockquote class="border-l-4 border-blue-500 pl-4 italic text-gray-700 my-6">"This is an inspiring quote that will motivate your visitors."</blockquote>'
  },

  // Media blocks
  {
    id: 'image',
    name: 'Image',
    description: 'Image with caption',
    icon: Image,
    category: 'media',
    html: '<div class="my-6"><img src="https://via.placeholder.com/600x400" alt="Description" class="w-full rounded-lg shadow-md"><p class="text-sm text-gray-600 mt-2 text-center">Image caption</p></div>'
  },
  {
    id: 'video',
    name: 'Video',
    description: 'Embedded video player',
    icon: Video,
    category: 'media',
    html: '<div class="my-6"><div class="aspect-video bg-gray-200 rounded-lg flex items-center justify-center"><p class="text-gray-600">Video placeholder - replace with actual video embed</p></div></div>'
  },

  // Layout blocks
  {
    id: 'two-columns',
    name: 'Two Columns',
    description: 'Side-by-side content',
    icon: List,
    category: 'layout',
    html: '<div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-6"><div><h3 class="text-xl font-semibold mb-2">Left Column</h3><p class="text-gray-700">Content for the left column goes here.</p></div><div><h3 class="text-xl font-semibold mb-2">Right Column</h3><p class="text-gray-700">Content for the right column goes here.</p></div></div>'
  },
  {
    id: 'three-columns',
    name: 'Three Columns',
    description: 'Three-column layout',
    icon: List,
    category: 'layout',
    html: '<div class="grid grid-cols-1 md:grid-cols-3 gap-6 my-6"><div><h3 class="text-lg font-semibold mb-2">Column 1</h3><p class="text-gray-700">First column content.</p></div><div><h3 class="text-lg font-semibold mb-2">Column 2</h3><p class="text-gray-700">Second column content.</p></div><div><h3 class="text-lg font-semibold mb-2">Column 3</h3><p class="text-gray-700">Third column content.</p></div></div>'
  },

  // Contact blocks
  {
    id: 'contact-info',
    name: 'Contact Info',
    description: 'Contact details with icons',
    icon: Mail,
    category: 'contact',
    html: '<div class="bg-gray-50 p-6 rounded-lg my-6"><h3 class="text-xl font-semibold mb-4">Contact Information</h3><div class="space-y-3"><div class="flex items-center"><svg class="w-5 h-5 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg><span>contact@example.com</span></div><div class="flex items-center"><svg class="w-5 h-5 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg><span>+1 (555) 123-4567</span></div><div class="flex items-center"><svg class="w-5 h-5 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg><span>123 Main St, City, State 12345</span></div></div></div>'
  },

  // Feature blocks
  {
    id: 'feature-list',
    name: 'Feature List',
    description: 'List of features with checkmarks',
    icon: CheckCircle,
    category: 'features',
    html: '<div class="my-6"><h3 class="text-xl font-semibold mb-4">Key Features</h3><ul class="space-y-3"><li class="flex items-center"><svg class="w-5 h-5 mr-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg><span>Feature 1 - Description of the first feature</span></li><li class="flex items-center"><svg class="w-5 h-5 mr-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg><span>Feature 2 - Description of the second feature</span></li><li class="flex items-center"><svg class="w-5 h-5 mr-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg><span>Feature 3 - Description of the third feature</span></li></ul></div>'
  },
  {
    id: 'testimonial',
    name: 'Testimonial',
    description: 'Customer testimonial with stars',
    icon: Star,
    category: 'features',
    html: '<div class="bg-blue-50 p-6 rounded-lg my-6"><div class="flex items-center mb-3"><div class="flex text-yellow-400"><svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg><svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg><svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg><svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg><svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg></div></div><p class="text-gray-700 italic mb-2">"This is an amazing product that has transformed our business. Highly recommended!"</p><p class="text-sm text-gray-600">- John Doe, CEO of Company</p></div>'
  },

  // Alert blocks
  {
    id: 'success-alert',
    name: 'Success Alert',
    description: 'Green success message',
    icon: CheckCircle,
    category: 'alerts',
    html: '<div class="bg-green-50 border border-green-200 rounded-lg p-4 my-6"><div class="flex items-center"><svg class="w-5 h-5 mr-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg><p class="text-green-800 font-medium">Success!</p></div><p class="text-green-700 mt-1">Your operation completed successfully.</p></div>'
  },
  {
    id: 'warning-alert',
    name: 'Warning Alert',
    description: 'Yellow warning message',
    icon: AlertCircle,
    category: 'alerts',
    html: '<div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 my-6"><div class="flex items-center"><svg class="w-5 h-5 mr-3 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path></svg><p class="text-yellow-800 font-medium">Warning</p></div><p class="text-yellow-700 mt-1">Please review this information carefully.</p></div>'
  },
  {
    id: 'info-alert',
    name: 'Info Alert',
    description: 'Blue information message',
    icon: Info,
    category: 'alerts',
    html: '<div class="bg-blue-50 border border-blue-200 rounded-lg p-4 my-6"><div class="flex items-center"><svg class="w-5 h-5 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg><p class="text-blue-800 font-medium">Information</p></div><p class="text-blue-700 mt-1">Here is some helpful information for you.</p></div>'
  },

  // Code block
  {
    id: 'code-block',
    name: 'Code Block',
    description: 'Formatted code snippet',
    icon: Code,
    category: 'text',
    html: '<div class="bg-gray-900 text-gray-100 p-4 rounded-lg my-6 overflow-x-auto"><pre><code>// Example code snippet\nfunction hello() {\n  console.log("Hello, World!");\n}</code></pre></div>'
  }
];

interface HTMLBlocksProps {
  onInsertBlock: (html: string) => void;
}

export function HTMLBlocks({ onInsertBlock }: HTMLBlocksProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showPreview, setShowPreview] = useState<string | null>(null);

  const categories = [
    { id: 'all', name: 'All Blocks', icon: Plus },
    { id: 'text', name: 'Text', icon: Type },
    { id: 'media', name: 'Media', icon: Image },
    { id: 'layout', name: 'Layout', icon: List },
    { id: 'contact', name: 'Contact', icon: Mail },
    { id: 'features', name: 'Features', icon: CheckCircle },
    { id: 'alerts', name: 'Alerts', icon: AlertCircle },
  ];

  const filteredBlocks = selectedCategory === 'all' 
    ? htmlBlocks 
    : htmlBlocks.filter(block => block.category === selectedCategory);

  const handleInsertBlock = (block: HTMLBlock) => {
    onInsertBlock(block.html);
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-3">HTML Blocks</h3>
        <p className="text-sm text-gray-600 mb-4">
          Click on any block to insert it into your page content.
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className="flex items-center gap-2"
            >
              <Icon className="w-4 h-4" />
              {category.name}
            </Button>
          );
        })}
      </div>

      {/* Blocks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBlocks.map((block) => {
          const Icon = block.icon;
          return (
            <Card key={block.id} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <Icon className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <CardTitle className="text-base">{block.name}</CardTitle>
                    <CardDescription className="text-sm">
                      {block.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleInsertBlock(block)}
                    className="flex-1"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Insert
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowPreview(showPreview === block.id ? null : block.id)}
                  >
                    Preview
                  </Button>
                </div>
                
                {showPreview === block.id && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg border">
                    <div className="text-xs text-gray-600 mb-2">Preview:</div>
                    <div 
                      className="prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: block.html }}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
