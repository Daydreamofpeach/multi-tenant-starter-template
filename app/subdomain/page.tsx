import { notFound, redirect } from 'next/navigation';
import { getPageBySubdomain, checkUserAccessToPage, getAuthCookie, getSession } from '@/lib/auth/utils';

interface SubdomainPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SubdomainPage({ searchParams }: SubdomainPageProps) {
  // Extract subdomain from search params (set by middleware)
  const params = await searchParams;
  const subdomain = params.subdomain as string;
  
  if (!subdomain) {
    notFound();
  }

  // Only show published pages
  const page = await getPageBySubdomain(subdomain);
  
  if (!page || page.status !== 'published') {
    notFound();
  }

  // Check if page is private and user has access
  if (page.visibility === 'private') {
    const sessionId = await getAuthCookie();
    if (!sessionId) {
      redirect('/auth/signin');
    }

    const session = await getSession(sessionId);
    if (!session) {
      redirect('/auth/signin');
    }

    const hasAccess = await checkUserAccessToPage(page.id, session.userId);
    if (!hasAccess) {
      notFound();
    }
  }

  return (
    <div className="subdomain-content">
      <header className="subdomain-header">
        <h1 className="subdomain-title">{page.title}</h1>
        {page.metaDescription && (
          <p className="subdomain-meta">{page.metaDescription}</p>
        )}
      </header>
      
      <main className="subdomain-content-body">
        {page.content ? (
          <div 
            dangerouslySetInnerHTML={{ __html: page.content }}
          />
        ) : (
          <p>No content available for this page.</p>
        )}
      </main>
      
      <footer className="mt-12 pt-8 border-t border-gray-200">
        <p className="text-sm text-gray-500 text-center">
          Powered by your multi-tenant platform
        </p>
      </footer>
    </div>
  );
}

export async function generateMetadata({ searchParams }: SubdomainPageProps) {
  const params = await searchParams;
  const subdomain = params.subdomain as string;
  
  if (!subdomain) {
    return {
      title: 'Page Not Found',
    };
  }

  const page = await getPageBySubdomain(subdomain);
  
  if (!page) {
    return {
      title: 'Page Not Found',
    };
  }

  return {
    title: page.metaTitle || page.title,
    description: page.metaDescription,
  };
}
