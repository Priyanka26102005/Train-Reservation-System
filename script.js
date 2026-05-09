// Initialize data storage
let users = JSON.parse(localStorage.getItem('trainGO_users')) || [];
let trains = [];
let tickets = JSON.parse(localStorage.getItem('trainGO_tickets')) || [];
let reviews = JSON.parse(localStorage.getItem('trainGO_reviews')) || [];
let currentUser = JSON.parse(localStorage.getItem('trainGO_currentUser')) || null;
let selectedSeats = [];
let currentBookingData = null;

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    // Indian Railway trains data
    localStorage.removeItem('trainGO_trains');
    trains = [
        {id: "12001", name: "Shatabdi Express", route: "New Delhi to Chandigarh", from: "New Delhi", to: "Chandigarh", startTime: "07:20", arrivalTime: "10:50", duration: "3h 30m", seats: 200, price: 1850, date: "Feb 14 SUN"},
        {id: "12002", name: "Rajdhani Express", route: "New Delhi to Mumbai", from: "New Delhi", to: "Mumbai", startTime: "16:55", arrivalTime: "08:35", duration: "15h 40m", seats: 180, price: 3200, date: "Feb 14 SUN"},
        {id: "12259", name: "Duronto Express", route: "New Delhi to Katra", from: "New Delhi", to: "Katra", startTime: "19:55", arrivalTime: "05:45", duration: "9h 50m", seats: 220, price: 2100, date: "Feb 14 SUN"},
        {id: "12423", name: "Dibrugarh Rajdhani", route: "New Delhi to Guwahati", from: "New Delhi", to: "Guwahati", startTime: "13:05", arrivalTime: "18:00", duration: "28h 55m", seats: 160, price: 4500, date: "Feb 14 SUN"},
        {id: "12951", name: "Mumbai Rajdhani", route: "Mumbai to New Delhi", from: "Mumbai", to: "New Delhi", startTime: "17:00", arrivalTime: "09:10", duration: "16h 10m", seats: 190, price: 3100, date: "Feb 14 SUN"},
        {id: "12301", name: "Howrah Rajdhani", route: "New Delhi to Kolkata", from: "New Delhi", to: "Kolkata", startTime: "17:00", arrivalTime: "10:10", duration: "17h 10m", seats: 170, price: 2900, date: "Feb 14 SUN"},
        {id: "12626", name: "Kerala Express", route: "New Delhi to Thiruvananthapuram", from: "New Delhi", to: "Thiruvananthapuram", startTime: "11:00", arrivalTime: "11:30", duration: "48h 30m", seats: 240, price: 3800, date: "Feb 15 MON"},
        {id: "12723", name: "Telangana Express", route: "New Delhi to Hyderabad", from: "New Delhi", to: "Hyderabad", startTime: "21:15", arrivalTime: "20:50", duration: "23h 35m", seats: 210, price: 2700, date: "Feb 14 SUN"},
        {id: "12615", name: "Grand Trunk Express", route: "New Delhi to Chennai", from: "New Delhi", to: "Chennai", startTime: "19:30", arrivalTime: "22:45", duration: "27h 15m", seats: 250, price: 3400, date: "Feb 15 MON"},
        {id: "12780", name: "Goa Express", route: "New Delhi to Goa", from: "New Delhi", to: "Goa", startTime: "15:00", arrivalTime: "14:40", duration: "23h 40m", seats: 200, price: 2800, date: "Feb 15 MON"},
        {id: "22691", name: "Rajdhani Express", route: "New Delhi to Bangalore", from: "New Delhi", to: "Bangalore", startTime: "20:30", arrivalTime: "06:00", duration: "33h 30m", seats: 180, price: 4200, date: "Feb 15 MON"},
        {id: "12009", name: "Shatabdi Express", route: "New Delhi to Lucknow", from: "New Delhi", to: "Lucknow", startTime: "06:10", arrivalTime: "12:35", duration: "6h 25m", seats: 200, price: 1650, date: "Feb 14 SUN"},
        {id: "12003", name: "Pune Shatabdi", route: "Mumbai to Pune", from: "Mumbai", to: "Pune", startTime: "17:35", arrivalTime: "20:25", duration: "2h 50m", seats: 150, price: 1200, date: "Feb 14 SUN"},
        {id: "12004", name: "Pune Shatabdi", route: "Pune to Mumbai", from: "Pune", to: "Mumbai", startTime: "05:40", arrivalTime: "08:25", duration: "2h 45m", seats: 150, price: 1200, date: "Feb 14 SUN"},
        {id: "12005", name: "Kalka Shatabdi", route: "Chandigarh to Kalka", from: "Chandigarh", to: "Kalka", startTime: "17:30", arrivalTime: "18:15", duration: "45m", seats: 100, price: 450, date: "Feb 14 SUN"},
        {id: "12006", name: "Kalka Shatabdi", route: "Kalka to Chandigarh", from: "Kalka", to: "Chandigarh", startTime: "19:00", arrivalTime: "19:45", duration: "45m", seats: 100, price: 450, date: "Feb 14 SUN"},
        {id: "12007", name: "Chennai Express", route: "Mumbai to Chennai", from: "Mumbai", to: "Chennai", startTime: "21:05", arrivalTime: "11:45", duration: "14h 40m", seats: 220, price: 2400, date: "Feb 14 SUN"},
        {id: "12008", name: "Chennai Express", route: "Chennai to Mumbai", from: "Chennai", to: "Mumbai", startTime: "23:15", arrivalTime: "14:00", duration: "14h 45m", seats: 220, price: 2400, date: "Feb 15 MON"},
        {id: "12010", name: "Ahmedabad Shatabdi", route: "Mumbai to Ahmedabad", from: "Mumbai", to: "Ahmedabad", startTime: "06:25", arrivalTime: "13:20", duration: "6h 55m", seats: 180, price: 1800, date: "Feb 14 SUN"},
        {id: "12011", name: "Ahmedabad Shatabdi", route: "Ahmedabad to Mumbai", from: "Ahmedabad", to: "Mumbai", startTime: "14:30", arrivalTime: "21:35", duration: "7h 05m", seats: 180, price: 1800, date: "Feb 14 SUN"},
        {id: "12012", name: "Jaipur Express", route: "New Delhi to Jaipur", from: "New Delhi", to: "Jaipur", startTime: "19:50", arrivalTime: "23:55", duration: "4h 05m", seats: 200, price: 950, date: "Feb 14 SUN"},
        {id: "12013", name: "Jaipur Express", route: "Jaipur to New Delhi", from: "Jaipur", to: "New Delhi", startTime: "05:55", arrivalTime: "10:30", duration: "4h 35m", seats: 200, price: 950, date: "Feb 14 SUN"},
        {id: "12014", name: "Bhopal Express", route: "New Delhi to Bhopal", from: "New Delhi", to: "Bhopal", startTime: "07:40", arrivalTime: "19:05", duration: "11h 25m", seats: 180, price: 1950, date: "Feb 14 SUN"},
        {id: "12015", name: "Bhopal Express", route: "Bhopal to New Delhi", from: "Bhopal", to: "New Delhi", startTime: "20:15", arrivalTime: "07:50", duration: "11h 35m", seats: 180, price: 1950, date: "Feb 15 MON"},
        {id: "12016", name: "Intercity Express", route: "Mumbai to Kolkata", from: "Mumbai", to: "Kolkata", startTime: "08:30", arrivalTime: "06:45", duration: "22h 15m", seats: 200, price: 2800, date: "Feb 14 SUN"},
        {id: "12017", name: "Superfast Express", route: "Chennai to Mumbai", from: "Chennai", to: "Mumbai", startTime: "14:20", arrivalTime: "04:30", duration: "14h 10m", seats: 180, price: 2400, date: "Feb 14 SUN"},
        {id: "12018", name: "Rajdhani Express", route: "Kolkata to Chennai", from: "Kolkata", to: "Chennai", startTime: "12:45", arrivalTime: "18:20", duration: "29h 35m", seats: 160, price: 3600, date: "Feb 15 MON"},
        {id: "12019", name: "Express Train", route: "Hyderabad to Kolkata", from: "Hyderabad", to: "Kolkata", startTime: "16:10", arrivalTime: "22:40", duration: "30h 30m", seats: 190, price: 3200, date: "Feb 15 MON"},
        {id: "12020", name: "Mail Express", route: "Bangalore to New Delhi", from: "Bangalore", to: "New Delhi", startTime: "09:15", arrivalTime: "11:50", duration: "26h 35m", seats: 170, price: 3800, date: "Feb 15 MON"},
        {id: "12021", name: "Shatabdi Express", route: "Pune to Chennai", from: "Pune", to: "Chennai", startTime: "06:40", arrivalTime: "18:15", duration: "11h 35m", seats: 150, price: 2200, date: "Feb 14 SUN"},
        {id: "12022", name: "Duronto Express", route: "Jaipur to Mumbai", from: "Jaipur", to: "Mumbai", startTime: "22:30", arrivalTime: "14:45", duration: "16h 15m", seats: 200, price: 2600, date: "Feb 15 MON"},
        {id: "12023", name: "Garib Rath", route: "Ahmedabad to Kolkata", from: "Ahmedabad", to: "Kolkata", startTime: "18:20", arrivalTime: "08:30", duration: "38h 10m", seats: 220, price: 2900, date: "Feb 16 TUE"},
        {id: "12024", name: "Jan Shatabdi", route: "Lucknow to Chennai", from: "Lucknow", to: "Chennai", startTime: "05:30", arrivalTime: "09:45", duration: "28h 15m", seats: 180, price: 3400, date: "Feb 15 MON"}
    ];
    localStorage.setItem('trainGO_trains', JSON.stringify(trains));
    
    loadTrainCards();
    setupForms();
    checkUserSession();
    setMinDate();
    setSearchMinDate();
    initializeHeroForm();
});

