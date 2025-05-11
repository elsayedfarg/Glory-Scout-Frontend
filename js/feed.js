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

    // We won't pre-render comments anymore, they'll be loaded on demand
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
        <div class="comments-container">
          <div class="comments-loading">Loading comments...</div>
        </div>
        
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

        // Insert the post into the DOM (no comments loaded yet)
        feedGrid.insertAdjacentHTML('beforeend', createPostCard(post, []));

        // Attach event listeners to the new post
        attachPostListeners(post.id);
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

    // Always ensure comments start collapsed
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
    const commentsContainer = postElem.querySelector('.comments-container');
    let commentsLoaded = false;

    commentToggle.addEventListener('click', function () {
        commentsSection.classList.toggle('active');

        // If comments section is now active and comments haven't been loaded yet, load them
        if (commentsSection.classList.contains('active') && !commentsLoaded) {
            loadComments(postId, commentsContainer);
            commentsLoaded = true;
        }
    });

    // Comment submission
    const commentForm = postElem.querySelector('.comment-input');
    const commentInput = commentForm.querySelector('input');
    const commentSubmit = commentForm.querySelector('.comment-submit');

    commentSubmit.addEventListener('click', async function () {
        const commentText = commentInput.value.trim();
        if (!commentText) return;

        try {
            // Show loading state
            commentSubmit.disabled = true;
            commentSubmit.textContent = 'Posting...';

            // Get current username or use 'You' as fallback
            const currentUsername = 'You'; // Replace with actual username if available

            // API call first, then update UI
            const response = await api.post(`http://glory-scout.tryasp.net/api/Post/${postId}/comments`, {
                content: commentText
            });

            console.log('Comment posted response:', response);

            // Reload all comments to ensure the new one appears
            loadComments(postId, commentsContainer);

            // Clear input
            commentInput.value = '';

            // Update comment count
            const commentsCountElem = postElem.querySelector('.comments-count');
            const currentCount = parseInt(commentsCountElem.textContent);
            commentsCountElem.textContent = (currentCount + 1) + ' Comments';

            // Make sure comments section is expanded
            commentsSection.classList.add('active');
            commentsLoaded = true;
        } catch (e) {
            console.error('Failed to post comment:', e);
            alert('Failed to post comment. Please try again.');
        } finally {
            // Reset button state
            commentSubmit.disabled = false;
            commentSubmit.textContent = 'Post';
        }
    });

    // Enter key to submit comment
    commentInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            commentSubmit.click();
        }
    });
}

// Function to load comments for a post
async function loadComments(postId, container) {
    try {
        container.innerHTML = '<div class="comments-loading">Loading comments...</div>';

        const response = await api.get(`http://glory-scout.tryasp.net/api/Post/${postId}/comments?page=1&pageSize=20`);
        console.log('Comments loaded:', response);

        // Process the comment data
        let comments = [];
        if (response && response.data) {
            if (Array.isArray(response.data)) {
                comments = response.data;
            } else if (response.data.comments) {
                comments = response.data.comments;
            }
        }

        // Clear loading indicator
        container.innerHTML = '';

        // If no comments, show a message
        if (!comments.length) {
            container.innerHTML = '<div class="no-comments">No comments yet</div>';
            return;
        }

        // Render each comment
        comments.forEach(comment => {
            console.log('Rendering comment:', comment);

            // Get username from comment
            let username = 'Anonymous';
            if (comment.user && comment.user.username) {
                username = comment.user.username;
            }

            // Get comment text - check commentedText field
            let commentText = 'No content';
            if (comment.commentedText) {
                commentText = comment.commentedText;
            } else if (comment.content) {
                commentText = comment.content;
            } else if (comment.text) {
                commentText = comment.text;
            }

            const commentEl = document.createElement('div');
            commentEl.className = 'comment-item';
            commentEl.innerHTML = `
                <span class="comment-username">${username}:</span>
                <span class="comment-content">${commentText}</span>
            `;

            container.appendChild(commentEl);
        });
    } catch (error) {
        console.error('Error loading comments:', error);
        container.innerHTML = '<div class="comments-error">Failed to load comments. Please try again.</div>';
    }
}

