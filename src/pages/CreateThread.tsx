
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link, Navigate } from "react-router-dom";

const categories = [
  { id: "scam-reports", name: "Scam Reports" },
  { id: "prevention-tips", name: "Prevention Tips" },
  { id: "support-recovery", name: "Support & Recovery" },
  { id: "general-discussion", name: "General Discussion" }
];

const CreateThread = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    content: ""
  });

  // Redirect if not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Thread created!",
        description: "Your discussion thread has been posted successfully.",
      });
      
      navigate("/forums");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create thread. Please try again.",
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

  const handleCategoryChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      category: value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link to="/forums">
              <Button variant="outline" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Forums
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Create New Thread</h1>
          </div>

          {/* Form */}
          <Card>
            <CardHeader>
              <CardTitle>Start a New Discussion</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Thread Title</Label>
                  <Input
                    id="title"
                    name="title"
                    type="text"
                    required
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter a clear, descriptive title"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category} onValueChange={handleCategoryChange} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    name="content"
                    required
                    value={formData.content}
                    onChange={handleInputChange}
                    placeholder="Share your experience, ask a question, or start a discussion..."
                    rows={12}
                  />
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">Community Guidelines:</h3>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Be respectful and supportive to all community members</li>
                    <li>• Share accurate information and cite sources when possible</li>
                    <li>• Protect privacy - avoid sharing personal identifying information</li>
                    <li>• Use clear, descriptive titles to help others find relevant discussions</li>
                    <li>• Search existing threads before creating a new one</li>
                  </ul>
                </div>

                <div className="flex gap-4">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    {isLoading ? "Creating Thread..." : "Create Thread"}
                  </Button>
                  <Link to="/forums">
                    <Button type="button" variant="outline">
                      Cancel
                    </Button>
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default CreateThread;
