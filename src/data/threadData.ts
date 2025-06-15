
export const threadData = {
  1: {
    id: 1,
    title: "New Bitcoin Investment Scam Alert",
    author: "SafetyFirst",
    createdAt: "2 days ago",
    category: "Scam Reports",
    isPinned: true,
    content: "I've been seeing a lot of reports about a new Bitcoin investment scam that's targeting people through social media ads. The scammers are promising guaranteed returns of 300% in just 30 days. They're using fake celebrity endorsements and creating convincing but fraudulent websites. Please be aware and share this with others who might be vulnerable to these types of scams.",
    posts: [
      {
        id: 1,
        author: "CyberGuard",
        content: "Thanks for sharing this! I've seen similar ads on Facebook. The websites they create look very professional, which makes them even more dangerous.",
        createdAt: "2 days ago",
        likes: 5
      },
      {
        id: 2,
        author: "AlertUser",
        content: "My elderly neighbor almost fell for this exact scam. Thankfully I was able to warn her in time. These scammers are getting more sophisticated.",
        createdAt: "1 day ago",
        likes: 8
      },
      {
        id: 3,
        author: "TechSavvy",
        content: "I've reported several of these fake ads to the social media platforms. Everyone should do the same when they see them!",
        createdAt: "1 day ago",
        likes: 3
      }
    ]
  },
  2: {
    id: 2,
    title: "How to identify fake tech support calls",
    author: "TechExpert",
    createdAt: "3 days ago",
    category: "Prevention Tips",
    isPinned: false,
    content: "Here are some key warning signs to help you identify fake tech support calls and protect yourself from these common scams.",
    posts: [
      {
        id: 4,
        author: "SafeUser",
        content: "Great tips! I almost fell for one of these calls last week. They seemed so convincing.",
        createdAt: "2 days ago",
        likes: 12
      }
    ]
  },
  3: {
    id: 3,
    title: "Received suspicious email from 'bank'",
    author: "NewUser123",
    createdAt: "1 day ago",
    category: "Scam Reports",
    isPinned: false,
    content: "I received an email claiming to be from my bank asking me to verify my account details. Something seemed off about it.",
    posts: [
      {
        id: 5,
        author: "BankingSafe",
        content: "Never click links in suspicious emails. Always go directly to your bank's official website.",
        createdAt: "1 day ago",
        likes: 6
      }
    ]
  },
  4: {
    id: 4,
    title: "Recovery after falling for romance scam",
    author: "StayStrong",
    createdAt: "4 days ago",
    category: "Support & Recovery",
    isPinned: false,
    content: "I want to share my experience and recovery journey after falling victim to a romance scam to help others who might be going through the same thing.",
    posts: [
      {
        id: 6,
        author: "SupportiveFriend",
        content: "Thank you for sharing your story. It takes courage to speak about this. You're helping others by being open.",
        createdAt: "3 days ago",
        likes: 15
      }
    ]
  },
  5: {
    id: 5,
    title: "Best practices for online shopping safety",
    author: "SecureShop",
    createdAt: "5 days ago",
    category: "Prevention Tips",
    isPinned: false,
    content: "With the holiday season approaching, here are essential tips to keep your online shopping secure and avoid scams.",
    posts: [
      {
        id: 7,
        author: "ShoppingSafe",
        content: "These are excellent tips! I always check for the secure lock icon before entering payment info.",
        createdAt: "4 days ago",
        likes: 9
      }
    ]
  }
};

export type ThreadData = typeof threadData;
export type Thread = ThreadData[keyof ThreadData];
export type Post = Thread['posts'][0];
