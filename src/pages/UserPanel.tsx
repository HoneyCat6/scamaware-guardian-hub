import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";

interface Thread {
  id: number;
  title: string;
  created_at: string;
}

interface Post {
  id: number;
  content: string;
  thread_id: number;
  created_at: string;
}

interface Article {
  id: number;
  title: string;
  published_at: string | null;
}

const UserPanel = () => {
  const { user } = useAuth();
  const [threads, setThreads] = useState<Thread[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [activeTab, setActiveTab] = useState<'threads' | 'posts' | 'articles'>('threads');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    // Fetch threads
    supabase
      .from('threads')
      .select('id, title, created_at')
      .eq('author_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data }) => setThreads(data || []));
    // Fetch posts
    supabase
      .from('posts')
      .select('id, content, thread_id, created_at')
      .eq('author_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data }) => setPosts(data || []));
    // Fetch articles
    supabase
      .from('articles')
      .select('id, title, published_at')
      .eq('author_id', user.id)
      .order('published_at', { ascending: false })
      .then(({ data }) => setArticles(data || []));
    setLoading(false);
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8 text-center">
          <h2 className="text-2xl font-bold mb-4">User Panel</h2>
          <p>You must be logged in to view your posts and articles.</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">My Content</h2>
        <div className="flex gap-4 mb-6">
          <Button variant={activeTab === 'threads' ? 'default' : 'outline'} onClick={() => setActiveTab('threads')}>Forum Threads</Button>
          <Button variant={activeTab === 'posts' ? 'default' : 'outline'} onClick={() => setActiveTab('posts')}>Forum Posts</Button>
          <Button variant={activeTab === 'articles' ? 'default' : 'outline'} onClick={() => setActiveTab('articles')}>News Articles</Button>
        </div>
        {loading && <div>Loading...</div>}
        {!loading && activeTab === 'threads' && (
          <div>
            <h3 className="text-xl font-semibold mb-2">My Forum Threads</h3>
            {threads.length === 0 ? <p>No threads found.</p> : (
              <ul className="space-y-2">
                {threads.map(thread => (
                  <li key={thread.id} className="border rounded p-4 flex justify-between items-center">
                    <div>
                      <Link to={`/forums/thread/${thread.id}`} className="font-medium hover:underline">{thread.title}</Link>
                      <div className="text-xs text-gray-500">{new Date(thread.created_at).toLocaleString()}</div>
                    </div>
                    <div className="flex gap-2">
                      <Link to={`/forums/thread/${thread.id}`}><Button size="sm">View</Button></Link>
                      {/* Add edit/delete actions as needed */}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
        {!loading && activeTab === 'posts' && (
          <div>
            <h3 className="text-xl font-semibold mb-2">My Forum Posts</h3>
            {posts.length === 0 ? <p>No posts found.</p> : (
              <ul className="space-y-2">
                {posts.map(post => (
                  <li key={post.id} className="border rounded p-4 flex justify-between items-center">
                    <div>
                      <div className="mb-1 text-gray-700">{post.content.slice(0, 100)}{post.content.length > 100 ? '...' : ''}</div>
                      <div className="text-xs text-gray-500">{new Date(post.created_at).toLocaleString()}</div>
                    </div>
                    <div className="flex gap-2">
                      <Link to={`/forums/thread/${post.thread_id}`}><Button size="sm">View</Button></Link>
                      {/* Add edit/delete actions as needed */}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
        {!loading && activeTab === 'articles' && (
          <div>
            <h3 className="text-xl font-semibold mb-2">My News Articles</h3>
            {articles.length === 0 ? <p>No articles found.</p> : (
              <ul className="space-y-2">
                {articles.map(article => (
                  <li key={article.id} className="border rounded p-4 flex justify-between items-center">
                    <div>
                      <Link to={`/news/${article.id}`} className="font-medium hover:underline">{article.title}</Link>
                      <div className="text-xs text-gray-500">{article.published_at ? new Date(article.published_at).toLocaleString() : "Not published"}</div>
                    </div>
                    <div className="flex gap-2">
                      <Link to={`/news/${article.id}`}><Button size="sm">View</Button></Link>
                      {/* Add edit/delete actions as needed */}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default UserPanel; 