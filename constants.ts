
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
    title: "The Geneva AI Accord",
    category: "Tech",
    isInternational: true,
    summary: "Nations convene to establish baseline safety protocols for advanced AI models, balancing innovation speed with safety guardrails.",
    newsNarrative: "GENEVA — In a landmark assembly this week, delegates from over 40 nations convened in Geneva to draft the first comprehensive Global Treaty on Artificial Intelligence Safety. The accord marks a pivotal moment in technological governance, establishing a universal baseline for 'Red Line' capabilities—specific thresholds of autonomous behavior that no AI model is permitted to cross without human authorization.\n\nThe treaty introduces a tiered compliance system. Tier 1 systems, those exceeding 10^25 FLOPs of training compute, will be subject to mandatory external audits by a newly formed UN oversight body. Tier 2 systems will face lighter reporting requirements but must maintain 'kill switches' accessible by national authorities. This structure aims to prevent the proliferation of dangerous capabilities while allowing smaller-scale innovation to proceed with fewer hurdles.\n\nWhile the US and EU have hailed the agreement as a necessary safeguard against existential risk, representatives from the Global South have expressed concern. 'We fear this treaty effectively pulls up the ladder,' stated the Brazilian delegate, arguing that the high compliance costs will entrench the dominance of current tech giants and prevent developing nations from building their own sovereign AI infrastructure.",
    whyMatters: "The barrier to entry for coding might soon include a million-dollar compliance license.\n\nWe are currently deciding whether the next industrial revolution will be driven by open innovation or consolidated within a few entrenched giants.",
    impactHint: "Future job markets are quietly being reshaped by unseen screening standards.", 
    readingTime: 4,
    coreTension: "Safety ↔ Open Innovation",
    tensionLabel: "Core Tension",
    lensMetrics: { scope: 90, diversity: 60, controversy: 85 },
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
    title: "Brazil's Digital Sovereignty Stand",
    category: "Politics",
    isInternational: true,
    summary: "Judicial freeze on social media assets highlights the growing conflict between national digital sovereignty and stateless tech platforms.",
    newsNarrative: "BRASILIA — The standoff between Brazilian judicial authorities and international technology platforms escalated sharply...",
    whyMatters: "A localized court order now ripples across global infrastructure.\n\nWhen digital borders harden, the universal web begins to fracture into national intranets, changing how information flows across the world.",
    impactHint: "Digital services are becoming increasingly geographically conditional.", 
    readingTime: 3,
    coreTension: "National Law ↔ Borderless Web",
    tensionLabel: "Key Trade-off",
    lensMetrics: { scope: 75, diversity: 40, controversy: 95 },
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
            description: "The Brazilian court's decision to freeze Starlink assets to pay for X's fines relies on a legal theory known as 'piercing the corporate veil'..."
        },
        {
            title: "Context: The 'Splinternet'",
            type: "Academic",
            description: "We are witnessing the acceleration of the 'Splinternet'—the fragmentation of the global internet into distinct national blocks..."
        }
    ], 
    sourceCount: 92, lastUpdated: "1 hour ago"
  },
  {
    id: "12",
    title: "Japan's Automation Gamble",
    category: "Society",
    isInternational: true,
    summary: "Japan introduces radical new visa policies and automation incentives to combat terminal demographic decline.",
    newsNarrative: "TOKYO — Facing an existential demographic crisis, the Japanese government has unveiled a suite of radical policy shifts...",
    whyMatters: "Japan is the canary in the coal mine for all aging developed nations.\n\nThey are attempting to replace a shrinking workforce with robotics and digital nomads. Success saves the economy; failure risks cultural collapse.",
    impactHint: "Pension systems rely on a working population that may soon not exist.", 
    readingTime: 5,
    coreTension: "Homogeneity ↔ Economic Survival",
    tensionLabel: "Core Tension",
    lensMetrics: { scope: 60, diversity: 30, controversy: 50 },
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
    title: "The Price of Urban Entry",
    category: "Society",
    summary: "Major metropolitan areas introduce dynamic pricing for entering city centers during peak hours to reduce emissions and traffic.",
    newsNarrative: "NEW YORK — The Metropolitan Transportation Authority has officially approved a congestion pricing plan...",
    whyMatters: "We are putting a literal price tag on public pavement.\n\nWhile aimed at reducing emissions, this shifts the cost of clean air onto the working class who cannot afford to live in the city center.",
    impactHint: "The cost of a morning commute is being recalculated for everyone.", 
    readingTime: 3,
    coreTension: "Efficiency ↔ Equity",
    tensionLabel: "Key Trade-off",
    lensMetrics: { scope: 40, diversity: 80, controversy: 70 },
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
  { 
    id: "3", title: "The End of Cash?", category: "Economy", summary: "Nations piloting digital currency.", whyMatters: "Digital convenience often comes at the cost of financial anonymity.\n\nEvery transaction becoming a data point fundamentally changes the nature of private commerce.", 
    readingTime: 4, coreTension: "Privacy ↔ Efficiency", tensionLabel: "Key Trade-off", lensMetrics: { scope: 95, diversity: 50, controversy: 80 }, facts: [], dataCutoff: "2024", sourceCount: 200, lastUpdated: "9:00 AM" 
  },
  { 
    id: "4", title: "Mining the Abyss", category: "Agriculture", summary: "Mining rare earth metals.", whyMatters: "Green energy requires batteries, and batteries require metals found on the ocean floor.\n\nSaving the climate above water might require destroying the ecosystem below it.", 
    readingTime: 3, lensMetrics: { scope: 60, diversity: 70, controversy: 60 }, facts: [], dataCutoff: "2024", sourceCount: 65, lastUpdated: "11:00 AM" 
  },
  { id: "5", title: "Social Media Age Verification", category: "Politics", summary: "ID for social media.", whyMatters: "Safety laws are colliding with privacy rights.", readingTime: 2, lensMetrics: { scope: 80, diversity: 40, controversy: 50 }, facts: [], dataCutoff: "2024", sourceCount: 112, lastUpdated: "08:45 AM" },
  { id: "6", title: "CRISPR Gene Editing", category: "Science", summary: "Germline editing debate.", whyMatters: "We now have the tools to direct our own evolution.", readingTime: 6, coreTension: "Health ↔ Ethics", tensionLabel: "Core Tension", lensMetrics: { scope: 90, diversity: 90, controversy: 90 }, facts: [], dataCutoff: "2024", sourceCount: 98, lastUpdated: "12:10 PM" },
  { id: "7", title: "4-Day Work Week", category: "Society", summary: "Productivity trials.", whyMatters: "The standard work week is being renegotiated.", readingTime: 3, lensMetrics: { scope: 50, diversity: 30, controversy: 40 }, facts: [], dataCutoff: "2024", sourceCount: 150, lastUpdated: "09:50 AM" },
  { id: "8", title: "Space Sovereignty", category: "Space", summary: "Moon mining rights.", whyMatters: "Old geopolitical rivalries are launching into orbit.", readingTime: 4, lensMetrics: { scope: 20, diversity: 20, controversy: 30 }, facts: [], dataCutoff: "2024", sourceCount: 77, lastUpdated: "07:30 AM" },
  { id: "9", title: "Global Minimum Tax", category: "Economy", summary: "15% corporate tax.", whyMatters: "Tax havens are facing a unified global challenge.", readingTime: 5, lensMetrics: { scope: 85, diversity: 60, controversy: 60 }, facts: [], dataCutoff: "2024", sourceCount: 130, lastUpdated: "02:15 PM" },
  { id: "10", title: "Lab-Grown Meat", category: "Agriculture", summary: "Cultivated meat sales.", whyMatters: "Food production is decoupling from agriculture.", readingTime: 3, lensMetrics: { scope: 40, diversity: 50, controversy: 70 }, facts: [], dataCutoff: "2024", sourceCount: 105, lastUpdated: "01:00 PM" },
  { id: "13", title: "Indie Game Renaissance", category: "Gaming", summary: "Small studios are outselling AAA giants as players tire of microtransactions.", whyMatters: "A shift in digital culture from monetization to creativity.", readingTime: 2, lensMetrics: { scope: 30, diversity: 60, controversy: 20 }, facts: [], dataCutoff: "2024", sourceCount: 50, lastUpdated: "03:15 PM" },
  { id: "14", title: "The Return of Vinyl", category: "Entertainment", summary: "Physical media sales hit 30-year high.", whyMatters: "A tactile rebellion against the ephemeral nature of streaming.", readingTime: 2, lensMetrics: { scope: 20, diversity: 10, controversy: 10 }, facts: [], dataCutoff: "2024", sourceCount: 40, lastUpdated: "05:00 PM" },
  { id: "15", title: "Lost Cities of the Amazon", category: "History", summary: "LiDAR reveals ancient urban sprawls in the rainforest.", whyMatters: "We are rewriting the history of human civilization in the Americas.", readingTime: 5, lensMetrics: { scope: 50, diversity: 80, controversy: 30 }, facts: [], dataCutoff: "2024", sourceCount: 120, lastUpdated: "11:30 AM" }
];
