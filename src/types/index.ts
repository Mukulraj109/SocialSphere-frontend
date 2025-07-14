export interface User {
  _id: string;
  username: string;
  email: string;
  fullName: string;
  avatar: string;
  coverImage: string;
  watchHistory: string[];
  subscribersCount?: number;
  subscribedChannelCount?: number;
  isSubscribed?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  statusCode: number;
  data: User & {
    accessToken?: string;
    refreshToken?: string;
  };
  message: string;
  success: boolean;
}

export interface LoginCredentials {
  username?: string;
  email?: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  fullName: string;
  avatar?: File;
  coverImage?: File;
}

export interface UpdateUserDetails {
  fullName?: string;
  email?: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export interface ApiError {
  statusCode: number;
  message: string;
  success: false;
}

export interface Video {
  _id: string;
  title: string;
  description: string;
  thumbnail: string;
  videoFile: string;
  duration: number;
  views: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  owner: string | User;
}

export interface VideoUploadData {
  title: string;
  description?: string;
  videoFile: File;
  thumbnail: File;
}

export interface VideoUpdateData {
  title?: string;
  description?: string;
  thumbnail?: File;
}

export interface VideosResponse {
  statusCode: number;
  data: Video[];
  message: string;
  success: boolean;
}

export interface VideoResponse {
  statusCode: number;
  data: Video;
  message: string;
  success: boolean;
}

// Like interfaces
export interface LikeResponse {
  statusCode: number;
  data: {
    isVideoLiked?: boolean;
    isCommentLiked?: boolean;
    isCommunityLiked?: boolean;
  };
  message: string;
  success: boolean;
}

export interface LikedVideo {
  _id: string;
  video: Video;
  likedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface LikedVideosResponse {
  statusCode: number;
  data: LikedVideo[];
  message: string;
  success: boolean;
}

// Comment interfaces
export interface Comment {
  _id: string;
  content: string;
  video: string;
  owner: User[] | string;
  createdAt: string;
  updatedAt: string;
}

export interface CommentResponse {
  statusCode: number;
  data: Comment;
  message: string;
  success: boolean;
}

export interface CommentsResponse {
  statusCode: number;
  data: Comment[];
  message: string;
  success: boolean;
}

// Community Post interfaces
export interface CommunityPost {
  _id: string;
  content: string;
  owner: User[] | string;
  createdAt: string;
  updatedAt: string;
}

export interface CommunityPostResponse {
  statusCode: number;
  data: CommunityPost;
  message: string;
  success: boolean;
}

export interface CommunityPostsResponse {
  statusCode: number;
  data: CommunityPost[];
  message: string;
  success: boolean;
}

// Subscription interfaces
export interface SubscriptionResponse {
  statusCode: number;
  data: {
    isSubscribed: boolean;
  };
  message: string;
  success: boolean;
}

export interface Subscriber {
  _id: string;
  subscriber: User[];
  createdAt: string;
}

export interface SubscribersResponse {
  statusCode: number;
  data: Subscriber[];
  message: string;
  success: boolean;
}

export interface SubscribedChannel {
  _id: string;
  channel: User[];
  createdAt: string;
}

export interface SubscribedChannelsResponse {
  statusCode: number;
  data: SubscribedChannel[];
  message: string;
  success: boolean;
}

// Playlist interfaces
export interface Playlist {
  _id: string;
  name: string;
  description: string;
  video: Video[] | string[];
  owner: string;
  createdAt: string;
  updatedAt: string;
}

export interface PlaylistResponse {
  statusCode: number;
  data: Playlist;
  message: string;
  success: boolean;
}

export interface PlaylistsResponse {
  statusCode: number;
  data: Playlist[];
  message: string;
  success: boolean;
}

export interface CreatePlaylistData {
  name: string;
  description?: string;
}

export interface UpdatePlaylistData {
  name?: string;
  description?: string;
}