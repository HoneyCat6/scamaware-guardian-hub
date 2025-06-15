
import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface Article {
  id: number;
  title: string;
  content: string;
  author: string;
  publishedAt: string;
  excerpt: string;
}

const mockArticles: Article[] = [
  {
    id: 1,
    title: "New Phishing Campaign Targets Banking Customers",
    content: "A sophisticated phishing campaign has been identified targeting customers of major banks...",
    author: "Security Team",
    publishedAt: "2024-01-15",
    excerpt: "Learn about the latest phishing tactics and how to protect yourself from banking scams."
  },
  {
    id: 2,
    title: "Romance Scams on Social Media Increase by 300%",
    content: "Authorities report a significant increase in romance scams across social media platforms...",
    author: "Research Team",
    publishedAt: "2024-01-12",
    excerpt: "Understanding the warning signs of romance scams and how to stay safe while dating online."
  },
  {
    id: 3,
    title: "Cryptocurrency Investment Scams: What to Watch For",
    content: "As cryptocurrency gains popularity, scammers are developing new ways to exploit investors...",
    author: "Crypto Analyst",
    publishedAt: "2024-01-10",
    excerpt: "Essential tips for identifying and avoiding cryptocurrency investment scams."
  }
];

const News = () => {
  const [articles, setArticles] = useState<Article[]>(mockArticles);
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useAuth();
  const { toast } = useToast();

  const canEditArticles = user && (user.role === 'moderator' || user.role === 'admin');

  const handleDeleteArticle = (articleId: number) => {
    setArticles(prev => prev.filter(article => article.id !== articleId));
    toast({
      title: "Article deleted",
      description: "The article has been successfully removed.",
    });
  };

  const filteredArticles = articles.filter(article => {
    const query = searchQuery.toLowerCase();
    return (
      article.title.toLowerCase().includes(query) ||
      article.content.toLowerCase().includes(query) ||
      article.excerpt.toLowerCase().includes(query) ||
      article.author.toLowerCase().includes(query)
    );
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
          
          {canEditArticles && (
            <Link to="/create-article">
              <Button className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Create Article
              </Button>
            </Link>
          )}
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          {searchQuery && (
            <p className="text-sm text-gray-600 mt-2">
              Found {filteredArticles.length} article{filteredArticles.length !== 1 ? 's' : ''} matching "{searchQuery}"
            </p>
          )}
        </div>

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
                      <Button 
                        size="sm" 
                        variant="destructive" 
                        className="p-2"
                        onClick={() => handleDeleteArticle(article.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
                
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {article.excerpt}
                </p>
                
                <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                  <span>By {article.author}</span>
                  <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                </div>
                
                <Link to={`/article/${article.id}`}>
                  <Button variant="outline" className="w-full">
                    Read More
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {filteredArticles.length === 0 && !searchQuery && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No articles yet</h3>
            <p className="text-gray-500">Check back soon for the latest scam alerts and news.</p>
          </div>
        )}

        {filteredArticles.length === 0 && searchQuery && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No articles found</h3>
            <p className="text-gray-500">No articles match your search query "{searchQuery}". Try different keywords.</p>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default News;
