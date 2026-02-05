
import { TopicData, CocoonReportData, CategoryScore, TopicCategory, TrendInsight } from "../types";
import { MOCK_TOPICS } from "../constants";

const ALL_CATEGORIES: TopicCategory[] = ['Policy', 'Tech', 'Economy', 'Society', 'International', 'Science'];

export const generateCocoonReport = (clickedTopics: TopicData[], favorites: TopicData[]): CocoonReportData => {
  const totalReads = clickedTopics.length;
  const counts: Record<string, number> = {};

  // Initialize counts for Radar Chart
  ALL_CATEGORIES.forEach(cat => counts[cat] = 0);

  // Count reads for Radar
  clickedTopics.forEach(topic => {
    if (topic.category && counts[topic.category] !== undefined) {
      counts[topic.category]++;
    }
  });

  // Calculate scores for Radar Chart
  // Base score 20 for existence, +20 per read, max 100
  const radarData: CategoryScore[] = ALL_CATEGORIES.map(subject => {
    const count = counts[subject];
    let score = 0;
    if (count > 0) score = Math.min(100, 20 + (count * 20));
    
    return {
      subject,
      score,
      fullMark: 100
    };
  });

  // Identify Blind Spots (Score 0)
  const blindSpots = radarData.filter(d => d.score === 0).map(d => d.subject);

  // Calculate Cocoon Score (Balance)
  const scores = radarData.map(d => d.score);
  const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
  const variance = scores.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / scores.length;
  const stdDev = Math.sqrt(variance);
  
  // Normalize: 0 stdDev = 100 score.
  const cocoonScore = Math.max(0, Math.round(100 - stdDev));

  // Determine Diversity Level
  let diversityLevel: CocoonReportData['diversityLevel'] = 'Echo Chamber';
  if (cocoonScore > 80 && totalReads > 5) diversityLevel = 'Bridge Builder';
  else if (cocoonScore > 50) diversityLevel = 'Explorer';
  else if (cocoonScore > 30) diversityLevel = 'Filter Bubble';

  // Recommendation
  let recommendedTopic = undefined;
  if (blindSpots.length > 0) {
    recommendedTopic = blindSpots[Math.floor(Math.random() * blindSpots.length)];
  }

  // --- Generate Trend Insights ---
  
  // 1. Global Themes (Mock: Last 30 Days "Hot" Events)
  // In a real app, filtering MOCK_TOPICS by date would be better, here we take fixed ones for demo
  const globalThemes = MOCK_TOPICS.slice(0, 3).map(t => ({
    title: t.title,
    category: t.category
  }));

  // 2. User Focused Events (Logic: Weighted Score based on Clicks & Favorites)
  // Score: Click = 1, Favorite = 3
  const topicScores: Record<string, { topic: TopicData, score: number }> = {};
  
  // Process Clicks
  clickedTopics.forEach(t => {
      if(!topicScores[t.id]) topicScores[t.id] = { topic: t, score: 0 };
      topicScores[t.id].score += 1;
  });

  // Process Favorites
  favorites.forEach(t => {
      if(!topicScores[t.id]) topicScores[t.id] = { topic: t, score: 0 };
      topicScores[t.id].score += 3;
  });

  // Sort by Score
  const userTopTopics = Object.values(topicScores)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(item => ({
        title: item.topic.title,
        score: item.score,
        category: item.topic.category
    }));

  // 3. Summaries
  // Dynamic User Summary
  let userFocusSummary = "You haven't built enough reading history yet.";
  if (userTopTopics.length > 0) {
      const topTitle = userTopTopics[0].title;
      const topCat = userTopTopics[0].category;
      if (userTopTopics.length === 1) {
          userFocusSummary = `You are heavily focused on the "${topTitle}" event in the ${topCat} sector.`;
      } else {
          userFocusSummary = `Your attention is centered on "${topTitle}" and related ${topCat} discussions, with strong interest in high-impact policy shifts.`;
      }
  }

  const globalSummary = "This month's global discourse was dominated by AI Safety Governance and Digital Sovereignty, marking a shift from economic indicators to regulatory frameworks.";

  const trendInsights: TrendInsight = {
    globalThemes,
    userTopTopics,
    userFocusSummary,
    globalSummary
  };

  return {
    radarData,
    totalReads,
    cocoonScore,
    blindSpots,
    diversityLevel,
    recommendedTopic,
    trendInsights
  };
};
