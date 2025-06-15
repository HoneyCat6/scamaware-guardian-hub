
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
  }
};

export type ThreadData = typeof threadData;
export type Thread = ThreadData[keyof ThreadData];
export type Post = Thread['posts'][0];
