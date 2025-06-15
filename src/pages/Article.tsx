
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Edit, Trash2, Calendar, User } from "lucide-react";
import { Button } from "@/components/ui/button";
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
    content: `A sophisticated phishing campaign has been identified targeting customers of major banks across the country. Security researchers have discovered that scammers are using increasingly convincing fake websites and emails to steal banking credentials.

## How the Scam Works

The attackers send emails that appear to be from legitimate banks, warning customers about suspicious activity on their accounts. These emails contain links to fake banking websites that look nearly identical to the real ones.

### Warning Signs to Watch For:

1. **Urgent language**: Phrases like "Your account will be closed" or "Immediate action required"
2. **Generic greetings**: Using "Dear Customer" instead of your actual name
3. **Suspicious URLs**: Domain names that are slightly different from the real bank's website
4. **Requests for sensitive information**: Legitimate banks never ask for passwords or PINs via email

## How to Protect Yourself

- Always type your bank's URL directly into your browser
- Enable two-factor authentication on all banking accounts
- Report suspicious emails to your bank immediately
- Never click links in banking emails - go to the official website instead

If you believe you may have fallen victim to this scam, contact your bank immediately and monitor your accounts closely for any unauthorized transactions.`,
    author: "Security Team",
    publishedAt: "2024-01-15",
    excerpt: "Learn about the latest phishing tactics and how to protect yourself from banking scams."
  },
  {
    id: 2,
    title: "Romance Scams on Social Media Increase by 300%",
    content: `Authorities report a significant increase in romance scams across social media platforms, with losses exceeding $500 million in the past year alone. These scams prey on people's emotions and desire for companionship.

## The Anatomy of a Romance Scam

Romance scammers create fake profiles on dating apps and social media platforms, often using stolen photos of attractive people. They spend weeks or months building emotional connections with their victims before asking for money.

### Common Tactics Include:

- **Professing love quickly**: Saying "I love you" within days or weeks
- **Avoiding phone calls or video chats**: Making excuses to avoid real-time communication
- **Having a tragic backstory**: Claims of being widowed, in the military, or working overseas
- **Financial emergencies**: Sudden needs for money due to medical bills, travel costs, or business problems

## Red Flags to Watch For

1. **Too good to be true**: Professional model photos and perfect life story
2. **Poor grammar**: Inconsistent language use that doesn't match their claimed background
3. **Requests for money**: Any request for financial assistance is a major red flag
4. **Unwillingness to meet**: Constant excuses for why they can't meet in person

## Protecting Yourself

- Never send money, gifts, or personal information to someone you've only met online
- Use reverse image searches to check if profile photos are stolen
- Be suspicious of anyone who quickly professes love or asks to move conversations off the platform
- Trust your instincts - if something feels wrong, it probably is

If you believe you're being targeted by a romance scammer, report them to the platform and consider contacting local authorities.`,
    author: "Research Team",
    publishedAt: "2024-01-12",
    excerpt: "Understanding the warning signs of romance scams and how to stay safe while dating online."
  },
  {
    id: 3,
    title: "Cryptocurrency Investment Scams: What to Watch For",
    content: `As cryptocurrency gains popularity, scammers are developing new ways to exploit investors. From fake investment platforms to celebrity endorsement scams, the crypto space has become a hotbed for fraudulent activities.

## Types of Crypto Scams

### 1. Fake Investment Platforms
Scammers create professional-looking websites that promise high returns on cryptocurrency investments. These platforms may show fake trading activity and profits to convince victims to invest more money.

### 2. Celebrity Endorsement Scams
Fraudsters use deepfakes or hacked social media accounts to make it appear that celebrities are endorsing specific cryptocurrency investments or giveaways.

### 3. Pump and Dump Schemes
Groups coordinate to artificially inflate the price of a lesser-known cryptocurrency before selling their holdings, leaving other investors with worthless tokens.

## Warning Signs

- **Guaranteed returns**: No legitimate investment can guarantee profits
- **Pressure to act quickly**: Scammers create urgency to prevent victims from researching
- **Celebrity endorsements**: Be suspicious of any celebrity promoting specific crypto investments
- **Requests for private keys**: Never share your wallet's private keys or seed phrases

## How to Protect Yourself

1. **Research thoroughly**: Investigate any investment opportunity before committing funds
2. **Use reputable exchanges**: Stick to well-known, regulated cryptocurrency exchanges
3. **Be skeptical of social media ads**: Don't trust investment advice from social media advertisements
4. **Secure your wallet**: Use hardware wallets and never share private keys
5. **Start small**: Only invest what you can afford to lose

Remember: if an investment opportunity sounds too good to be true, it probably is. Take time to research and consult with financial advisors before making significant investments in cryptocurrency.`,
    author: "Crypto Analyst",
    publishedAt: "2024-01-10",
    excerpt: "Essential tips for identifying and avoiding cryptocurrency investment scams."
  }
];

const Article = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [article, setArticle] = useState<Article | null>(null);

  const canEditArticle = user && (user.role === 'moderator' || user.role === 'admin');

  useEffect(() => {
    if (id) {
      const foundArticle = mockArticles.find(a => a.id === parseInt(id));
      setArticle(foundArticle || null);
    }
  }, [id]);

  const handleDeleteArticle = () => {
    if (article) {
      toast({
        title: "Article deleted",
        description: "The article has been successfully removed.",
      });
      navigate("/news");
    }
  };

  if (!article) {
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
          {/* Back button and actions */}
          <div className="flex justify-between items-center mb-6">
            <Link to="/news">
              <Button variant="outline" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to News
              </Button>
            </Link>
            
            {canEditArticle && (
              <div className="flex gap-2">
                <Link to={`/edit-article/${article.id}`}>
                  <Button size="sm" variant="outline" className="flex items-center gap-2">
                    <Edit className="w-4 h-4" />
                    Edit
                  </Button>
                </Link>
                <Button 
                  size="sm" 
                  variant="destructive" 
                  onClick={handleDeleteArticle}
                  className="flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </Button>
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
                  <span>{new Date(article.publishedAt).toLocaleDateString('en-US', {
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
