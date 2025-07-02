-- Insert initial articles
INSERT INTO public.articles (
    id,
    title,
    content,
    author,
    published_at,
    excerpt,
    category,
    status,
    reviewer_id,
    reviewed_at,
    author_id,
    created_at,
    updated_at
) VALUES
(1, 'Phishing Emails Mimic Major Banks', 'Cybercriminals are now sending highly sophisticated phishing emails that perfectly mimic communications from major banks like Chase, Bank of America, and Wells Fargo. These emails often include legitimate-looking logos, sender addresses that appear authentic, and urgent messages about ''suspicious account activity'' requiring immediate verification.

**How the Scam Works:**
1. Victims receive an email appearing to be from their bank
2. The message contains a link to a fake login page
3. Entered credentials are captured by scammers
4. Accounts are drained or sold on the dark web

**Prevention Tips:**
✔️ Never click links in unsolicited banking emails - type your bank''s URL manually
✔️ Enable two-factor authentication on all financial accounts
✔️ Check for subtle URL misspellings (e.g., ''chase-bank.com'' instead of ''chase.com'')
✔️ Look for poor grammar - legitimate bank communications are professionally written
✔️ Contact your bank directly using the number on your card if unsure

**If You''ve Been Scammed:**
- Immediately change all banking passwords
- Contact your bank''s fraud department
- Place a credit freeze with all three bureaus
- Report to the FTC at ReportFraud.ftc.gov', 'Admin', '2024-08-15 09:23:45+00', 'Learn how to spot sophisticated banking phishing attempts that steal login credentials', 'Phishing', 'approved', NULL, NULL, 'admin1', '2024-08-10 14:30:00+00', '2024-08-15 11:45:33+00'),

(2, 'Romance Scams Exploit Loneliness', 'Romance scammers are preying on people''s loneliness by creating fake profiles on dating apps (Tinder, Bumble) and social media (Facebook, Instagram). These criminals spend weeks building trust before inventing emergencies requiring money.

**Common Tactics:**
- Using stolen photos of attractive military personnel or doctors
- Claiming to be overseas for work
- Avoiding video calls (or using pre-recorded videos)
- Suddenly needing money for medical bills or travel

**Red Flags:**
🚩 They profess love unusually quickly
🚩 Their stories contain inconsistencies
🚩 They refuse to meet in person
🚩 They ask for money via gift cards or cryptocurrency

**Protection Tips:**
✔️ Reverse image search their profile pictures
✔️ Video chat early in the relationship
✔️ Never send money to someone you haven''t met
✔️ Tell friends/family about online relationships
✔️ Research common romance scam scripts

**Victim Support:**
- Report to the dating platform
- Contact your bank if money was sent
- Seek support from trusted friends/family', 'Admin', '2024-09-12 14:20:11+00', 'How scammers exploit loneliness on dating apps and social media - warning signs and prevention', 'Romance', 'approved', NULL, NULL, 'admin1', '2024-09-08 10:15:44+00', '2024-09-15 08:30:22+00'),

(3, 'Cryptocurrency Investment Scams Surge', 'As cryptocurrency gains mainstream attention, scammers are creating fake investment platforms promising guaranteed high returns. These ''pig butchering'' scams often start on social media or dating apps.

**How It Works:**
1. Scammers contact victims through random messages
2. They build trust over weeks/months
3. Introduce a ''can''t lose'' crypto investment
4. Show fake account growth
5. Disappear when victims try to withdraw

**Common Schemes:**
- Fake mining platforms
- Ponzi schemes dressed as DeFi projects
- Celebrity-endorsement scams
- Fake exchange websites

**Prevention Guide:**
✔️ Never invest based on social media messages
✔️ Research projects thoroughly (check whitepapers, team)
✔️ Use only well-known exchanges (Coinbase, Binance)
✔️ Be wary of ''guaranteed'' returns
✔️ Remember: real investments have risk

**If Scammed:**
- Document all communications
- Report to IC3.gov (FBI''s cybercrime unit)
- Contact your bank if fiat was sent
- Warn others in crypto communities', 'Admin', '2024-10-15 16:45:33+00', 'Sophisticated cryptocurrency scams are stealing millions - learn how to protect your investments', 'Cryptocurrency', 'approved', NULL, NULL, 'admin1', '2024-10-10 09:30:55+00', '2024-10-18 13:20:44+00'),

(4, 'Fake Job Offers Target Job Seekers', 'Scammers are posting fake job listings on LinkedIn, Indeed, and other platforms to steal personal information or money. These scams often impersonate real companies.

**Common Fake Job Scams:**
- ''Work from home'' opportunities requiring payment
- Fake interviews via text/email only
- Requests for SSNs or bank details early
- Overpayment scams (fake checks)
- Pyramid schemes disguised as jobs

**Red Flags:**
🚩 Employer contacts you unexpectedly
🚩 Vague job descriptions
🚩 Requests for payment (for ''training'' or ''equipment'')
🚩 Poor grammar in communications

**Protection Tips:**
✔️ Research the company independently
✔️ Verify email domains match the company
✔️ Never pay for employment
✔️ Be wary of high salaries for minimal work
✔️ Meet in person/video for interviews

**If Targeted:**
- Report the listing to the job platform
- Place a fraud alert on your credit
- Monitor bank accounts closely', 'Admin', '2024-11-18 11:30:15+00', 'How to identify fraudulent job postings that steal money or personal information', 'Employment', 'approved', NULL, NULL, 'admin1', '2024-11-13 16:45:33+00', '2024-11-20 10:15:22+00'),

(5, 'Fake Online Stores Scam Shoppers', 'Fraudulent e-commerce sites are flooding search results and social media, offering luxury items at 70-90% discounts to steal payment information.

**Recent Fake Store Tactics:**
- Using stolen product images
- Creating fake ''trust'' badges
- Running limited-time countdown timers
- Fake celebrity endorsements
- Copying legitimate store designs

**How to Spot Fake Stores:**
🔍 Check domain registration date (new = risky)
🔍 Look for physical address/contact info
🔍 Search for reviews outside their site
🔍 Test checkout for HTTPS security
🔍 Reverse image search product photos

**Safe Shopping Tips:**
✔️ Use credit cards (better fraud protection)
✔️ Stick to known retailers
✔️ Be wary of social media ads
✔️ Check return policies
✔️ Use PayPal for buyer protection

**If Scammed:**
- Dispute charges immediately
- Report to the FTC
- Warn others by leaving reviews', 'Admin', '2024-12-20 13:45:44+00', 'Fraudulent online stores are stealing payment info - learn how to verify legitimacy', 'Shopping', 'approved', NULL, NULL, 'admin1', '2024-12-15 14:30:11+00', '2024-12-23 09:45:33+00'),

(6, 'Ponzi Schemes Target Retirees', 'Ponzi schemes are increasingly targeting retirement funds, promising consistent 10-15% monthly returns through ''exclusive'' investment clubs.

**Modern Ponzi Traits:**
- Fake account statements
- Pressure to recruit others
- Complex jargon to confuse
- Claims of ''proprietary'' strategies
- Withdrawal delays

**Protection Guide:**
✔️ Verify SEC/FINRA registration
✔️ Research the investment strategy
✔️ Be wary of unlicensed sellers
✔️ Check for audited financials
✔️ Remember: high returns = high risk

**If Involved:**
- Stop all payments immediately
- Document everything
- Report to SEC.gov
- Consult a financial advisor
- Warn other participants', 'Admin', '2025-01-23 15:20:11+00', 'How fraudulent investment schemes are draining retirement accounts - warning signs', 'Investment', 'approved', NULL, NULL, 'admin1', '2025-01-18 11:45:22+00', '2025-01-26 12:30:44+00'),

(7, 'Tech Support Scams Evolve', 'Scammers now use fake Windows/MacOS pop-ups with alarming sounds to trick victims into calling fraudulent ''support'' numbers.

**Current Tactics:**
- Browser lock screens showing FBI warnings
- Fake ''virus detected'' system alerts
- Cold calls claiming to be from ''Microsoft''
- Requests for remote access
- Demands for payment in gift cards

**Prevention Steps:**
✔️ Never allow unsolicited remote access
✔️ Close pop-ups via Task Manager (Ctrl+Alt+Del)
✔️ Keep software updated
✔️ Use reputable antivirus software
✔️ Educate elderly family members

**If Compromised:**
1. Disconnect from internet
2. Run malware scans
3. Change all passwords
4. Contact bank if payments made
5. Report to FBI''s IC3', 'Admin', '2025-02-26 10:15:33+00', 'Fake tech support calls and pop-ups are stealing thousands daily - protection guide', 'Tech Support', 'approved', NULL, NULL, 'admin1', '2025-02-20 14:20:55+00', '2025-02-29 16:45:22+00'),

(8, 'Fake Lottery Scams Continue', 'Scammers are sending personalized mail and emails claiming victims have won millions in fake lotteries, but need to pay ''taxes'' first.

**Recent Variations:**
- Fake Publishers Clearing House notices
- Counterfeit cashier''s checks
- Claims of being from foreign lotteries
- Threats of legal action if not paid
- Requests for gift card payments

**Protection Tips:**
✔️ Remember: you can''t win what you didn''t enter
✔️ Real lotteries don''t ask for upfront payments
✔️ Verify through official lottery websites
✔️ Be wary of overseas communications
✔️ Report scams to the FTC

**If Targeted:**
- Do not engage with scammers
- Keep all documents as evidence
- Place fraud alerts if info shared
- Warn family/friends', 'Admin', '2025-03-29 13:40:44+00', 'Fake lottery notifications are tricking victims into paying fake fees - how to respond', 'Lottery', 'approved', NULL, NULL, 'admin1', '2025-03-23 09:30:11+00', '2025-04-02 14:20:33+00'),

(9, 'Smishing (Text Scams) Increase', 'Text message scams now mimic delivery notifications, bank alerts, and even friend messages to spread malware or steal info.

**Common SMS Scams:**
- ''Your package couldn''t be delivered''
- ''Your bank account is locked''
- ''Hi mom, I lost my phone...''
- Fake two-factor authentication codes
- ''Claim your reward'' messages

**Prevention Guide:**
✔️ Never click links in unexpected texts
✔️ Verify delivery issues via carrier apps
✔️ Contact banks using official numbers
✔️ Enable spam filtering on your phone
✔️ Educate family about smishing

**If You Clicked:**
1. Don''t enter any information
2. Run antivirus scans
3. Monitor accounts closely
4. Consider changing passwords
5. Report to your carrier', 'Admin', '2025-04-02 16:55:22+00', 'Text message scams are becoming more sophisticated - how to protect yourself', 'Phishing', 'approved', NULL, NULL, 'admin1', '2025-03-26 13:45:44+00', '2025-04-05 10:30:11+00'),

(10, 'Fake Social Media Giveaways', 'Fraudulent giveaways on Instagram and TikTok promise free products in exchange for sharing personal info or paying ''shipping.''

**Current Scam Signs:**
- Requires tagging friends to enter
- Asks for credit card for ''verification''
- Links to non-brand websites
- Uses celebrity images without permission
- No official brand affiliation

**Verification Tips:**
✔️ Check the account''s verification badge
✔️ Look for past giveaway winners
✔️ Research the promotion independently
✔️ Never pay for ''free'' items
✔️ Report suspicious giveaways

**If Scammed:**
- Dispute any charges
- Change account passwords
- Report to the social platform
- Warn your network', 'Admin', '2025-05-05 11:20:33+00', 'How to distinguish real social media giveaways from scams stealing money and data', 'Social Media', 'approved', NULL, NULL, 'admin1', '2025-04-29 15:30:22+00', '2025-05-08 14:45:44+00');

-- Reset the sequence to the next available ID
SELECT setval('articles_id_seq', (SELECT MAX(id) FROM articles)); 