// Navigation functions
function showPage(pageId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Show selected page
    const targetPage = document.getElementById(pageId + 'Page');
    if (targetPage) {
        targetPage.classList.add('active');
    }
    
    // Update nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // Find and activate the correct nav link
    const activeLink = document.querySelector(`[onclick="showPage('${pageId}')"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
    
    // Load page-specific data
    if (pageId === 'blog') {
        loadBlogPosts();
    } else if (pageId === 'gallery') {
        loadGalleryImages();
    } else if (pageId === 'about') {
        loadAboutPage();
    } else if (pageId === 'reviews') {
        populateTrainSelects();
        loadReviews();
    } else if (pageId === 'mytickets') {
        loadMyTickets();
    } else if (pageId === 'searchcancel') {
        // Search/Cancel page loaded
    } else if (pageId === 'weather') {
        setTimeout(() => loadWeatherData(), 100);
    } else if (pageId === 'findtrains') {
        loadTrainTable();
        setSearchMinDate();
    } else if (pageId === 'dashboard') {
        setTimeout(() => loadDashboard(), 100);
    } else if (pageId === 'profile') {
        loadProfile();
    } else if (pageId === 'mybookings') {
        loadMyBookings();
    } else if (pageId === 'stationservices') {
        loadStationServices();
    } else if (pageId === 'foodordering') {
        loadFoodOrdering();
    }
}

// Load blog posts
function loadBlogPosts() {
    const blogPosts = document.querySelector('.blog-posts');
    if (!blogPosts) return;
    
    const posts = [
        {
            id: 1,
            title: "Indian Railways: Journey Through Heritage",
            content: "Discover the rich history and modern developments of Indian Railways, connecting the nation from Kashmir to Kanyakumari.",
            fullContent: "Indian Railways stands as one of the world's largest railway networks, spanning over 67,000 kilometers across the diverse landscape of India. From the snow-capped peaks of Kashmir to the southern tip of Kanyakumari, this magnificent network has been the backbone of India's transportation system for over 160 years. The journey began in 1853 with the first passenger train from Mumbai to Thane, covering just 34 kilometers. Today, Indian Railways carries over 8 billion passengers annually, making it not just a mode of transport but a lifeline that connects millions of dreams, aspirations, and destinations. The heritage of Indian Railways is reflected in its iconic stations like Victoria Terminus (now Chhatrapati Shivaji Maharaj Terminus) in Mumbai, Howrah Junction in Kolkata, and New Delhi Railway Station. These architectural marvels tell stories of colonial legacy while embracing modern amenities. The network has evolved from steam engines to electric trains, from manual signaling to computerized reservation systems, showcasing India's technological advancement while preserving its rich railway heritage.",
            date: "December 15, 2024",
            image: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=800&h=400&fit=crop"
        },
        {
            id: 2,
            title: "High-Speed Rail Revolution in India",
            content: "Exploring the future of transportation with bullet trains and modern railway infrastructure across India.",
            fullContent: "India is on the brink of a high-speed rail revolution that promises to transform the way people travel across the country. The Mumbai-Ahmedabad High-Speed Rail project, India's first bullet train corridor, represents a significant leap towards modernizing the nation's transportation infrastructure. This 508-kilometer corridor will reduce travel time from 7 hours to just 2 hours and 58 minutes, operating at speeds of up to 320 km/h. The project, developed with Japanese Shinkansen technology, incorporates advanced safety features, earthquake resistance, and environmental sustainability. Beyond this flagship project, India has ambitious plans for multiple high-speed corridors connecting major cities like Delhi-Mumbai, Delhi-Kolkata, and Chennai-Bangalore. These projects will not only revolutionize passenger travel but also boost economic development along the corridors, create employment opportunities, and position India as a leader in high-speed rail technology in South Asia. The integration of artificial intelligence, IoT sensors, and predictive maintenance systems will ensure these trains operate with maximum efficiency and safety.",
            date: "December 10, 2024",
            image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&h=400&fit=crop"
        },
        {
            id: 3,
            title: "Sustainable Travel with Indian Railways",
            content: "How train travel contributes to eco-friendly transportation and reduces carbon footprint.",
            fullContent: "Indian Railways has emerged as a champion of sustainable transportation, significantly contributing to India's environmental goals and carbon footprint reduction. As one of the world's largest green transportation networks, railways consume 3-5 times less energy per passenger-kilometer compared to road transport and 2-3 times less than air travel. The massive electrification drive has converted over 80% of the broad gauge network to electric traction, reducing dependence on fossil fuels and cutting carbon emissions by millions of tons annually. Solar power initiatives across railway stations and installations have made Indian Railways one of the largest solar power consumers in the country. The introduction of energy-efficient LED lighting, regenerative braking systems in trains, and bio-toilets has further enhanced the environmental benefits. Water conservation through rainwater harvesting, waste management through segregation and recycling, and the use of eco-friendly materials in construction demonstrate the railways' commitment to sustainability. The shift towards electric and hybrid locomotives, coupled with plans for hydrogen-powered trains, positions Indian Railways as a model for sustainable mass transportation globally.",
            date: "December 5, 2024",
            image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=400&fit=crop"
        },
        {
            id: 4,
            title: "Digital Transformation of Railway Booking",
            content: "Revolutionary changes in train ticket booking through mobile apps, AI, and digital payment systems.",
            fullContent: "The digital transformation of Indian Railways has revolutionized how millions of passengers book their train tickets, making travel planning more convenient and accessible than ever before. The IRCTC (Indian Railway Catering and Tourism Corporation) mobile app and website have become the backbone of this digital revolution, processing over 1 million transactions daily. The integration of artificial intelligence and machine learning has enhanced user experience through personalized recommendations, dynamic pricing, and predictive analytics for seat availability. Features like Tatkal booking, waitlist prediction, and automatic ticket cancellation have streamlined the booking process. The introduction of UPI payments, digital wallets, and contactless transactions has made payments seamless and secure. Real-time train tracking, PNR status updates, and SMS notifications keep passengers informed throughout their journey. The recent addition of features like train coach composition, platform information, and food ordering through the app has created a comprehensive travel ecosystem. Future developments include voice-based booking, augmented reality for station navigation, and blockchain technology for secure transactions, promising an even more sophisticated digital railway experience.",
            date: "December 1, 2024",
            image: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=800&h=400&fit=crop"
        },
        {
            id: 5,
            title: "Safety Innovations in Modern Trains",
            content: "Advanced safety technologies and systems ensuring passenger security in Indian Railways.",
            fullContent: "Safety remains the paramount concern for Indian Railways, leading to the implementation of cutting-edge technologies and innovative systems to ensure passenger security and operational excellence. The introduction of Train Collision Avoidance System (TCAS) and Automatic Train Protection (ATP) systems has significantly reduced the risk of accidents by providing real-time monitoring and automatic braking capabilities. Modern trains are equipped with GPS-based tracking systems, CCTV surveillance, and emergency communication devices that enable immediate response to any safety concerns. The implementation of Radio Frequency Identification (RFID) tags for tracking rolling stock and the use of drones for track inspection have enhanced preventive maintenance capabilities. Fire detection and suppression systems, improved bogey designs for better stability, and enhanced lighting systems contribute to passenger safety. The introduction of women-only coaches, help desks, and 24/7 security personnel ensures personal safety. Regular safety audits, staff training programs, and passenger awareness campaigns have created a comprehensive safety ecosystem. Future innovations include AI-powered predictive maintenance, biometric access controls, and smart sensors for real-time health monitoring of critical train components.",
            date: "November 28, 2024",
            image: "https://images.unsplash.com/photo-1517263904808-5dc91e3e7044?w=800&h=400&fit=crop"
        },
        {
            id: 6,
            title: "Regional Connectivity and Rural Development",
            content: "How railway expansion is connecting remote areas and boosting rural economic development.",
            fullContent: "Indian Railways plays a crucial role in connecting remote and rural areas, serving as a catalyst for economic development and social integration across the country. The ambitious railway expansion projects have brought connectivity to previously isolated regions, opening up new opportunities for trade, tourism, and employment. The construction of new railway lines in northeastern states, tribal areas, and border regions has not only improved accessibility but also strengthened national security and cultural integration. These connectivity projects have transformed local economies by providing farmers direct access to markets, reducing transportation costs, and enabling the movement of goods and services. The establishment of railway stations in small towns has led to the development of commercial hubs, educational institutions, and healthcare facilities. Special trains like the Humsafar Express, Antyodaya Express, and Jan Shatabdi have been designed to cater to different economic segments, ensuring affordable and comfortable travel for all. The railway network has also facilitated the growth of tourism in remote destinations, preserving local culture while providing economic opportunities. Future plans include the development of high-speed regional connectivity and the integration of railways with other modes of transport to create seamless multimodal transportation networks.",
            date: "November 25, 2024",
            image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=400&fit=crop"
        }
    ];
    
    blogPosts.innerHTML = '';
    posts.forEach(post => {
        blogPosts.innerHTML += `
            <article class="blog-post">
                <img src="${post.image}" alt="${post.title}">
                <div class="blog-post-content">
                    <h3>${post.title}</h3>
                    <p>${post.content}</p>
                    <div class="blog-meta">
                        <span>${post.date}</span>
                        <a href="#" class="read-more" onclick="showFullBlog(${post.id}); return false;">Read More</a>
                    </div>
                </div>
            </article>
        `;
    });
}

// Show full blog content
function showFullBlog(blogId) {
    const posts = [
        {
            id: 1,
            title: "Indian Railways: Journey Through Heritage",
            fullContent: "Indian Railways stands as one of the world's largest railway networks, spanning over 67,000 kilometers across the diverse landscape of India. From the snow-capped peaks of Kashmir to the southern tip of Kanyakumari, this magnificent network has been the backbone of India's transportation system for over 160 years. The journey began in 1853 with the first passenger train from Mumbai to Thane, covering just 34 kilometers. Today, Indian Railways carries over 8 billion passengers annually, making it not just a mode of transport but a lifeline that connects millions of dreams, aspirations, and destinations. The heritage of Indian Railways is reflected in its iconic stations like Victoria Terminus (now Chhatrapati Shivaji Maharaj Terminus) in Mumbai, Howrah Junction in Kolkata, and New Delhi Railway Station. These architectural marvels tell stories of colonial legacy while embracing modern amenities. The network has evolved from steam engines to electric trains, from manual signaling to computerized reservation systems, showcasing India's technological advancement while preserving its rich railway heritage.",
            date: "December 15, 2024",
            image: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=800&h=400&fit=crop"
        },
        {
            id: 2,
            title: "High-Speed Rail Revolution in India",
            fullContent: "India is on the brink of a high-speed rail revolution that promises to transform the way people travel across the country. The Mumbai-Ahmedabad High-Speed Rail project, India's first bullet train corridor, represents a significant leap towards modernizing the nation's transportation infrastructure. This 508-kilometer corridor will reduce travel time from 7 hours to just 2 hours and 58 minutes, operating at speeds of up to 320 km/h. The project, developed with Japanese Shinkansen technology, incorporates advanced safety features, earthquake resistance, and environmental sustainability. Beyond this flagship project, India has ambitious plans for multiple high-speed corridors connecting major cities like Delhi-Mumbai, Delhi-Kolkata, and Chennai-Bangalore. These projects will not only revolutionize passenger travel but also boost economic development along the corridors, create employment opportunities, and position India as a leader in high-speed rail technology in South Asia. The integration of artificial intelligence, IoT sensors, and predictive maintenance systems will ensure these trains operate with maximum efficiency and safety.",
            date: "December 10, 2024",
            image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&h=400&fit=crop"
        },
        {
            id: 3,
            title: "Sustainable Travel with Indian Railways",
            fullContent: "Indian Railways has emerged as a champion of sustainable transportation, significantly contributing to India's environmental goals and carbon footprint reduction. As one of the world's largest green transportation networks, railways consume 3-5 times less energy per passenger-kilometer compared to road transport and 2-3 times less than air travel. The massive electrification drive has converted over 80% of the broad gauge network to electric traction, reducing dependence on fossil fuels and cutting carbon emissions by millions of tons annually. Solar power initiatives across railway stations and installations have made Indian Railways one of the largest solar power consumers in the country. The introduction of energy-efficient LED lighting, regenerative braking systems in trains, and bio-toilets has further enhanced the environmental benefits. Water conservation through rainwater harvesting, waste management through segregation and recycling, and the use of eco-friendly materials in construction demonstrate the railways' commitment to sustainability. The shift towards electric and hybrid locomotives, coupled with plans for hydrogen-powered trains, positions Indian Railways as a model for sustainable mass transportation globally.",
            date: "December 5, 2024",
            image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=400&fit=crop"
        },
        {
            id: 4,
            title: "Digital Transformation of Railway Booking",
            fullContent: "The digital transformation of Indian Railways has revolutionized how millions of passengers book their train tickets, making travel planning more convenient and accessible than ever before. The IRCTC (Indian Railway Catering and Tourism Corporation) mobile app and website have become the backbone of this digital revolution, processing over 1 million transactions daily. The integration of artificial intelligence and machine learning has enhanced user experience through personalized recommendations, dynamic pricing, and predictive analytics for seat availability. Features like Tatkal booking, waitlist prediction, and automatic ticket cancellation have streamlined the booking process. The introduction of UPI payments, digital wallets, and contactless transactions has made payments seamless and secure. Real-time train tracking, PNR status updates, and SMS notifications keep passengers informed throughout their journey. The recent addition of features like train coach composition, platform information, and food ordering through the app has created a comprehensive travel ecosystem. Future developments include voice-based booking, augmented reality for station navigation, and blockchain technology for secure transactions, promising an even more sophisticated digital railway experience.",
            date: "December 1, 2024",
            image: "https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=800&h=400&fit=crop"
        },
        {
            id: 5,
            title: "Safety Innovations in Modern Trains",
            fullContent: "Safety remains the paramount concern for Indian Railways, leading to the implementation of cutting-edge technologies and innovative systems to ensure passenger security and operational excellence. The introduction of Train Collision Avoidance System (TCAS) and Automatic Train Protection (ATP) systems has significantly reduced the risk of accidents by providing real-time monitoring and automatic braking capabilities. Modern trains are equipped with GPS-based tracking systems, CCTV surveillance, and emergency communication devices that enable immediate response to any safety concerns. The implementation of Radio Frequency Identification (RFID) tags for tracking rolling stock and the use of drones for track inspection have enhanced preventive maintenance capabilities. Fire detection and suppression systems, improved bogey designs for better stability, and enhanced lighting systems contribute to passenger safety. The introduction of women-only coaches, help desks, and 24/7 security personnel ensures personal safety. Regular safety audits, staff training programs, and passenger awareness campaigns have created a comprehensive safety ecosystem. Future innovations include AI-powered predictive maintenance, biometric access controls, and smart sensors for real-time health monitoring of critical train components.",
            date: "November 28, 2024",
            image: "https://images.unsplash.com/photo-1517263904808-5dc91e3e7044?w=800&h=400&fit=crop"
        },
        {
            id: 6,
            title: "Regional Connectivity and Rural Development",
            fullContent: "Indian Railways plays a crucial role in connecting remote and rural areas, serving as a catalyst for economic development and social integration across the country. The ambitious railway expansion projects have brought connectivity to previously isolated regions, opening up new opportunities for trade, tourism, and employment. The construction of new railway lines in northeastern states, tribal areas, and border regions has not only improved accessibility but also strengthened national security and cultural integration. These connectivity projects have transformed local economies by providing farmers direct access to markets, reducing transportation costs, and enabling the movement of goods and services. The establishment of railway stations in small towns has led to the development of commercial hubs, educational institutions, and healthcare facilities. Special trains like the Humsafar Express, Antyodaya Express, and Jan Shatabdi have been designed to cater to different economic segments, ensuring affordable and comfortable travel for all. The railway network has also facilitated the growth of tourism in remote destinations, preserving local culture while providing economic opportunities. Future plans include the development of high-speed regional connectivity and the integration of railways with other modes of transport to create seamless multimodal transportation networks.",
            date: "November 25, 2024",
            image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=400&fit=crop"
        }
    ];
    
    const post = posts.find(p => p.id === blogId);
    if (!post) return;
    
    const modalHTML = `
        <div class="modal-content large">
            <span class="close" onclick="this.parentElement.parentElement.remove()">&times;</span>
            <div class="blog-full-content">
                <img src="${post.image}" alt="${post.title}" style="width: 100%; height: 300px; object-fit: cover; border-radius: 10px; margin-bottom: 20px;">
                <h2 style="color: #333; margin-bottom: 10px;">${post.title}</h2>
                <p style="color: #666; margin-bottom: 20px; font-size: 14px;"><i class="fas fa-calendar"></i> ${post.date}</p>
                <div style="color: #333; line-height: 1.8; font-size: 16px;">${post.fullContent}</div>
            </div>
        </div>
    `;
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'block';
    modal.innerHTML = modalHTML;
    document.body.appendChild(modal);
}

// Load gallery images
function loadGalleryImages() {
    const galleryGrid = document.querySelector('.gallery-grid');
    if (!galleryGrid) return;
    
    const trainImages = [
        "https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=600&h=400&fit=crop",
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop",
        "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&h=400&fit=crop",
        "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=600&h=400&fit=crop",
        "https://images.unsplash.com/photo-1465447142348-e9952c393450?w=600&h=400&fit=crop",
        "https://images.unsplash.com/photo-1517263904808-5dc91e3e7044?w=600&h=400&fit=crop"
    ];
    
    galleryGrid.innerHTML = '';
    trainImages.forEach((image, index) => {
        galleryGrid.innerHTML += `
            <div class="gallery-item">
                <img src="${image}" alt="Indian Train ${index + 1}">
                <div class="gallery-overlay">
                    <i class="fas fa-search-plus"></i>
                </div>
            </div>
        `;
    });
}

// Load about page content
function loadAboutPage() {
    // About page content can be loaded here if needed
    console.log('About page loaded');
}

// Search trains with filters
function searchTrains(from, to, date) {
    const filteredTrains = trains.filter(train => {
        const route = train.route.toLowerCase();
        const fromLower = from.toLowerCase();
        const toLower = to.toLowerCase();
        
        const hasFrom = train.from.toLowerCase().includes(fromLower) || route.includes(fromLower);
        const hasTo = train.to.toLowerCase().includes(toLower) || route.includes(toLower);
        
        const routeParts = train.route.split(' to ');
        if (routeParts.length === 2) {
            const trainFrom = routeParts[0].trim().toLowerCase();
            const trainTo = routeParts[1].trim().toLowerCase();
            const directMatch = trainFrom.includes(fromLower) && trainTo.includes(toLower);
            return directMatch || (hasFrom && hasTo);
        }
        
        return hasFrom && hasTo;
    });
    
    displaySearchResults(filteredTrains, from, to);
}

function displaySearchResults(filteredTrains, from, to) {
    const tbody = document.getElementById('trainTableBody');
    const title = document.getElementById('trainsTitle');
    const noResults = document.getElementById('noTrainsFound');
    
    if (filteredTrains.length === 0) {
        tbody.innerHTML = '';
        noResults.style.display = 'block';
        title.textContent = `No trains found from ${from} to ${to}`;
        return;
    }
    
    noResults.style.display = 'none';
    title.textContent = `Trains from ${from} to ${to} (${filteredTrains.length} found)`;
    
    tbody.innerHTML = '';
    filteredTrains.forEach(train => {
        const row = `
            <tr>
                <td><strong>${train.name}</strong><br><small>#${train.id}</small></td>
                <td>${train.route}</td>
                <td>${train.startTime}</td>
                <td>${train.arrivalTime}</td>
                <td><span class="seats-available">${train.seats}</span></td>
                <td>₹${train.price}</td>
                <td><button class="book-btn" onclick="quickBook('${train.id}')">Book Now</button></td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

function sortTrains(sortBy) {
    let sortedTrains = [...trains];
    
    switch(sortBy) {
        case 'price':
            sortedTrains.sort((a, b) => a.price - b.price);
            break;
        case 'name':
            sortedTrains.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'time':
        default:
            sortedTrains.sort((a, b) => a.startTime.localeCompare(b.startTime));
            break;
    }
    
    displaySortedTrains(sortedTrains);
}

function displaySortedTrains(sortedTrains) {
    const tbody = document.getElementById('trainTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    sortedTrains.forEach(train => {
        const seatStatus = train.seats > 50 ? 'available' : train.seats > 10 ? 'limited' : 'full';
        const row = `
            <tr>
                <td><strong>${train.name}</strong><br><small>#${train.id}</small></td>
                <td>${train.route}</td>
                <td>${train.startTime}</td>
                <td>${train.arrivalTime}</td>
                <td><span class="seats-${seatStatus}">${train.seats} seats</span></td>
                <td>₹${train.price}</td>
                <td><button class="book-btn" onclick="quickBook('${train.id}')">Book Now</button></td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

function toggleMenu() {
    const navMenu = document.getElementById('navMenu');
    navMenu.classList.toggle('active');
}

// Gallery filter functionality
function filterGallery(category) {
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    const galleryGrid = document.querySelector('.gallery-grid');
    if (!galleryGrid) return;
    
    const imagesByCategory = {
        trains: [
            "https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=600&h=400&fit=crop",
            "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop",
            "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&h=400&fit=crop"
        ],
        stations: [
            "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=600&h=400&fit=crop",
            "https://images.unsplash.com/photo-1465447142348-e9952c393450?w=600&h=400&fit=crop"
        ],
        express: [
            "https://images.unsplash.com/photo-1517263904808-5dc91e3e7044?w=600&h=400&fit=crop",
            "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop"
        ],
        heritage: [
            "https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=600&h=400&fit=crop",
            "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=600&h=400&fit=crop"
        ],
        modern: [
            "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&h=400&fit=crop",
            "https://images.unsplash.com/photo-1517263904808-5dc91e3e7044?w=600&h=400&fit=crop"
        ],
        scenic: [
            "https://images.unsplash.com/photo-1465447142348-e9952c393450?w=600&h=400&fit=crop",
            "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop"
        ]
    };
    
    const images = imagesByCategory[category] || imagesByCategory.trains;
    
    galleryGrid.innerHTML = '';
    images.forEach((image, index) => {
        galleryGrid.innerHTML += `
            <div class="gallery-item">
                <img src="${image}" alt="${category} ${index + 1}">
                <div class="gallery-overlay">
                    <i class="fas fa-search-plus"></i>
                </div>
            </div>
        `;
    });
}

// Blog category filter
function filterBlog(category) {
    const blogPosts = document.querySelector('.blog-posts');
    if (!blogPosts) return;
    
    const postsByCategory = {
        transport: [
            {
                title: "Indian Railways: Journey Through Heritage",
                content: "Discover the rich history and modern developments of Indian Railways.",
                date: "December 15, 2024",
                image: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=800&h=400&fit=crop"
            },
            {
                title: "Digital Transformation of Railway Booking",
                content: "Revolutionary changes in train ticket booking through mobile apps and AI.",
                date: "December 1, 2024",
                image: "https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=800&h=400&fit=crop"
            }
        ],
        trains: [
            {
                title: "High-Speed Rail Revolution in India",
                content: "Exploring the future of transportation with bullet trains.",
                date: "December 10, 2024",
                image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&h=400&fit=crop"
            },
            {
                title: "Safety Innovations in Modern Trains",
                content: "Advanced safety technologies ensuring passenger security.",
                date: "November 28, 2024",
                image: "https://images.unsplash.com/photo-1517263904808-5dc91e3e7044?w=800&h=400&fit=crop"
            }
        ],
        tourism: [
            {
                title: "Best Scenic Train Routes in India",
                content: "Discover the most beautiful train journeys across India.",
                date: "December 8, 2024",
                image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=400&fit=crop"
            }
        ],
        railway: [
            {
                title: "Sustainable Travel with Indian Railways",
                content: "How train travel contributes to eco-friendly transportation.",
                date: "December 5, 2024",
                image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=400&fit=crop"
            },
            {
                title: "Regional Connectivity and Rural Development",
                content: "How railway expansion connects remote areas and boosts development.",
                date: "November 25, 2024",
                image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=400&fit=crop"
            }
        ]
    };
    
    const posts = postsByCategory[category] || Object.values(postsByCategory).flat();
    
    blogPosts.innerHTML = '';
    posts.forEach(post => {
        blogPosts.innerHTML += `
            <article class="blog-post">
                <img src="${post.image}" alt="${post.title}">
                <div class="blog-post-content">
                    <h3>${post.title}</h3>
                    <p>${post.content}</p>
                    <div class="blog-meta">
                        <span>${post.date}</span>
                        <a href="#" class="read-more" onclick="showBlogModal('${post.title}', '${post.content}', '${post.date}', '${post.image}'); return false;">Read More</a>
                    </div>
                </div>
            </article>
        `;
    });
}

// Load My Tickets page
function loadMyTickets() {
    const ticketsContent = document.getElementById('ticketsContent');
    if (!currentUser) {
        ticketsContent.innerHTML = `
            <div class="login-required">
                <i class="fas fa-lock"></i>
                <h3>Login Required</h3>
                <p>Please login to view your tickets</p>
                <button class="btn-primary" onclick="showLogin()">Login Now</button>
            </div>
        `;
        return;
    }
    
    const userTickets = tickets.filter(t => t.userId === currentUser.id);
    
    if (userTickets.length === 0) {
        ticketsContent.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-ticket-alt"></i>
                <h3>No tickets found</h3>
                <p>You haven't booked any tickets yet.</p>
                <button class="btn-primary" onclick="showPage('home')">Book Your First Ticket</button>
            </div>
        `;
        return;
    }
    
    let ticketsHTML = '<div class="tickets-grid">';
    userTickets.reverse().forEach(ticket => {
        const passengerList = ticket.passengers.map(p => `${p.name} (${p.age}yrs)`).join(', ');
        ticketsHTML += `
            <div class="ticket-card ${ticket.status === 'Cancelled' ? 'cancelled' : ''}">
                <div class="ticket-header">
                    <h3>${ticket.trainName}</h3>
                    <span class="status-badge status-${ticket.status.toLowerCase()}">${ticket.status}</span>
                </div>
                <div class="ticket-details">
                    <p><strong>ID:</strong> ${ticket.id}</p>
                    <p><strong>Route:</strong> ${ticket.route}</p>
                    <p><strong>Date:</strong> ${ticket.travelDate}</p>
                    <p><strong>Passengers:</strong> ${passengerList}</p>
                    <p><strong>Total:</strong> ₹${ticket.totalPrice}</p>
                </div>
                ${ticket.status === 'Confirmed' ? `
                    <div class="ticket-actions">
                        <button class="btn-primary" onclick="generateETicket('${ticket.id}')">Download</button>
                        <button class="btn-danger" onclick="cancelTicket('${ticket.id}'); loadMyTickets();">Cancel</button>
                    </div>
                ` : ''}
            </div>
        `;
    });
    ticketsHTML += '</div>';
    ticketsContent.innerHTML = ticketsHTML;
}

// Load Weather Data
function loadWeatherData() {
    const weatherDisplay = document.getElementById('weatherDisplay');
    if (!weatherDisplay) return;
    
    const weatherData = {
        delhi: { name: 'New Delhi', temp: 25, condition: 'Clear Sky', icon: 'fas fa-sun' },
        mumbai: { name: 'Mumbai', temp: 28, condition: 'Partly Cloudy', icon: 'fas fa-cloud-sun' },
        kolkata: { name: 'Kolkata', temp: 26, condition: 'Humid', icon: 'fas fa-cloud' },
        chennai: { name: 'Chennai', temp: 30, condition: 'Hot', icon: 'fas fa-sun' },
        bangalore: { name: 'Bangalore', temp: 22, condition: 'Pleasant', icon: 'fas fa-cloud-sun' }
    };
    
    weatherDisplay.innerHTML = '';
    Object.keys(weatherData).forEach(city => {
        const data = weatherData[city];
        weatherDisplay.innerHTML += `
            <div class="weather-card">
                <h3>${data.name}</h3>
                <div class="weather-info">
                    <i class="${data.icon}"></i>
                    <span class="temp">${data.temp}°C</span>
                </div>
                <p>${data.condition}</p>
            </div>
        `;
    });
}

// Get Weather for specific city
function getWeather() {
    const city = document.getElementById('weatherCity').value;
    if (!city) {
        showMessage('Please select a city', 'error');
        return;
    }
    
    const weatherData = {
        delhi: { name: 'New Delhi', temp: 25, condition: 'Clear Sky', icon: 'fas fa-sun' },
        mumbai: { name: 'Mumbai', temp: 28, condition: 'Partly Cloudy', icon: 'fas fa-cloud-sun' },
        kolkata: { name: 'Kolkata', temp: 26, condition: 'Humid', icon: 'fas fa-cloud' },
        chennai: { name: 'Chennai', temp: 30, condition: 'Hot', icon: 'fas fa-sun' },
        bangalore: { name: 'Bangalore', temp: 22, condition: 'Pleasant', icon: 'fas fa-cloud-sun' }
    };
    
    const data = weatherData[city];
    const weatherDisplay = document.getElementById('weatherDisplay');
    
    weatherDisplay.innerHTML = `
        <div class="weather-card active">
            <h3>${data.name}</h3>
            <div class="weather-info">
                <i class="${data.icon}"></i>
                <span class="temp">${data.temp}°C</span>
            </div>
            <p>${data.condition}</p>
            <div class="weather-details">
                <p>Humidity: ${Math.floor(Math.random() * 40) + 40}%</p>
                <p>Wind: ${Math.floor(Math.random() * 15) + 5} km/h</p>
            </div>
        </div>
    `;
    
    showMessage(`Weather updated for ${data.name}`, 'success');
}

// Load Profile
function loadProfile() {
    const profileContent = document.getElementById('profileContent');
    if (!currentUser) {
        profileContent.innerHTML = `
            <div class="login-required">
                <i class="fas fa-lock"></i>
                <h3>Login Required</h3>
                <p>Please login to view your profile</p>
                <button class="btn-primary" onclick="showLogin()">Login Now</button>
            </div>
        `;
        return;
    }
    
    const userTickets = tickets.filter(t => t.userId === currentUser.id);
    const totalSpent = userTickets.reduce((sum, t) => sum + t.totalPrice, 0);
    const memberSince = new Date(currentUser.joinDate).toLocaleDateString();
    
    profileContent.innerHTML = `
        <div class="profile-container">
            <div class="profile-header">
                <div class="profile-avatar">
                    <i class="fas fa-user-circle"></i>
                </div>
                <div class="profile-info">
                    <h2>${currentUser.fullName || currentUser.username}</h2>
                    <p class="profile-email">${currentUser.email}</p>
                    <p class="member-since">Member since ${memberSince}</p>
                </div>
                <button class="btn-primary" onclick="editProfile()">Edit Profile</button>
            </div>
            
            <div class="profile-stats">
                <div class="stat-item" onclick="showPage('mybookings')" style="cursor: pointer;">
                    <i class="fas fa-ticket-alt"></i>
                    <span class="stat-number">${userTickets.length}</span>
                    <span class="stat-label">Total Bookings</span>
                </div>
                <div class="stat-item">
                    <i class="fas fa-rupee-sign"></i>
                    <span class="stat-number">₹${totalSpent}</span>
                    <span class="stat-label">Total Spent</span>
                </div>
                <div class="stat-item">
                    <i class="fas fa-star"></i>
                    <span class="stat-number">${reviews.filter(r => r.userId === currentUser.id).length}</span>
                    <span class="stat-label">Reviews Given</span>
                </div>
            </div>
            
            <div class="profile-quick-actions">
                <button class="btn-primary" onclick="showPage('mybookings')">View My Bookings</button>
                <button class="btn-secondary" onclick="showPage('stationservices')">Station Services</button>
                <button class="btn-secondary" onclick="showPage('foodordering')">Order Food</button>
            </div>
            
            <div class="profile-details">
                <div class="detail-section">
                    <h3>Personal Information</h3>
                    <div class="detail-grid">
                        <div class="detail-item">
                            <label>Full Name</label>
                            <span>${currentUser.fullName || 'Not provided'}</span>
                        </div>
                        <div class="detail-item">
                            <label>Username</label>
                            <span>${currentUser.username}</span>
                        </div>
                        <div class="detail-item">
                            <label>Email</label>
                            <span>${currentUser.email}</span>
                        </div>
                        <div class="detail-item">
                            <label>Phone</label>
                            <span>${currentUser.phone || 'Not provided'}</span>
                        </div>
                        <div class="detail-item">
                            <label>Age</label>
                            <span>${currentUser.age || 'Not provided'}</span>
                        </div>
                        <div class="detail-item">
                            <label>Gender</label>
                            <span>${currentUser.gender || 'Not provided'}</span>
                        </div>
                        <div class="detail-item">
                            <label>Aadhar Number</label>
                            <span>${currentUser.aadhar ? '****-****-' + currentUser.aadhar.slice(-4) : 'Not provided'}</span>
                        </div>
                        <div class="detail-item full-width">
                            <label>Address</label>
                            <span>${currentUser.address || 'Not provided'}</span>
                        </div>
                    </div>
                </div>
                
                <div class="detail-section">
                    <h3>Quick Actions</h3>
                    <div class="action-buttons">
                        <button class="btn-primary" onclick="showPage('mybookings')">My Bookings History</button>
                        <button class="btn-secondary" onclick="showPage('stationservices')">Find Station Services</button>
                        <button class="btn-secondary" onclick="showPage('foodordering')">Order Food to Train</button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function editProfile() {
    if (!currentUser) return;
    
    const modalHTML = `
        <div class="modal-content">
            <span class="close" onclick="closeModal('editProfileModal')">&times;</span>
            <h2><i class="fas fa-user-edit"></i> Edit Profile</h2>
            <div id="editProfileMessageContainer"></div>
            <form id="editProfileForm">
                <div class="form-row">
                    <div class="form-group">
                        <label>Full Name</label>
                        <input type="text" id="editFullName" value="${currentUser.fullName || ''}" required>
                    </div>
                    <div class="form-group">
                        <label>Username</label>
                        <input type="text" value="${currentUser.username}" readonly style="background: #f5f5f5;">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Email</label>
                        <input type="email" id="editEmail" value="${currentUser.email}" required>
                    </div>
                    <div class="form-group">
                        <label>Phone</label>
                        <input type="tel" id="editPhone" value="${currentUser.phone || ''}" pattern="[0-9]{10}" required>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Age</label>
                        <input type="number" id="editAge" value="${currentUser.age || ''}" min="1" max="120" required>
                    </div>
                    <div class="form-group">
                        <label>Gender</label>
                        <select id="editGender" required>
                            <option value="Male" ${currentUser.gender === 'Male' ? 'selected' : ''}>Male</option>
                            <option value="Female" ${currentUser.gender === 'Female' ? 'selected' : ''}>Female</option>
                            <option value="Other" ${currentUser.gender === 'Other' ? 'selected' : ''}>Other</option>
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <label>Aadhar Number</label>
                    <input type="text" id="editAadhar" value="${currentUser.aadhar || ''}" pattern="[0-9]{12}" required>
                </div>
                <div class="form-group">
                    <label>Address</label>
                    <textarea id="editAddress" required rows="3">${currentUser.address || ''}</textarea>
                </div>
                <button type="submit" class="btn-primary full-width">Update Profile</button>
            </form>
        </div>
    `;
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'editProfileModal';
    modal.style.display = 'block';
    modal.innerHTML = modalHTML;
    document.body.appendChild(modal);
    
    // Handle form submission
    modal.querySelector('#editProfileForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const updatedData = {
            fullName: document.getElementById('editFullName').value,
            email: document.getElementById('editEmail').value,
            phone: document.getElementById('editPhone').value,
            age: parseInt(document.getElementById('editAge').value),
            gender: document.getElementById('editGender').value,
            aadhar: document.getElementById('editAadhar').value,
            address: document.getElementById('editAddress').value
        };
        
        // Validation
        if (updatedData.phone.length !== 10) {
            showMessage('Phone number must be 10 digits!', 'error', 'editProfileMessageContainer');
            return;
        }
        
        if (updatedData.aadhar.length !== 12) {
            showMessage('Aadhar number must be 12 digits!', 'error', 'editProfileMessageContainer');
            return;
        }
        
        // Update user data
        Object.assign(currentUser, updatedData);
        
        const userIndex = users.findIndex(u => u.id === currentUser.id);
        users[userIndex] = currentUser;
        
        localStorage.setItem('trainGO_users', JSON.stringify(users));
        localStorage.setItem('trainGO_currentUser', JSON.stringify(currentUser));
        
        closeModal('editProfileModal');
        loadProfile();
        showMessage('Profile updated successfully!', 'success');
    });
}

// Load Dashboard
function loadDashboard() {
    const dashboardContent = document.getElementById('dashboardContent');
    if (!currentUser) {
        dashboardContent.innerHTML = `
            <div class="login-required">
                <i class="fas fa-lock"></i>
                <h3>Login Required</h3>
                <p>Please login to view your dashboard</p>
                <button class="btn-primary" onclick="showLogin()">Login Now</button>
            </div>
        `;
        return;
    }
    
    const userTickets = tickets.filter(t => t.userId === currentUser.id);
    const userReviews = reviews.filter(r => r.userId === currentUser.id);
    const upcomingTrips = userTickets.filter(t => 
        t.status === 'Confirmed' && new Date(t.travelDate) > new Date()
    );
    
    const recentBookingsHTML = userTickets.length > 0 ? 
        userTickets.slice(-3).reverse().map(ticket => `
            <div class="activity-item">
                <div class="activity-info">
                    <h4>${ticket.trainName}</h4>
                    <p>${ticket.route} • ${ticket.travelDate}</p>
                </div>
                <span class="status-${ticket.status.toLowerCase()}">${ticket.status}</span>
            </div>
        `).join('') : '<p>No bookings yet. <a href="#" onclick="showPage(\'home\')">Book your first ticket!</a></p>';
    
    dashboardContent.innerHTML = `
        <div class="dashboard-welcome">
            <h2>Welcome back, ${currentUser.fullName || currentUser.username}!</h2>
            <p>Here's your travel overview</p>
        </div>
        <div class="dashboard-stats">
            <div class="stat-card">
                <i class="fas fa-ticket-alt"></i>
                <h3>${userTickets.length}</h3>
                <p>Total Bookings</p>
            </div>
            <div class="stat-card">
                <i class="fas fa-star"></i>
                <h3>${userReviews.length}</h3>
                <p>Reviews Given</p>
            </div>
            <div class="stat-card">
                <i class="fas fa-calendar"></i>
                <h3>${upcomingTrips.length}</h3>
                <p>Upcoming Trips</p>
            </div>
            <div class="stat-card">
                <i class="fas fa-rupee-sign"></i>
                <h3>₹${userTickets.reduce((sum, t) => sum + t.totalPrice, 0)}</h3>
                <p>Total Spent</p>
            </div>
        </div>
        <div class="recent-activity">
            <h3>Recent Bookings</h3>
            <div class="activity-list">
                ${recentBookingsHTML}
            </div>
        </div>
    `;
}

// Load train table for Find Trains page
function loadTrainTable() {
    const tbody = document.getElementById('trainTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    trains.forEach(train => {
        const seatStatus = train.seats > 50 ? 'available' : train.seats > 10 ? 'limited' : 'full';
        const row = `
            <tr>
                <td><strong>${train.name}</strong><br><small>#${train.id}</small></td>
                <td>${train.route}</td>
                <td>${train.startTime}</td>
                <td>${train.arrivalTime}</td>
                <td><span class="seats-${seatStatus}">${train.seats} seats</span></td>
                <td>₹${train.price}</td>
                <td><button class="book-btn" onclick="quickBook('${train.id}')">Book Now</button></td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

// Message system
function showMessage(message, type, container = 'messageContainer') {
    const messageContainer = document.getElementById(container);
    if (!messageContainer) {
        console.error('Message container not found:', container);
        return;
    }
    
    // Clear existing messages in the container
    messageContainer.innerHTML = '';
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    
    messageContainer.appendChild(messageDiv);
    
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.remove();
        }
    }, 4000);
}

