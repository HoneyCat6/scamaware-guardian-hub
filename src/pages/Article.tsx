import { useState, useEffect } from "react";
import { useParams, useNavigate, Link, useSearchParams } from "react-router-dom";
import { ArrowLeft, Edit, Trash2, Calendar, User, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
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

type ArticleType = Database["public"]["Tables"]["articles"]["Row"];

const Article = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const [article, setArticle] = useState<ArticleType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filteredIds, setFilteredIds] = useState<number[]>([]);
  const currentIndex = id ? filteredIds.indexOf(Number(id)) : -1;
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const canEditArticle = user && (user.role === 'moderator' || user.role === 'admin');

  // Fetch filtered articles based on URL params
  useEffect(() => {
    const fetchFilteredArticles = async () => {
      const { data: articles } = await supabase.from("articles").select("id, title, content, excerpt, author, category, published_at");
      if (!articles) return;

      let filtered = articles;
      const search = searchParams.get("search")?.toLowerCase();
      const category = searchParams.get("category");
      const sort = searchParams.get("sort") || "Newest";

      // Apply filters
      if (search || category) {
        filtered = articles.filter(article => {
          const matchesSearch = !search || 
            article.title.toLowerCase().includes(search) ||
            article.content.toLowerCase().includes(search) ||
            article.excerpt.toLowerCase().includes(search) ||
            article.author.toLowerCase().includes(search);
          const matchesCategory = !category || category === "All" || article.category === category;
          return matchesSearch && matchesCategory;
        });
      }

      // Apply sort
      filtered.sort((a, b) => {
        const dateA = new Date(a.published_at || 0).getTime();
        const dateB = new Date(b.published_at || 0).getTime();
        return sort === "Newest" ? dateB - dateA : dateA - dateB;
      });

      setFilteredIds(filtered.map(article => article.id));
    };

    fetchFilteredArticles();
  }, [searchParams]);

  useEffect(() => {
    if (id) {
      setLoading(true);
      setError(null);
      supabase
        .from("articles")
        .select("*")
        .eq("id", Number(id))
        .single()
        .then(({ data, error }) => {
          if (error || !data) {
            setError("Article not found.");
            setArticle(null);
          } else {
            setArticle(data);
          }
          setLoading(false);
        });
    }
  }, [id]);

  const handleDeleteClick = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!article) return;

    try {
      const { error } = await supabase
        .from("articles")
        .delete()
        .eq("id", article.id);

      if (error) throw error;

      toast({
        title: "Article deleted",
        description: "The article has been successfully removed.",
      });
      navigate("/news");
    } catch (error) {
      console.error('Error deleting article:', error);
      toast({
        title: "Error",
        description: "Failed to delete article.",
        variant: "destructive",
      });
    } finally {
      setIsDeleteDialogOpen(false);
    }
  };

  const navigateToArticle = (direction: 'prev' | 'next') => {
    if (currentIndex === -1) return;
    const newIndex = direction === 'prev' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex >= 0 && newIndex < filteredIds.length) {
      navigate(`/article/${filteredIds[newIndex]}?${searchParams.toString()}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <span className="text-gray-500">Loading article...</span>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Article Not Found</h1>
            <p className="text-gray-600 mb-6">The article you're looking for doesn't exist.</p>
            <Link to="/news">
              <Button>Back to News</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Navigation controls */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <Link to={`/news?${searchParams.toString()}`}>
                <Button variant="outline" className="flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back to News
                </Button>
              </Link>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => navigateToArticle('prev')}
                disabled={currentIndex <= 0}
                className="flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>
              <Button
                variant="outline"
                onClick={() => navigateToArticle('next')}
                disabled={currentIndex === -1 || currentIndex >= filteredIds.length - 1}
                className="flex items-center gap-1"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            {canEditArticle && (
              <div className="flex gap-2">
                <Link to={`/edit-article/${article.id}`}>
                  <Button size="sm" variant="outline" className="flex items-center gap-2">
                    <Edit className="w-4 h-4" />
                    Edit
                  </Button>
                </Link>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      size="sm" 
                      variant="destructive" 
                      className="flex items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Article</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this article? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDeleteConfirm}
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

          {/* Article content */}
          <article className="bg-white rounded-lg shadow-lg p-8">
            <header className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {article.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 text-gray-600 text-sm">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>By {article.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(article.published_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</span>
                </div>
              </div>
            </header>

            <div className="prose prose-lg max-w-none">
              {article.content.split('\n\n').map((paragraph, index) => {
                if (paragraph.startsWith('## ')) {
                  return (
                    <h2 key={index} className="text-2xl font-bold text-gray-900 mt-8 mb-4">
                      {paragraph.replace('## ', '')}
                    </h2>
                  );
                } else if (paragraph.startsWith('### ')) {
                  return (
                    <h3 key={index} className="text-xl font-bold text-gray-900 mt-6 mb-3">
                      {paragraph.replace('### ', '')}
                    </h3>
                  );
                } else if (paragraph.includes('1. ') || paragraph.includes('- ')) {
                  const items = paragraph.split('\n').filter(item => item.trim());
                  return (
                    <ul key={index} className="list-disc list-inside space-y-2 my-4">
                      {items.map((item, itemIndex) => (
                        <li key={itemIndex} className="text-gray-700">
                          {item.replace(/^[1-9]\.\s*|\-\s*/, '')}
                        </li>
                      ))}
                    </ul>
                  );
                } else {
                  return (
                    <p key={index} className="text-gray-700 mb-4 leading-relaxed">
                      {paragraph}
                    </p>
                  );
                }
              })}
            </div>
          </article>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Article;
