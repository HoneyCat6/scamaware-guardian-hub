import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Check, X, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";

type Article = Database['public']['Tables']['articles']['Row'] & {
  reviewer: {
    username: string;
    role: Database['public']['Enums']['user_role'];
  } | null;
};
type ReviewAction = 'approved' | 'rejected';
type ArticleStatus = 'pending' | 'approved' | 'rejected';

export const ArticleReview = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{
    type: ReviewAction;
    article: Article;
  } | null>(null);
  const [currentStatus, setCurrentStatus] = useState<ArticleStatus>('pending');

  useEffect(() => {
    fetchArticles(currentStatus);
  }, [currentStatus]);

  const fetchArticles = async (status: ArticleStatus) => {
    try {
      setIsLoading(true);
      
      // First fetch articles
      const { data: articles, error: articlesError } = await supabase
        .from('articles')
        .select('*')
        .eq('status', status)
        .order('created_at', { ascending: false });

      if (articlesError) throw articlesError;

      // For articles with reviewers, fetch their profiles
      const articlesWithReviewers = await Promise.all((articles || []).map(async (article) => {
        if (!article.reviewer_id) {
          return { ...article, reviewer: null };
        }

        const { data: reviewerData, error: reviewerError } = await supabase
          .from('profiles')
          .select('username, role')
          .eq('id', article.reviewer_id)
          .single();

        if (reviewerError) {
          console.error('Error fetching reviewer:', reviewerError);
          return { ...article, reviewer: null };
        }

        return {
          ...article,
          reviewer: reviewerData ? { 
            username: reviewerData.username,
            role: reviewerData.role
          } : null
        };
      }));

      setArticles(articlesWithReviewers);
    } catch (error) {
      console.error(`Error fetching ${status} articles:`, error);
      toast({
        title: "Error",
        description: `Failed to load ${status} articles.`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReview = async (articleId: number, status: ReviewAction) => {
    try {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      // Debug: Log the review attempt
      console.log('Attempting to review article:', {
        articleId,
        status,
        reviewerId: user.id
      });

      // First check if the article still exists and is still pending
      const { data: articleCheck, error: checkError } = await supabase
        .from('articles')
        .select('status')
        .eq('id', articleId)
        .single();

      if (checkError) {
        console.error('Error checking article status:', checkError);
        throw new Error(`Failed to check article status: ${checkError.message}`);
      }

      if (!articleCheck) {
        throw new Error('Article not found');
      }

      if (articleCheck.status !== 'pending') {
        throw new Error('Article has already been reviewed');
      }

      // Debug: Log the update attempt
      console.log('Attempting to update article status');

      // Perform the update
      const { data: updateData, error: updateError } = await supabase
        .from('articles')
        .update({
          status,
          reviewer_id: user.id,
          reviewed_at: new Date().toISOString(),
          published_at: status === 'approved' ? new Date().toISOString() : null
        })
        .eq('id', articleId)
        .select()
        .single();

      if (updateError) {
        console.error('Error updating article:', updateError);
        throw new Error(`Failed to update article: ${updateError.message}`);
      }

      if (!updateData) {
        throw new Error('Failed to update article: No data returned');
      }

      // Debug: Log successful update
      console.log('Article successfully updated:', updateData);

      toast({
        title: `Article ${status}!`,
        description: status === 'approved' 
          ? "The article has been published successfully."
          : "The article has been rejected successfully.",
        variant: status === 'approved' ? 'default' : 'destructive',
      });

      // Remove the article from the list
      setArticles(prev => prev.filter(article => article.id !== articleId));
      setConfirmAction(null);
    } catch (error) {
      console.error('Error reviewing article:', error);
      
      // Determine if it's a Supabase error or a regular error
      const errorMessage = error instanceof Error 
        ? error.message
        : typeof error === 'object' && error !== null && 'message' in error
          ? String(error.message)
          : "An unexpected error occurred while reviewing the article";

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });

      // If it's an authentication error, we might want to redirect to login
      if (errorMessage.includes('not authenticated')) {
        navigate('/login');
      }
    }
  };

  const renderArticleList = (articles: Article[]) => {
    if (isLoading) {
      return <div className="text-center py-8">Loading articles...</div>;
    }

    if (articles.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          No {currentStatus} articles found.
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {articles.map((article) => (
          <Card key={article.id} className="p-4">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">{article.title}</h3>
                <p className="text-sm text-gray-600">{article.excerpt}</p>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Badge>{article.category}</Badge>
                  <span>by {article.author}</span>
                  {article.reviewed_at && (
                    <>
                      <span>• Reviewed on {new Date(article.reviewed_at).toLocaleDateString()}</span>
                      {article.reviewer && (
                        <span>• Reviewed by {article.reviewer.username}({article.reviewer.role})</span>
                      )}
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setSelectedArticle(article);
                    setIsPreviewOpen(true);
                  }}
                >
                  <Eye className="w-4 h-4 mr-1" />
                  Preview
                </Button>
                {currentStatus === 'pending' && (
                  <>
                    <Button
                      size="sm"
                      variant="default"
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => setConfirmAction({ type: 'approved', article })}
                    >
                      <Check className="w-4 h-4 mr-1" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => setConfirmAction({ type: 'rejected', article })}
                    >
                      <X className="w-4 h-4 mr-1" />
                      Reject
                    </Button>
                  </>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <Tabs defaultValue="pending" onValueChange={(value) => setCurrentStatus(value as ArticleStatus)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>
        <TabsContent value="pending">
          <h2 className="text-2xl font-bold mb-4">Pending Articles</h2>
          {renderArticleList(articles)}
        </TabsContent>
        <TabsContent value="approved">
          <h2 className="text-2xl font-bold mb-4">Approved Articles</h2>
          {renderArticleList(articles)}
        </TabsContent>
        <TabsContent value="rejected">
          <h2 className="text-2xl font-bold mb-4">Rejected Articles</h2>
          {renderArticleList(articles)}
        </TabsContent>
      </Tabs>

      {/* Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedArticle?.title}</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <div className="prose max-w-none">
              <div className="mb-4">
                <Badge>{selectedArticle?.category}</Badge>
                <span className="ml-2 text-sm text-gray-500">by {selectedArticle?.author}</span>
                {selectedArticle?.reviewed_at && (
                  <span className="ml-2 text-sm text-gray-500">
                    • Reviewed on {new Date(selectedArticle.reviewed_at).toLocaleDateString()}
                  </span>
                )}
              </div>
              <p className="text-lg text-gray-600 mb-6">{selectedArticle?.excerpt}</p>
              <div className="whitespace-pre-wrap">{selectedArticle?.content}</div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog 
        open={confirmAction !== null} 
        onOpenChange={(open) => !open && setConfirmAction(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {confirmAction?.type === 'approved' ? 'Approve Article' : 'Reject Article'}
            </DialogTitle>
            <DialogDescription>
              {confirmAction?.type === 'approved'
                ? 'Are you sure you want to approve this article? It will be published immediately.'
                : 'Are you sure you want to reject this article? This action cannot be undone.'}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setConfirmAction(null)}
            >
              Cancel
            </Button>
            <Button
              variant={confirmAction?.type === 'approved' ? 'default' : 'destructive'}
              className={confirmAction?.type === 'approved' ? 'bg-green-600 hover:bg-green-700' : ''}
              onClick={() => {
                if (confirmAction) {
                  handleReview(confirmAction.article.id, confirmAction.type);
                }
              }}
            >
              {confirmAction?.type === 'approved' ? 'Approve' : 'Reject'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}; 