// Load train cards - exact match to reference
function loadTrainCards() {
    const container = document.getElementById('trainCards');
    if (!container) return;
    
    container.innerHTML = '';
    
    // Show first 12 trains
    const displayTrains = trains.slice(0, 12);
    
    displayTrains.forEach(train => {
        const card = `
            <div class="train-card">
                <div class="train-info">
                    <div class="train-logo">${train.id.slice(-2)}</div>
                    <div class="train-details">
                        <h4>${train.name}</h4>
                        <div class="train-route">${train.route}</div>
                    </div>
                </div>
                <div class="train-timing">
                    <div class="departure">
                        <div class="time">${train.startTime}</div>
                        <div class="date">${train.date}</div>
                        <div class="station">${train.from}</div>
                    </div>
                    <div class="duration">
                        <i class="fas fa-arrow-right"></i>
                        <div class="duration-text">${train.duration}</div>
                    </div>
                    <div class="arrival">
                        <div class="time">${train.arrivalTime}</div>
                        <div class="date">${train.date}</div>
                        <div class="station">${train.to}</div>
                    </div>
                </div>
                <div class="train-price">
                    <div class="price">₹${train.price}</div>
                    <div class="per-person">/person</div>
                    <div class="amenities">
                        <i class="fas fa-wifi"></i>
                        <i class="fas fa-utensils"></i>
                        <i class="fas fa-bed"></i>
                        <i class="fas fa-plane"></i>
                    </div>
                    <button class="book-btn" onclick="quickBook('${train.id}')">Book</button>
                </div>
            </div>
        `;
        container.innerHTML += card;
    });
    
    // Update results count
    const resultsCount = document.getElementById('resultsCount');
    if (resultsCount) {
        resultsCount.textContent = `${displayTrains.length} of ${trains.length} found`;
    }
}

