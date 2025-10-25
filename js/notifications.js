javascript
// ==========================================
// REAL-TIME NOTIFICATIONS SYSTEM
// ==========================================

class NotificationSystem {
    constructor() {
        this.notifications = [];
        this.unreadCount = 0;
        this.init();
    }

    init() {
        // Load notifications from mockData
        this.notifications = mockData.notifications || [];
        this.updateUnreadCount();
        
        // Simulate real-time notifications every 30 seconds
        this.startRealTimeSimulation();
    }

    startRealTimeSimulation() {
        setInterval(() => {
            if (Math.random() > 0.7) { // 30% chance every 30 seconds
                this.generateRandomNotification();
            }
        }, 30000);
    }

    generateRandomNotification() {
        const types = ['event', 'lost-found', 'club', 'announcement'];
        const messages = {
            'event': [
                'New event posted: Workshop on Web Development',
                'Event reminder: Tech Talk starts in 1 hour',
                'Event cancelled: Sports Day postponed'
            ],
            'lost-found': [
                'Someone found an item matching your description',
                'New lost item reported in your area',
                'Your lost item has been claimed'
            ],
            'club': [
                'Coding Club meeting rescheduled',
                'New club activity: Photography Contest',
                'Club registration open for Music Club'
            ],
            'announcement': [
                'Important: Mid-term exam schedule updated',
                'Campus WiFi will be down for maintenance',
                'New library resources available'
            ]
        };

        const type = types[Math.floor(Math.random() * types.length)];
        const messageArray = messages[type];
        const message = messageArray[Math.floor(Math.random() * messageArray.length)];

        const notification = {
            id: Date.now(),
            title: type.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
            message: message,
            time: 'Just now',
            read: false,
            type: type
        };

        this.addNotification(notification);
    }

    addNotification(notification) {
        this.notifications.unshift(notification);
        this.unreadCount++;
        this.updateUI();
        this.showToast(notification);
    }

    markAsRead(notificationId) {
        const notification = this.notifications.find(n => n.id === notificationId);
        if (notification && !notification.read) {
            notification.read = true;
            this.unreadCount--;
            this.updateUI();
        }
    }

    markAllAsRead() {
        this.notifications.forEach(n => n.read = true);
        this.unreadCount = 0;
        this.updateUI();
    }

    updateUnreadCount() {
        this.unreadCount = this.notifications.filter(n => !n.read).length;
    }

    updateUI() {
        // Update notification count badge
        const countBadge = document.querySelector('.notification-count');
        if (countBadge) {
            countBadge.textContent = this.unreadCount;
            countBadge.style.display = this.unreadCount > 0 ? 'flex' : 'none';
        }

        // Update notification list if panel is open
        const panel = document.getElementById('notification-panel');
        if (panel && panel.classList.contains('active')) {
            this.renderNotifications();
        }
    }

    renderNotifications() {
        const container = document.getElementById('notification-list');
        if (!container) return;

        container.innerHTML = this.notifications.map(notification => `
            <div class="notification-item ${notification.read ? '' : 'unread'}" data-id="${notification.id}">
                <p class="notification-time">${notification.time}</p>
                <h4 style="margin-bottom: 0.5rem;">${notification.title}</h4>
                <p style="font-size: 0.875rem; color: var(--text-gray);">
                    ${notification.message}
                </p>
            </div>
        `).join('');

        // Add click listeners
        container.querySelectorAll('.notification-item').forEach(item => {
            item.addEventListener('click', () => {
                const id = parseInt(item.dataset.id);
                this.markAsRead(id);
                item.classList.remove('unread');
            });
        });
    }

    showToast(notification) {
        const toast = document.createElement('div');
        toast.className = 'notification-toast';
        toast.innerHTML = `
            <div class="toast-icon">
                <i class="fas fa-bell"></i>
            </div>
            <div class="toast-content">
                <h4>${notification.title}</h4>
                <p>${notification.message}</p>
            </div>
            <button class="toast-close">
                <i class="fas fa-times"></i>
            </button>
        `;

        document.body.appendChild(toast);

        // Animate in
        setTimeout(() => toast.classList.add('show'), 100);

        // Close button
        toast.querySelector('.toast-close').addEventListener('click', () => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        });

        // Auto remove after 5 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 5000);
    }
}

// Initialize notification system
let notificationSystem;
document.addEventListener('DOMContentLoaded', () => {
    if (auth.checkAuth()) {
        notificationSystem = new NotificationSystem();
    }
});

// Add toast styles
const toastStyles = document.createElement('style');
toastStyles.textContent = `
    .notification-toast {
        position: fixed;
        top: 100px;
        right: -400px;
        width: 350px;
        background: rgba(30, 41, 59, 0.98);
        backdrop-filter: blur(16px);
        border: 1px solid rgba(148, 163, 184, 0.2);
        border-radius: var(--radius-lg);
        padding: 1rem;
        display: flex;
        gap: 1rem;
        box-shadow: var(--shadow-lg);
        z-index: 10000;
        transition: right 0.3s ease;
    }

    .notification-toast.show {
        right: 20px;
    }

    .toast-icon {
        width: 40px;
        height: 40px;
        background: var(--gradient-primary);
        border-radius: var(--radius-md);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
    }

    .toast-content {
        flex: 1;
    }

    .toast-content h4 {
        font-size: 0.95rem;
        font-weight: 600;
        margin-bottom: 0.25rem;
    }

    .toast-content p {
        font-size: 0.85rem;
        color: var(--text-gray);
        line-height: 1.4;
    }

    .toast-close {
        color: var(--text-gray);
        transition: color 0.3s ease;
    }

    .toast-close:hover {
        color: var(--text-white);
    }

    @media (max-width: 768px) {
        .notification-toast {
            width: calc(100% - 40px);
            right: -100%;
        }

        .notification-toast.show {
            right: 20px;
        }
    }
`;
document.head.appendChild(toastStyles);
