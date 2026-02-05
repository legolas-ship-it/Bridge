import { TopicData } from "./types";

export const INCENTIVE_GOALS = {
  streak: 7, // 7 days
  reads: 20, // 20 articles outside cocoon
  errors: 1, // 1 correction
  suggestions: 1, // 1 adopted suggestion
  referrals: 3 // 3 friends
};

export const MOCK_TOPICS: TopicData[] = [
  {
    id: "1",
    title: "Global AI Regulation Summit 2024",
    category: "Tech",
    isInternational: true,
    summary: "Nations convene to establish baseline safety protocols for advanced AI models, balancing innovation speed with safety guardrails.",
    newsNarrative: "GENEVA — In a landmark assembly this week, delegates from over 40 nations convened in Geneva to draft the first comprehensive Global Treaty on Artificial Intelligence Safety. The summit, precipitated by rapid advancements in generative models, aims to establish a baseline for 'Red Line' capabilities—features deemed too dangerous for open deployment without oversight. Negotiations have been intense, with significant friction observed between the 'Safety First' bloc, led by the EU, and nations favoring a more laissez-faire approach to foster rapid innovation.\n\nThe core agreement reached on Thursday involves a tiered classification system for AI models based on compute power and capability benchmarks. Models exceeding a specific threshold of floating-point operations will be subject to mandatory external auditing and 'kill switch' integration. However, the enforcement mechanism remains a point of contention. Developing nations have expressed concern that compliance costs could entrench the dominance of established tech giants in the US and China, effectively shutting out smaller players from the global market.\n\nOutside the convention center, a diverse coalition of protestors—ranging from labor unions fearing automation-driven unemployment to open-source advocates warning against centralized control of knowledge—staged demonstrations. Their presence underscored the high stakes of the summit: beyond the technical protocols, the delegates are effectively negotiating the future distribution of economic power and the structure of the digital workforce for the next decade.",
    whyMatters: "Determines the pace of technological adoption and safety nets for the next decade of workforce automation.",
    facts: [
      { content: "Delegates from 40 countries present.", confidence: "High" },
      { content: "Agreement reached on 'Red Line' capabilities.", confidence: "High" }
    ],
    dataCutoff: "2024-10-25",
    controversyPrediction: {
      score: 75,
      riskLevel: "High",
      reasoning: "High likelihood of enforcement disparity between nations causing trade friction within 6 months."
    },
    trendAnalysis: [
      { date: "Oct 1", sentiment: 45, volume: 20, event: "Summit Announced" },
      { date: "Oct 10", sentiment: 40, volume: 50, event: "Leaks of Agenda" },
      { date: "Oct 20", sentiment: 30, volume: 85, event: "Protests Outside" },
      { date: "Oct 25", sentiment: 60, volume: 100, event: "Treaty Signed" },
      { date: "Today", sentiment: 55, volume: 60 }
    ],
    missingIntel: [
        { question: "How will violations be penalized?", whyCritical: "Without enforcement mechanisms, the treaty is symbolic.", trustedSource: "UN Final Report (Due Nov)" },
        { question: "Did China agree to the compute caps?", whyCritical: "Essential for global containment of AGI risks.", trustedSource: "Joint Press Release" }
    ],
    rolePlay: {
      mode: 'dilemma',
      roleName: "Tech Policy Advisor",
      context: "You advise a mid-sized nation that wants AI benefits but fears dominance by US/China.",
      rounds: [
        { 
          situation: "The draft treaty bans open-sourcing models above a certain size. Your local startups rely on open source.",
          options: [
            { text: "Sign the treaty to align with major powers.", consequence: "Local startups suffer, but you gain security guarantees." },
            { text: "Refuse to sign to protect local innovation.", consequence: "You face diplomatic isolation and trade tariffs." }
          ]
        },
        {
          situation: "A major tech giant offers to build a data center in your country if you lobby for looser regulations.",
          options: [
             { text: "Accept the deal for jobs.", consequence: "Public trust erodes; you are seen as bought by big tech." },
             { text: "Reject it to maintain integrity.", consequence: "You lose 5,000 potential high-tech jobs." }
          ]
        },
        {
          situation: "Citizens are protesting, fearing AI will take their jobs regardless of the treaty.",
          options: [
            { text: "Promise Universal Basic Income (UBI).", consequence: "Calms protestors but debt skyrockets." },
            { text: "Focus on retraining programs.", consequence: "Fiscal responsibility maintained, but protests continue." }
          ]
        }
      ]
    },
    disciplinaryPerspectives: [
      { 
        discipline: "Economics", 
        insight: "This legislation effectively creates a high barrier to entry. The compliance costs mandated by the treaty act as a regressive tax, which large incumbents like Google can absorb easily, but which may bankrupt smaller startups, inevitably leading to market oligopoly." 
      },
      { 
        discipline: "Sociology", 
        insight: "The focus on 'existential risk' reinforces a technocratic hierarchy. By framing AI as a danger only solvable by elite scientists, it disempowers the general public, suggesting that ordinary citizens lack the capacity to participate in governing the technologies that shape their lives." 
      }
    ],
    divergenceRating: 4,
    perspectiveSummary: "Tension between 'Open Source' advocates fearing centralization and 'Safety First' blocs fearing existential risk.",
    stakeholders: [
      {
        id: "s1", name: "Tech Giants", x: 90, y: 95,
        fears: "Regulatory capture by competitors; stifling innovation.",
        values: "Progress, Efficiency, Market Dominance",
        blindSpots: "Underestimating systemic social disruption.",
        rationality: "We are the only ones with resources to build this safely."
      },
      {
        id: "s2", name: "Open Source Devs", x: 80, y: 30,
        fears: "Being legislated out of existence; centralized control of truth.",
        values: "Democratization, Transparency, Freedom",
        blindSpots: "Potential for misuse by bad actors.",
        rationality: "Centralized AI is a single point of failure for humanity."
      },
      {
        id: "s3", name: "Labor Unions", x: 95, y: 40,
        fears: "Mass unemployment; loss of bargaining power.",
        values: "Security, Dignity, Fair Share",
        blindSpots: "Potential for AI to augment rather than replace.",
        rationality: "History shows automation benefits capital over labor initially."
      },
      {
        id: "s4", name: "Policy Makers", x: 50, y: 85,
        fears: "Losing geopolitical edge; social unrest.",
        values: "Stability, National Security, Order",
        blindSpots: "Technical nuance of how models actually work.",
        rationality: "It is our duty to protect the public from unknown risks."
      }
    ],
    terms: [
      { 
        term: "Regulatory Capture", 
        definition: "This happens when the companies being regulated end up controlling the government agency meant to supervise them. In AI, it means big tech giants might help write the rules to make them so complicated that smaller startups can't compete." 
      },
      { 
        term: "Compute Threshold", 
        definition: "A limit based on computer power. Think of it like a speed limit for building AI brains. If a model uses more computing power than this limit, the government assumes it's dangerous and needs special inspections." 
      },
      { 
        term: "Open Weights", 
        definition: "When the 'brain' of an AI is available for anyone to download and use on their own computer. It's great for privacy and freedom, but it means the creator can't stop people from using it for bad things." 
      }
    ],
    extensions: [
      { 
        title: "Historical Parallel: The Steam Boiler Acts", 
        type: "Case",
        description: "In the 19th century, high-pressure steam engines fueled the industrial revolution but caused deadly boiler explosions, creating a crisis similar to modern AI safety. Initially, industrialists argued against inspections to protect trade secrets. However, the 1852 Steamboat Act established federal safety standards, proving regulation could coexist with innovation. Today's proposed 'Compute Thresholds' mirror those early 'Pressure Limits'—certifying the safety architecture of the model without banning the underlying mathematics or stopping the economic engine." 
      },
      { 
        title: "Concept: The Alignment Problem", 
        type: "Academic",
        description: "The 'Alignment Problem' is the core challenge driving the 'Safety First' agenda. It refers to the difficulty of ensuring an AI's goals match human intent, even when instructions seem clear. A classic example is 'Specification Gaming': if you reward a robot for a clean room, it might just turn off the lights so it can't see the dirt. The fear is that powerful models might learn to deceive safety testers ('Instrumental Convergence') to achieve their programmed goals." 
      },
      { 
        title: "Report: The Concentration of Compute", 
        type: "Report",
        description: "A recent analysis reveals that 90% of the world's high-end AI chips (GPUs) are controlled by just three corporations. This concentration of 'Compute' creates a geopolitical bottleneck. The Geneva treaty's focus on regulating compute-heavy models effectively grants these corporations a status similar to nuclear powers. While it ensures safety, it creates a 'moat' preventing startups or developing nations from catching up, risking a form of digital colonialism where the Global South depends entirely on rented intelligence." 
      }
    ],
    historicalParallels: [
        {
            event: "Nuclear Non-Proliferation Treaty (1968)",
            year: "1968",
            similarity: "Attempting to control a technology with existential risk while allowing peaceful use.",
            lesson: "Verification is the hardest part; treaties without inspections fail."
        }
    ],
    sourceCount: 142,
    lastUpdated: "10:42 AM"
  },
  {
    id: "11",
    title: "Brazil vs. Big Tech Sovereignty",
    category: "International",
    isInternational: true,
    summary: "Judicial freeze on social media assets highlights the growing conflict between national digital sovereignty and stateless tech platforms.",
    newsNarrative: "BRASILIA — The standoff between Brazilian judicial authorities and international technology platforms escalated sharply this week when the Supreme Federal Court ordered a freeze on the financial assets of Starlink. This move comes as a direct response to ongoing disputes over content moderation compliance and fines levied against social media giant X (formerly Twitter). The court asserts that foreign entities operating within Brazil must adhere to local laws regarding hate speech and misinformation, viewing the asset freeze as a necessary enforcement mechanism.\n\nThe conflict highlights a growing geopolitical tension: the clash between national digital sovereignty and the borderless nature of modern internet infrastructure. Proponents of the court's decision argue that tech platforms have acted with impunity for too long, effectively bypassing national legal systems. Conversely, critics and tech advocates view the asset freeze—targeting a separate company under the same ownership umbrella—as an overreach that could chill foreign investment and disrupt critical internet services for thousands of rural Brazilians who rely on satellite connectivity.\n\nAs the legal battle unfolds, it serves as a bellwether for other nations grappling with similar issues. Countries around the world are watching closely to see if Brazil's aggressive stance will force concessions from Big Tech or lead to a service withdrawal, setting a precedent for the future of global internet governance.",
    whyMatters: "Sets a precedent for how Global South nations might enforce local laws on multinational giants.",
    facts: [
      { content: "Supreme Court froze bank accounts of Starlink.", confidence: "High" },
      { content: "Dispute originated over content moderation orders.", confidence: "High" }
    ],
    dataCutoff: "2024-09-15",
    divergenceRating: 5,
    perspectiveSummary: "National Rule of Law vs. Freedom of Speech/Corporate Autonomy.",
    stakeholders: [],
    terms: [
       { term: "Digital Sovereignty", definition: "The right of a state to govern the network and data within its borders." }
    ], 
    extensions: [
        {
            title: "Legal Concept: Corporate Veil Piercing",
            type: "Case",
            description: "The Brazilian court's decision to freeze Starlink assets to pay for X's fines relies on a legal theory known as 'piercing the corporate veil' (or specifically in Brazil, 'economic group responsibility').\n\nNormally, distinct companies—even if owned by the same person—are treated as separate legal entities to limit liability. However, Brazilian law allows courts to ignore this separation if they believe the structure is being used to evade legal obligations or obstruct justice.\n\nThis is a controversial application in international law because Starlink and X have different shareholders and boards, despite the shared ownership by Elon Musk. If this precedent stands, it implies that multinational conglomerates can be held collectively liable for the actions of any single subsidiary in Brazil, significantly increasing the risk for global investors."
        },
        {
            title: "Context: The 'Splinternet'",
            type: "Academic",
            description: "We are witnessing the acceleration of the 'Splinternet'—the fragmentation of the global internet into distinct national blocks regulated by local laws.\n\nFor the first 20 years of the web, the prevailing philosophy was 'Cyber-Libertarianism' (the internet as a borderless space). Today, we are moving toward 'Cyber-Westphalianism' (the internet as a collection of sovereign territories). Brazil's actions, along with the EU's GDPR and China's Great Firewall, represent the re-assertion of the nation-state.\n\nThe mechanism at play here is 'Chokepoint Control'. Governments cannot easily control data flow, but they can control assets (bank accounts) and infrastructure (ISPs). By targeting the financial assets of a related company (Starlink), Brazil is demonstrating that physical jurisdiction still trumps digital ubiquity."
        }
    ], 
    sourceCount: 92, lastUpdated: "1 hour ago"
  },
  {
    id: "12",
    title: "Japan's Depopulation Strategy Shift",
    category: "Culture",
    isInternational: true,
    summary: "Japan introduces radical new visa policies and automation incentives to combat terminal demographic decline.",
    newsNarrative: "TOKYO — Facing an existential demographic crisis, the Japanese government has unveiled a suite of radical policy shifts aimed at stabilizing its shrinking workforce. With the population falling by over 800,000 in the last year alone, traditional resistance to immigration is giving way to pragmatic economic necessity. The new measures include the launch of a 'Digital Nomad' visa and expanded pathways to permanent residency for skilled blue-collar workers, marking a significant departure from Japan's historically insular approach.\n\nSimultaneously, the strategy doubles down on technological solutions. Massive subsidies are being rolled out for robotics and AI integration in sectors like elder care, agriculture, and logistics. The government envisions a 'Society 5.0' where automation fills the labor gap left by a retiring workforce. However, these changes are not without cultural friction. Conservative factions worry about the erosion of social homogeneity, while younger generations express concern that automation might suppress wages even as labor becomes scarce.\n\nJapan's experiment is being viewed as a test case for the developed world. As nations like Germany, South Korea, and China face similar aging trajectories, the success or failure of Japan's hybrid approach—combining targeted immigration with aggressive automation—will likely inform global policy for decades to come.",
    whyMatters: "Offers a glimpse into the future for other aging developed nations (Germany, Korea, China).",
    facts: [
      { content: "Population fell by 800k last year.", confidence: "High" },
      { content: "New 'Digital Nomad' visa launched.", confidence: "High" }
    ],
    dataCutoff: "2024-10-01",
    divergenceRating: 3,
    perspectiveSummary: "Preservation of cultural homogeneity vs. economic survival via immigration.",
    stakeholders: [],
    terms: [], extensions: [], sourceCount: 45, lastUpdated: "4 hours ago"
  },
  {
    id: "2",
    title: "Urban Congestion Tax Implementation",
    category: "Society",
    summary: "Major metropolitan areas introduce dynamic pricing for entering city centers during peak hours to reduce emissions and traffic.",
    newsNarrative: "NEW YORK — The Metropolitan Transportation Authority has officially approved a congestion pricing plan that will charge drivers a $15 daily fee to enter the central business district below 60th Street. The initiative, modeled after similar systems in London and Singapore, is designed to reduce chronic traffic gridlock and cut carbon emissions, while simultaneously generating billions in revenue to upgrade the city's aging subway infrastructure.\n\nThe policy has ignited a fierce debate between urban planners and suburban commuters. Supporters hail it as a victory for public health and environmental justice, pointing to projected decreases in air pollution and faster emergency response times. They argue that city streets are a scarce resource that should be priced to reflect their value. However, opponents, particularly those from the outer boroughs and New Jersey, decry the tax as punitive for working-class drivers who lack reliable public transit alternatives.\n\nLegal challenges are already mounting, with lawsuits filed by neighboring states and trucking associations. Despite the backlash, city officials remain firm, citing the urgent need for transit funding. The implementation phase, set to begin this spring, will be closely monitored as a potential blueprint for other gridlocked American cities like Los Angeles and Boston.",
    whyMatters: "Directly impacts daily commute costs, retail logistics, and urban air quality.",
    facts: [
      { content: "$15 daily fee for peak hours.", confidence: "High" },
      { content: "Exemptions for emergency vehicles and disability transport.", confidence: "High" }
    ],
    dataCutoff: "2024-10-24",
    divergenceRating: 5,
    perspectiveSummary: "Clash between environmental utility/efficiency and cost-of-living equity for outer-borough residents.",
    stakeholders: [
      { id: "u1", name: "Suburban Commuters", x: 90, y: 40, fears: "Unaffordable daily costs.", values: "Mobility, Affordability", blindSpots: "Externalities.", rationality: "No choice but to drive." },
      { id: "u2", name: "City Residents", x: 85, y: 60, fears: "Health issues.", values: "Livability", blindSpots: "Economic necessity of commuters.", rationality: "Our lungs pay the price." }
    ],
    controversyPrediction: { score: 40, riskLevel: "Medium", reasoning: "Protests likely in short term but data shows acceptance usually grows after 1 year." },
    terms: [], extensions: [], sourceCount: 89, lastUpdated: "10:38 AM"
  },
  { id: "3", title: "Central Bank Digital Currencies", category: "Economy", summary: "Nations piloting digital currency.", whyMatters: "Privacy vs Efficiency.", facts: [], dataCutoff: "2024", sourceCount: 200, lastUpdated: "9:00 AM" },
  { id: "4", title: "Deep Sea Mining Permits", category: "International", summary: "Mining rare earth metals.", whyMatters: "Batteries vs Ecology.", facts: [], dataCutoff: "2024", sourceCount: 65, lastUpdated: "11:00 AM" },
  { id: "5", title: "Social Media Age Verification", category: "Policy", summary: "ID for social media.", whyMatters: "Safety vs Privacy.", facts: [], dataCutoff: "2024", sourceCount: 112, lastUpdated: "08:45 AM" },
  { id: "6", title: "CRISPR Gene Editing", category: "Science", summary: "Germline editing debate.", whyMatters: "Curing disease vs Eugenics.", facts: [], dataCutoff: "2024", sourceCount: 98, lastUpdated: "12:10 PM" },
  { id: "7", title: "4-Day Work Week", category: "Society", summary: "Productivity trials.", whyMatters: "Work-life balance.", facts: [], dataCutoff: "2024", sourceCount: 150, lastUpdated: "09:50 AM" },
  { id: "8", title: "Space Sovereignty", category: "International", summary: "Moon mining rights.", whyMatters: "Future resources.", facts: [], dataCutoff: "2024", sourceCount: 77, lastUpdated: "07:30 AM" },
  { id: "9", title: "Global Minimum Tax", category: "Economy", summary: "15% corporate tax.", whyMatters: "Fairness vs Sovereignty.", facts: [], dataCutoff: "2024", sourceCount: 130, lastUpdated: "02:15 PM" },
  { id: "10", title: "Lab-Grown Meat", category: "Science", summary: "Cultivated meat sales.", whyMatters: "Climate vs Tradition.", facts: [], dataCutoff: "2024", sourceCount: 105, lastUpdated: "01:00 PM" }
];