// Load train table (keep for compatibility)
function loadTrainTable() {
    loadTrainCards();
}

function quickBook(trainId) {
    if (!currentUser) {
        showMessage('Please login first to book tickets!', 'error');
        showLogin();
        return;
    }
    
    const train = trains.find(t => t.id === trainId);
    if (!train) {
        showMessage('Train not found!', 'error');
        return;
    }
    
    // Store selected train for booking
    currentBookingData = {
        train: train,
        trainId: trainId
    };
    
    // Show booking form modal
    showBookingModal(train);
}

function showBookingModal(train) {
    const modalHTML = `
        <div class="modal-content booking-modal">
            <span class="close" onclick="this.parentElement.parentElement.remove()">&times;</span>
            <div class="booking-modal-content">
                <h2><i class="fas fa-train"></i> Book Ticket - ${train.name}</h2>
                <div class="train-booking-info">
                    <p><strong>Route:</strong> ${train.route}</p>
                    <p><strong>Timing:</strong> ${train.startTime} - ${train.arrivalTime}</p>
                    <p><strong>Duration:</strong> ${train.duration}</p>
                    <p><strong>Price:</strong> ₹${train.price} per person</p>
                </div>
                <form id="quickBookingForm">
                    <div class="booking-form-row">
                        <div class="booking-form-group">
                            <label>Travel Date</label>
                            <input type="date" id="quickTravelDate" required>
                        </div>
                        <div class="booking-form-group">
                            <label>Class</label>
                            <select id="quickSeatClass" required>
                                <option value="3rd">3rd AC (₹${train.price})</option>
                                <option value="2nd">2nd AC (₹${Math.round(train.price * 1.3)})</option>
                                <option value="1st">1st AC (₹${Math.round(train.price * 1.5)})</option>
                            </select>
                        </div>
                    </div>
                    <div class="booking-form-group">
                        <label>Number of Passengers</label>
                        <select id="quickPassengers" required onchange="generateQuickPassengerForms(this.value)">
                            <option value="">Select passengers</option>
                            <option value="1">1 Passenger</option>
                            <option value="2">2 Passengers</option>
                            <option value="3">3 Passengers</option>
                            <option value="4">4 Passengers</option>
                        </select>
                    </div>
                    <div id="quickPassengerDetails"></div>
                    <button type="submit" class="btn-primary full-width">Proceed to Payment</button>
                </form>
            </div>
        </div>
    `;
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'block';
    modal.innerHTML = modalHTML;
    document.body.appendChild(modal);
    
    // Set minimum date
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    document.getElementById('quickTravelDate').min = tomorrow.toISOString().split('T')[0];
    
    // Handle form submission
    modal.querySelector('#quickBookingForm').addEventListener('submit', function(e) {
        e.preventDefault();
        processQuickBooking(modal);
    });
}

function generateQuickPassengerForms(count) {
    const container = document.getElementById('quickPassengerDetails');
    container.innerHTML = '';
    
    if (count > 0) {
        container.innerHTML = '<div class="passenger-section"><h3>Passenger Details</h3></div>';
        const passengerSection = container.querySelector('.passenger-section');
        
        for (let i = 1; i <= count; i++) {
            const passengerForm = `
                <div class="passenger-card">
                    <h4>Passenger ${i}</h4>
                    <div class="booking-form-row">
                        <div class="booking-form-group">
                            <label>Full Name</label>
                            <input type="text" id="quickPassenger${i}Name" placeholder="Enter full name" required>
                        </div>
                        <div class="booking-form-group">
                            <label>Age</label>
                            <input type="number" id="quickPassenger${i}Age" placeholder="Age" min="1" max="120" required>
                        </div>
                    </div>
                    <div class="booking-form-group">
                        <label>Gender</label>
                        <select id="quickPassenger${i}Gender" required>
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                </div>
            `;
            passengerSection.innerHTML += passengerForm;
        }
    }
}

function processQuickBooking(modal) {
    const travelDate = document.getElementById('quickTravelDate').value;
    const seatClass = document.getElementById('quickSeatClass').value;
    const passengerCount = parseInt(document.getElementById('quickPassengers').value);
    
    if (!travelDate || !seatClass || !passengerCount) {
        showMessage('Please fill all required fields!', 'error');
        return;
    }
    
    // Get passenger details
    const passengerDetails = [];
    for (let i = 1; i <= passengerCount; i++) {
        const name = document.getElementById(`quickPassenger${i}Name`).value;
        const age = document.getElementById(`quickPassenger${i}Age`).value;
        const gender = document.getElementById(`quickPassenger${i}Gender`).value;
        
        if (!name || !age || !gender) {
            showMessage('Please fill all passenger details!', 'error');
            return;
        }
        
        passengerDetails.push({ name, age: parseInt(age), gender });
    }
    
    const train = currentBookingData.train;
    const priceMultiplier = seatClass === '1st' ? 1.5 : seatClass === '2nd' ? 1.3 : 1;
    const totalPrice = Math.round(train.price * passengerCount * priceMultiplier);
    
    const ticket = {
        id: 'TKT' + Date.now(),
        userId: currentUser.id,
        trainId: train.id,
        trainName: train.name,
        route: train.route,
        travelDate,
        seatClass,
        passengers: passengerDetails,
        totalPrice: totalPrice,
        bookingDate: new Date().toISOString().split('T')[0],
        status: 'Confirmed'
    };
    
    // Update booking data for payment
    currentBookingData = {
        ticket: ticket,
        train: train,
        passengerCount: passengerCount
    };
    
    modal.remove();
    showPaymentModal();
}

// Setup forms
function setupForms() {
    // Login form
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
            currentUser = user;
            localStorage.setItem('trainGO_currentUser', JSON.stringify(currentUser));
            closeModal('loginModal');
            showUserDashboard();
            document.getElementById('loginForm').reset();
            showMessage(`Welcome back, ${user.fullName || user.username}!`, 'success');
        } else {
            showMessage('Invalid email or password!', 'error', 'loginMessageContainer');
        }
    });

    // Register form
    document.getElementById('registerForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = {
            fullName: document.getElementById('regFullName').value,
            username: document.getElementById('regUsername').value,
            email: document.getElementById('regEmail').value,
            phone: document.getElementById('regPhone').value,
            age: parseInt(document.getElementById('regAge').value),
            gender: document.getElementById('regGender').value,
            aadhar: document.getElementById('regAadhar').value,
            address: document.getElementById('regAddress').value,
            password: document.getElementById('regPassword').value
        };
        
        // Validation
        if (users.find(u => u.username === formData.username)) {
            showMessage('Username already exists!', 'error', 'registerMessageContainer');
            return;
        }
        
        if (users.find(u => u.email === formData.email)) {
            showMessage('Email already registered!', 'error', 'registerMessageContainer');
            return;
        }
        
        if (formData.phone.length !== 10) {
            showMessage('Phone number must be 10 digits!', 'error', 'registerMessageContainer');
            return;
        }
        
        if (formData.aadhar.length !== 12) {
            showMessage('Aadhar number must be 12 digits!', 'error', 'registerMessageContainer');
            return;
        }
        
        const newUser = {
            id: Date.now(),
            ...formData,
            joinDate: new Date().toISOString().split('T')[0]
        };
        
        users.push(newUser);
        localStorage.setItem('trainGO_users', JSON.stringify(users));
        closeModal('registerModal');
        document.getElementById('registerForm').reset();
        showMessage('Registration successful! Please login with your credentials.', 'success');
    });

    // Booking form
    document.getElementById('bookingForm').addEventListener('submit', function(e) {
        e.preventDefault();
        if (!currentUser) {
            showMessage('Please login first!', 'error');
            return;
        }
        
        const trainId = parseInt(document.getElementById('trainSelect').value);
        const travelDate = document.getElementById('travelDate').value;
        const seatClass = document.getElementById('seatClass').value;
        const passengerCount = parseInt(document.getElementById('passengers').value);
        
        const train = trains.find(t => t.id === trainId);
        if (train.seats < passengerCount) {
            showMessage('Not enough seats available!', 'error');
            return;
        }
        
        // Get passenger details
        const passengerDetails = [];
        for (let i = 1; i <= passengerCount; i++) {
            const name = document.getElementById(`passenger${i}Name`).value;
            const age = document.getElementById(`passenger${i}Age`).value;
            const gender = document.getElementById(`passenger${i}Gender`).value;
            
            if (!name || !age || !gender) {
                showMessage('Please fill all passenger details!', 'error');
                return;
            }
            
            passengerDetails.push({ name, age: parseInt(age), gender });
        }
        
        const ticket = {
            id: 'TKT' + Date.now(),
            userId: currentUser.id,
            trainId: trainId,
            trainName: train.name,
            route: train.route,
            travelDate,
            seatClass,
            passengers: passengerDetails,
            totalPrice: train.price * passengerCount * (seatClass === '1st' ? 1.5 : 1),
            bookingDate: new Date().toISOString().split('T')[0],
            status: 'Confirmed'
        };
        
        tickets.push(ticket);
        train.seats -= passengerCount;
        
        localStorage.setItem('trainGO_tickets', JSON.stringify(tickets));
        localStorage.setItem('trainGO_trains', JSON.stringify(trains));
        
        // Validate seat selection if seats were selected
        if (selectedSeats.length > 0 && selectedSeats.length !== passengerCount) {
            showMessage('Please select exactly ' + passengerCount + ' seats!', 'error');
            return;
        }
        
        // Store booking data for payment
        currentBookingData = {
            ticket: ticket,
            train: train,
            passengerCount: passengerCount,
            selectedSeats: [...selectedSeats]
        };
        
        showPage('payment');
        document.getElementById('bookingForm').reset();
        document.getElementById('passengerDetails').innerHTML = '';
        document.getElementById('seatSelection').style.display = 'none';
        selectedSeats = [];
    });

    // Search form
    document.getElementById('searchForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const ticketId = document.getElementById('ticketId').value;
        const ticket = tickets.find(t => t.id === ticketId);
        
        if (ticket) {
            displayTicketDetails(ticket);
        } else {
            showMessage('Ticket not found!', 'error');
            document.getElementById('ticketResults').innerHTML = '';
        }
    });

    // Review form
    document.getElementById('reviewForm').addEventListener('submit', function(e) {
        e.preventDefault();
        if (!currentUser) {
            showMessage('Please login first!', 'error');
            return;
        }
        
        const trainId = parseInt(document.getElementById('reviewTrain').value);
        const rating = parseInt(document.querySelector('input[name="rating"]:checked').value);
        const reviewText = document.getElementById('reviewText').value;
        
        const train = trains.find(t => t.id === trainId);
        const review = {
            id: Date.now(),
            userId: currentUser.id,
            username: currentUser.fullName || currentUser.username,
            trainId: trainId,
            trainName: train.name,
            rating: rating,
            review: reviewText,
            date: new Date().toISOString().split('T')[0]
        };
        
        reviews.push(review);
        localStorage.setItem('trainGO_reviews', JSON.stringify(reviews));
        
        showMessage('Review submitted successfully!', 'success');
        document.getElementById('reviewForm').reset();
        loadReviews();
        updateUserStats();
    });

    // Passenger count change
    document.getElementById('passengers').addEventListener('change', function() {
        const count = parseInt(this.value);
        generatePassengerForms(count);
        if (count > 0) {
            generateSeatSelection(count);
        }
    });

    // Train search form
    const trainSearchForm = document.getElementById('trainSearchForm');
    if (trainSearchForm) {
        trainSearchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const from = document.getElementById('fromCity').value;
            const to = document.getElementById('toCity').value;
            const date = document.getElementById('searchDate').value;
            const priceRange = document.getElementById('priceFilter').value;
            const timeFilter = document.getElementById('timeFilter').value;
            
            advancedSearchTrains(from, to, date, priceRange, timeFilter);
        });
    }

function advancedSearchTrains(from, to, date, priceRange, timeFilter) {
    let filteredTrains = trains.filter(train => {
        // Route filter
        let routeMatch = true;
        if (from || to) {
            const route = train.route.toLowerCase();
            const routeParts = train.route.split(' to ');
            if (from && to) {
                if (routeParts.length === 2) {
                    const trainFrom = routeParts[0].trim().toLowerCase();
                    const trainTo = routeParts[1].trim().toLowerCase();
                    routeMatch = trainFrom.includes(from.toLowerCase()) && trainTo.includes(to.toLowerCase());
                } else {
                    routeMatch = route.includes(from.toLowerCase()) && route.includes(to.toLowerCase());
                }
            } else if (from) {
                routeMatch = route.includes(from.toLowerCase()) || train.from.toLowerCase().includes(from.toLowerCase());
            } else if (to) {
                routeMatch = route.includes(to.toLowerCase()) || train.to.toLowerCase().includes(to.toLowerCase());
            }
        }
        
        // Price filter
        let priceMatch = true;
        if (priceRange) {
            const [min, max] = priceRange.split('-').map(Number);
            priceMatch = train.price >= min && (max ? train.price <= max : true);
        }
        
        // Time filter
        let timeMatch = true;
        if (timeFilter) {
            const hour = parseInt(train.startTime.split(':')[0]);
            switch(timeFilter) {
                case 'morning': timeMatch = hour >= 6 && hour < 12; break;
                case 'afternoon': timeMatch = hour >= 12 && hour < 18; break;
                case 'evening': timeMatch = hour >= 18 && hour < 24; break;
                case 'night': timeMatch = hour >= 0 && hour < 6; break;
            }
        }
        
        return routeMatch && priceMatch && timeMatch;
    });
    
    displayAdvancedSearchResults(filteredTrains, from, to);
}

