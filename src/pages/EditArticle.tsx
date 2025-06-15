
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link, Navigate } from "react-router-dom";

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

const EditArticle = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [article, setArticle] = useState<Article | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: ""
  });

  // Redirect if not moderator or admin
  if (!user || (user.role !== 'moderator' && user.role !== 'admin')) {
    return <Navigate to="/news" replace />;
  }

  useEffect(() => {
    if (id) {
      const foundArticle = mockArticles.find(a => a.id === parseInt(id));
      if (foundArticle) {
        setArticle(foundArticle);
        setFormData({
          title: foundArticle.title,
          excerpt: foundArticle.excerpt,
          content: foundArticle.content
        });
      }
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Article updated!",
        description: "Your changes have been saved successfully.",
      });
      
      navigate(`/article/${id}`);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update article. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Article Not Found</h1>
            <p className="text-gray-600 mb-6">The article you're trying to edit doesn't exist.</p>
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
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link to={`/article/${id}`}>
              <Button variant="outline" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Article
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Edit Article</h1>
          </div>

          {/* Form */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Article Title</Label>
                <Input
                  id="title"
                  name="title"
                  type="text"
                  required
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter article title"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  name="excerpt"
                  required
                  value={formData.excerpt}
                  onChange={handleInputChange}
                  placeholder="Brief description of the article (2-3 sentences)"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Article Content</Label>
                <Textarea
                  id="content"
                  name="content"
                  required
                  value={formData.content}
                  onChange={handleInputChange}
                  placeholder="Write your article content here. You can use ## for headings and ### for subheadings."
                  rows={15}
                />
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">Formatting Tips:</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Use ## for main headings</li>
                  <li>• Use ### for subheadings</li>
                  <li>• Use numbered lists (1. 2. 3.) or bullet points (- item)</li>
                  <li>• Separate paragraphs with empty lines</li>
                </ul>
              </div>

              <div className="flex gap-4">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
                <Link to={`/article/${id}`}>
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default EditArticle;
