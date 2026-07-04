export const BADGES = [
  { id: 'explorer', name: 'Fraction Explorer', desc: 'Complete Wonder + Story phases', icon: '🏅' },
  { id: 'builder', name: 'Bar Builder', desc: 'Complete all 3 Simulation stations', icon: '🥈' },
  { id: 'champion', name: 'Equivalence Champion', desc: 'Score >= 80% on Play phase', icon: '🥇' },
  { id: 'perfect', name: 'Perfect Match', desc: 'Score 10/10 in any world', icon: '💎' },
  { id: 'streak', name: 'Streak Star', desc: 'Achieve a streak of 10 consecutive correct answers', icon: '🔥' },
  { id: 'traveler', name: 'World Traveler', desc: 'Complete all 10 worlds', icon: '🌍' }
];

export function checkBadges(state) {
  const newBadges = [];
  const hasBadge = (id) => state.badges.includes(id);

  if (!hasBadge('explorer') && state.phaseComplete.story) newBadges.push('explorer');
  if (!hasBadge('builder') && state.phaseComplete.simulate) newBadges.push('builder');
  if (!hasBadge('streak') && state.streak >= 10) newBadges.push('streak');
  if (!hasBadge('perfect') && state.worldScores.some(s => s === 10)) newBadges.push('perfect');

  return newBadges;
}
