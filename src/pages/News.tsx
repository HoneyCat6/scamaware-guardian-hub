import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type Article = Database["public"]["Tables"]["articles"]["Row"];

// Fisher-Yates shuffle
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const News = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Initialize state from URL params or defaults
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "All");
  const [sortOrder, setSortOrder] = useState(searchParams.get("sort") || "Newest");
  const [articleToDelete, setArticleToDelete] = useState<number | null>(null);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("search", searchQuery);
    if (selectedCategory !== "All") params.set("category", selectedCategory);
    if (sortOrder !== "Newest") params.set("sort", sortOrder);
    setSearchParams(params);
  }, [searchQuery, selectedCategory, sortOrder, setSearchParams]);

  const { user } = useAuth();
  const { toast } = useToast();

  const canEditArticles = user && (user.role === 'moderator' || user.role === 'admin');

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      setError(null);
      try {
        // First check if we can connect to Supabase
        const { data: connectionTest, error: connectionError } = await supabase
          .from('articles')
          .select('count');

        if (connectionError) {
          console.error('Database connection error:', connectionError);
          setError("Failed to connect to the database. Please try again later.");
          setArticles([]);
          return;
        }

        // Fetch approved articles
        const { data, error } = await supabase
          .from("articles")
          .select("*")
          .eq('status', 'approved')
          .order('published_at', { ascending: false });
        
        if (error) {
          console.error('Error fetching articles:', error);
          setError("Failed to load articles. Please try again later.");
          setArticles([]);
        } else {
          if (!data || data.length === 0) {
            setArticles([]);
            setError("No articles found.");
          } else {
            setArticles(data);
          }
        }
      } catch (err) {
        console.error('Unexpected error:', err);
        setError("An unexpected error occurred. Please try again later.");
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  // Get unique categories from articles, sorted A-Z, with 'All' first
  const categories = [
    "All",
    ...Array.from(new Set(articles.map(article => article.category)))
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b))
  ];

  const handleDeleteArticle = async (articleId: number) => {
    const { error } = await supabase.from("articles").delete().eq("id", articleId);
    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete article.",
        variant: "destructive",
      });
    } else {
      setArticles(prev => prev.filter(article => article.id !== articleId));
      toast({
        title: "Article deleted",
        description: "The article has been successfully removed.",
      });
    }
  };

  const handleDeleteConfirm = async () => {
    if (!articleToDelete) return;

    const { error } = await supabase.from("articles").delete().eq("id", articleToDelete);
    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete article.",
        variant: "destructive",
      });
    } else {
      setArticles(prev => prev.filter(article => article.id !== articleToDelete));
      toast({
        title: "Article deleted",
        description: "The article has been successfully removed.",
      });
    }
    setArticleToDelete(null);
  };

  let filteredArticles = articles.filter(article => {
    const query = searchQuery.toLowerCase();
    const matchesCategory = selectedCategory === "All" || article.category === selectedCategory;
    const matchesQuery =
      article.title.toLowerCase().includes(query) ||
      article.content.toLowerCase().includes(query) ||
      article.excerpt.toLowerCase().includes(query) ||
      article.author.toLowerCase().includes(query);
    return matchesCategory && matchesQuery;
  });

  // Sort articles by date
  filteredArticles = filteredArticles.sort((a, b) => {
    const dateA = new Date(a.published_at || 0).getTime();
    const dateB = new Date(b.published_at || 0).getTime();
    return sortOrder === "Newest" ? dateB - dateA : dateA - dateB;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Scam News & Alerts</h1>
            <p className="text-gray-600 mt-2">Stay informed about the latest scam threats and protection strategies</p>
          </div>
          {user ? (
            <Link to="/create-article">
              <Button className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                {canEditArticles ? 'Create Article' : 'Submit Article'}
              </Button>
            </Link>
          ) : (
            <Link to="/login">
              <Button variant="outline" className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Login to Submit Article
              </Button>
            </Link>
          )}
        </div>
        {/* Search, Sort, and Category Filter */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:gap-4 gap-2">
          <div className="flex gap-2 w-full md:w-auto">
            <div className="relative max-w-md w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="w-56">
              <select
                value={sortOrder}
                onChange={e => setSortOrder(e.target.value)}
                className="w-full px-3 py-2 border rounded-md text-gray-700 bg-white"
              >
                <option value="Newest">Newest first</option>
                <option value="Oldest">Oldest first</option>
              </select>
            </div>
          </div>
          <div className="w-full md:w-60">
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border rounded-md text-gray-700 bg-white"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
        {loading && (
          <div className="flex justify-center items-center py-12">
            <span className="text-gray-500">Loading articles...</span>
          </div>
        )}
        {error && (
          <div className="flex justify-center items-center py-12">
            <span className="text-red-500">{error}</span>
          </div>
        )}
        {!loading && !error && searchQuery && (
          <p className="text-sm text-gray-600 mt-2">
            Found {filteredArticles.length} article{filteredArticles.length !== 1 ? 's' : ''} matching "{searchQuery}"
          </p>
        )}
        {!loading && !error && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredArticles.map((article) => (
              <div key={article.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-xl font-bold text-gray-900 line-clamp-2">
                      {article.title}
                    </h2>
                    {canEditArticles && (
                      <div className="flex gap-2 ml-4">
                        <Link to={`/edit-article/${article.id}`}>
                          <Button size="sm" variant="outline" className="p-2">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </Link>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button 
                              size="sm" 
                              variant="destructive" 
                              className="p-2"
                              onClick={() => setArticleToDelete(article.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Article</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{article.title}"? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel onClick={() => setArticleToDelete(null)}>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => {
                                  handleDeleteConfirm();
                                  setArticleToDelete(null);
                                }}
                                className="bg-red-600 hover:bg-red-700 text-white"
                              >
                                Delete Article
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    )}
                  </div>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {article.excerpt}
                  </p>
                  <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                    <span>
                      {article.author ? `By ${article.author}` : 'Anonymous'}
                    </span>
                    <span>ID: {article.id}</span>
                    <span>{new Date(article.published_at).toLocaleDateString()}</span>
                  </div>
                  <Link 
                    to={`/article/${article.id}?${searchParams.toString()}`}
                    className="w-full"
                  >
                    <Button variant="outline" className="w-full">
                      Read More
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
        {!loading && !error && filteredArticles.length === 0 && !searchQuery && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No articles yet</h3>
            <p className="text-gray-500">Check back soon for the latest scam alerts and news.</p>
          </div>
        )}
        {!loading && !error && filteredArticles.length === 0 && searchQuery && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No articles found</h3>
            <p className="text-gray-500">No articles match your search query "{searchQuery}". Try different keywords.</p>
          </div>
        )}
      </div>
      <Footer />
      {articleToDelete && (
        <AlertDialog open={true} onOpenChange={() => setArticleToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure you want to delete this article?</AlertDialogTitle>
              <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setArticleToDelete(null)}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteConfirm}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
};

export default News;
