javascript
// ==========================================
// MOCK DATA FOR DEVELOPMENT
// ==========================================

const mockData = {
    // Events
    events: [
        {
            id: 1,
            title: 'Tech Fest 2025',
            description: 'Annual technology festival featuring hackathons, workshops, and tech talks',
            date: '2025-11-15',
            time: '9:00 AM - 6:00 PM',
            location: 'Main Auditorium',
            category: 'Technology',
            organizer: 'Tech Club',
            attendees: 250,
            image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400'
        },
        {
            id: 2,
            title: 'Cultural Night',
            description: 'Celebrate diversity with music, dance, and cultural performances',
            date: '2025-11-20',
            time: '6:00 PM - 10:00 PM',
            location: 'Open Air Theatre',
            category: 'Cultural',
            organizer: 'Cultural Committee',
            attendees: 500,
            image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400'
        },
        {
            id: 3,
            title: 'Career Fair 2025',
            description: 'Meet top recruiters and explore career opportunities',
            date: '2025-11-25',
            time: '10:00 AM - 5:00 PM',
            location: 'Convention Center',
            category: 'Career',
            organizer: 'Placement Cell',
            attendees: 1000,
            image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=400'
        },
        {
            id: 4,
            title: 'Sports Day',
            description: 'Inter-department sports competition',
            date: '2025-11-28',
            time: '8:00 AM - 4:00 PM',
            location: 'Sports Complex',
            category: 'Sports',
            organizer: 'Sports Committee',
            attendees: 800,
            image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400'
        },
        {
            id: 5,
            title: 'Workshop: AI & ML',
            description: 'Hands-on workshop on Artificial Intelligence and Machine Learning',
            date: '2025-12-02',
            time: '2:00 PM - 5:00 PM',
            location: 'Computer Lab A',
            category: 'Workshop',
            organizer: 'CSE Department',
            attendees: 100,
            image: 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=400'
        }
    ],

    // Lost & Found Items
    lostItems: [
        {
            id: 1,
            title: 'Black Backpack',
            description: 'Black Nike backpack with laptop inside',
            category: 'Bags',
            location: 'Library - 2nd Floor',
            date: 'Oct 20, 2025',
            status: 'lost',
            reportedBy: 'John Doe',
            contactEmail: 'john@klh.edu',
            image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300'
        },
        {
            id: 2,
            title: 'iPhone 13 Pro',
            description: 'Space gray iPhone 13 Pro with blue case',
            category: 'Electronics',
            location: 'Cafeteria',
            date: 'Oct 21, 2025',
            status: 'found',
            reportedBy: 'Sarah Smith',
            contactEmail: 'sarah@klh.edu',
            image: 'https://images.unsplash.com/photo-1592286927505-b0c2e5d60a3b?w=300'
        },
        {
            id: 3,
            title: 'Blue Water Bottle',
            description: 'Stainless steel blue water bottle with stickers',
            category: 'Personal Items',
            location: 'Gym',
            date: 'Oct 22, 2025',
            status: 'lost',
            reportedBy: 'Mike Johnson',
            contactEmail: 'mike@klh.edu',
            image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=300'
        },
        {
            id: 4,
            title: 'Textbook - Data Structures',
            description: 'Data Structures and Algorithms textbook by Cormen',
            category: 'Books',
            location: 'Classroom B-203',
            date: 'Oct 23, 2025',
            status: 'found',
            reportedBy: 'Emily Davis',
            contactEmail: 'emily@klh.edu',
            image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300'
        },
        {
            id: 5,
            title: 'Wireless Earbuds',
            description: 'White AirPods Pro with charging case',
            category: 'Electronics',
            location: 'Parking Lot',
            date: 'Oct 24, 2025',
            status: 'lost',
            reportedBy: 'David Wilson',
            contactEmail: 'david@klh.edu',
            image: 'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=300'
        }
    ],

    // Clubs
    clubs: [
        {
            id: 1,
            name: 'Coding Club',
            icon: '💻',
            description: 'Learn programming, participate in hackathons, and build projects',
            members: 250,
            president: 'Alex Kumar',
            email: 'coding@klh.edu',
            category: 'Technical',
            meetingDay: 'Every Saturday',
            meetingTime: '4:00 PM'
        },
        {
            id: 2,
            name: 'Dance Club',
            icon: '💃',
            description: 'Express yourself through various dance forms',
            members: 180,
            president: 'Priya Sharma',
            email: 'dance@klh.edu',
            category: 'Cultural',
            meetingDay: 'Monday & Thursday',
            meetingTime: '5:00 PM'
        },
        {
            id: 3,
            name: 'Photography Club',
            icon: '📷',
            description: 'Capture moments and learn photography techniques',
            members: 120,
            president: 'Rahul Verma',
            email: 'photo@klh.edu',
            category: 'Arts',
            meetingDay: 'Every Sunday',
            meetingTime: '10:00 AM'
        },
        {
            id: 4,
            name: 'Robotics Club',
            icon: '🤖',
            description: 'Build robots and compete in robotics competitions',
            members: 95,
            president: 'Anjali Reddy',
            email: 'robotics@klh.edu',
            category: 'Technical',
            meetingDay: 'Friday',
            meetingTime: '3:00 PM'
        },
        {
            id: 5,
            name: 'Music Club',
            icon: '🎵',
            description: 'Learn instruments, form bands, and perform',
            members: 150,
            president: 'Karthik Rao',
            email: 'music@klh.edu',
            category: 'Cultural',
            meetingDay: 'Wednesday',
            meetingTime: '6:00 PM'
        },
        {
            id: 6,
            name: 'Entrepreneurship Cell',
            icon: '💡',
            description: 'Start your startup journey and learn business skills',
            members: 200,
            president: 'Neha Gupta',
            email: 'ecell@klh.edu',
            category: 'Professional',
            meetingDay: 'Tuesday',
            meetingTime: '5:00 PM'
        }
    ],

    // Announcements
    announcements: [
        {
            id: 1,
            title: 'Mid-Semester Exams',
            message: 'Mid-semester examinations will be conducted from Nov 10-15, 2025',
            type: 'blue',
            icon: 'graduation-cap',
            time: '2 hours ago',
            priority: 'high',
            category: 'Academic'
        },
        {
            id: 2,
            title: 'Library Timings Extended',
            message: 'Library will remain open till 11 PM during exam week',
            type: 'green',
            icon: 'book',
            time: '5 hours ago',
            priority: 'medium',
            category: 'Facility'
        },
        {
            id: 3,
            title: 'Guest Lecture',
            message: 'Industry expert talk on Cloud Computing - Tomorrow at 2 PM',
            type: 'purple',
            icon: 'microphone',
            time: '1 day ago',
            priority: 'medium',
            category: 'Event'
        },
        {
            id: 4,
            title: 'Campus WiFi Maintenance',
            message: 'WiFi services will be temporarily unavailable on Oct 28 from 2-4 AM',
            type: 'orange',
            icon: 'wifi',
            time: '2 days ago',
            priority: 'high',
            category: 'Technical'
        },
        {
            id: 5,
            title: 'Food Festival',
            message: 'Annual food festival this weekend at the main ground',
            type: 'green',
            icon: 'utensils',
            time: '3 days ago',
            priority: 'low',
            category: 'Event'
        }
    ],

    // Notifications
    notifications: [
        {
            id: 1,
            title: 'Event Reminder',
            message: 'Tech Fest 2025 starts tomorrow at 9 AM',
            time: '10 minutes ago',
            read: false,
            type: 'event'
        },
        {
            id: 2,
            title: 'Lost Item Match',
            message: 'Someone found an item matching your report',
            time: '1 hour ago',
            read: false,
            type: 'lost-found'
        },
        {
            id: 3,
            title: 'Club Meeting',
            message: 'Coding Club meeting scheduled for Saturday',
            time: '3 hours ago',
            read: false,
            type: 'club'
        },
        {
            id: 4,
            title: 'Feedback Response',
            message: 'Your feedback has been reviewed by the admin',
            time: '5 hours ago',
            read: true,
            type: 'feedback'
        },
        {
            id: 5,
            title: 'New Resource',
            message: 'New study material uploaded for Data Structures',
            time: '1 day ago',
            read: true,
            type: 'resource'
        }
    ],

    // Resources
    resources: [
        {
            id: 1,
            title: 'Data Structures Notes',
            description: 'Complete notes for Data Structures and Algorithms course',
            type: 'PDF',
            size: '2.5 MB',
            uploadedBy: 'Dr. Sarah Smith',
            uploadDate: 'Oct 20, 2025',
            downloads: 150,
            category: 'Computer Science',
            semester: '3rd Semester',
            url: '#'
        },
        {
            id: 2,
            title: 'Python Tutorial Videos',
            description: 'Video series covering Python basics to advanced topics',
            type: 'Video',
            size: '500 MB',
            uploadedBy: 'Prof. John Doe',
            uploadDate: 'Oct 18, 2025',
            downloads: 280,
            category: 'Computer Science',
            semester: '2nd Semester',
            url: '#'
        },
        {
            id: 3,
            title: 'Database Management System',
            description: 'DBMS lecture slides and lab exercises',
            type: 'PPT',
            size: '5.2 MB',
            uploadedBy: 'Dr. Mike Johnson',
            uploadDate: 'Oct 15, 2025',
            downloads: 195,
            category: 'Computer Science',
            semester: '4th Semester',
            url: '#'
        },
        {
            id: 4,
            title: 'Previous Year Question Papers',
            description: 'Collection of previous year exam papers for all subjects',
            type: 'ZIP',
            size: '15 MB',
            uploadedBy: 'Admin',
            uploadDate: 'Oct 10, 2025',
            downloads: 520,
            category: 'General',
            semester: 'All Semesters',
            url: '#'
        }
    ],

    // Feedback/Grievances
    feedbacks: [
        {
            id: 1,
            title: 'Cafeteria Food Quality',
            message: 'The food quality in the cafeteria needs improvement',
            category: 'Facilities',
            priority: 'medium',
            status: 'in-progress',
            submittedBy: 'Student',
            submittedDate: 'Oct 20, 2025',
            response: 'Thank you for your feedback. We are working with the cafeteria management to improve food quality.',
            responseDate: 'Oct 21, 2025'
        },
        {
            id: 2,
            title: 'WiFi Connectivity Issues',
            message: 'Frequent disconnections in the library area',
            category: 'Technical',
            priority: 'high',
            status: 'resolved',
            submittedBy: 'Student',
            submittedDate: 'Oct 18, 2025',
            response: 'WiFi routers have been upgraded in the library area. Please check and let us know if the issue persists.',
            responseDate: 'Oct 22, 2025'
        },
        {
            id: 3,
            title: 'Parking Space',
            message: 'Insufficient parking space for students',
            category: 'Infrastructure',
            priority: 'medium',
            status: 'pending',
            submittedBy: 'Student',
            submittedDate: 'Oct 23, 2025',
            response: null,
            responseDate: null
        }
    ]
};

// Export for use in other files
window.mockData = mockData;
