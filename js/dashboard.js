javascript
// ==========================================
// DASHBOARD LOGIC
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    if (!auth.checkAuth()) {
        window.location.href = 'login.html';
        return;
    }
    
    const currentUser = auth.getCurrentUser();
    
    // Update user profile
    updateUserProfile(currentUser);
    
    // Load dashboard data
    loadDashboardData();
    
    // Initialize sidebar
    initSidebar();
    
    // Initialize notifications
    initNotifications();
    
    // Handle quick actions
    initQuickActions();
    
    // Logout button
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to logout?')) {
                auth.logout();
            }
        });
    }
});

// Update user profile
function updateUserProfile(user) {
    const userName = document.querySelector('.user-name');
    const userImage = document.querySelector('.user-profile img');
    
    if (userName) {
        userName.textContent = user.name;
    }
    
    if (userImage) {
        userImage.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=a855f7&color=fff`;
    }
    
    // Update top bar user info
    const userNameElement = document.getElementById('user-name');
    const userEmailElement = document.getElementById('user-email');
    
    if (userNameElement) {
        userNameElement.textContent = user.name || user.role.charAt(0).toUpperCase() + user.role.slice(1);
    }
    
    if (userEmailElement) {
        userEmailElement.textContent = user.email;
    }
    
    // Update welcome message
    const welcomeMessage = document.querySelector('.welcome-content h2');
    if (welcomeMessage) {
        const firstName = user.name.split(' ')[0];
        welcomeMessage.textContent = `Welcome Back, ${firstName}! 👋`;
    }
}

// Load dashboard data
async function loadDashboardData() {
    try {
        console.log('Loading dashboard data from backend...');
        
        // Load all dashboard components
        await Promise.all([
            loadUpcomingEvents(),
            loadRecentLostItems(),
            loadMyClubs(),
            loadLatestAnnouncements(),
            loadNotifications()
        ]);
        
    } catch (error) {
        console.error('Error loading dashboard data:', error);
        showNotification('Failed to load some data. Please refresh the page.', 'error');
    }
}

// Load upcoming events
async function loadUpcomingEvents() {
    const container = document.getElementById('upcoming-events');
    if (!container) return;
    
    try {
        const response = await fetch('/api/events', {
            credentials: 'include'
        });
        const data = await response.json();
        
        if (data.ok && data.events) {
            const upcomingEvents = data.events
                .filter(event => new Date(event.start_date) > new Date())
                .slice(0, 3);
            
            container.innerHTML = upcomingEvents.map(event => {
                const date = new Date(event.start_date);
                return `
                    <div class="event-item">
                        <div class="event-date">
                            <span class="event-day">${date.getDate()}</span>
                            <span class="event-month">${date.toLocaleString('default', { month: 'short' })}</span>
                        </div>
                        <div class="event-info">
                            <h4>${event.title}</h4>
                            <p><i class="fas fa-map-marker-alt"></i> ${event.location || 'TBA'}</p>
                        </div>
                    </div>
                `;
            }).join('');
        } else {
            container.innerHTML = '<p>No upcoming events</p>';
        }
    } catch (error) {
        console.error('Error loading events:', error);
        container.innerHTML = '<p>Error loading events</p>';
    }
}

// Load recent lost items
async function loadRecentLostItems() {
    const container = document.getElementById('recent-lost-items');
    if (!container) return;
    
    try {
        const response = await fetch('/api/lostfound/list', {
            credentials: 'include'
        });
        const data = await response.json();
        
        if (data.ok && data.items) {
            const recentItems = data.items.slice(0, 3);
            
            container.innerHTML = recentItems.map(item => `
                <div class="lost-item">
                    <div style="display: flex; justify-content: space-between; align-items: start;">
                        <div>
                            <h4>${item.item}</h4>
                            <p><i class="fas fa-map-marker-alt"></i> ${item.location}</p>
                            <p style="font-size: 0.75rem; color: var(--text-gray); margin-top: 0.5rem;">
                                ${new Date(item.created_at).toLocaleDateString()}
                            </p>
                        </div>
                        <span class="badge ${item.status === 'found' ? 'badge-success' : 'badge-warning'}">
                            ${item.status}
                        </span>
                    </div>
                </div>
            `).join('');
        } else {
            container.innerHTML = '<p>No recent lost items</p>';
        }
    } catch (error) {
        console.error('Error loading lost items:', error);
        container.innerHTML = '<p>Error loading lost items</p>';
    }
}

// Load my clubs
async function loadMyClubs() {
    const container = document.getElementById('my-clubs');
    if (!container) return;
    
    try {
        const response = await fetch('/api/clubs/user/my-clubs', {
            credentials: 'include'
        });
        const data = await response.json();
        
        if (data.ok && data.clubs) {
            const userClubs = data.clubs.slice(0, 3);
            
            container.innerHTML = userClubs.map(club => `
                <div class="club-item">
                    <div style="display: flex; align-items: center; gap: 1rem;">
                        <div style="width: 50px; height: 50px; background: var(--gradient-primary); border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; font-size: 1.5rem;">
                            👥
                        </div>
                        <div style="flex: 1;">
                            <h4>${club.name}</h4>
                            <p style="font-size: 0.875rem; color: var(--text-gray);">
                                ${club.member_count || 0} members
                            </p>
                        </div>
                    </div>
                </div>
            `).join('');
        } else {
            container.innerHTML = '<p>No clubs joined yet</p>';
        }
    } catch (error) {
        console.error('Error loading clubs:', error);
        container.innerHTML = '<p>Error loading clubs</p>';
    }
}

// Load latest announcements
async function loadLatestAnnouncements() {
    const container = document.getElementById('latest-announcements');
    if (!container) return;
    
    try {
        const response = await fetch('/api/announcements', {
            credentials: 'include'
        });
        const data = await response.json();
        
        if (data.ok && data.announcements) {
            const latestAnnouncements = data.announcements.slice(0, 3);
    
            container.innerHTML = latestAnnouncements.map(announcement => `
                <div class="announcement-item">
                    <div style="display: flex; gap: 0.75rem;">
                        <div style="width: 40px; height: 40px; background: var(--gradient-primary); border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                            <i class="fas fa-bullhorn"></i>
                        </div>
                        <div style="flex: 1;">
                            <h4 style="margin-bottom: 0.25rem;">${announcement.title}</h4>
                            <p style="font-size: 0.875rem; color: var(--text-gray); margin-bottom: 0.5rem;">
                                ${announcement.content.substring(0, 100)}${announcement.content.length > 100 ? '...' : ''}
                            </p>
                            <p style="font-size: 0.75rem; color: var(--text-gray);">
                                <i class="fas fa-clock"></i> ${new Date(announcement.created_at).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                </div>
            `).join('');
        } else {
            container.innerHTML = '<p>No announcements</p>';
        }
    } catch (error) {
        console.error('Error loading announcements:', error);
        container.innerHTML = '<p>Error loading announcements</p>';
    }
}

// Load notifications
async function loadNotifications() {
    try {
        const response = await fetch('/api/notifications', {
            credentials: 'include'
        });
        const data = await response.json();
        
        if (data.ok && data.notifications) {
            const unreadCount = data.notifications.filter(n => !n.is_read).length;
            
            // Update notification badge if it exists
            const notificationBadge = document.querySelector('.notification-badge');
            if (notificationBadge) {
                notificationBadge.textContent = unreadCount;
                notificationBadge.style.display = unreadCount > 0 ? 'block' : 'none';
            }
        }
    } catch (error) {
        console.error('Error loading notifications:', error);
    }
}

// Initialize sidebar
function initSidebar() {
    const sidebar = document.getElementById('sidebar');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const navItems = document.querySelectorAll('.nav-item');
    
    // Mobile menu toggle
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
    }
    
    // Sidebar close button (mobile)
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.remove('active');
        });
    }
    
    // Navigation items
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const page = item.dataset.page;
            
            // Update active state
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
            
            // Load page content
            loadPage(page);
            
            // Close mobile menu
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('active');
            }
        });
    });
}

// Load page content
function loadPage(page) {
    const pageTitle = document.querySelector('.page-title');
    const contentPages = document.querySelectorAll('.content-page');
    
    // Hide all pages
    contentPages.forEach(p => p.classList.remove('active'));
    
    // Show requested page or overview
    const targetPage = document.getElementById(`${page}-page`) || document.getElementById('overview-page');
    if (targetPage) {
        targetPage.classList.add('active');
    }
    
    // Update page title
    if (pageTitle) {
        const pageTitles = {
            'overview': 'Dashboard',
            'lost-found': 'Lost & Found',
            'events': 'Events',
            'clubs': 'Clubs',
            'resources': 'Resources',
            'feedback': 'Feedback',
            'announcements': 'Announcements',
            'profile': 'Profile'
        };
        pageTitle.textContent = pageTitles[page] || 'Dashboard';
    }
}

// Initialize notifications
function initNotifications() {
    const notificationIcon = document.getElementById('notification-icon');
    const notificationPanel = document.getElementById('notification-panel');
    const closePanel = notificationPanel?.querySelector('.close-panel');
    
    if (notificationIcon) {
        notificationIcon.addEventListener('click', () => {
            notificationPanel.classList.toggle('active');
            loadNotifications();
        });
    }
    
    if (closePanel) {
        closePanel.addEventListener('click', () => {
            notificationPanel.classList.remove('active');
        });
    }
    
    // Close panel when clicking outside
    document.addEventListener('click', (e) => {
        if (!notificationIcon?.contains(e.target) && !notificationPanel?.contains(e.target)) {
            notificationPanel?.classList.remove('active');
        }
    });
}

// Load notifications
function loadNotifications() {
    const container = document.getElementById('notification-list');
    if (!container) return;
    
    const notifications = mockData.notifications;
    
    container.innerHTML = notifications.map(notification => `
        <div class="notification-item ${notification.read ? '' : 'unread'}">
            <p class="notification-time">${notification.time}</p>
            <h4 style="margin-bottom: 0.5rem;">${notification.title}</h4>
            <p style="font-size: 0.875rem; color: var(--text-gray);">
                ${notification.message}
            </p>
        </div>
    `).join('');
}

// Initialize quick actions
function initQuickActions() {
    const actionCards = document.querySelectorAll('.action-card');
    
    actionCards.forEach(card => {
        card.addEventListener('click', () => {
            const action = card.dataset.action;
            handleQuickAction(action);
        });
    });
}

// Handle quick actions
function handleQuickAction(action) {
    const actions = {
        'report-lost': () => {
            auth.showNotification('Opening Lost & Found form...', 'info');
            setTimeout(() => loadPage('lost-found'), 500);
        },
        'view-events': () => {
            auth.showNotification('Loading events...', 'info');
            setTimeout(() => loadPage('events'), 500);
        },
        'join-club': () => {
            auth.showNotification('Loading clubs...', 'info');
            setTimeout(() => loadPage('clubs'), 500);
        },
        'submit-feedback': () => {
            auth.showNotification('Opening feedback form...', 'info');
            setTimeout(() => loadPage('feedback'), 500);
        }
    };
    
    if (actions[action]) {
        actions[action]();
    }
}

// Add badge styles
const style = document.createElement('style');
style.textContent = `
    .badge-success {
        background: #10b981;
        color: white;
        padding: 0.25rem 0.75rem;
        border-radius: 12px;
        font-size: 0.75rem;
        font-weight: 600;
        text-transform: uppercase;
    }
    
    .badge-warning {
        background: #f59e0b;
        color: white;
        padding: 0.25rem 0.75rem;
        border-radius: 12px;
        font-size: 0.75rem;
        font-weight: 600;
        text-transform: uppercase;
    }
    
    @media (max-width: 768px) {
        .sidebar {
            transform: translateX(-100%);
        }
        
        .sidebar.active {
            transform: translateX(0);
        }
        
        .main-content {
            margin-left: 0;
        }
        
        .mobile-menu-btn {
            display: block;
        }
        
        .sidebar-toggle {
            display: block;
        }
        
        .search-box {
            display: none;
        }
        
        .user-name {
            display: none;
        }
        
        .dashboard-grid {
            grid-template-columns: 1fr;
        }
        
        .welcome-section {
            flex-direction: column;
            gap: 1.5rem;
        }
        
        .welcome-stats {
            width: 100%;
            justify-content: space-around;
        }
    }
`;
document.head.appendChild(style);
