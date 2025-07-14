const API_BASE_URL = 'http://localhost:8000/api/v1';

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

 private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${this.baseURL}${endpoint}`;

  // Only set 'Content-Type' if body is NOT FormData
  const isFormData = options.body instanceof FormData;

  const config: RequestInit = {
    credentials: 'include',
    ...options,
    headers: {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

  // Auth endpoints
  async register(formData: FormData) {
    return this.request('/users/register', {
      method: 'POST',
      headers: {}, // Don't set Content-Type for FormData
      body: formData,
    });
  }

  async login(credentials: { username?: string; email?: string; password: string }) {
    return this.request('/users/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async logout() {
    return this.request('/users/logout', {
      method: 'POST',
    });
  }

  async refreshToken() {
    return this.request('/users/refresh-access-token', {
      method: 'POST',
    });
  }

  async getCurrentUser() {
    return this.request('/users/current-user');
  }

  async changePassword(data: { currentPassword: string; newPassword: string }) {
    return this.request('/users/change-password', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateUserDetails(data: { fullName?: string; email?: string }) {
    return this.request('/users/update-user-detail', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateAvatar(file: File) {
    const formData = new FormData();
    formData.append('avatar', file);
    
    return this.request('/users/update-avatar', {
      method: 'POST',
      headers: {}, // Don't set Content-Type for FormData
      body: formData,
    });
  }

  async updateCoverImage(file: File) {
    const formData = new FormData();
    formData.append('coverImage', file);
    
    return this.request('/users/update-cover-image', {
      method: 'POST',
      headers: {}, // Don't set Content-Type for FormData
      body: formData,
    });
  }

  async getChannelProfile(username: string) {
    return this.request(`/users/channel/${username}`);
  }

  async getWatchHistory() {
    return this.request('/users/watch-history');
  }

  // Video endpoints
  async publishVideo(formData: FormData) {
    return this.request('/videos/publish-video', {
      method: 'POST',
      headers: {}, // Don't set Content-Type for FormData
      body: formData,
    });
  }

  async getVideos(params?: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortType?: 'asc' | 'desc';
  }) {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params?.sortType) queryParams.append('sortType', params.sortType);
    
    const query = queryParams.toString();
    return this.request(`/videos${query ? `?${query}` : ''}`);
  }

  async getVideoById(videoId: string) {
    return this.request(`/videos/vid/${videoId}`);
  }

  async updateVideo(videoId: string, formData: FormData) {
    return this.request(`/videos/update-video/${videoId}`, {
      method: 'POST',
      headers: {}, // Don't set Content-Type for FormData
      body: formData,
    });
  }

  async deleteVideo(videoId: string) {
    return this.request(`/videos/delete/${videoId}`, {
      method: 'POST',
    });
  }

  async togglePublishStatus(videoId: string) {
    return this.request(`/videos/publish-status/${videoId}`, {
      method: 'POST',
    });
  }

  // Like endpoints
  async toggleVideoLike(videoId: string) {
    return this.request(`/likes/vid-like/${videoId}`, {
      method: 'POST',
    });
  }

  async toggleCommentLike(commentId: string) {
    return this.request(`/likes/comment-like/${commentId}`, {
      method: 'POST',
    });
  }

  async toggleCommunityPostLike(postId: string) {
    return this.request(`/likes/post-like/${postId}`, {
      method: 'POST',
    });
  }

  async getLikedVideos() {
    return this.request('/likes/get-liked-vid');
  }

  // Comment endpoints
  async addComment(channelId: string, videoId: string, content: string) {
    return this.request(`/comments/create/${channelId}/${videoId}`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  }

  async getVideoComments(videoId: string) {
    return this.request(`/comments/vid-comments/${videoId}`);
  }

  async deleteComment(commentId: string) {
    return this.request(`/comments/delete-comment/${commentId}`, {
      method: 'POST',
    });
  }

  async updateComment(commentId: string, content: string) {
    return this.request(`/comments/update-comment/${commentId}`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  }

  // Community Post endpoints
  async createCommunityPost(content: string) {
    return this.request('/communities/', {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  }

  async getAllCommunityPosts() {
    return this.request('/communities/all-post');
  }

  async getChannelPosts(channelId: string) {
    return this.request(`/communities/channel-post/${channelId}`);
  }

  async deleteCommunityPost(postId: string) {
    return this.request(`/communities/delete-post/${postId}`, {
      method: 'POST',
    });
  }

  async updateCommunityPost(postId: string, content: string) {
    return this.request(`/communities/update-post/${postId}`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  }

  // Subscription endpoints
  async toggleSubscription(channelId: string) {
    return this.request(`/subscriptions/${channelId}`, {
      method: 'POST',
    });
  }

  async getChannelSubscribers(channelId: string) {
    return this.request(`/subscriptions/channel-subs/${channelId}`, {
      method: 'POST',
    });
  }

  async getSubscribedChannels(channelId: string) {
    return this.request(`/subscriptions/subscribed-channels/${channelId}`, {
      method: 'POST',
    });
  }

  // Playlist endpoints
  async createPlaylist(data: { name: string; description?: string }) {
    return this.request('/playlists/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async addVideoToPlaylist(playlistId: string, videoId: string) {
    return this.request(`/playlists/add-videos/${playlistId}/${videoId}`, {
      method: 'POST',
    });
  }

  async getPlaylist(playlistId: string) {
    return this.request(`/playlists/get-playlist/${playlistId}`);
  }

  async getUserPlaylists(userId: string) {
    return this.request(`/playlists/get-user-playlist/${userId}`);
  }

  async deletePlaylist(playlistId: string) {
    return this.request(`/playlists/delete-playlist/${playlistId}`, {
      method: 'POST',
    });
  }

  async updatePlaylist(playlistId: string, data: { name?: string; description?: string }) {
    return this.request(`/playlists/update-playlist/${playlistId}`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async removeVideoFromPlaylist(playlistId: string, videoId: string) {
    return this.request(`/playlists/remove-video/${playlistId}/${videoId}`, {
      method: 'POST',
    });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);