function displayAdvancedSearchResults(filteredTrains, from, to) {
    const tbody = document.getElementById('trainTableBody');
    const title = document.getElementById('trainsTitle');
    const noResults = document.getElementById('noTrainsFound');
    
    if (filteredTrains.length === 0) {
        tbody.innerHTML = '';
        noResults.style.display = 'block';
        title.textContent = from && to ? `No trains found from ${from} to ${to}` : 'No trains match your criteria';
        return;
    }
    
    noResults.style.display = 'none';
    title.textContent = from && to ? 
        `${filteredTrains.length} trains from ${from} to ${to}` : 
        `${filteredTrains.length} trains found`;
    
    tbody.innerHTML = '';
    filteredTrains.forEach(train => {
        const seatStatus = train.seats > 50 ? 'available' : train.seats > 10 ? 'limited' : 'full';
        const row = `
            <tr>
                <td><strong>${train.name}</strong><br><small>#${train.id}</small></td>
                <td>${train.route}</td>
                <td>${train.startTime}</td>
                <td>${train.arrivalTime}</td>
                <td><span class="seats-${seatStatus}">${train.seats} seats</span></td>
                <td>₹${train.price}</td>
                <td><button class="book-btn" onclick="quickBook('${train.id}')">Book Now</button></td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

    // Forgot password form
    let foundUser = null;
    document.getElementById('forgotPasswordForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const emailOrUsername = document.getElementById('forgotEmail').value;
        
        foundUser = users.find(u => u.email === emailOrUsername || u.username === emailOrUsername);
        if (foundUser) {
            showMessage(`Account found: ${foundUser.fullName || foundUser.username}`, 'success', 'forgotPasswordMessageContainer');
            document.getElementById('forgotPasswordStep1').style.display = 'none';
            document.getElementById('forgotPasswordStep2').style.display = 'block';
        } else {
            showMessage('Account not found!', 'error', 'forgotPasswordMessageContainer');
        }
    });

    // Reset password form
    document.getElementById('resetPasswordForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        if (newPassword !== confirmPassword) {
            showMessage('Passwords do not match!', 'error', 'forgotPasswordMessageContainer');
            return;
        }
        
        if (foundUser) {
            foundUser.password = newPassword;
            const userIndex = users.findIndex(u => u.id === foundUser.id);
            users[userIndex] = foundUser;
            localStorage.setItem('trainGO_users', JSON.stringify(users));
            
            showMessage('Password reset successfully!', 'success', 'forgotPasswordMessageContainer');
            setTimeout(() => {
                closeModal('forgotPasswordModal');
                document.getElementById('forgotPasswordForm').reset();
                document.getElementById('resetPasswordForm').reset();
                document.getElementById('forgotPasswordStep1').style.display = 'block';
                document.getElementById('forgotPasswordStep2').style.display = 'none';
                foundUser = null;
            }, 2000);
        }
    });

    // Advanced search form
    document.getElementById('advancedSearchForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const from = document.getElementById('advFromCity').value;
        const to = document.getElementById('advToCity').value;
        const date = document.getElementById('advSearchDate').value;
        const priceRange = document.getElementById('priceFilter').value;
        const timeFilter = document.getElementById('timeFilter').value;
        
        advancedSearchTrains(from, to, date, priceRange, timeFilter);
    });

    // Sort functionality
    const sortBy = document.getElementById('sortBy');
    if (sortBy) {
        sortBy.addEventListener('change', function() {
            sortTrains(this.value);
        });
    }
}

// Generate passenger detail forms
function generatePassengerForms(count) {
    const container = document.getElementById('passengerDetails');
    container.innerHTML = '';
    
    if (count > 0) {
        container.innerHTML = '<h3>Passenger Details</h3>';
        
        for (let i = 1; i <= count; i++) {
            const passengerForm = `
                <div class="passenger-card">
                    <h4>Passenger ${i}</h4>
                    <div class="form-row">
                        <div class="form-group">
                            <label>Full Name</label>
                            <input type="text" id="passenger${i}Name" placeholder="Enter full name" required>
                        </div>
                        <div class="form-group">
                            <label>Age</label>
                            <input type="number" id="passenger${i}Age" placeholder="Age" min="1" max="120" required>
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Gender</label>
                        <select id="passenger${i}Gender" required>
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                </div>
            `;
            container.innerHTML += passengerForm;
        }
    }
}

// Modal functions
function showModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function showLogin() {
    document.getElementById('loginModal').style.display = 'block';
}

function showRegister() {
    document.getElementById('registerModal').style.display = 'block';
}

function showForgotPassword() {
    closeModal('loginModal');
    document.getElementById('forgotPasswordModal').style.display = 'block';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}



// Populate train selects
function populateTrainSelects() {
    const selects = ['trainSelect', 'reviewTrain', 'reviewFilter'];
    selects.forEach(selectId => {
        const select = document.getElementById(selectId);
        if (select) {
            if (selectId === 'reviewFilter') {
                select.innerHTML = '<option value="">All Trains</option>';
            } else {
                select.innerHTML = select.id === 'trainSelect' ? 
                    '<option value="">Choose your train</option>' : 
                    '<option value="">Choose train to review</option>';
            }
            
            trains.forEach(train => {
                select.innerHTML += `<option value="${train.id}">${train.name} - ${train.route}</option>`;
            });
        }
    });
}

// Filter reviews by train
function filterReviews() {
    const selectedTrain = document.getElementById('reviewFilter').value;
    const reviewsList = document.getElementById('reviewsList');
    
    let filteredReviews = reviews;
    if (selectedTrain) {
        filteredReviews = reviews.filter(r => r.trainId == selectedTrain);
    }
    
    if (filteredReviews.length === 0) {
        reviewsList.innerHTML = '<p>No reviews found for the selected criteria.</p>';
        return;
    }
    
    reviewsList.innerHTML = '';
    filteredReviews.slice(-10).reverse().forEach(review => {
        const stars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
        reviewsList.innerHTML += `
            <div class="review-card">
                <div class="review-header">
                    <strong>${review.username}</strong>
                    <div class="review-stars">${stars}</div>
                </div>
                <div class="review-meta">${review.trainName} • ${review.date}</div>
                <p>${review.review}</p>
            </div>
        `;
    });
}

// Display ticket details
function displayTicketDetails(ticket) {
    const resultsDiv = document.getElementById('ticketResults');
    const passengerList = ticket.passengers.map(p => 
        `<li>${p.name} (${p.age}yrs, ${p.gender})</li>`
    ).join('');
    
    resultsDiv.innerHTML = `
        <div class="ticket-card ${ticket.status === 'Cancelled' ? 'cancelled' : ''}">
            <h3>Ticket Details</h3>
            <div class="ticket-info">
                <p><strong>Ticket ID:</strong> ${ticket.id}</p>
                <p><strong>Train:</strong> ${ticket.trainName}</p>
                <p><strong>Route:</strong> ${ticket.route}</p>
                <p><strong>Travel Date:</strong> ${ticket.travelDate}</p>
                <p><strong>Class:</strong> ${ticket.seatClass}</p>
                <p><strong>Passengers:</strong></p>
                <ul>${passengerList}</ul>
                <p><strong>Total Price:</strong> ₹ ${ticket.totalPrice}</p>
                <p><strong>Booking Date:</strong> ${ticket.bookingDate}</p>
                <p><strong>Status:</strong> <span class="status-${ticket.status.toLowerCase()}">${ticket.status}</span></p>
            </div>
            ${ticket.status === 'Confirmed' ? `
                <div class="ticket-actions">
                    <button class="btn-primary" onclick="generateETicket('${ticket.id}')">Download E-Ticket</button>
                    <button class="btn-danger" onclick="cancelTicket('${ticket.id}')">Cancel Ticket</button>
                </div>
            ` : ''}
        </div>
    `;
}

// Cancel ticket
function cancelTicket(ticketId) {
    if (confirm('Are you sure you want to cancel this ticket?')) {
        const ticketIndex = tickets.findIndex(t => t.id === ticketId);
        if (ticketIndex !== -1) {
            const ticket = tickets[ticketIndex];
            const train = trains.find(t => t.id === ticket.trainId);
            
            // Return seats
            train.seats += ticket.passengers.length;
            
            // Update ticket status
            tickets[ticketIndex].status = 'Cancelled';
            
            localStorage.setItem('trainGO_tickets', JSON.stringify(tickets));
            localStorage.setItem('trainGO_trains', JSON.stringify(trains));
            
            showMessage('Ticket cancelled successfully! Refund will be processed within 5-7 business days.', 'success');
            displayTicketDetails(tickets[ticketIndex]);
            loadTrainTable();
            updateUserStats();
        }
    }
}

// Load reviews
function loadReviews() {
    populateTrainSelects();
    filterReviews(); // This will load all reviews initially
}

// User session management
function checkUserSession() {
    if (currentUser) {
        showUserDashboard();
    }
}

function showUserDashboard() {
    // Show user profile in navbar
    document.getElementById('navAuth').style.display = 'none';
    document.getElementById('userProfile').style.display = 'block';
    document.getElementById('navUsername').textContent = currentUser.fullName || currentUser.username;
    document.getElementById('dashboardLink').style.display = 'block';
    
    updateUserStats();
    loadRecentBookings();
}

function toggleProfileMenu() {
    const menu = document.getElementById('profileMenu');
    menu.classList.toggle('show');
}

// Close profile menu when clicking outside
document.addEventListener('click', function(event) {
    const profileDropdown = document.querySelector('.profile-dropdown');
    const profileMenu = document.getElementById('profileMenu');
    
    if (!profileDropdown.contains(event.target)) {
        profileMenu.classList.remove('show');
    }
});

function updateUserStats() {
    if (!currentUser) return;
    
    const userTickets = tickets.filter(t => t.userId === currentUser.id);
    const userReviews = reviews.filter(r => r.userId === currentUser.id);
    const upcomingTrips = userTickets.filter(t => 
        t.status === 'Confirmed' && new Date(t.travelDate) > new Date()
    );
    
    const ticketCountEl = document.getElementById('userTicketCount');
    const reviewCountEl = document.getElementById('userReviewCount');
    const upcomingTripsEl = document.getElementById('upcomingTrips');
    
    if (ticketCountEl) ticketCountEl.textContent = userTickets.length;
    if (reviewCountEl) reviewCountEl.textContent = userReviews.length;
    if (upcomingTripsEl) upcomingTripsEl.textContent = upcomingTrips.length;
}

function loadRecentBookings() {
    if (!currentUser) return;
    
    const userTickets = tickets.filter(t => t.userId === currentUser.id).slice(-5).reverse();
    const bookingsList = document.getElementById('recentBookings');
    
    if (userTickets.length === 0) {
        bookingsList.innerHTML = '<p>No bookings yet. <a href="#" onclick="showPage(\'booking\')">Book your first ticket!</a></p>';
        return;
    }
    
    bookingsList.innerHTML = '';
    userTickets.forEach(ticket => {
        bookingsList.innerHTML += `
            <div class="ticket-card ${ticket.status === 'Cancelled' ? 'cancelled' : ''}">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <strong>${ticket.trainName}</strong>
                        <p>${ticket.route} • ${ticket.travelDate}</p>
                        <small>Ticket ID: ${ticket.id}</small>
                    </div>
                    <div style="text-align: right;">
                        <strong>₹ ${ticket.totalPrice}</strong>
                        <p class="status-${ticket.status.toLowerCase()}">${ticket.status}</p>
                    </div>
                </div>
            </div>
        `;
    });
}

function logout() {
    currentUser = null;
    localStorage.removeItem('trainGO_currentUser');
    
    // Reset nav
    document.getElementById('navAuth').style.display = 'flex';
    document.getElementById('userProfile').style.display = 'none';
    document.getElementById('dashboardLink').style.display = 'none';
    
    showMessage('Logged out successfully!', 'success');
    showPage('home');
}

// Show my tickets function
function showMyTickets() {
    if (!currentUser) return;
    
    const userTickets = tickets.filter(t => t.userId === currentUser.id);
    let ticketsHTML = `
        <div class="page-header">
            <h1><i class="fas fa-list"></i> My Tickets</h1>
            <p>View and manage all your bookings</p>
        </div>
        <div class="tickets-container">
    `;
    
    if (userTickets.length === 0) {
        ticketsHTML += `
            <div class="empty-state">
                <i class="fas fa-ticket-alt"></i>
                <h3>No tickets found</h3>
                <p>You haven't booked any tickets yet.</p>
                <button class="btn-primary" onclick="showPage('booking')">Book Your First Ticket</button>
            </div>
        `;
    } else {
        userTickets.reverse().forEach(ticket => {
            const passengerList = ticket.passengers.map(p => 
                `<li>${p.name} (${p.age}yrs, ${p.gender})</li>`
            ).join('');
            
            ticketsHTML += `
                <div class="ticket-card ${ticket.status === 'Cancelled' ? 'cancelled' : ''}">
                    <div class="ticket-header">
                        <h3>${ticket.trainName}</h3>
                        <span class="status-badge status-${ticket.status.toLowerCase()}">${ticket.status}</span>
                    </div>
                    <div class="ticket-details">
                        <div class="detail-row">
                            <span><strong>Ticket ID:</strong> ${ticket.id}</span>
                            <span><strong>Date:</strong> ${ticket.travelDate}</span>
                        </div>
                        <div class="detail-row">
                            <span><strong>Route:</strong> ${ticket.route}</span>
                            <span><strong>Class:</strong> ${ticket.seatClass}</span>
                        </div>
                        <div class="detail-row">
                            <span><strong>Passengers:</strong></span>
                            <span><strong>Total:</strong> ₹ ${ticket.totalPrice}</span>
                        </div>
                        <ul class="passenger-list">${passengerList}</ul>
                        ${ticket.status === 'Confirmed' ? `
                            <div class="ticket-actions">
                                <button class="btn-primary" onclick="generateETicket('${ticket.id}')">Download E-Ticket</button>
                                <button class="btn-danger" onclick="cancelTicket('${ticket.id}'); showMyTickets();">Cancel Ticket</button>
                            </div>
                        ` : ''}
                    </div>
                </div>
            `;
        });
    }
    
    ticketsHTML += '</div>';
    
    // Create modal for tickets
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'block';
    modal.innerHTML = `
        <div class="modal-content large">
            <span class="close" onclick="this.parentElement.parentElement.remove()">&times;</span>
            ${ticketsHTML}
        </div>
    `;
    document.body.appendChild(modal);
    
    // Close profile menu
    document.getElementById('profileMenu').classList.remove('show');
}

// Show profile
function showProfile() {
    if (!currentUser) return;
    
    const profileHTML = `
        <div class="modal-content large">
            <span class="close" onclick="this.parentElement.parentElement.remove()">&times;</span>
            <h2><i class="fas fa-user"></i> My Profile</h2>
            <form id="profileUpdateForm">
                <div class="form-row">
                    <div class="form-group">
                        <label>Full Name</label>
                        <input type="text" id="profileFullName" value="${currentUser.fullName || ''}" required>
                    </div>
                    <div class="form-group">
                        <label>Username</label>
                        <input type="text" value="${currentUser.username}" readonly style="background: #f5f5f5;">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Email</label>
                        <input type="email" id="profileEmail" value="${currentUser.email}" required>
                    </div>
                    <div class="form-group">
                        <label>Phone</label>
                        <input type="tel" id="profilePhone" value="${currentUser.phone}" pattern="[0-9]{10}" required>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Age</label>
                        <input type="number" id="profileAge" value="${currentUser.age || ''}" min="1" max="120" required>
                    </div>
                    <div class="form-group">
                        <label>Gender</label>
                        <select id="profileGender" required>
                            <option value="Male" ${currentUser.gender === 'Male' ? 'selected' : ''}>Male</option>
                            <option value="Female" ${currentUser.gender === 'Female' ? 'selected' : ''}>Female</option>
                            <option value="Other" ${currentUser.gender === 'Other' ? 'selected' : ''}>Other</option>
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <label>Aadhar Number</label>
                    <input type="text" id="profileAadhar" value="${currentUser.aadhar || ''}" pattern="[0-9]{12}" required>
                </div>
                <div class="form-group">
                    <label>Address</label>
                    <textarea id="profileAddress" required>${currentUser.address || ''}</textarea>
                </div>
                <button type="submit" class="btn-primary full-width">Update Profile</button>
            </form>
        </div>
    `;
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'block';
    modal.innerHTML = profileHTML;
    document.body.appendChild(modal);
    
    // Handle profile update
    modal.querySelector('#profileUpdateForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const updatedData = {
            fullName: document.getElementById('profileFullName').value,
            email: document.getElementById('profileEmail').value,
            phone: document.getElementById('profilePhone').value,
            age: parseInt(document.getElementById('profileAge').value),
            gender: document.getElementById('profileGender').value,
            aadhar: document.getElementById('profileAadhar').value,
            address: document.getElementById('profileAddress').value
        };
        
        // Validation
        if (updatedData.phone.length !== 10) {
            showMessage('Phone number must be 10 digits!', 'error');
            return;
        }
        
        if (updatedData.aadhar.length !== 12) {
            showMessage('Aadhar number must be 12 digits!', 'error');
            return;
        }
        
        // Update user data
        Object.assign(currentUser, updatedData);
        
        const userIndex = users.findIndex(u => u.id === currentUser.id);
        users[userIndex] = currentUser;
        
        localStorage.setItem('trainGO_users', JSON.stringify(users));
        localStorage.setItem('trainGO_currentUser', JSON.stringify(currentUser));
        
        showMessage('Profile updated successfully!', 'success');
        modal.remove();
        showUserDashboard();
    });
}

// Set minimum date for travel
function setMinDate() {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const dateInput = document.getElementById('travelDate');
    if (dateInput) {
        dateInput.min = tomorrow.toISOString().split('T')[0];
    }
}

function setSearchMinDate() {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const minDate = tomorrow.toISOString().split('T')[0];
    
    const searchDate = document.getElementById('searchDate');
    const advSearchDate = document.getElementById('advSearchDate');
    
    if (searchDate) searchDate.min = minDate;
    if (advSearchDate) advSearchDate.min = minDate;
}

// Train search functions
function searchTrains(from, to, date) {
    const filteredTrains = trains.filter(train => {
        const route = train.route.toLowerCase();
        const fromLower = from.toLowerCase();
        const toLower = to.toLowerCase();
        
        // Check multiple matching criteria
        const hasFrom = train.from.toLowerCase().includes(fromLower) || route.includes(fromLower);
        const hasTo = train.to.toLowerCase().includes(toLower) || route.includes(toLower);
        
        // Check if route goes from source to destination
        const routeParts = train.route.split(' to ');
        if (routeParts.length === 2) {
            const trainFrom = routeParts[0].trim().toLowerCase();
            const trainTo = routeParts[1].trim().toLowerCase();
            const directMatch = trainFrom.includes(fromLower) && trainTo.includes(toLower);
            return directMatch || (hasFrom && hasTo);
        }
        
        return hasFrom && hasTo;
    });
    
    displaySearchResults(filteredTrains, from, to);
}

function displaySearchResults(filteredTrains, from, to) {
    const tbody = document.getElementById('trainTableBody');
    const title = document.getElementById('trainsTitle');
    const noResults = document.getElementById('noTrainsFound');
    
    if (filteredTrains.length === 0) {
        tbody.innerHTML = '';
        noResults.style.display = 'block';
        title.textContent = `No trains found from ${from} to ${to}`;
        return;
    }
    
    noResults.style.display = 'none';
    title.textContent = `Trains from ${from} to ${to} (${filteredTrains.length} found)`;
    
    tbody.innerHTML = '';
    filteredTrains.forEach(train => {
        const row = `
            <tr>
                <td><strong>${train.name}</strong><br><small>#${train.id}</small></td>
                <td>${train.route}</td>
                <td>${train.startTime}</td>
                <td>${train.arrivalTime}</td>
                <td><span class="seats-available">${train.seats}</span></td>
                <td>₹${train.price}</td>
                <td><button class="book-btn" onclick="quickBook(${train.id})">Book Now</button></td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

function clearSearch() {
    document.getElementById('fromCity').value = '';
    document.getElementById('toCity').value = '';
    document.getElementById('searchDate').value = '';
    loadTrainTable();
    document.getElementById('trainsTitle').textContent = 'All Available Trains';
    document.getElementById('noTrainsFound').style.display = 'none';
}

function sortTrains(sortBy) {
    let sortedTrains = [...trains];
    
    switch(sortBy) {
        case 'price':
            sortedTrains.sort((a, b) => a.price - b.price);
            break;
        case 'name':
            sortedTrains.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'time':
        default:
            sortedTrains.sort((a, b) => a.startTime.localeCompare(b.startTime));
            break;
    }
    
    displaySortedTrains(sortedTrains);
}

function displaySortedTrains(sortedTrains) {
    const tbody = document.getElementById('trainTableBody');
    tbody.innerHTML = '';
    
    sortedTrains.forEach(train => {
        const row = `
            <tr>
                <td><strong>${train.name}</strong><br><small>#${train.id}</small></td>
                <td>${train.route}</td>
                <td>${train.startTime}</td>
                <td>${train.arrivalTime}</td>
                <td><span class="seats-available">${train.seats}</span></td>
                <td>₹${train.price}</td>
                <td><button class="book-btn" onclick="quickBook(${train.id})">Book Now</button></td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

// Advanced search functions
function loadAdvancedTrainTable() {
    const tbody = document.getElementById('advTrainTableBody');
    tbody.innerHTML = '';
    
    trains.forEach(train => {
        const seatStatus = train.seats > 50 ? 'seats-available' : train.seats > 10 ? 'seats-limited' : 'seats-full';
        const seatText = train.seats > 50 ? 'Available' : train.seats > 10 ? 'Limited' : 'Full';
        
        const row = `
            <tr>
                <td>
                    <div class="train-info">
                        <div class="train-name">${train.name}</div>
                        <div class="train-number">#${train.id}</div>
                    </div>
                </td>
                <td>${train.route}</td>
                <td>
                    <div class="timing-info">
                        <div class="departure"><i class="fas fa-arrow-up"></i> <span class="time">${train.startTime}</span></div>
                        <div class="arrival"><i class="fas fa-arrow-down"></i> <span class="time">${train.arrivalTime}</span></div>
                    </div>
                </td>
                <td>
                    <div class="availability">
                        <span class="${seatStatus}">${train.seats} seats</span>
                        <small>${seatText}</small>
                    </div>
                </td>
                <td>
                    <div class="price-info">
                        <div class="price">₹${train.price}</div>
                        <div class="price-per-class">3rd Class</div>
                    </div>
                </td>
                <td><button class="book-btn" onclick="quickBook(${train.id})">Book Now</button></td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

function advancedSearchTrains(from, to, date, priceRange, timeFilter) {
    let filteredTrains = trains.filter(train => {
        // Route filter
        const route = train.route.toLowerCase();
        const routeParts = train.route.split(' to ');
        let routeMatch = true;
        
        if (from && to) {
            if (routeParts.length === 2) {
                const trainFrom = routeParts[0].trim().toLowerCase();
                const trainTo = routeParts[1].trim().toLowerCase();
                routeMatch = trainFrom.includes(from.toLowerCase()) && trainTo.includes(to.toLowerCase());
            } else {
                routeMatch = route.includes(from.toLowerCase()) && route.includes(to.toLowerCase());
            }
        } else if (from) {
            routeMatch = route.includes(from.toLowerCase());
        } else if (to) {
            routeMatch = route.includes(to.toLowerCase());
        }
        
        // Price filter
        let priceMatch = true;
        if (priceRange) {
            const [min, max] = priceRange.split('-').map(Number);
            priceMatch = train.price >= min && (max ? train.price <= max : true);
        }
        
        // Time filter
        let timeMatch = true;
        if (timeFilter) {
            const hour = parseInt(train.startTime.split(':')[0]);
            switch(timeFilter) {
                case 'morning': timeMatch = hour >= 6 && hour < 12; break;
                case 'afternoon': timeMatch = hour >= 12 && hour < 18; break;
                case 'evening': timeMatch = hour >= 18 && hour < 24; break;
                case 'night': timeMatch = hour >= 0 && hour < 6; break;
            }
        }
        
        return routeMatch && priceMatch && timeMatch;
    });
    
    displayAdvancedSearchResults(filteredTrains, from, to);
}

function displayAdvancedSearchResults(filteredTrains, from, to) {
    const tbody = document.getElementById('advTrainTableBody');
    const title = document.getElementById('resultsTitle');
    const noResults = document.getElementById('advNoTrainsFound');
    
    if (filteredTrains.length === 0) {
        tbody.innerHTML = '';
        noResults.style.display = 'block';
        title.textContent = from && to ? `No trains found from ${from} to ${to}` : 'No trains match your criteria';
        return;
    }
    
    noResults.style.display = 'none';
    title.textContent = from && to ? 
        `${filteredTrains.length} trains from ${from} to ${to}` : 
        `${filteredTrains.length} trains found`;
    
    tbody.innerHTML = '';
    filteredTrains.forEach(train => {
        const seatStatus = train.seats > 50 ? 'seats-available' : train.seats > 10 ? 'seats-limited' : 'seats-full';
        const seatText = train.seats > 50 ? 'Available' : train.seats > 10 ? 'Limited' : 'Full';
        
        const row = `
            <tr>
                <td>
                    <div class="train-info">
                        <div class="train-name">${train.name}</div>
                        <div class="train-number">#${train.id}</div>
                    </div>
                </td>
                <td>${train.route}</td>
                <td>
                    <div class="timing-info">
                        <div class="departure"><i class="fas fa-arrow-up"></i> <span class="time">${train.startTime}</span></div>
                        <div class="arrival"><i class="fas fa-arrow-down"></i> <span class="time">${train.arrivalTime}</span></div>
                    </div>
                </td>
                <td>
                    <div class="availability">
                        <span class="${seatStatus}">${train.seats} seats</span>
                        <small>${seatText}</small>
                    </div>
                </td>
                <td>
                    <div class="price-info">
                        <div class="price">₹${train.price}</div>
                        <div class="price-per-class">3rd Class</div>
                    </div>
                </td>
                <td><button class="book-btn" onclick="quickBook(${train.id})">Book Now</button></td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

function sortAdvancedTrains(sortBy) {
    const tbody = document.getElementById('advTrainTableBody');
    const rows = Array.from(tbody.querySelectorAll('tr'));
    
    rows.sort((a, b) => {
        switch(sortBy) {
            case 'price':
                const priceA = parseInt(a.querySelector('.price').textContent.replace('₹', ''));
                const priceB = parseInt(b.querySelector('.price').textContent.replace('₹', ''));
                return priceA - priceB;
            case 'name':
                const nameA = a.querySelector('.train-name').textContent;
                const nameB = b.querySelector('.train-name').textContent;
                return nameA.localeCompare(nameB);
            case 'time':
            default:
                const timeA = a.querySelector('.departure .time').textContent;
                const timeB = b.querySelector('.departure .time').textContent;
                return timeA.localeCompare(timeB);
        }
    });
    
    tbody.innerHTML = '';
    rows.forEach(row => tbody.appendChild(row));
}

// Seat Selection Functions
function generateSeatSelection(passengerCount) {
    const seatSelection = document.getElementById('seatSelection');
    seatSelection.style.display = 'block';
    
    const seatGrid = document.getElementById('seatGrid');
    seatGrid.innerHTML = '';
    selectedSeats = [];
    
    // Generate 40 seats (10 rows x 4 seats)
    for (let i = 1; i <= 40; i++) {
        const seatBtn = document.createElement('button');
        seatBtn.type = 'button';
        seatBtn.className = 'seat-btn';
        seatBtn.textContent = i;
        seatBtn.id = `seat-${i}`;
        seatBtn.onclick = () => toggleSeat(i, passengerCount);
        
        // Randomly make some seats booked
        if (Math.random() < 0.3) {
            seatBtn.classList.add('booked');
            seatBtn.disabled = true;
        }
        
        seatGrid.appendChild(seatBtn);
    }
    
    updateProceedButton(passengerCount);
}

function updateProceedButton(passengerCount) {
    const btn = document.getElementById('proceedPaymentBtn');
    if (btn) {
        if (selectedSeats.length === passengerCount) {
            btn.textContent = `Proceed to Payment (${selectedSeats.length}/${passengerCount} seats selected)`;
            btn.disabled = false;
        } else {
            btn.textContent = `Select ${passengerCount - selectedSeats.length} more seats`;
            btn.disabled = true;
        }
    }
}

function toggleSeat(seatNumber, maxSeats) {
    const seatBtn = document.getElementById(`seat-${seatNumber}`);
    
    if (seatBtn.classList.contains('booked')) return;
    
    if (seatBtn.classList.contains('selected')) {
        seatBtn.classList.remove('selected');
        selectedSeats = selectedSeats.filter(s => s !== seatNumber);
    } else {
        if (selectedSeats.length < maxSeats) {
            seatBtn.classList.add('selected');
            selectedSeats.push(seatNumber);
        } else {
            showMessage(`You can only select ${maxSeats} seats`, 'warning');
            return;
        }
    }
    
    updateProceedButton(maxSeats);
}

// Payment Functions
function selectPayment(method) {
    document.querySelectorAll('.payment-option').forEach(option => {
        option.classList.remove('selected');
    });
    
    event.currentTarget.classList.add('selected');
    document.getElementById(method).checked = true;
    
    const paymentDetails = document.getElementById('paymentDetails');
    paymentDetails.className = 'payment-details show';
    
    let detailsHTML = '';
    switch(method) {
        case 'upi':
            detailsHTML = `
                <h4>UPI Payment</h4>
                <input type="text" placeholder="Enter UPI ID" required>
                <p><small>You will be redirected to your UPI app</small></p>
            `;
            break;
        case 'card':
            detailsHTML = `
                <h4>Card Details</h4>
                <input type="text" placeholder="Card Number" maxlength="16" required>
                <div style="display: flex; gap: 1rem;">
                    <input type="text" placeholder="MM/YY" maxlength="5" required>
                    <input type="text" placeholder="CVV" maxlength="3" required>
                </div>
                <input type="text" placeholder="Cardholder Name" required>
            `;
            break;
        case 'netbanking':
            detailsHTML = `
                <h4>Net Banking</h4>
                <select required>
                    <option value="">Select Bank</option>
                    <option value="sbi">State Bank of India</option>
                    <option value="hdfc">HDFC Bank</option>
                    <option value="icici">ICICI Bank</option>
                    <option value="axis">Axis Bank</option>
                </select>
            `;
            break;
    }
    
    paymentDetails.innerHTML = detailsHTML;
    document.getElementById('payNowBtn').disabled = false;
}

function displayBookingSummary() {
    if (!currentBookingData) return;
    
    const { ticket, train, selectedSeats } = currentBookingData;
    const passengerList = ticket.passengers.map(p => `${p.name} (${p.age}yrs, ${p.gender})`).join('<br>');
    
    const summaryHTML = `
        <div class="summary-item">
            <strong>Train:</strong> ${train.name} (#${train.id})
        </div>
        <div class="summary-item">
            <strong>Route:</strong> ${train.route}
        </div>
        <div class="summary-item">
            <strong>Date:</strong> ${ticket.travelDate}
        </div>
        <div class="summary-item">
            <strong>Timing:</strong> ${train.startTime} - ${train.arrivalTime}
        </div>
        <div class="summary-item">
            <strong>Class:</strong> ${ticket.seatClass}
        </div>
        <div class="summary-item">
            <strong>Passengers:</strong><br>${passengerList}
        </div>
        <div class="summary-item">
            <strong>Selected Seats:</strong> ${selectedSeats.join(', ') || 'Auto-assigned'}
        </div>
        <hr>
        <div class="summary-total">
            <strong>Total Amount: ₹${ticket.totalPrice}</strong>
        </div>
    `;
    
    document.getElementById('bookingSummary').innerHTML = summaryHTML;
    document.getElementById('payAmount').textContent = ticket.totalPrice;
}

function processPayment() {
    if (!currentBookingData) return;
    
    const selectedPayment = document.querySelector('input[name="payment"]:checked');
    if (!selectedPayment) {
        showMessage('Please select a payment method', 'error');
        return;
    }
    
    // Disable pay button
    document.getElementById('payNowBtn').disabled = true;
    document.getElementById('payNowBtn').innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    
    showMessage('Processing your payment...', 'info');
    
    setTimeout(() => {
        // Add ticket to storage
        tickets.push(currentBookingData.ticket);
        
        // Update train seats
        const train = trains.find(t => t.id === currentBookingData.train.id);
        train.seats -= currentBookingData.passengerCount;
        
        localStorage.setItem('trainGO_tickets', JSON.stringify(tickets));
        localStorage.setItem('trainGO_trains', JSON.stringify(trains));
        
        showMessage(`Payment successful! Ticket ID: ${currentBookingData.ticket.id}`, 'success');
        
        // Show download notification with button
        setTimeout(() => {
            showDownloadNotification(currentBookingData.ticket);
        }, 1000);
        
        currentBookingData = null;
        loadTrainTable();
        updateUserStats();
        showPage('dashboard');
    }, 3000);
}

// Download notification
function showDownloadNotification(ticket) {
    const notificationHTML = `
        <div class="download-notification">
            <div class="notification-content">
                <i class="fas fa-check-circle"></i>
                <h3>Payment Successful!</h3>
                <p>Your ticket has been booked successfully.</p>
                <p><strong>Ticket ID:</strong> ${ticket.id}</p>
                <div class="notification-actions">
                    <button class="btn-primary" onclick="generateETicket('${ticket.id}'); closeDownloadNotification();">Download E-Ticket</button>
                    <button class="btn-secondary" onclick="closeDownloadNotification()">Later</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', notificationHTML);
}

function closeDownloadNotification() {
    const notification = document.querySelector('.download-notification');
    if (notification) {
        notification.remove();
    }
}

// E-Ticket Generation
function generateETicket(ticketId) {
    const ticket = typeof ticketId === 'string' ? tickets.find(t => t.id === ticketId) : ticketId;
    if (!ticket) {
        showMessage('Ticket not found!', 'error');
        return;
    }
    
    try {
        // Check if jsPDF is available
        if (!window.jspdf) {
            throw new Error('PDF library not loaded');
        }
        
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // Header
        doc.setFontSize(24);
        doc.setTextColor(102, 126, 234);
        doc.text('TrainGO E-Ticket', 20, 30);
        
        // Ticket details
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text(`Ticket ID: ${ticket.id}`, 20, 55);
        doc.text(`Train: ${ticket.trainName}`, 20, 70);
        doc.text(`Route: ${ticket.route}`, 20, 85);
        doc.text(`Travel Date: ${ticket.travelDate}`, 20, 100);
        doc.text(`Class: ${ticket.seatClass}`, 20, 115);
        doc.text(`Booking Date: ${ticket.bookingDate}`, 20, 130);
        doc.text(`Status: ${ticket.status}`, 20, 145);
        
        // Passenger details
        doc.text('Passengers:', 20, 165);
        let yPos = 180;
        ticket.passengers.forEach((passenger, index) => {
            doc.text(`${index + 1}. ${passenger.name} (${passenger.age}yrs, ${passenger.gender})`, 25, yPos);
            yPos += 15;
        });
        
        // Total amount
        doc.setFontSize(14);
        doc.setTextColor(255, 107, 107);
        doc.text(`Total Amount: Rs ${ticket.totalPrice}`, 20, yPos + 20);
        
        // Simple QR placeholder (since QR might be causing issues)
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        doc.rect(140, 50, 50, 50);
        doc.text('QR Code', 155, 80);
        doc.text(ticket.id, 145, 90);
        
        // Footer
        doc.setFontSize(10);
        doc.setTextColor(128, 128, 128);
        doc.text('Thank you for choosing TrainGO!', 20, 280);
        doc.text('For support: +91-139-2131234 | support@traingo.in', 20, 290);
        
        // Save PDF
        doc.save(`TrainGO-Ticket-${ticket.id}.pdf`);
        showMessage('E-ticket downloaded successfully!', 'success');
        
    } catch (error) {
        console.error('PDF generation error:', error);
        // Fallback: create a simple text file
        downloadTextTicket(ticket);
    }
}

// Fallback text download
function downloadTextTicket(ticket) {
    const ticketText = `
=== TrainGO E-Ticket ===

Ticket ID: ${ticket.id}
Train: ${ticket.trainName}
Route: ${ticket.route}
Travel Date: ${ticket.travelDate}
Class: ${ticket.seatClass}
Booking Date: ${ticket.bookingDate}
Status: ${ticket.status}

Passengers:
${ticket.passengers.map((p, i) => `${i + 1}. ${p.name} (${p.age}yrs, ${p.gender})`).join('\n')}

Total Amount: Rs ${ticket.totalPrice}

Thank you for choosing TrainGO!
For support: +91-139-2131234 | support@traingo.in
    `;
    
    const blob = new Blob([ticketText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `TrainGO-Ticket-${ticket.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showMessage('Ticket downloaded as text file!', 'success');
}

// Hero form functions
function swapRoutes() {
    const from = document.getElementById('heroFrom');
    const to = document.getElementById('heroTo');
    const temp = from.value;
    from.value = to.value;
    to.value = temp;
}

function swapCities() {
    const from = document.getElementById('heroFrom');
    const to = document.getElementById('heroTo');
    const temp = from.value;
    from.value = to.value;
    to.value = temp;
}

function searchFromHero() {
    const from = document.getElementById('heroFrom').value;
    const to = document.getElementById('heroTo').value;
    const date = document.getElementById('heroDate').value;
    
    if (!from || !to || !date) {
        showMessage('Please fill in all travel details', 'error');
        return;
    }
    
    // Improved search logic - check both exact matches and partial matches
    const filteredTrains = trains.filter(train => {
        const route = train.route.toLowerCase();
        const fromLower = from.toLowerCase();
        const toLower = to.toLowerCase();
        
        // Check if route contains both cities
        const hasFrom = train.from.toLowerCase().includes(fromLower) || route.includes(fromLower);
        const hasTo = train.to.toLowerCase().includes(toLower) || route.includes(toLower);
        
        // Also check route direction
        const routeParts = route.split(' to ');
        if (routeParts.length === 2) {
            const routeFrom = routeParts[0].trim();
            const routeTo = routeParts[1].trim();
            const directMatch = routeFrom.includes(fromLower) && routeTo.includes(toLower);
            return directMatch || (hasFrom && hasTo);
        }
        
        return hasFrom && hasTo;
    });
    
    if (filteredTrains.length > 0) {
        // Update train cards with filtered results
        const container = document.getElementById('trainCards');
        container.innerHTML = '';
        
        filteredTrains.forEach(train => {
            const card = `
                <div class="train-card">
                    <div class="train-info">
                        <div class="train-logo">${train.id.slice(-2)}</div>
                        <div class="train-details">
                            <h4 style="color: #333; margin-bottom: 5px;">${train.name}</h4>
                            <div class="train-route" style="color: #666; font-size: 14px;">${train.route}</div>
                        </div>
                    </div>
                    <div class="train-timing">
                        <div class="departure">
                            <div class="time">${train.startTime}</div>
                            <div class="date">${train.date}</div>
                            <div class="station">${train.from}</div>
                        </div>
                        <div class="duration">
                            <i class="fas fa-arrow-right"></i>
                            <div class="duration-text">${train.duration}</div>
                        </div>
                        <div class="arrival">
                            <div class="time">${train.arrivalTime}</div>
                            <div class="date">${train.date}</div>
                            <div class="station">${train.to}</div>
                        </div>
                    </div>
                    <div class="train-price">
                        <div class="price">₹${train.price}</div>
                        <div class="per-person">/person</div>
                        <div class="amenities">
                            <i class="fas fa-wifi"></i>
                            <i class="fas fa-utensils"></i>
                            <i class="fas fa-bed"></i>
                            <i class="fas fa-plane"></i>
                        </div>
                        <button class="book-btn" onclick="quickBook('${train.id}')">Book</button>
                    </div>
                </div>
            `;
            container.innerHTML += card;
        });
        
        // Update results count
        const resultsCount = document.getElementById('resultsCount');
        if (resultsCount) {
            resultsCount.textContent = `${filteredTrains.length} of ${trains.length} found`;
        }
        
        // Show results section and hide success section
        document.querySelector('.train-results-section').style.display = 'block';
        document.getElementById('successSection').style.display = 'none';
        
        // Activate first step
        document.querySelector('.step').classList.add('active');
        
        showMessage(`Found ${filteredTrains.length} trains from ${from} to ${to}`, 'success');
    } else {
        showMessage('No trains found for the selected route. Try different cities or check spelling.', 'error');
        // Show all trains if no match found
        loadTrainCards();
    }
}

function showPaymentModal() {
    if (!currentBookingData) return;
    
    const { ticket, train } = currentBookingData;
    const passengerList = ticket.passengers.map(p => `${p.name} (${p.age}yrs, ${p.gender})`).join('<br>');
    
    const modalHTML = `
        <div class="modal-content booking-modal">
            <span class="close" onclick="this.parentElement.parentElement.remove()">&times;</span>
            <div class="booking-modal-content">
                <h2><i class="fas fa-credit-card"></i> Payment Details</h2>
            
            <div class="booking-summary">
                <h3>Booking Summary</h3>
                <div class="summary-item">
                    <strong>Train:</strong> ${train.name} (#${train.id})
                </div>
                <div class="summary-item">
                    <strong>Route:</strong> ${train.route}
                </div>
                <div class="summary-item">
                    <strong>Date:</strong> ${ticket.travelDate}
                </div>
                <div class="summary-item">
                    <strong>Class:</strong> ${ticket.seatClass}
                </div>
                <div class="summary-item">
                    <strong>Passengers:</strong><br>${passengerList}
                </div>
                <hr>
                <div class="summary-total">
                    <strong>Total Amount: ₹${ticket.totalPrice}</strong>
                </div>
            </div>
            
            <div class="payment-section">
                <h3>Select Payment Method</h3>
                <div class="payment-options">
                    <div class="payment-option" onclick="selectPaymentMethod('upi')">
                        <input type="radio" name="payment" value="upi" id="upi">
                        <label for="upi">
                            <i class="fas fa-mobile-alt"></i>
                            <span>UPI Payment</span>
                        </label>
                    </div>
                    <div class="payment-option" onclick="selectPaymentMethod('card')">
                        <input type="radio" name="payment" value="card" id="card">
                        <label for="card">
                            <i class="fas fa-credit-card"></i>
                            <span>Credit/Debit Card</span>
                        </label>
                    </div>
                    <div class="payment-option" onclick="selectPaymentMethod('netbanking')">
                        <input type="radio" name="payment" value="netbanking" id="netbanking">
                        <label for="netbanking">
                            <i class="fas fa-university"></i>
                            <span>Net Banking</span>
                        </label>
                    </div>
                </div>
                
                <div id="paymentDetails" class="payment-details"></div>
                
                <button id="payNowBtn" class="btn-primary full-width" onclick="processQuickPayment()" disabled>
                    Pay ₹${ticket.totalPrice}
                </button>
            </div>
        </div>
    `;
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'block';
    modal.innerHTML = modalHTML;
    document.body.appendChild(modal);
}

function selectPaymentMethod(method) {
    document.querySelectorAll('.payment-option').forEach(option => {
        option.classList.remove('selected');
    });
    
    event.currentTarget.classList.add('selected');
    document.getElementById(method).checked = true;
    
    const paymentDetails = document.getElementById('paymentDetails');
    paymentDetails.className = 'payment-details show';
    
    let detailsHTML = '';
    switch(method) {
        case 'upi':
            detailsHTML = `
                <h4>UPI Payment</h4>
                <input type="text" placeholder="Enter UPI ID (e.g., user@paytm)" required>
                <p><small>You will be redirected to your UPI app</small></p>
            `;
            break;
        case 'card':
            detailsHTML = `
                <h4>Card Details</h4>
                <input type="text" placeholder="Card Number" maxlength="16" required>
                <div style="display: flex; gap: 1rem;">
                    <input type="text" placeholder="MM/YY" maxlength="5" required>
                    <input type="text" placeholder="CVV" maxlength="3" required>
                </div>
                <input type="text" placeholder="Cardholder Name" required>
            `;
            break;
        case 'netbanking':
            detailsHTML = `
                <h4>Net Banking</h4>
                <select required>
                    <option value="">Select Bank</option>
                    <option value="sbi">State Bank of India</option>
                    <option value="hdfc">HDFC Bank</option>
                    <option value="icici">ICICI Bank</option>
                    <option value="axis">Axis Bank</option>
                    <option value="pnb">Punjab National Bank</option>
                </select>
            `;
            break;
    }
    
    paymentDetails.innerHTML = detailsHTML;
    document.getElementById('payNowBtn').disabled = false;
}

function processQuickPayment() {
    if (!currentBookingData) return;
    
    const selectedPayment = document.querySelector('input[name="payment"]:checked');
    if (!selectedPayment) {
        showMessage('Please select a payment method', 'error');
        return;
    }
    
    // Disable pay button
    const payBtn = document.getElementById('payNowBtn');
    payBtn.disabled = true;
    payBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing Payment...';
    
    showMessage('Processing your payment...', 'info');
    
    setTimeout(() => {
        // Add ticket to storage
        tickets.push(currentBookingData.ticket);
        
        // Update train seats
        const train = trains.find(t => t.id === currentBookingData.train.id);
        train.seats -= currentBookingData.passengerCount;
        
        localStorage.setItem('trainGO_tickets', JSON.stringify(tickets));
        localStorage.setItem('trainGO_trains', JSON.stringify(trains));
        
        // Close payment modal
        document.querySelector('.modal').remove();
        
        // Show success modal
        showBookingSuccessModal(currentBookingData.ticket);
        
        currentBookingData = null;
        loadTrainCards();
        updateUserStats();
    }, 3000);
}

function showBookingSuccessModal(ticket) {
    const modalHTML = `
        <div class="modal-content booking-modal">
            <span class="close" onclick="goToHome(); this.parentElement.parentElement.remove();">&times;</span>
            <div class="booking-modal-content">
                <div class="success-content">
                    <div class="success-icon">
                        <i class="fas fa-check-circle"></i>
                    </div>
                    <h2>Booking Successful!</h2>
                    <p>Your ticket has been booked successfully.</p>
                    <div class="ticket-info">
                        <p><strong>Ticket ID:</strong> ${ticket.id}</p>
                        <p><strong>Train:</strong> ${ticket.trainName}</p>
                        <p><strong>Date:</strong> ${ticket.travelDate}</p>
                    </div>
                    <div class="success-actions">
                        <button class="btn-primary" onclick="generateETicket('${ticket.id}'); goToHome(); this.parentElement.parentElement.parentElement.parentElement.parentElement.remove();">Download E-Ticket</button>
                        <button class="btn-secondary" onclick="goToHome(); this.parentElement.parentElement.parentElement.parentElement.parentElement.remove(); searchAgain();">Search More Trains</button>
                        <button class="btn-secondary" onclick="goToHome(); this.parentElement.parentElement.parentElement.parentElement.parentElement.remove();">Go to Home</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'block';
    modal.innerHTML = modalHTML;
    document.body.appendChild(modal);
    
    showMessage(`Payment successful! Ticket ID: ${ticket.id}`, 'success');
}

function goToHome() {
    // Reset all forms and states
    document.getElementById('heroFrom').value = '';
    document.getElementById('heroTo').value = '';
    document.getElementById('heroDate').value = '';
    
    // Hide train results and show initial state
    document.querySelector('.train-results-section').style.display = 'none';
    document.getElementById('successSection').style.display = 'none';
    
    // Reset steps
    document.querySelectorAll('.step').forEach(step => step.classList.remove('active'));
    
    // Show home page
    showPage('home');
}

function searchAgain() {
    // Reset search form
    document.getElementById('heroFrom').value = '';
    document.getElementById('heroTo').value = '';
    document.getElementById('heroDate').value = '';
    
    // Show all trains
    loadTrainCards();
    
    // Reset steps
    document.querySelectorAll('.step').forEach(step => step.classList.remove('active'));
    document.querySelector('.step').classList.add('active');
    
    // Show results section
    document.querySelector('.train-results-section').style.display = 'block';
    document.getElementById('successSection').style.display = 'none';
    
    showMessage('Search for more trains!', 'info');
}

function displayTrainResults(trainList) {
    const trainsGrid = document.getElementById('trainsGrid');
    if (!trainsGrid) return;
    
    trainsGrid.innerHTML = '';
    
    trainList.forEach(train => {
        const trainCard = document.createElement('div');
        trainCard.className = 'train-result-card';
        trainCard.innerHTML = `
            <div class="train-info">
                <h3>${train.name}</h3>
                <p>${train.route}</p>
                <div class="train-timing">
                    <span>Dep: ${train.startTime}</span>
                    <span>Arr: ${train.arrivalTime}</span>
                </div>
            </div>
            <div class="train-price">
                <span class="price">₹${train.price}</span>
                <button class="book-btn" onclick="quickBook(${train.id})">Book Now</button>
            </div>
        `;
        trainsGrid.appendChild(trainCard);
    });
}

// Initialize hero form with city options
function initializeHeroForm() {
    const cities = ['New Delhi', 'Mumbai', 'Kolkata', 'Chennai', 'Hyderabad', 'Chandigarh', 'Katra', 'Dibrugarh', 'Thiruvananthapuram', 'Vasco Da Gama'];
    
    const fromInput = document.getElementById('heroFrom');
    const toInput = document.getElementById('heroTo');
    
    if (fromInput && toInput) {
        // Add datalist for autocomplete
        const datalist = document.createElement('datalist');
        datalist.id = 'cities';
        cities.forEach(city => {
            const option = document.createElement('option');
            option.value = city;
            datalist.appendChild(option);
        });
        document.body.appendChild(datalist);
        
        fromInput.setAttribute('list', 'cities');
        toInput.setAttribute('list', 'cities');
    }
}

// My Bookings functionality
function loadMyBookings() {
    const bookingsContent = document.getElementById('bookingsContent');
    if (!currentUser) {
        bookingsContent.innerHTML = `
            <div class="login-required">
                <i class="fas fa-lock"></i>
                <h3>Login Required</h3>
                <p>Please login to view your bookings</p>
                <button class="btn-primary" onclick="showLogin()">Login Now</button>
            </div>
        `;
        return;
    }
    
    const userTickets = tickets.filter(t => t.userId === currentUser.id);
    const today = new Date();
    
    const previousBookings = userTickets.filter(t => new Date(t.travelDate) < today);
    const presentBookings = userTickets.filter(t => {
        const travelDate = new Date(t.travelDate);
        return travelDate.toDateString() === today.toDateString();
    });
    const futureBookings = userTickets.filter(t => new Date(t.travelDate) > today);
    
    bookingsContent.innerHTML = `
        <div class="bookings-tabs">
            <button class="tab-btn active" onclick="showBookingTab('previous')">Previous (${previousBookings.length})</button>
            <button class="tab-btn" onclick="showBookingTab('present')">Present (${presentBookings.length})</button>
            <button class="tab-btn" onclick="showBookingTab('future')">Future (${futureBookings.length})</button>
        </div>
        <div id="bookingTabContent">
            ${renderBookingSection(previousBookings, 'previous')}
        </div>
    `;
}

function showBookingTab(type) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    const userTickets = tickets.filter(t => t.userId === currentUser.id);
    const today = new Date();
    
    let bookings = [];
    switch(type) {
        case 'previous':
            bookings = userTickets.filter(t => new Date(t.travelDate) < today);
            break;
        case 'present':
            bookings = userTickets.filter(t => {
                const travelDate = new Date(t.travelDate);
                return travelDate.toDateString() === today.toDateString();
            });
            break;
        case 'future':
            bookings = userTickets.filter(t => new Date(t.travelDate) > today);
            break;
    }
    
    document.getElementById('bookingTabContent').innerHTML = renderBookingSection(bookings, type);
}

function renderBookingSection(bookings, type) {
    if (bookings.length === 0) {
        return `
            <div class="empty-bookings">
                <i class="fas fa-ticket-alt"></i>
                <h3>No ${type} bookings</h3>
                <p>You don't have any ${type} bookings.</p>
            </div>
        `;
    }
    
    return `
        <div class="bookings-list">
            ${bookings.map(ticket => `
                <div class="booking-card ${ticket.status === 'Cancelled' ? 'cancelled' : ''}">
                    <div class="booking-header">
                        <h3>${ticket.trainName}</h3>
                        <span class="status-badge status-${ticket.status.toLowerCase()}">${ticket.status}</span>
                    </div>
                    <div class="booking-details">
                        <p><strong>Route:</strong> ${ticket.route}</p>
                        <p><strong>Date:</strong> ${ticket.travelDate}</p>
                        <p><strong>Passengers:</strong> ${ticket.passengers.length}</p>
                        <p><strong>Total:</strong> ₹${ticket.totalPrice}</p>
                    </div>
                    ${ticket.status === 'Confirmed' && type === 'future' ? `
                        <div class="booking-actions">
                            <button class="btn-primary" onclick="generateETicket('${ticket.id}')">Download</button>
                            <button class="btn-danger" onclick="cancelTicket('${ticket.id}'); loadMyBookings();">Cancel</button>
                        </div>
                    ` : ''}
                </div>
            `).join('')}
        </div>
    `;
}

// Station Services functionality
function loadStationServices() {
    // Initialize with default message
}

function searchStationServices() {
    const station = document.getElementById('stationSelect').value;
    if (!station) {
        showMessage('Please select a station', 'error');
        return;
    }
    
    const services = getStationServices(station);
    displayStationServices(services);
    showMessage(`Services loaded for ${station}`, 'success');
}

function showServiceTab(type) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    const station = document.getElementById('stationSelect').value;
    if (!station) {
        document.getElementById('servicesResults').innerHTML = '<p>Please select a station first</p>';
        return;
    }
    
    const services = getStationServices(station);
    displayServicesByType(services[type] || [], type);
}

function getStationServices(stationCode) {
    const servicesData = {
        'NDLS': {
            hotels: [
                {name: 'Hotel Ashoka', distance: '0.5 km', rating: 4.2, price: '₹3500/night'},
                {name: 'The Imperial', distance: '2.1 km', rating: 4.8, price: '₹8500/night'},
                {name: 'Hotel Tara Palace', distance: '1.2 km', rating: 3.9, price: '₹2200/night'}
            ],
            restaurants: [
                {name: 'Karim\'s', distance: '3.2 km', rating: 4.5, cuisine: 'Mughlai'},
                {name: 'Paranthe Wali Gali', distance: '4.1 km', rating: 4.3, cuisine: 'North Indian'},
                {name: 'Haldiram\'s', distance: '0.8 km', rating: 4.1, cuisine: 'Vegetarian'}
            ],
            malls: [
                {name: 'Connaught Place', distance: '2.5 km', rating: 4.4, type: 'Shopping Complex'},
                {name: 'Select City Walk', distance: '8.2 km', rating: 4.6, type: 'Mall'},
                {name: 'Khan Market', distance: '3.8 km', rating: 4.2, type: 'Market'}
            ],
            hospitals: [
                {name: 'AIIMS Delhi', distance: '6.5 km', rating: 4.7, type: 'Government'},
                {name: 'Apollo Hospital', distance: '4.2 km', rating: 4.5, type: 'Private'},
                {name: 'Safdarjung Hospital', distance: '5.1 km', rating: 4.1, type: 'Government'}
            ]
        },
        'CSTM': {
            hotels: [
                {name: 'The Taj Mahal Palace', distance: '2.1 km', rating: 4.9, price: '₹15000/night'},
                {name: 'Hotel Suba Palace', distance: '0.8 km', rating: 4.0, price: '₹4500/night'},
                {name: 'Sea Green Hotel', distance: '1.5 km', rating: 3.8, price: '₹3200/night'}
            ],
            restaurants: [
                {name: 'Leopold Cafe', distance: '2.3 km', rating: 4.2, cuisine: 'Continental'},
                {name: 'Trishna', distance: '1.8 km', rating: 4.6, cuisine: 'Seafood'},
                {name: 'Britannia & Co.', distance: '2.5 km', rating: 4.4, cuisine: 'Parsi'}
            ],
            malls: [
                {name: 'Phoenix Mills', distance: '8.5 km', rating: 4.5, type: 'Mall'},
                {name: 'Palladium Mall', distance: '6.2 km', rating: 4.3, type: 'Mall'},
                {name: 'Crawford Market', distance: '1.2 km', rating: 4.0, type: 'Market'}
            ],
            hospitals: [
                {name: 'JJ Hospital', distance: '2.8 km', rating: 4.2, type: 'Government'},
                {name: 'Breach Candy Hospital', distance: '4.5 km', rating: 4.6, type: 'Private'},
                {name: 'KEM Hospital', distance: '3.2 km', rating: 4.1, type: 'Government'}
            ]
        }
    };
    
    return servicesData[stationCode] || {
        hotels: [{name: 'Hotel Example', distance: '1.0 km', rating: 4.0, price: '₹2500/night'}],
        restaurants: [{name: 'Restaurant Example', distance: '0.5 km', rating: 4.0, cuisine: 'Multi-cuisine'}],
        malls: [{name: 'Shopping Center', distance: '2.0 km', rating: 4.0, type: 'Mall'}],
        hospitals: [{name: 'City Hospital', distance: '1.5 km', rating: 4.0, type: 'Private'}]
    };
}

function displayStationServices(services) {
    displayServicesByType(services.hotels, 'hotels');
}

function displayServicesByType(serviceList, type) {
    const resultsDiv = document.getElementById('servicesResults');
    const icon = {
        hotels: 'fas fa-bed',
        restaurants: 'fas fa-utensils',
        malls: 'fas fa-shopping-bag',
        hospitals: 'fas fa-hospital'
    };
    
    resultsDiv.innerHTML = `
        <div class="services-grid">
            ${serviceList.map(service => `
                <div class="service-card">
                    <div class="service-header">
                        <i class="${icon[type]}"></i>
                        <h3>${service.name}</h3>
                    </div>
                    <div class="service-details">
                        <p><i class="fas fa-map-marker-alt"></i> ${service.distance}</p>
                        <p><i class="fas fa-star"></i> ${service.rating}/5</p>
                        ${service.price ? `<p><i class="fas fa-rupee-sign"></i> ${service.price}</p>` : ''}
                        ${service.cuisine ? `<p><i class="fas fa-utensils"></i> ${service.cuisine}</p>` : ''}
                        ${service.type ? `<p><i class="fas fa-info-circle"></i> ${service.type}</p>` : ''}
                    </div>
                    <button class="btn-primary" onclick="getDirections('${service.name}')">Get Directions</button>
                </div>
            `).join('')}
        </div>
    `;
}

function getDirections(serviceName) {
    showMessage(`Opening directions to ${serviceName}...`, 'info');
    // In a real app, this would open Google Maps or similar
}

// Food Ordering functionality
function loadFoodOrdering() {
    // Initialize with default message
}

function searchFoodOptions() {
    const trainNumber = document.getElementById('trainNumber').value;
    const stationCode = document.getElementById('stationCode').value;
    
    if (!trainNumber || !stationCode) {
        showMessage('Please enter train number and station code', 'error');
        return;
    }
    
    const foodMenu = getFoodMenu();
    displayFoodMenu(foodMenu.veg);
    showMessage(`Food menu loaded for Train ${trainNumber} at ${stationCode}`, 'success');
}

function showFoodCategory(category) {
    document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    const foodMenu = getFoodMenu();
    displayFoodMenu(foodMenu[category] || []);
}

function getFoodMenu() {
    return {
        veg: [
            {id: 1, name: 'Veg Thali', price: 120, description: 'Complete vegetarian meal with rice, dal, vegetables'},
            {id: 2, name: 'Paneer Butter Masala', price: 150, description: 'Rich paneer curry with butter naan'},
            {id: 3, name: 'Chole Bhature', price: 100, description: 'Spicy chickpeas with fried bread'},
            {id: 4, name: 'Veg Biryani', price: 130, description: 'Aromatic rice with mixed vegetables'}
        ],
        nonveg: [
            {id: 5, name: 'Chicken Curry', price: 180, description: 'Spicy chicken curry with rice'},
            {id: 6, name: 'Mutton Biryani', price: 220, description: 'Fragrant rice with tender mutton pieces'},
            {id: 7, name: 'Fish Fry', price: 160, description: 'Crispy fried fish with lemon'},
            {id: 8, name: 'Egg Curry', price: 140, description: 'Boiled eggs in spicy gravy'}
        ],
        snacks: [
            {id: 9, name: 'Samosa', price: 20, description: 'Crispy fried pastry with potato filling'},
            {id: 10, name: 'Sandwich', price: 60, description: 'Grilled vegetable sandwich'},
            {id: 11, name: 'Pakora', price: 40, description: 'Mixed vegetable fritters'},
            {id: 12, name: 'Dhokla', price: 50, description: 'Steamed gram flour cake'}
        ],
        beverages: [
            {id: 13, name: 'Tea', price: 15, description: 'Hot Indian tea'},
            {id: 14, name: 'Coffee', price: 20, description: 'Fresh brewed coffee'},
            {id: 15, name: 'Cold Drink', price: 25, description: 'Chilled soft drink'},
            {id: 16, name: 'Fresh Juice', price: 35, description: 'Seasonal fruit juice'}
        ]
    };
}

let cart = [];

function displayFoodMenu(menuItems) {
    const menuDiv = document.getElementById('foodMenu');
    
    menuDiv.innerHTML = `
        <div class="food-grid">
            ${menuItems.map(item => `
                <div class="food-item">
                    <div class="food-details">
                        <h3>${item.name}</h3>
                        <p>${item.description}</p>
                        <div class="food-price">₹${item.price}</div>
                    </div>
                    <button class="btn-primary" onclick="addToCart(${item.id}, '${item.name}', ${item.price})">Add to Cart</button>
                </div>
            `).join('')}
        </div>
    `;
}

function addToCart(id, name, price) {
    const existingItem = cart.find(item => item.id === id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({id, name, price, quantity: 1});
    }
    
    updateCartDisplay();
    showMessage(`${name} added to cart`, 'success');
}

function updateCartDisplay() {
    const cartSection = document.getElementById('cartSection');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    if (cart.length === 0) {
        cartSection.style.display = 'none';
        return;
    }
    
    cartSection.style.display = 'block';
    
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <span>${item.name}</span>
            <div class="quantity-controls">
                <button onclick="updateQuantity(${item.id}, -1)">-</button>
                <span>${item.quantity}</span>
                <button onclick="updateQuantity(${item.id}, 1)">+</button>
            </div>
            <span>₹${item.price * item.quantity}</span>
            <button onclick="removeFromCart(${item.id})" class="remove-btn">×</button>
        </div>
    `).join('');
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = total;
}

function updateQuantity(id, change) {
    const item = cart.find(item => item.id === id);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(id);
        } else {
            updateCartDisplay();
        }
    }
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCartDisplay();
}

function placeOrder() {
    if (cart.length === 0) {
        showMessage('Your cart is empty', 'error');
        return;
    }
    
    if (!currentUser) {
        showMessage('Please login to place order', 'error');
        showLogin();
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const trainNumber = document.getElementById('trainNumber').value;
    const stationCode = document.getElementById('stationCode').value;
    
    const order = {
        id: 'ORD' + Date.now(),
        userId: currentUser.id,
        trainNumber,
        stationCode,
        items: [...cart],
        total,
        status: 'Confirmed',
        orderDate: new Date().toISOString().split('T')[0]
    };
    
    // Store order (in real app, this would go to backend)
    let orders = JSON.parse(localStorage.getItem('trainGO_orders')) || [];
    orders.push(order);
    localStorage.setItem('trainGO_orders', JSON.stringify(orders));
    
    cart = [];
    updateCartDisplay();
    
    showMessage(`Order placed successfully! Order ID: ${order.id}. Food will be delivered at ${stationCode} station.`, 'success');
}

// Show blog modal for filtered posts
function showBlogModal(title, content, date, image) {
    document.body.classList.add('modal-open');
    
    const modalHTML = `
        <div class="modal-content large">
            <span class="close" onclick="closeBlogModal(this)">&times;</span>
            <div class="blog-full-content">
                <img src="${image}" alt="${title}" style="width: 100%; height: 300px; object-fit: cover; border-radius: 10px; margin-bottom: 20px;">
                <h2 style="color: #333; margin-bottom: 10px;">${title}</h2>
                <p style="color: #666; margin-bottom: 20px; font-size: 14px;"><i class="fas fa-calendar"></i> ${date}</p>
                <div style="color: #333; line-height: 1.8; font-size: 16px;">${content}</div>
            </div>
        </div>
    `;
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'block';
    modal.innerHTML = modalHTML;
    document.body.appendChild(modal);
}

function closeBlogModal(element) {
    document.body.classList.remove('modal-open');
    element.parentElement.parentElement.remove();
}

// Close modals when clicking outside
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        document.body.classList.remove('modal-open');
        event.target.style.display = 'none';
    }
}

// Add CSS for train result cards
function addTrainResultStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .trains-results {
            padding: 40px 0;
            background: #111;
        }
        
        .trains-grid {
            display: grid;
            gap: 20px;
        }
        
        .train-result-card {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 10px;
            padding: 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            transition: transform 0.3s;
        }
        
        .train-result-card:hover {
            transform: translateY(-2px);
        }
        
        .train-info h3 {
            margin-bottom: 5px;
            color: #ff4500;
        }
        
        .train-info p {
            color: #ccc;
            margin-bottom: 10px;
        }
        
        .train-timing {
            display: flex;
            gap: 20px;
            font-size: 14px;
            color: #aaa;
        }
        
        .train-price {
            text-align: right;
        }
        
        .price {
            font-size: 24px;
            font-weight: 600;
            color: #ff4500;
            display: block;
            margin-bottom: 10px;
        }
        
        .book-btn {
            background: #ff4500;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            font-weight: 500;
        }
        
        .book-btn:hover {
            background: #e63900;
        }
    `;
    document.head.appendChild(style);
}

// Call this function when the page loads
addTrainResultStyles();