import api from './axios';

export const voteApi = {
  votePost: (postId, voteType) => api.post('/votes/post', { postId, voteType }),
  voteComment: (commentId, voteType) => api.post('/votes/comment', { commentId, voteType }),
  getPostVote: (postId) => api.get(`/votes/post/${postId}`),
  getCommentVote: (commentId) => api.get(`/votes/comment/${commentId}`),
};