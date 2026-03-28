import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { postsAPI, isAuthenticated } from '../utils/api';
import './SocialFeed.css';

function SocialFeed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newPost, setNewPost] = useState('');
  const [postType, setPostType] = useState('update');
  const [submitting, setSubmitting] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async (pageNum = 1) => {
    try {
      setLoading(true);
      const response = await postsAPI.getAll(pageNum);
      if (response.success) {
        if (pageNum === 1) {
          setPosts(response.posts);
        } else {
          setPosts(prev => [...prev, ...response.posts]);
        }
        setHasMore(response.currentPage < response.totalPages);
      }
    } catch (err) {
      setError('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newPost.trim()) return;

    try {
      setSubmitting(true);
      const response = await postsAPI.create({
        content: newPost,
        type: postType
      });
      
      if (response.success) {
        setPosts(prev => [response.post, ...prev]);
        setNewPost('');
      }
    } catch (err) {
      alert('Failed to create post');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = async (postId) => {
    try {
      const response = await postsAPI.like(postId);
      if (response.success) {
        setPosts(prev => prev.map(post => {
          if (post._id === postId) {
            return {
              ...post,
              likes: response.isLiked 
                ? [...post.likes, 'currentUser']
                : post.likes.filter(id => id !== 'currentUser')
            };
          }
          return post;
        }));
      }
    } catch (err) {
      console.error('Failed to like post');
    }
  };

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchPosts(nextPage);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="social-feed-page">
      <div className="feed-header">
        <h1>Community Feed</h1>
        <p className="subtitle">Share your spiritual journey with the community</p>
      </div>

      {/* Create Post */}
      {isAuthenticated() && (
        <div className="create-post">
          <form onSubmit={handleSubmit}>
            <textarea
              placeholder="Share your spiritual experience, question, or update..."
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              maxLength={2000}
              rows={3}
            />
            <div className="post-actions">
              <select 
                value={postType} 
                onChange={(e) => setPostType(e.target.value)}
                className="type-select"
              >
                <option value="update">Update</option>
                <option value="experience">Experience</option>
                <option value="question">Question</option>
                <option value="photo">Photo</option>
              </select>
              <button 
                type="submit" 
                disabled={submitting || !newPost.trim()}
                className="post-btn"
              >
                {submitting ? 'Posting...' : 'Post'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Posts Feed */}
      <div className="posts-feed">
        {posts.map(post => (
          <div key={post._id} className="post-card">
            <div className="post-header">
              <div className="user-info">
                <div className="user-avatar">
                  {post.user?.spiritualName?.[0] || post.user?.name?.[0] || '?'}
                </div>
                <div className="user-details">
                  <Link to={`/profile/${post.user?._id}`} className="user-name">
                    {post.user?.spiritualName || post.user?.name || 'Unknown'}
                  </Link>
                  {post.temple && (
                    <span className="temple-tag">
                      🛕 {post.temple.name}
                    </span>
                  )}
                </div>
              </div>
              <span className="post-time">{formatDate(post.createdAt)}</span>
            </div>

            <div className="post-content">
              <p>{post.content}</p>
              {post.images?.length > 0 && (
                <div className="post-images">
                  {post.images.map((img, idx) => (
                    <img key={idx} src={img} alt="Post content" />
                  ))}
                </div>
              )}
            </div>

            <div className="post-footer">
              <button 
                className={`like-btn ${post.likes?.includes('currentUser') ? 'liked' : ''}`}
                onClick={() => handleLike(post._id)}
              >
                <span>🙏</span>
                <span>{post.likes?.length || 0}</span>
              </button>
              <button className="comment-btn">
                <span>💬</span>
                <span>{post.comments?.length || 0}</span>
              </button>
              <span className={`post-type-badge ${post.type}`}>{post.type}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Load More */}
      {hasMore && !loading && (
        <button className="load-more-btn" onClick={loadMore}>
          Load More Posts
        </button>
      )}

      {loading && page === 1 && (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading posts...</p>
        </div>
      )}

      {error && <div className="error-message">{error}</div>}

      {!loading && posts.length === 0 && (
        <div className="no-posts">
          <p>No posts yet. Be the first to share!</p>
        </div>
      )}
    </div>
  );
}

export default SocialFeed;
