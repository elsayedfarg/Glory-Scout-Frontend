import api from './api.js';

const feedGrid = document.getElementById('feed-grid');
const feedLoader = document.getElementById('feed-loader');
let isLoading = false;
let lastLikesCount = null;
let lastCreatedAt = null;
let reachedEnd = false;

function formatDate(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleString();
}

function createPostCard(post) {
    return `
    <div class="feed-post" data-post-id="${post.id}" data-liked="${post.likedByCurrentUser}">
      <div class="feed-post-header">
        <img class="feed-post-avatar" src="${post.userProfilePhoto || 'https://via.placeholder.com/48'}" alt="${post.userName}">
        <span class="feed-post-user">${post.userName}</span>
        <span class="feed-post-date">${formatDate(post.createdAt)}</span>
      </div>
      <div class="feed-post-content">${post.content || ''}</div>
      ${post.imageUrl ? `<img class="feed-post-image" src="${post.imageUrl}" alt="Post image">` : ''}
      <div class="feed-post-actions">
        <span class="feed-action like-action${post.likedByCurrentUser ? ' liked' : ''}" data-liked="${post.likedByCurrentUser}">
          <i class="fas fa-heart icon"></i> <span class="like-count">${post.likesCount}</span>
        </span>
        <span class="feed-action comment-action">
          <i class="fas fa-comment icon"></i> <span class="comment-count">${post.commentsCount}</span>
        </span>
      </div>
      <div class="feed-comments" style="display:none;"></div>
    </div>
  `;
}

function renderPosts(posts) {
    posts.forEach(post => {
        feedGrid.insertAdjacentHTML('beforeend', createPostCard(post));
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
        const posts = res.data;
        if (!posts.length) {
            reachedEnd = true;
            feedLoader.style.display = 'none';
            return;
        }
        renderPosts(posts);
        // Update for next page
        const last = posts[posts.length - 1];
        lastLikesCount = last.likesCount;
        lastCreatedAt = last.createdAt;
        attachPostListeners(posts);
    } catch (err) {
        feedLoader.innerHTML = '<span style="color:red">Failed to load feed.</span>';
    } finally {
        isLoading = false;
        feedLoader.style.display = 'none';
    }
}

function attachPostListeners(posts) {
    posts.forEach(post => {
        const postElem = feedGrid.querySelector(`.feed-post[data-post-id="${post.id}"]`);
        if (!postElem) return;
        // Like/unlike
        const likeBtn = postElem.querySelector('.like-action');
        likeBtn.onclick = async function () {
            const liked = likeBtn.classList.contains('liked');
            try {
                if (!liked) {
                    await api.post(`http://glory-scout.tryasp.net/api/Post/${post.id}/like`);
                    likeBtn.classList.add('liked');
                    likeBtn.querySelector('.like-count').textContent = parseInt(likeBtn.querySelector('.like-count').textContent) + 1;
                } else {
                    await api.delete(`http://glory-scout.tryasp.net/api/Post/${post.id}/like`);
                    likeBtn.classList.remove('liked');
                    likeBtn.querySelector('.like-count').textContent = Math.max(0, parseInt(likeBtn.querySelector('.like-count').textContent) - 1);
                }
            } catch (e) {
                alert('Failed to update like.');
            }
        };
        // Show comments
        const commentBtn = postElem.querySelector('.comment-action');
        const commentsDiv = postElem.querySelector('.feed-comments');
        let commentsLoaded = false;
        commentBtn.onclick = async function () {
            if (commentsDiv.style.display === 'block') {
                commentsDiv.style.display = 'none';
                return;
            }
            commentsDiv.style.display = 'block';
            if (commentsLoaded) return;
            commentsDiv.innerHTML = '<span>Loading comments...</span>';
            try {
                const res = await api.get(`http://glory-scout.tryasp.net/api/Post/${post.id}/comments?page=1&pageSize=20`);
                const comments = res.data;
                if (!comments.length) {
                    commentsDiv.innerHTML = '<span>No comments yet.</span>';
                } else {
                    commentsDiv.innerHTML = comments.map(c => `
            <div class="feed-comment">
              <span class="feed-comment-user">${c.userName}</span>
              <span class="feed-comment-date">${formatDate(c.createdAt)}</span>
              <div>${c.content}</div>
            </div>
          `).join('');
                }
                commentsLoaded = true;
            } catch (e) {
                commentsDiv.innerHTML = '<span style="color:red">Failed to load comments.</span>';
            }
        };
    });
}

// Infinite scroll
window.addEventListener('scroll', () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 300) {
        loadFeed();
    }
});

// Initial load
loadFeed(); 