// Initialize menu toggle functionality
document.addEventListener('DOMContentLoaded', function () {
    const sidebarToggle = document.getElementById('menu-toggle');
    const headerMenuToggle = document.getElementById('header-menu-toggle');
    const sidebar = document.getElementById('sidebar');
    const createPostInput = document.querySelector('.create-post-input input');
    const photoBtn = document.querySelector('.create-post-btn:nth-child(1)');
    const videoBtn = document.querySelector('.create-post-btn:nth-child(2)');
    const postBtn = document.querySelector('.create-post-btn.primary-btn');
    let selectedFile = null;
    let fileInputElement = null;

    // Create a hidden file input element
    function createFileInput() {
        if (fileInputElement) {
            document.body.removeChild(fileInputElement);
        }

        fileInputElement = document.createElement('input');
        fileInputElement.type = 'file';
        fileInputElement.accept = 'image/*';
        fileInputElement.style.display = 'none';
        document.body.appendChild(fileInputElement);

        fileInputElement.addEventListener('change', function (e) {
            if (e.target.files && e.target.files[0]) {
                selectedFile = e.target.files[0];

                // Update UI to show selected file
                const fileName = selectedFile.name;
                createPostInput.value = `Selected image: ${fileName}`;

                // Enable post button
                postBtn.classList.add('active');

                // Show image preview
                showImagePreview(selectedFile);
            }
        });
    }

    // Show image preview
    function showImagePreview(file) {
        // Remove any existing preview
        const existingPreview = document.querySelector('.create-post-preview');
        if (existingPreview) {
            existingPreview.remove();
        }

        const reader = new FileReader();
        reader.onload = function (e) {
            const previewContainer = document.createElement('div');
            previewContainer.className = 'create-post-preview';

            const previewImage = document.createElement('img');
            previewImage.src = e.target.result;
            previewImage.className = 'preview-image';

            const removeBtn = document.createElement('button');
            removeBtn.className = 'remove-preview';
            removeBtn.innerHTML = '<i class="fas fa-times"></i>';
            removeBtn.addEventListener('click', function (e) {
                e.preventDefault();
                previewContainer.remove();
                selectedFile = null;
                createPostInput.value = '';
                postBtn.classList.remove('active');
            });

            previewContainer.appendChild(previewImage);
            previewContainer.appendChild(removeBtn);

            const postCard = document.querySelector('.create-post-card');
            postCard.appendChild(previewContainer);
        };

        reader.readAsDataURL(file);
    }

    // Initialize file input
    createFileInput();

    // Photo button click
    if (photoBtn) {
        photoBtn.addEventListener('click', function () {
            fileInputElement.click();
        });
    }

    // Post button click
    if (postBtn) {
        postBtn.addEventListener('click', async function () {
            const description = createPostInput.value.trim();

            // Don't allow empty posts without either description or image
            if (!description && !selectedFile) {
                alert('Please enter a description or select an image');
                return;
            }

            // Show loading state
            postBtn.disabled = true;
            postBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';

            try {
                const formData = new FormData();

                // Add description
                formData.append('Description', description);

                // Add file if selected
                if (selectedFile) {
                    formData.append('file', selectedFile);
                }

                // Send post request
                const response = await fetch('http://glory-scout.tryasp.net/api/UserProfile/create-post', {
                    method: 'POST',
                    body: formData,
                    headers: {
                        // Don't set Content-Type for FormData
                        // The browser will set it automatically with the boundary
                        'Authorization': `Bearer ${localStorage.getItem('token')}` // Add auth token if needed
                    }
                });

                if (response.ok) {
                    // Reset form
                    createPostInput.value = '';
                    selectedFile = null;

                    // Remove preview
                    const preview = document.querySelector('.create-post-preview');
                    if (preview) {
                        preview.remove();
                    }

                    // Refresh feed to show the new post
                    feedGrid.innerHTML = '';
                    loadFeed();

                    // Show success message
                    alert('Post created successfully!');
                } else {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Failed to create post');
                }
            } catch (error) {
                console.error('Error creating post:', error);
                alert('Failed to create post. Please try again.');
            } finally {
                // Reset button state
                postBtn.disabled = false;
                postBtn.innerHTML = 'Post';
            }
        });
    }

    // Enable post button when text is entered
    if (createPostInput) {
        createPostInput.addEventListener('input', function () {
            if (this.value.trim() || selectedFile) {
                postBtn.classList.add('active');
            } else {
                postBtn.classList.remove('active');
            }
        });
    }

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