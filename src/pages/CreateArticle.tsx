import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import { supabase } from "@/integrations/supabase/client";
import { Checkbox } from "@/components/ui/checkbox";
import { Database } from "@/integrations/supabase/types";

type ArticleStatus = Database['public']['Tables']['articles']['Row']['status'];

const CATEGORIES = [
  "Shopping",
  "Employment",
  "Investment",
  "Software",
  "Education",
  "Social Media",
  "Cryptocurrency",
  "Travel",
  "Charity",
  "Marketplace",
  "Business",
  "Events",
  "Delivery",
  "Tech Support",
  "Survey",
  "Housing",
  "Phishing"
];

const CreateArticle = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState<string>("");
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: CATEGORIES[0],
    hideAuthor: false
  });

  // Fetch username on component mount
  useEffect(() => {
    const fetchUsername = async () => {
      if (user?.id) {
        const { data, error } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', user.id)
          .single();
        
        if (data?.username) {
          setUsername(data.username);
        }
      }
    };
    fetchUsername();
  }, [user]);

  // Redirect if not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const isAdminOrModerator = user.role === 'admin' || user.role === 'moderator';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Prepare the article data
      const now = new Date().toISOString();
      const status = (isAdminOrModerator ? "approved" : "pending") as ArticleStatus;
      
      const articleData = {
        title: formData.title,
        excerpt: formData.excerpt,
        content: formData.content,
        category: formData.category,
        author: formData.hideAuthor ? "Anonymous" : username,
        author_id: user.id,
        status: status,
        // Only set published_at if the article is being approved
        published_at: status === "approved" ? now : undefined
      };

      // Insert the article
      const { error } = await supabase
        .from("articles")
        .insert([articleData]);

      if (error) throw error;
      
      toast({
        title: isAdminOrModerator ? "Article published!" : "Article submitted for review!",
        description: isAdminOrModerator 
          ? "Your article has been published successfully."
          : "Your article will be reviewed by a moderator before being published.",
      });
      
      navigate("/news");
    } catch (error) {
      console.error('Error creating article:', error);
      toast({
        title: "Error",
        description: "Failed to create article. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link to="/news">
              <Button variant="outline" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to News
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Create New Article</h1>
          </div>

          {/* Form */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            {!isAdminOrModerator && (
              <div className="mb-6 p-4 bg-blue-50 text-blue-700 rounded-lg">
                <p>Your article will be reviewed by a moderator before being published.</p>
              </div>
            )}

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
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md text-gray-700 bg-white"
                >
                  {CATEGORIES.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
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

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hideAuthor"
                  checked={formData.hideAuthor}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, hideAuthor: checked as boolean }))
                  }
                />
                <Label htmlFor="hideAuthor">Hide author name from article</Label>
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={isLoading} className="flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  {isLoading ? "Saving..." : isAdminOrModerator ? "Publish Article" : "Submit for Review"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default CreateArticle;
