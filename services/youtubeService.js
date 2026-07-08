const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

// Cache channel IDs to avoid fetching them repeatedly
const channelIdCache = {
  '@TuanDatVlogs': 'UCsoY16pm6pYV97oZHYSL_Sg',
  '@tuandat89': 'UCF6DIt8u0ssiVDrIDLwuRew'
};

const FALLBACK_SHORTS = [
  'N4DYw05QOKI' // Real short from @TuanDatVlogs
];

const FALLBACK_VIDEOS = [
  'enoFbiCKmAQ', // Real video 1 from @tuandat89
  'Tb0NEdLgv5g'  // Real video 2 from @tuandat89
];

export const youtubeService = {
  /**
   * Resolve a handle to channel ID (cheap quota: 1 point)
   */
  async getChannelId(handle) {
    if (!YOUTUBE_API_KEY) return null;
    if (channelIdCache[handle]) return channelIdCache[handle];

    try {
      const cleanHandle = handle.startsWith('@') ? handle : `@${handle}`;
      const url = `https://www.googleapis.com/youtube/v3/channels?part=id&forHandle=${encodeURIComponent(cleanHandle)}&key=${YOUTUBE_API_KEY}`;
      const res = await fetch(url);
      const data = await res.json();

      if (data?.items && data.items.length > 0) {
        const id = data.items[0].id;
        channelIdCache[handle] = id;
        return id;
      }
    } catch (err) {
      console.error(`Error resolving handle ${handle}:`, err);
    }
    return null;
  },

  /**
   * Fetch 20 newest videos from a channel (cheap quota: 1 point)
   */
  async getRecentVideos(handle, isShorts = false) {
    const fallback = isShorts ? FALLBACK_SHORTS : FALLBACK_VIDEOS;
    if (!YOUTUBE_API_KEY) {
      console.log(`No YOUTUBE_API_KEY. Using fallback videos for ${handle}.`);
      return fallback;
    }

    try {
      const channelId = await this.getChannelId(handle);
      if (!channelId) return fallback;

      // Convert UC... (channel ID) to UU... (uploads playlist ID)
      const uploadsPlaylistId = 'UU' + channelId.substring(2);

      const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=20&key=${YOUTUBE_API_KEY}`;
      const res = await fetch(url);
      const data = await res.json();

      if (data?.items && data.items.length > 0) {
        // Return array of video IDs
        return data.items.map(item => item.snippet?.resourceId?.videoId).filter(Boolean);
      }
    } catch (err) {
      console.error(`Error fetching uploads for ${handle}:`, err);
    }
    return fallback;
  },

  /**
   * Get a random video from the list, with 70% preference to top 5 newest
   */
  getRandomVideo(videoList) {
    if (!videoList || videoList.length === 0) return null;
    const count = videoList.length;

    // 70% chance to pick from top 5 (newest), 30% from all
    const useTop5 = Math.random() < 0.7 && count >= 5;
    const range = useTop5 ? 5 : count;
    const index = Math.floor(Math.random() * range);
    return videoList[index];
  }
};
