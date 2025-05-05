document.addEventListener('DOMContentLoaded', function () {
    // Elements
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    const mainContent = document.getElementById('main-content');
    const notification = document.getElementById('notification');
    const addPostBtn = document.getElementById('add-post-btn');
    const postUpload = document.getElementById('post-upload');
    const postModal = document.getElementById('post-modal');
    const closeModal = document.querySelector('.close-modal');
    const postPreviewImage = document.getElementById('post-preview-image');
    const postSubmitBtn = document.querySelector('.post-submit-btn');
    const postsGrid = document.getElementById('posts-grid');
    const postTextarea = document.querySelector('.post-form textarea');
    const postCount = document.querySelector('.stat-value');
    const usernameEl = document.querySelector('.username');
    const fullNameEl = document.querySelector('.full-name');

    let sidebarOpen = false;

    // Sidebar toggle
    if (menuToggle && sidebar && overlay && mainContent) {
        menuToggle.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            sidebarOpen = !sidebarOpen;

            sidebar.classList.toggle('active', sidebarOpen);
            overlay.classList.toggle('active', sidebarOpen);
            mainContent.classList.toggle('sidebar-active', sidebarOpen);
        });

        overlay.addEventListener('click', function () {
            sidebarOpen = false;
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
            mainContent.classList.remove('sidebar-active');
        });
    }

    // Nav highlight toggle
    document.querySelectorAll('.posts-nav').forEach(nav => {
        nav.addEventListener('click', function () {
            document.querySelectorAll('.posts-nav').forEach(item => item.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Add post flow
    if (addPostBtn && postUpload && postModal && postPreviewImage) {
        addPostBtn.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            postUpload.click();
        });

        postUpload.addEventListener('change', function (event) {
            const file = event.target.files?.[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    postPreviewImage.src = e.target.result;
                    postModal.classList.add('active');
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Close modal
    if (closeModal && postModal) {
        closeModal.addEventListener('click', () => postModal.classList.remove('active'));
        window.addEventListener('click', (e) => {
            if (e.target === postModal) postModal.classList.remove('active');
        });
    }

    // Submit post
    if (postSubmitBtn && postsGrid && postPreviewImage && postTextarea && postCount) {
        postSubmitBtn.addEventListener('click', function () {
            const caption = postTextarea.value.trim();
            if (!caption) {
                showNotification("Please enter a caption.");
                return;
            }

            const newPost = document.createElement('div');
            newPost.className = 'post-item';

            const postImg = document.createElement('img');
            postImg.src = postPreviewImage.src;
            postImg.alt = 'New Post';

            const overlayDiv = document.createElement('div');
            overlayDiv.className = 'post-overlay';

            const stats = document.createElement('div');
            stats.className = 'post-stats';
            stats.innerHTML = `
                <span><i class="fas fa-heart"></i> 0</span>
                <span><i class="fas fa-comment"></i> 0</span>
            `;

            overlayDiv.appendChild(stats);
            newPost.appendChild(postImg);
            newPost.appendChild(overlayDiv);
            postsGrid.insertBefore(newPost, postsGrid.firstChild);

            // Update count & reset
            postCount.textContent = parseInt(postCount.textContent || '0') + 1;
            postModal.classList.remove('active');
            postTextarea.value = '';
            postUpload.value = '';

            showNotification('Post added successfully!');
        });
    }

    // Show notification
    function showNotification(message) {
        if (!notification) return;
        notification.textContent = message;
        notification.classList.add('show');
        setTimeout(() => notification.classList.remove('show'), 3000);
    }

    // Simulate profile loading
    setTimeout(() => {
        if (usernameEl) usernameEl.textContent = '@professional_user';
        if (fullNameEl) fullNameEl.textContent = 'Professional User';
    }, 500);
});
