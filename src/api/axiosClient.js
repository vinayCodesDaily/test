import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const BASE_PATH = import.meta.env.VITE_API_BASE_PATH || '/api/v1';

const axiosClient = axios.create({
    baseURL: `${API_URL}${BASE_PATH}`,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Setup mock database in localStorage if not exists
const initMockDB = () => {
    if (!localStorage.getItem('mock_packages')) {
        const defaultPackages = [
            {
                id: 1,
                name: 'Kashmir Paradise Tour',
                description: 'Experience the heaven on earth with Srinagar, Gulmarg, and Pahalgam sightseeing, shikhara ride and snow-clad peaks.',
                base_price: 18500,
                duration_days: 5,
                image_url: 'https://images.unsplash.com/photo-1566837497312-7be4743b5a03?auto=format&fit=crop&w=600&q=80',
                destinations: [{ id: 1, name: 'Srinagar' }, { id: 2, name: 'Gulmarg' }],
                status: 'active',
                itinerary: [
                    { day: 1, title: 'Arrival in Srinagar & Shikara Ride', description: 'Check into house-boat, evening Shikara ride on Dal Lake.' },
                    { day: 2, title: 'Srinagar Sightseeing', description: 'Visit Shalimar and Nishat Mughal Gardens.' },
                    { day: 3, title: 'Excursion to Gulmarg', description: 'Enjoy Gondola ride and snow activities.' },
                    { day: 4, title: 'Excursion to Pahalgam', description: 'Visit Betaab valley and local markets.' },
                    { day: 5, title: 'Departure', description: 'Transfer to airport for flight back home.' }
                ]
            },
            {
                id: 2,
                name: 'Goa Coastal Escapade',
                description: 'Sun, sand, and serenity. Enjoy water sports in North Goa and historic church visits in South Goa with premium resort stay.',
                base_price: 12000,
                duration_days: 4,
                image_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
                destinations: [{ id: 3, name: 'North Goa' }, { id: 4, name: 'South Goa' }],
                status: 'active',
                itinerary: [
                    { day: 1, title: 'Arrival & Beach Sunset', description: 'Check in, relax, evening stroll at Calangute beach.' },
                    { day: 2, title: 'North Goa Forts & Water Sports', description: 'Visit Aguada Fort, Baga beach water sports.' },
                    { day: 3, title: 'South Goa Heritage Tour', description: 'Visit Basilica of Bom Jesus, Mangueshi temple, spice plantation.' },
                    { day: 4, title: 'Departure', description: 'Transfer to airport/railway station.' }
                ]
            },
            {
                id: 3,
                name: 'Kerala Backwaters & Hills',
                description: 'A perfect blend of Munnar hill stations and the calm backwaters of Alleppey in a premium traditional houseboat.',
                base_price: 22000,
                duration_days: 6,
                image_url: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=600&q=80',
                destinations: [{ id: 5, name: 'Munnar' }, { id: 6, name: 'Alleppey' }],
                status: 'active',
                itinerary: [
                    { day: 1, title: 'Cochin to Munnar', description: 'Scenic drive through tea gardens and waterfalls.' },
                    { day: 2, title: 'Munnar Hill Sightseeing', description: 'Visit Eravikulam National Park and Mattupetty Dam.' },
                    { day: 3, title: 'Munnar to Thekkady', description: 'Wildlife sanctuary boating and spice tour.' },
                    { day: 4, title: 'Thekkady to Alleppey Houseboat', description: 'Board traditional houseboat, cruise along canals.' },
                    { day: 5, title: 'Houseboat Cruise & Kochi Transfer', description: 'Sightseeing in historic Fort Kochi.' },
                    { day: 6, title: 'Departure', description: 'Airport drop-off.' }
                ]
            },
            {
                id: 4,
                name: 'Leh Ladakh Highway Adventure',
                description: 'An ultimate road trip experience visiting Pangong Lake, Nubra Valley, Khardung La Pass (highest motorable road).',
                base_price: 35000,
                duration_days: 7,
                image_url: 'https://images.unsplash.com/photo-1544161513-0179fe746fd5?auto=format&fit=crop&w=600&q=80',
                destinations: [{ id: 7, name: 'Leh' }, { id: 8, name: 'Nubra Valley' }],
                status: 'active',
                itinerary: [
                    { day: 1, title: 'Arrival in Leh', description: 'Acclimatization day with light local sightseeing.' },
                    { day: 2, title: 'Leh Monasteries & Hall of Fame', description: 'Visit Thiksey monastery and war memorial.' },
                    { day: 3, title: 'Leh to Nubra Valley via Khardung La', description: 'Drive over 17,580 feet pass, Sand dunes camel safari.' },
                    { day: 4, title: 'Nubra Valley to Pangong Lake', description: 'Drive along Shyok river to the breathtaking blue lake.' },
                    { day: 5, title: 'Pangong to Leh', description: 'Drive back via Chang La Pass.' },
                    { day: 6, title: 'Leh Local Exploration', description: 'Shopping and leisure day in Leh market.' },
                    { day: 7, title: 'Departure', description: 'Early morning airport transfer.' }
                ]
            }
        ];
        localStorage.setItem('mock_packages', JSON.stringify(defaultPackages));
    }

    if (!localStorage.getItem('mock_bookings')) {
        const defaultBookings = [
            {
                id: 101,
                package_id: 1,
                package_name: 'Kashmir Paradise Tour',
                travel_date: '2026-06-15',
                number_of_travelers: 2,
                status: 'confirmed',
                total_price: 37000,
                special_requests: 'Require vegetarian meals only.',
                hotel_tier: 'Premium Resor',
                flight_details: 'Included (Air India AI-825)',
                user_id: 4,
                user_name: 'Rahul Sharma',
                user_email: 'customer@travel.com',
                payment_status: 'paid'
            },
            {
                id: 102,
                package_id: 2,
                package_name: 'Goa Coastal Escapade',
                travel_date: '2026-07-20',
                number_of_travelers: 4,
                status: 'pending',
                total_price: 48000,
                special_requests: 'Need room adjacent to pool.',
                hotel_tier: 'Deluxe Hotel',
                flight_details: 'Not Selected',
                user_id: 4,
                user_name: 'Rahul Sharma',
                user_email: 'customer@travel.com',
                payment_status: 'pending'
            }
        ];
        localStorage.setItem('mock_bookings', JSON.stringify(defaultBookings));
    }

    if (!localStorage.getItem('mock_trip_types')) {
        const defaultTripTypes = [
            { id: 1, name: 'Adventure', icon: '🧗', description: 'Thrilling outdoor itineraries with hiking, rafting, and mountain exploration.' },
            { id: 2, name: 'Relaxation', icon: '🌴', description: 'Calm, resort-style getaways with spa, beaches, and leisure stays.' },
            { id: 3, name: 'Cultural', icon: '🏛️', description: 'Heritage tours and immersive local experiences across India.' },
            { id: 4, name: 'Family', icon: '👨‍👩‍👧‍👦', description: 'Kid-friendly packages with comfort, convenience and sightseeing.' },
            { id: 5, name: 'Romantic', icon: '❤️', description: 'Couples-focused escapes with private stays and scenic experiences.' }
        ];
        localStorage.setItem('mock_trip_types', JSON.stringify(defaultTripTypes));
    }

    if (!localStorage.getItem('mock_destinations')) {
        const defaultDestinations = [
            { id: 1, name: 'Srinagar', image_url: 'https://images.unsplash.com/photo-1541919329513-f6f2d7470b44?auto=format&fit=crop&w=900&q=80', description: 'Houseboats, Mughal gardens and serene Dal Lake.' },
            { id: 2, name: 'Gulmarg', image_url: 'https://images.unsplash.com/photo-1501973801540-537f08ccae7c?auto=format&fit=crop&w=900&q=80', description: 'Snow-clad slopes, meadow hikes and gondola rides.' },
            { id: 3, name: 'North Goa', image_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80', description: 'Vibrant beaches and water sports.' }
        ];
        localStorage.setItem('mock_destinations', JSON.stringify(defaultDestinations));
    }

    if (!localStorage.getItem('mock_gallery')) {
        const defaultGallery = [
            { id: 1, image_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80', caption: 'Sunset Beach' },
            { id: 2, image_url: 'https://images.unsplash.com/photo-1544161513-0179fe746fd5?auto=format&fit=crop&w=900&q=80', caption: 'Mountain Road' }
        ];
        localStorage.setItem('mock_gallery', JSON.stringify(defaultGallery));
    }

    if (!localStorage.getItem('mock_recommendations')) {
        const defaultRecs = [
            { id: 1, month: 'June', title: 'Monsoon Magic - Coorg & Wayanad' },
            { id: 2, month: 'December', title: 'Winter Wonders - Himachal' }
        ];
        localStorage.setItem('mock_recommendations', JSON.stringify(defaultRecs));
    }

    if (!localStorage.getItem('mock_about')) {
        const defaultAbout = {
            heading: 'We Are VoyageWay',
            content: 'Founded in 2018, VoyageWay is a premium travel platform connecting passionate explorers with extraordinary destinations.',
            achievements: [],
            images: []
        };
        localStorage.setItem('mock_about', JSON.stringify(defaultAbout));
    }

    if (!localStorage.getItem('mock_inquiries')) {
        const defaultInquiries = [
            {
                id: 201,
                name: 'Anjali Desai',
                email: 'anjali@example.com',
                phone: '+91 98765 43210',
                message: 'Looking to book a customized honeymoon tour to Kashmir in mid-July. Please share availability.',
                status: 'pending',
                assigned_to: null,
                assigned_name: 'Unassigned',
                created_at: '2026-05-30T10:15:00Z'
            },
            {
                id: 202,
                name: 'Vikram Malhotra',
                email: 'vikram@example.com',
                phone: '+91 91234 56789',
                message: 'Requesting a corporate retreat package for 25 people in Goa.',
                status: 'in_progress',
                assigned_to: 3,
                assigned_name: 'Amit Kumar (Consultant)',
                created_at: '2026-05-29T14:30:00Z'
            }
        ];
        localStorage.setItem('mock_inquiries', JSON.stringify(defaultInquiries));
    }

    if (!localStorage.getItem('mock_blogs')) {
        const defaultBlogs = [
            {
                id: 1,
                title: 'Top 5 Hidden Gems in Kashmir You Must Visit',
                slug: 'hidden-gems-kashmir',
                summary: 'Beyond Srinagar and Gulmarg lie untouched valleys that will steal your heart. Discover Gurez, Lolab, and more.',
                content: 'Kashmir is famous for its gorgeous lakes and popular tourist sights. However, the real soul of the valley lies in its offbeat destinations. Places like Gurez Valley, which remains cut off for half the year, offer breathtaking pine forests and wooden houses alongside the pristine Kishanganga river. Another gem is the Lolab Valley, characterized by its lush green meadows and fruit orchards. Visiting these places gives you an authentic feel of local Kashmiri culture, far away from commercial crowd paths.',
                image_url: 'https://images.unsplash.com/photo-1566837497312-7be4743b5a03?auto=format&fit=crop&w=600&q=80',
                published_at: 'May 15, 2026',
                author: 'Saniya Mir'
            },
            {
                id: 2,
                title: 'A Local\'s Guide to Goa Beyond Beaches',
                slug: 'goa-beyond-beaches',
                summary: 'Explore spice plantations, Portuguese heritage homes, and gorgeous waterfalls in the Western Ghats.',
                content: 'Goa is synonymous with beaches, parties, and shacks. But if you head inland, you will discover a completely different Goa. The historic Old Goa churches, like the Basilica of Bom Jesus, showcase spectacular Baroque architecture. The spice plantations of Ponda offer a fascinating aromatic tour topped with a traditional Goan buffet. If you love nature, trekking to the Dudhsagar Falls during or after monsoons is an experience of a lifetime.',
                image_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
                published_at: 'May 22, 2026',
                author: 'Joy D\'Souza'
            }
        ];
        localStorage.setItem('mock_blogs', JSON.stringify(defaultBlogs));
    }

    if (!localStorage.getItem('mock_testimonials')) {
        const defaultTestimonials = [
            {
                id: 1,
                name: 'Suresh Raina',
                rating: 5,
                feedback: 'Our family tour to Kashmir was organized flawlessly. The houseboat stay and the vehicle provided were top-notch. Highly recommended!',
                status: 'approved'
            },
            {
                id: 2,
                name: 'Meera Nair',
                rating: 5,
                feedback: 'The Kerala Backwaters package was an absolute dream. Everything from Munnar tea plantations to the Alleppey houseboat was well-curated.',
                status: 'approved'
            }
        ];
        localStorage.setItem('mock_testimonials', JSON.stringify(defaultTestimonials));
    }
};

initMockDB();

// A simple local router/mock engine
const handleMockRequest = async (config) => {
    const { method, url, data } = config;
    const cleanUrl = url.replace(BASE_PATH, '').split('?')[0];

    // Parse JSON data if needed
    let parsedData = data;
    if (typeof data === 'string') {
        try { parsedData = JSON.parse(data); } catch { /* ignore */ }
    }

    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    await delay(300); // simulate network delay

    // 1. Auth Endpoint Mocks
    if (cleanUrl === '/auth/login') {
        const { email } = parsedData || {};
        let role = { id: 4, name: 'Customer' };
        let name = 'Rahul Sharma';

        if (email.includes('admin')) {
            role = { id: 1, name: 'Super Admin' };
            name = 'Aditya Sen (Admin)';
        } else if (email.includes('manager')) {
            role = { id: 2, name: 'Manager' };
            name = 'Priya Patel (Manager)';
        } else if (email.includes('consultant')) {
            role = { id: 3, name: 'Consultant' };
            name = 'Amit Kumar (Consultant)';
        }

        const userObj = {
            id: role.id === 1 ? 1 : role.id === 2 ? 2 : role.id === 3 ? 3 : 4,
            name,
            email,
            role,
            created_at: '2026-01-10T12:00:00Z'
        };

        return {
            status: 200,
            data: {
                success: true,
                message: 'Logged in successfully',
                data: {
                    user: userObj,
                    token: `mock_jwt_token_for_${role.name.replace(' ', '_')}`
                }
            }
        };
    }

    if (cleanUrl === '/auth/register') {
        const { name, email } = parsedData || {};
        const userObj = {
            id: 10 + Math.floor(Math.random() * 100),
            name: name || 'New Traveler',
            email: email || 'traveler@example.com',
            role: { id: 4, name: 'Customer' },
            created_at: new Date().toISOString()
        };
        return {
            status: 200,
            data: {
                success: true,
                message: 'Registered successfully',
                data: { user: userObj }
            }
        };
    }

    if (cleanUrl === '/auth/profile') {
        const token = Cookies.get('auth_token') || '';
        let roleName = 'Customer';
        let name = 'Rahul Sharma';
        let email = 'customer@travel.com';
        let id = 4;

        if (token.includes('Super_Admin')) {
            roleName = 'Super Admin';
            name = 'Aditya Sen (Admin)';
            email = 'admin@travel.com';
            id = 1;
        } else if (token.includes('Manager')) {
            roleName = 'Manager';
            name = 'Priya Patel (Manager)';
            email = 'manager@travel.com';
            id = 2;
        } else if (token.includes('Consultant')) {
            roleName = 'Consultant';
            name = 'Amit Kumar (Consultant)';
            email = 'consultant@travel.com';
            id = 3;
        }

        if (method.toUpperCase() === 'PUT') {
            const updateData = parsedData || {};
            return {
                status: 200,
                data: {
                    success: true,
                    message: 'Profile updated successfully',
                    data: {
                        user: { id, name: updateData.name || name, email: updateData.email || email, role: { name: roleName }, updated: true }
                    }
                }
            };
        }

        return {
            status: 200,
            data: {
                success: true,
                data: {
                    user: { id, name, email, role: { name: roleName } }
                }
            }
        };
    }

    if (cleanUrl === '/auth/logout') {
        return {
            status: 200,
            data: { success: true, message: 'Logged out successfully' }
        };
    }

    if (cleanUrl === '/auth/change-password') {
        return {
            status: 200,
            data: { success: true, message: 'Password changed successfully' }
        };
    }

    // 2. Packages Endpoint Mocks
    if (cleanUrl === '/packages') {
        const pkgs = JSON.parse(localStorage.getItem('mock_packages') || '[]');
        if (method.toUpperCase() === 'POST') {
            const newPkg = {
                id: pkgs.length + 1,
                ...parsedData,
                status: 'active',
                itinerary: parsedData.itinerary || [
                    { day: 1, title: 'Welcome', description: 'Initial arrival and checking in.' }
                ]
            };
            pkgs.push(newPkg);
            localStorage.setItem('mock_packages', JSON.stringify(pkgs));
            return {
                status: 200,
                data: { success: true, data: newPkg, message: 'Package created successfully' }
            };
        }
        return {
            status: 200,
            data: { success: true, data: pkgs }
        };
    }

    if (cleanUrl.startsWith('/packages/')) {
        const parts = cleanUrl.split('/');
        const id = parseInt(parts[2]);
        const pkgs = JSON.parse(localStorage.getItem('mock_packages') || '[]');
        const index = pkgs.findIndex(p => p.id === id);

        if (method.toUpperCase() === 'PUT') {
            if (index !== -1) {
                pkgs[index] = { ...pkgs[index], ...parsedData };
                localStorage.setItem('mock_packages', JSON.stringify(pkgs));
                return { status: 200, data: { success: true, data: pkgs[index], message: 'Package updated' } };
            }
        }

        if (method.toUpperCase() === 'DELETE') {
            if (index !== -1) {
                pkgs.splice(index, 1);
                localStorage.setItem('mock_packages', JSON.stringify(pkgs));
                return { status: 200, data: { success: true, message: 'Package deleted' } };
            }
        }

        const pkg = pkgs.find(p => p.id === id);
        if (pkg) {
            return {
                status: 200,
                data: { success: true, data: pkg }
            };
        }
        return { status: 404, data: { success: false, message: 'Package not found' } };
    }

    if (cleanUrl === '/destinations') {
        const list = JSON.parse(localStorage.getItem('mock_destinations') || '[]');
        if (method.toUpperCase() === 'POST') {
            const newItem = { id: list.length + 1, ...parsedData };
            list.push(newItem);
            localStorage.setItem('mock_destinations', JSON.stringify(list));
            return { status: 200, data: { success: true, data: newItem, message: 'Destination created' } };
        }
        return { status: 200, data: { success: true, data: list } };
    }

    if (cleanUrl === '/trip-types') {
        const list = JSON.parse(localStorage.getItem('mock_trip_types') || '[]');
        if (method.toUpperCase() === 'POST') {
            const newItem = { id: list.length + 1, ...parsedData };
            list.push(newItem);
            localStorage.setItem('mock_trip_types', JSON.stringify(list));
            return { status: 200, data: { success: true, data: newItem, message: 'Trip type created' } };
        }
        return { status: 200, data: { success: true, data: { trip_types: list } } };
    }

    // Trip type single item operations
    if (cleanUrl.startsWith('/trip-types/')) {
        const id = parseInt(cleanUrl.split('/')[2]);
        const list = JSON.parse(localStorage.getItem('mock_trip_types') || '[]');
        const idx = list.findIndex(t => t.id === id);
        if (method.toUpperCase() === 'PUT' && idx !== -1) {
            list[idx] = { ...list[idx], ...parsedData };
            localStorage.setItem('mock_trip_types', JSON.stringify(list));
            return { status: 200, data: { success: true, data: list[idx], message: 'Trip type updated' } };
        }
        if (method.toUpperCase() === 'DELETE' && idx !== -1) {
            list.splice(idx, 1);
            localStorage.setItem('mock_trip_types', JSON.stringify(list));
            return { status: 200, data: { success: true, message: 'Trip type deleted' } };
        }
        const item = list.find(t => t.id === id);
        if (item) return { status: 200, data: { success: true, data: item } };
    }

    // Destination single item operations
    if (cleanUrl.startsWith('/destinations/')) {
        const id = parseInt(cleanUrl.split('/')[2]);
        const list = JSON.parse(localStorage.getItem('mock_destinations') || '[]');
        const idx = list.findIndex(t => t.id === id);
        if (method.toUpperCase() === 'PUT' && idx !== -1) {
            list[idx] = { ...list[idx], ...parsedData };
            localStorage.setItem('mock_destinations', JSON.stringify(list));
            return { status: 200, data: { success: true, data: list[idx], message: 'Destination updated' } };
        }
        if (method.toUpperCase() === 'DELETE' && idx !== -1) {
            list.splice(idx, 1);
            localStorage.setItem('mock_destinations', JSON.stringify(list));
            return { status: 200, data: { success: true, message: 'Destination deleted' } };
        }
        const item = list.find(t => t.id === id);
        if (item) return { status: 200, data: { success: true, data: item } };
    }

    // Gallery endpoints
    if (cleanUrl === '/gallery') {
        const gallery = JSON.parse(localStorage.getItem('mock_gallery') || '[]');
        if (method.toUpperCase() === 'POST') {
            const newItem = { id: gallery.length + 1, ...parsedData };
            gallery.push(newItem);
            localStorage.setItem('mock_gallery', JSON.stringify(gallery));
            return { status: 200, data: { success: true, data: newItem, message: 'Gallery item added' } };
        }
        return { status: 200, data: { success: true, data: gallery } };
    }

    if (cleanUrl.startsWith('/gallery/')) {
        const id = parseInt(cleanUrl.split('/')[2]);
        const gallery = JSON.parse(localStorage.getItem('mock_gallery') || '[]');
        const idx = gallery.findIndex(g => g.id === id);
        if (method.toUpperCase() === 'DELETE' && idx !== -1) {
            gallery.splice(idx, 1);
            localStorage.setItem('mock_gallery', JSON.stringify(gallery));
            return { status: 200, data: { success: true, message: 'Gallery item deleted' } };
        }
        const item = gallery.find(g => g.id === id);
        if (item) return { status: 200, data: { success: true, data: item } };
    }

    // Recommendations
    if (cleanUrl === '/recommendations') {
        const recs = JSON.parse(localStorage.getItem('mock_recommendations') || '[]');
        if (method.toUpperCase() === 'POST') {
            const newItem = { id: recs.length + 1, ...parsedData };
            recs.push(newItem);
            localStorage.setItem('mock_recommendations', JSON.stringify(recs));
            return { status: 200, data: { success: true, data: newItem, message: 'Recommendation added' } };
        }
        if (method.toUpperCase() === 'PUT') {
            // replace entire set
            localStorage.setItem('mock_recommendations', JSON.stringify(parsedData || []));
            return { status: 200, data: { success: true, data: parsedData, message: 'Recommendations updated' } };
        }
        return { status: 200, data: { success: true, data: recs } };
    }

    // About content
    if (cleanUrl === '/about') {
        const about = JSON.parse(localStorage.getItem('mock_about') || '{}');
        if (method.toUpperCase() === 'PUT') {
            const updated = { ...about, ...parsedData };
            localStorage.setItem('mock_about', JSON.stringify(updated));
            return { status: 200, data: { success: true, data: updated, message: 'About page updated' } };
        }
        return { status: 200, data: { success: true, data: about } };
    }

    // 3. Bookings Endpoint Mocks
    if (cleanUrl === '/bookings') {
        const bookings = JSON.parse(localStorage.getItem('mock_bookings') || '[]');
        if (method.toUpperCase() === 'POST') {
            const pkgs = JSON.parse(localStorage.getItem('mock_packages') || '[]');
            const parentPkg = pkgs.find(p => p.id === parsedData.package_id) || { name: 'Custom Tour', base_price: 15000 };

            const newBooking = {
                id: bookings.length + 101,
                package_id: parsedData.package_id,
                package_name: parentPkg.name,
                travel_date: parsedData.travel_date,
                number_of_travelers: parsedData.number_of_travelers || 1,
                status: 'pending',
                total_price: parentPkg.base_price * (parsedData.number_of_travelers || 1),
                special_requests: parsedData.special_requests || '',
                hotel_tier: parsedData.hotel_id || 'Standard Hotel',
                flight_details: parsedData.flight_id ? 'Added Flight' : 'Not Selected',
                user_id: 4,
                user_name: 'Rahul Sharma',
                user_email: 'customer@travel.com',
                payment_status: 'pending'
            };
            bookings.push(newBooking);
            localStorage.setItem('mock_bookings', JSON.stringify(bookings));
            return {
                status: 200,
                data: { success: true, data: { booking: newBooking }, message: 'Booking created successfully' }
            };
        }
        return {
            status: 200,
            data: { success: true, data: bookings }
        };
    }

    if (cleanUrl.startsWith('/bookings/') && cleanUrl.endsWith('/cancel')) {
        const id = parseInt(cleanUrl.split('/')[2]);
        const bookings = JSON.parse(localStorage.getItem('mock_bookings') || '[]');
        const idx = bookings.findIndex(b => b.id === id);
        if (idx !== -1) {
            bookings[idx].status = 'cancelled';
            localStorage.setItem('mock_bookings', JSON.stringify(bookings));
            return { status: 200, data: { success: true, message: 'Booking cancelled' } };
        }
    }

    if (cleanUrl.startsWith('/bookings/') && cleanUrl.endsWith('/confirm')) {
        const id = parseInt(cleanUrl.split('/')[2]);
        const bookings = JSON.parse(localStorage.getItem('mock_bookings') || '[]');
        const idx = bookings.findIndex(b => b.id === id);
        if (idx !== -1) {
            bookings[idx].status = 'confirmed';
            localStorage.setItem('mock_bookings', JSON.stringify(bookings));
            return { status: 200, data: { success: true, message: 'Booking confirmed' } };
        }
    }

    if (cleanUrl.startsWith('/bookings/') && cleanUrl.endsWith('/payment')) {
        const id = parseInt(cleanUrl.split('/')[2]);
        const bookings = JSON.parse(localStorage.getItem('mock_bookings') || '[]');
        const idx = bookings.findIndex(b => b.id === id);
        if (idx !== -1) {
            bookings[idx].payment_status = 'paid';
            bookings[idx].status = 'confirmed';
            localStorage.setItem('mock_bookings', JSON.stringify(bookings));
            return { status: 200, data: { success: true, message: 'Payment processed successfully' } };
        }
    }

    if (cleanUrl.startsWith('/bookings/') && cleanUrl.endsWith('/invoice')) {
        const id = parseInt(cleanUrl.split('/')[2]);
        const bookings = JSON.parse(localStorage.getItem('mock_bookings') || '[]');
        const booking = bookings.find(b => b.id === id);
        return {
            status: 200,
            data: {
                success: true,
                data: {
                    invoice_no: `INV-2026-${id}`,
                    booking,
                    tax_amount: (booking?.total_price || 0) * 0.05,
                    grand_total: (booking?.total_price || 0) * 1.05
                }
            }
        };
    }

    if (cleanUrl.startsWith('/bookings/')) {
        const id = parseInt(cleanUrl.split('/')[2]);
        const bookings = JSON.parse(localStorage.getItem('mock_bookings') || '[]');
        const booking = bookings.find(b => b.id === id);
        if (booking) {
            return { status: 200, data: { success: true, data: booking } };
        }
    }

    // 4. Inquiries Mocks
    if (cleanUrl === '/inquiries') {
        const inquiries = JSON.parse(localStorage.getItem('mock_inquiries') || '[]');
        if (method.toUpperCase() === 'POST') {
            const newInq = {
                id: inquiries.length + 201,
                name: parsedData.name,
                email: parsedData.email,
                phone: parsedData.phone || '',
                message: parsedData.message,
                status: 'pending',
                assigned_to: null,
                assigned_name: 'Unassigned',
                created_at: new Date().toISOString()
            };
            inquiries.push(newInq);
            localStorage.setItem('mock_inquiries', JSON.stringify(inquiries));
            return { status: 200, data: { success: true, message: 'Inquiry submitted successfully', data: newInq } };
        }
        return { status: 200, data: { success: true, data: inquiries } };
    }

    if (cleanUrl.startsWith('/inquiries/') && cleanUrl.endsWith('/assign')) {
        const id = parseInt(cleanUrl.split('/')[2]);
        const inquiries = JSON.parse(localStorage.getItem('mock_inquiries') || '[]');
        const idx = inquiries.findIndex(i => i.id === id);
        if (idx !== -1) {
            inquiries[idx].assigned_to = parsedData.consultant_id;
            inquiries[idx].assigned_name = parsedData.consultant_id === 3 ? 'Amit Kumar (Consultant)' : 'Staff Member';
            inquiries[idx].status = 'in_progress';
            localStorage.setItem('mock_inquiries', JSON.stringify(inquiries));
            return { status: 200, data: { success: true, message: 'Inquiry assigned' } };
        }
    }

    if (cleanUrl.startsWith('/inquiries/') && cleanUrl.endsWith('/status')) {
        const id = parseInt(cleanUrl.split('/')[2]);
        const inquiries = JSON.parse(localStorage.getItem('mock_inquiries') || '[]');
        const idx = inquiries.findIndex(i => i.id === id);
        if (idx !== -1) {
            inquiries[idx].status = parsedData.status;
            localStorage.setItem('mock_inquiries', JSON.stringify(inquiries));
            return { status: 200, data: { success: true, message: 'Status updated' } };
        }
    }

    // 5. CMS Endpoints Mocks
    if (cleanUrl === '/blogs') {
        const blogs = JSON.parse(localStorage.getItem('mock_blogs') || '[]');
        if (method.toUpperCase() === 'POST') {
            const newBlog = {
                id: blogs.length + 1,
                title: parsedData.title,
                slug: parsedData.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
                summary: parsedData.summary,
                content: parsedData.content,
                image_url: parsedData.image_url || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
                published_at: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
                author: 'Priya Patel (Manager)'
            };
            blogs.push(newBlog);
            localStorage.setItem('mock_blogs', JSON.stringify(blogs));
            return { status: 200, data: { success: true, data: newBlog, message: 'Blog posted' } };
        }
        return { status: 200, data: { success: true, data: blogs } };
    }

    if (cleanUrl.startsWith('/blogs/')) {
        const slug = cleanUrl.split('/')[2];
        const blogs = JSON.parse(localStorage.getItem('mock_blogs') || '[]');
        const blog = blogs.find(b => b.slug === slug);
        if (blog) {
            return { status: 200, data: { success: true, data: blog } };
        }
    }

    if (cleanUrl === '/testimonials') {
        const reviews = JSON.parse(localStorage.getItem('mock_testimonials') || '[]');
        if (method.toUpperCase() === 'POST') {
            const newRev = {
                id: reviews.length + 1,
                name: parsedData.name || 'Anonymous Guest',
                rating: parsedData.rating || 5,
                feedback: parsedData.feedback,
                status: 'pending'
            };
            reviews.push(newRev);
            localStorage.setItem('mock_testimonials', JSON.stringify(reviews));
            return { status: 200, data: { success: true, message: 'Testimonial submitted. Awaiting approval.' } };
        }
        const statusFilter = config.params?.status;
        const data = statusFilter === 'all' ? reviews : reviews.filter(r => r.status === 'approved');
        return { status: 200, data: { success: true, data } };
    }

    if (cleanUrl.startsWith('/testimonials/') && cleanUrl.endsWith('/approve')) {
        const id = parseInt(cleanUrl.split('/')[2]);
        const reviews = JSON.parse(localStorage.getItem('mock_testimonials') || '[]');
        const idx = reviews.findIndex(r => r.id === id);
        if (idx !== -1) {
            reviews[idx].status = 'approved';
            localStorage.setItem('mock_testimonials', JSON.stringify(reviews));
            return { status: 200, data: { success: true, message: 'Testimonial approved' } };
        }
    }

    if (cleanUrl === '/contact') {
        return { status: 200, data: { success: true, message: 'Contact message received.' } };
    }

    return { status: 404, data: { success: false, message: `Mock route not found: ${method} ${cleanUrl}` } };
};

// Request interceptor - Add token to all requests
axiosClient.interceptors.request.use(
    (config) => {


        const token = Cookies.get('auth_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor - Handle errors globally, plus intercept for Mock Mode
axiosClient.interceptors.response.use(
    async (response) => {
        return response;
    },
    async (error) => {
        const { config } = error;
        const requestUrl = config?.url || '';

        // If it's a network error or the backend returned 404/500 (endpoint not implemented), fall back to mock
        const isNetworkError = !error.response;
        const shouldFallbackToMock = isNetworkError || (error.response && [404, 500].includes(error.response.status));
        if (shouldFallbackToMock && config) {
            console.warn(`[Mock Fallback] Using mock data for ${config.method?.toUpperCase()} ${requestUrl} (network:${isNetworkError}, status:${error.response?.status})`);
            try {
                const mockResult = await handleMockRequest(config);
                // Return a fake axios-like response
                return { ...mockResult, config, headers: {}, statusText: 'OK' };
            } catch (mockError) {
                console.error('[Mock Fallback] Mock handler also failed:', mockError);
            }
        }

        // Skip global redirect for auth endpoints — let the UI handle the error
        const isAuthEndpoint = requestUrl.includes('/auth/login') || requestUrl.includes('/auth/register');

        if (error.response?.status === 401 && !isAuthEndpoint) {
            // Unauthorized - clear auth and redirect to login
            Cookies.remove('auth_token');
            Cookies.remove('user');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }

        if (error.response?.status === 403 && !isAuthEndpoint) {
            // Forbidden - user doesn't have permission
            window.location.href = '/unauthorized';
        }

        return Promise.reject(error);
    }
);



export default axiosClient;
