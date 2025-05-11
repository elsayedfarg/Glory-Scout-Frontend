import api from './api.js';

const feedGrid = document.getElementById('feed-grid');
const feedLoader = document.getElementById('feed-loader');
let isLoading = false;
let lastLikesCount = null;
let lastCreatedAt = null;
let reachedEnd = false;

function formatDate(dateStr) {
    const d = new Date(dateStr);
    const now = new Date();
    const diff = (now - d) / 1000;
    if (diff < 60) return `${Math.floor(diff)}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    return d.toLocaleDateString();
}

function createPostCard(post, commentsPreview = []) {
    const likesCount = post.likesCount || 0;
    const commentsCount = post.commentsCount || 0;

    // Get post URL, accounting for API typo (posrUrl vs postUrl)
    const postImageUrl = post.postUrl || post.posrUrl;

    // Create the post initials if no profile picture
    const initials = post.username ? post.username.charAt(0).toUpperCase() : '?';

    return `
    <div class="post-card" data-post-id="${post.id}" data-liked="${post.isLikedByCurrentUser}" data-likes-count="${likesCount}">
      <div class="post-header">
        <div class="post-avatar">
          ${post.userProfilePicture
            ? `<img src="${post.userProfilePicture}" alt="${post.username}" />`
            : initials}
        </div>
        <div class="post-user-info">
          <div class="post-username">${post.username}</div>
          ${post.description ? `<div class="post-description">${post.description}</div>` : ''}
          <div class="post-meta">${post.postNumber ? `${post.postNumber} post` : ''}</div>
        </div>
      </div>
      
      ${postImageUrl ? `
      <div class="post-media">
        <img class="post-image" src="${postImageUrl}" alt="Post image">
      </div>` : ''}
      
      ${post.content ? `
      <div class="post-content">
        <p>${post.content}</p>
      </div>` : ''}
      
      <div class="post-engagement">
        <span class="engagement-item">
          <span class="like-action${post.isLikedByCurrentUser ? ' liked' : ''}">
            <i class="fa-heart engagement-icon likes-icon ${post.isLikedByCurrentUser ? 'fas' : 'far'}"></i>
          </span>
          <span class="likes-count">${likesCount} Likes</span>
        </span>
        
        <span class="engagement-item comment-toggle">
          <i class="far fa-comment engagement-icon comments-icon"></i>
          <span class="comments-count">${commentsCount} Comments</span>
        </span>
      </div>
      
      <div class="post-comments">
        ${commentsPreview.map(c => `
          <div class="comment-item">
            <span class="comment-username">${c.userName}:</span>
            <span class="comment-content">${c.content}</span>
          </div>
        `).join('')}
        
        <div class="comment-input">
          <input type="text" placeholder="Add a comment..." />
          <button class="comment-submit">Post</button>
        </div>
      </div>
    </div>
  `;
}

function renderPosts(posts) {
    posts.forEach(post => {
        // Log individual post to debug
        console.log('Processing post:', post.id, post);

        // Fix the typo in the API response (posrUrl vs postUrl)
        if (post.posrUrl && !post.postUrl) {
            post.postUrl = post.posrUrl;
        }

        // Use description as content if no content exists
        if (!post.content && post.description) {
            post.content = post.description;
        }

        // For preview, fetch first 2 comments (optional, can be optimized)
        api.get(`http://glory-scout.tryasp.net/api/Post/${post.id}/comments?page=1&pageSize=2`).then(res => {
            const commentsPreview = res.data || [];
            feedGrid.insertAdjacentHTML('beforeend', createPostCard(post, commentsPreview));
            // Make sure to attach listeners after adding to DOM
            attachPostListeners(post.id);
        }).catch(() => {
            feedGrid.insertAdjacentHTML('beforeend', createPostCard(post, []));
            // Make sure to attach listeners after adding to DOM
            attachPostListeners(post.id);
        });
    });
}

async function loadFeed() {
    if (isLoading || reachedEnd) return;
    isLoading = true;
    feedLoader.style.display = 'block';
    let url = 'http://glory-scout.tryasp.net/api/HomePage/feed?limit=20';
    if (lastLikesCount !== null && lastCreatedAt !== null) {
        url += `&lastLikesCount=${encodeURIComponent(lastLikesCount)}&lastCreatedAt=${encodeURIComponent(lastCreatedAt)}&limit=20`;
    }
    try {
        const res = await api.get(url);
        const posts = res.data.posts;

        // Debug post data
        console.log('Feed data:', posts);

        if (!posts.length) {
            reachedEnd = true;
            feedLoader.style.display = 'none';
            return;
        }

        // Process posts to ensure content shows up
        const processedPosts = posts.map(post => {
            // Fix the image URL typo (posrUrl vs postUrl)
            if (post.posrUrl && !post.postUrl) {
                post.postUrl = post.posrUrl;
            }

            // Make sure description becomes content
            if (!post.content && post.description) {
                post.content = post.description;
            }

            // Log processed post
            console.log('Processed post:', post);

            return post;
        });

        renderPosts(processedPosts);

        // Update for next page using nextCursor
        const nextCursor = res.data.nextCursor;
        if (nextCursor) {
            lastLikesCount = nextCursor.lastLikesCount;
            lastCreatedAt = nextCursor.lastCreatedAt;
        }
    } catch (err) {
        console.error('Feed loading error:', err);
        feedLoader.innerHTML = '<span style="color:red">Failed to load feed.</span>';
    } finally {
        isLoading = false;
        feedLoader.style.display = 'none';
    }
}

