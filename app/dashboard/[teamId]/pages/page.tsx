'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Edit, 
  Trash2, 
  FileText, 
  Globe,
  Eye,
  ExternalLink,
  Code
} from 'lucide-react';
import HTMLBlocksEnhanced from '@/components/html-blocks-enhanced';

interface Page {
  id: string;
  teamId: string;
  subdomain: string;
  title: string;
  content?: string;
  status: 'draft' | 'published' | 'archived';
  visibility: 'public' | 'private';
  metaTitle?: string;
  metaDescription?: string;
  createdAt: string;
  updatedAt: string;
}

export default function PagesPage() {
  const params = useParams<{ teamId: string }>();
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPage, setEditingPage] = useState<Page | null>(null);
  const [showHTMLBlocks, setShowHTMLBlocks] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [formData, setFormData] = useState({
    subdomain: '',
    title: '',
    content: '',
    status: 'draft' as 'draft' | 'published' | 'archived',
    visibility: 'public' as 'public' | 'private',
    metaTitle: '',
    metaDescription: ''
  });

  const fetchPages = useCallback(async () => {
    try {
      const response = await fetch(`/api/pages?teamId=${params.teamId}`);
      if (response.ok) {
        const data = await response.json();
        setPages(data.pages);
      }
    } catch (error) {
      console.error('Failed to fetch pages:', error);
    } finally {
      setLoading(false);
    }
  }, [params.teamId]);

  useEffect(() => {
    fetchPages();
  }, [params.teamId, fetchPages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const pageData = {
        teamId: params.teamId,
        subdomain: formData.subdomain,
        title: formData.title,
        content: formData.content || undefined,
        status: formData.status,
        visibility: formData.visibility,
        metaTitle: formData.metaTitle || undefined,
        metaDescription: formData.metaDescription || undefined
      };

      const url = editingPage ? `/api/pages/${editingPage.id}` : '/api/pages';
      const method = editingPage ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pageData),
      });

      if (response.ok) {
        await fetchPages();
        resetForm();
      } else {
        const errorData = await response.json();
        if (errorData.error && errorData.error.includes('UNIQUE constraint failed')) {
          alert('A page with this subdomain already exists for your team. Please choose a different subdomain.');
        } else {
          alert(`Failed to save page: ${errorData.error || 'Unknown error'}`);
        }
      }
    } catch (error) {
      console.error('Failed to save page:', error);
      alert('Failed to save page');
    }
  };

  const handleEdit = (page: Page) => {
    setEditingPage(page);
    setFormData({
      subdomain: page.subdomain,
      title: page.title,
      content: page.content || '',
      status: page.status,
      visibility: page.visibility,
      metaTitle: page.metaTitle || '',
      metaDescription: page.metaDescription || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (pageId: string) => {
    if (!confirm('Are you sure you want to delete this page?')) {
      return;
    }

    try {
      const response = await fetch(`/api/pages/${pageId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchPages();
      } else {
        alert('Failed to delete page');
      }
    } catch (error) {
      console.error('Failed to delete page:', error);
      alert('Failed to delete page');
    }
  };

  const resetForm = () => {
    setFormData({
      subdomain: '',
      title: '',
      content: '',
      status: 'draft',
      visibility: 'public',
      metaTitle: '',
      metaDescription: ''
    });
    setEditingPage(null);
    setShowForm(false);
    setShowHTMLBlocks(false);
    setShowPreview(false);
  };

  const handleInsertHTMLBlock = (html: string, css: string, js: string) => {
    const fullBlock = `
<!-- HTML Block Start -->
<style>
${css}
</style>
${html}
<script>
${js}
</script>
<!-- HTML Block End -->
`;
    setFormData(prev => ({
      ...prev,
      content: prev.content + '\n\n' + fullBlock
    }));
    setShowHTMLBlocks(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSubdomainUrl = (subdomain: string) => {
    // Get the current domain from window.location
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return `${subdomain}.localhost:3000`;
      }
      return `${subdomain}.${hostname}`;
    }
    // Fallback for server-side rendering
    return `${subdomain}.yourdomain.com`;
  };

  if (loading) {
    return <div className="p-6">Loading pages...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Pages</h1>
          <p className="text-gray-600">Manage your subdomain pages</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Page
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingPage ? 'Edit Page' : 'Add New Page'}</CardTitle>
            <CardDescription>
              {editingPage ? 'Update page information' : 'Create a new subdomain page'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="subdomain">Subdomain *</Label>
                  <Input
                    id="subdomain"
                    value={formData.subdomain}
                    onChange={(e) => setFormData({ ...formData, subdomain: e.target.value })}
                    required
                    placeholder="my-page"
                  />
                                     <p className="text-xs text-gray-500 mt-1">
                     Will be accessible at {getSubdomainUrl(formData.subdomain || 'subdomain')}
                   </p>
                </div>
                                 <div>
                   <Label htmlFor="status">Status</Label>
                   <select
                     id="status"
                     value={formData.status}
                     onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                   >
                     <option value="draft">Draft</option>
                     <option value="published">Published</option>
                     <option value="archived">Archived</option>
                   </select>
                 </div>
                 <div>
                   <Label htmlFor="visibility">Visibility</Label>
                   <select
                     id="visibility"
                     value={formData.visibility}
                     onChange={(e) => setFormData({ ...formData, visibility: e.target.value as any })}
                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                   >
                     <option value="public">Public</option>
                     <option value="private">Private</option>
                   </select>
                   <p className="text-xs text-gray-500 mt-1">
                     Public pages are accessible to everyone. Private pages require authentication.
                   </p>
                 </div>
              </div>
              
              <div>
                <Label htmlFor="title">Page Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  placeholder="Enter page title"
                />
              </div>
              
                             <div>
                 <div className="flex items-center justify-between mb-2">
                   <Label htmlFor="content">Content</Label>
                   <Button
                     type="button"
                     variant="outline"
                     size="sm"
                     onClick={() => setShowHTMLBlocks(!showHTMLBlocks)}
                   >
                     <Code className="w-4 h-4 mr-1" />
                     {showHTMLBlocks ? 'Hide' : 'Show'} HTML Blocks
                   </Button>
                 </div>
                 
                 {showHTMLBlocks && (
                   <div className="mb-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                     <HTMLBlocksEnhanced onInsertBlock={handleInsertHTMLBlock} />
                   </div>
                 )}
                 
                 <textarea
                   id="content"
                   value={formData.content}
                   onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                   placeholder="Enter page content (HTML supported)"
                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[200px]"
                 />
                 <p className="text-xs text-gray-500 mt-1">
                   You can use HTML tags or insert pre-built blocks above.
                 </p>
                 
                 {formData.content && (
                   <div className="mt-4">
                     <Button
                       type="button"
                       variant="outline"
                       size="sm"
                       onClick={() => setShowPreview(!showPreview)}
                     >
                       <Eye className="w-4 h-4 mr-1" />
                       {showPreview ? 'Hide' : 'Show'} Preview
                     </Button>
                     
                     {showPreview && (
                       <div className="mt-3 p-4 border border-gray-200 rounded-lg bg-white">
                         <div className="text-sm text-gray-600 mb-2">Preview:</div>
                         <div 
                           className="prose prose-sm max-w-none"
                           dangerouslySetInnerHTML={{ __html: formData.content }}
                         />
                       </div>
                     )}
                   </div>
                 )}
               </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="metaTitle">Meta Title</Label>
                  <Input
                    id="metaTitle"
                    value={formData.metaTitle}
                    onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                    placeholder="SEO title"
                  />
                </div>
                <div>
                  <Label htmlFor="metaDescription">Meta Description</Label>
                  <Input
                    id="metaDescription"
                    value={formData.metaDescription}
                    onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                    placeholder="SEO description"
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button type="submit">
                  {editingPage ? 'Update Page' : 'Create Page'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pages.map((page) => (
          <Card key={page.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{page.title}</CardTitle>
                  <CardDescription className="flex items-center gap-1">
                    <Globe className="w-3 h-3" />
                    {getSubdomainUrl(page.subdomain)}
                  </CardDescription>
                </div>
                                 <div className="flex gap-2">
                   <Badge className={getStatusColor(page.status)}>
                     {page.status}
                   </Badge>
                   <Badge className={page.visibility === 'private' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}>
                     {page.visibility}
                   </Badge>
                 </div>
              </div>
            </CardHeader>
            <CardContent>
              {page.metaDescription && (
                <p className="text-sm text-gray-600 mb-3">{page.metaDescription}</p>
              )}
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEdit(page)}
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                {page.status === 'published' && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open(`http://${getSubdomainUrl(page.subdomain)}`, '_blank')}
                  >
                    <ExternalLink className="w-4 h-4 mr-1" />
                    View
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDelete(page.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {pages.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No pages yet</h3>
          <p className="text-gray-600 mb-4">Create your first subdomain page to get started.</p>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Page
          </Button>
        </div>
      )}
    </div>
  );
}
