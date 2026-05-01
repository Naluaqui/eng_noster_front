import {
  persuasionProfile,
  persuasionSidebarStats,
  persuasionSocials,
  persuasionTracks,
  persuasionWorklist,
} from '../mocks/persuasionProfile.mock';

export async function getPersuasionDashboard() {
  return {
    profile: persuasionProfile,
    socials: persuasionSocials,
    tracks: persuasionTracks,
    sidebarStats: persuasionSidebarStats,
    worklist: persuasionWorklist,
  };
}