function attachPostListeners(postId) {
    const postElem = feedGrid.querySelector(`.post-card[data-post-id="${postId}"]`);
    if (!postElem) return;

    // Ensure comments start collapsed
    const commentsSection = postElem.querySelector('.post-comments');
    commentsSection.classList.remove('active');

    // Like/unlike
    const likeBtn = postElem.querySelector('.like-action');
    const likeIcon = likeBtn.querySelector('.fa-heart');
    const likeCountElem = postElem.querySelector('.likes-count');

    likeBtn.addEventListener('click', async function () {
        try {
            const isLiked = likeBtn.classList.contains('liked');

            if (!isLiked) {
                // Optimistic UI update
                likeBtn.classList.add('liked');
                likeIcon.classList.remove('far');
                likeIcon.classList.add('fas');

                const currentCount = parseInt(likeCountElem.textContent);
                likeCountElem.textContent = (currentCount + 1) + ' Likes';

                // API call
                await api.post(`http://glory-scout.tryasp.net/api/Post/${postId}/like`);
            } else {
                // Optimistic UI update
                likeBtn.classList.remove('liked');
                likeIcon.classList.remove('fas');
                likeIcon.classList.add('far');

                const currentCount = parseInt(likeCountElem.textContent);
                likeCountElem.textContent = Math.max(0, currentCount - 1) + ' Likes';

                // API call
                await api.delete(`http://glory-scout.tryasp.net/api/Post/${postId}/like`);
            }
        } catch (e) {
            console.error('Failed to update like:', e);
            // Revert UI changes if API call fails
            if (likeBtn.classList.contains('liked')) {
                likeBtn.classList.remove('liked');
                likeIcon.classList.remove('fas');
                likeIcon.classList.add('far');
            } else {
                likeBtn.classList.add('liked');
                likeIcon.classList.remove('far');
                likeIcon.classList.add('fas');
            }
        }
    });

    // Comment toggle
    const commentToggle = postElem.querySelector('.comment-toggle');

    commentToggle.addEventListener('click', function () {
        commentsSection.classList.toggle('active');
    });

    // Comment submission
    const commentForm = postElem.querySelector('.comment-input');
    const commentInput = commentForm.querySelector('input');
    const commentSubmit = commentForm.querySelector('.comment-submit');

    commentSubmit.addEventListener('click', async function () {
        const commentText = commentInput.value.trim();
        if (!commentText) return;

        try {
            // Optimistic UI update
            const commentItem = document.createElement('div');
            commentItem.className = 'comment-item';
            commentItem.innerHTML = `
                <span class="comment-username">You:</span>
                <span class="comment-content">${commentText}</span>
            `;
            commentForm.insertAdjacentElement('beforebegin', commentItem);
            commentInput.value = '';

            // Update comment count
            const commentsCountElem = postElem.querySelector('.comments-count');
            const currentCount = parseInt(commentsCountElem.textContent);
            commentsCountElem.textContent = (currentCount + 1) + ' Comments';

            // API call
            await api.post(`http://glory-scout.tryasp.net/api/Post/${postId}/comments`, {
                content: commentText
            });
        } catch (e) {
            console.error('Failed to post comment:', e);
            // You could remove the optimistic comment here if the API call fails
        }
    });

    // Enter key to submit comment
    commentInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            commentSubmit.click();
        }
    });
}

// Initialize menu toggle functionality
document.addEventListener('DOMContentLoaded', function () {
    const sidebarToggle = document.getElementById('menu-toggle');
    const headerMenuToggle = document.getElementById('header-menu-toggle');
    const sidebar = document.getElementById('sidebar');

    function toggleSidebar() {
        sidebar.classList.toggle('active');
    }

    if (sidebarToggle) sidebarToggle.addEventListener('click', toggleSidebar);
    if (headerMenuToggle) headerMenuToggle.addEventListener('click', toggleSidebar);
});

// Infinite scroll
window.addEventListener('scroll', () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 300) {
        loadFeed();
    }
});

// Initial load
loadFeed();