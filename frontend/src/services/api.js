const BASE_URL = 'http://localhost:9999/api';

const request = async (url, options = {}) => {
    const token = localStorage.getItem('token');
    
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
        ...options,
        headers,
    };

    try {
        const response = await fetch(`${BASE_URL}${url}`, config);
        
        // Handle no content
        if (response.status === 204) {
            return null;
        }

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || data.error || 'Something went wrong');
        }

        if (data && typeof data === 'object' && 'success' in data && 'data' in data) {
            return data.data;
        }

        return data;
    } catch (error) {
        console.error('API Request Error:', error.message);
        throw error;
    }
};

export const api = {
    auth: {
        login: (email, password) => request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        }),
        register: (full_name, email, password, phone) => request('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ full_name, email, password, phone })
        }),
        getMe: () => request('/auth/me'),
        forgotPassword: (email) => request('/auth/forgot-password', {
            method: 'POST',
            body: JSON.stringify({ email })
        }),
        verifyOtp: (email, otp) => request('/auth/verify-otp', {
            method: 'POST',
            body: JSON.stringify({ email, otp })
        }),
        resetPassword: (email, password, confirmPassword) => request('/auth/reset-password', {
            method: 'POST',
            body: JSON.stringify({ email, password, confirmPassword })
        })
    },
    movies: {
        list: (filters = {}) => {
            const params = new URLSearchParams();
            if (filters.status) params.append('status', filters.status);
            if (filters.category) params.append('category', filters.category);
            if (filters.search) params.append('search', filters.search);
            const query = params.toString() ? `?${params.toString()}` : '';
            return request(`/movies${query}`);
        },
        get: (id) => request(`/movies/${id}`),
        create: (data) => request('/movies', {
            method: 'POST',
            body: JSON.stringify(data)
        }),
        update: (id, data) => request(`/movies/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        }),
        delete: (id) => request(`/movies/${id}`, {
            method: 'DELETE'
        })
    },
    showtimes: {
        list: (filters = {}) => {
            const params = new URLSearchParams();
            if (filters.movie_id) params.append('movie_id', filters.movie_id);
            if (filters.date) params.append('date', filters.date);
            if (filters.room_id) params.append('room_id', filters.room_id);
            const query = params.toString() ? `?${params.toString()}` : '';
            return request(`/showtimes${query}`);
        },
        get: (id) => request(`/showtimes/${id}`),
        getSeats: (id) => request(`/showtimes/${id}/seats`),
        create: (data) => request('/showtimes', {
            method: 'POST',
            body: JSON.stringify(data)
        }),
        update: (id, data) => request(`/showtimes/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        }),
        delete: (id) => request(`/showtimes/${id}`, {
            method: 'DELETE'
        })
    },
    bookings: {
        create: (showtime_id, seat_ids, food_items, notes) => request('/bookings', {
            method: 'POST',
            body: JSON.stringify({ showtime_id, seat_ids, food_items, notes })
        }),
        getMyBookings: () => request('/bookings/my-bookings'),
        get: (id) => request(`/bookings/${id}`),
        cancel: (id) => request(`/bookings/${id}/cancel`, {
            method: 'POST'
        }),
        listAll: (search = '', status = '') => {
            const params = new URLSearchParams();
            if (search) params.append('search', search);
            if (status) params.append('status', status);
            const query = params.toString() ? `?${params.toString()}` : '';
            return request(`/bookings${query}`);
        },
        validateTicket: (ticket_id, qr_code) => request('/bookings/validate-ticket', {
            method: 'POST',
            body: JSON.stringify({ ticket_id, qr_code })
        })
    },
    food: {
        list: (filters = {}) => {
            const params = new URLSearchParams();
            if (filters.type) params.append('type', filters.type);
            const query = params.toString() ? `?${params.toString()}` : '';
            return request(`/food${query}`);
        },
        createOrder: (items) => request('/food/orders', {
            method: 'POST',
            body: JSON.stringify({ items })
        }),
        createCounterSale: (items, customer_email) => request('/food/counter-sale', {
            method: 'POST',
            body: JSON.stringify({ items, customer_email })
        }),
        createItem: (data) => request('/food', {
            method: 'POST',
            body: JSON.stringify(data)
        }),
        updateItem: (id, data) => request(`/food/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        }),
        deleteItem: (id) => request(`/food/${id}`, {
            method: 'DELETE'
        })
    },
    payments: {
        create: (data) => request('/payments', {
            method: 'POST',
            body: JSON.stringify(data)
        })
    },
    reports: {
        revenue: (startDate, endDate) => request(`/reports/revenue?startDate=${startDate}&endDate=${endDate}`),
        system: () => request('/reports/system')
    },
    users: {
        list: () => request('/users'),
        updateRole: (id, role) => request(`/users/${id}/role`, {
            method: 'PUT',
            body: JSON.stringify({ role })
        }),
        updateStatus: (id, status) => request(`/users/${id}/status`, {
            method: 'PUT',
            body: JSON.stringify({ status })
        })
    },
    favorites: {
        list: () => request('/favorites'),
        add: (movie_id) => request('/favorites', {
            method: 'POST',
            body: JSON.stringify({ movie_id })
        }),
        remove: (movie_id) => request(`/favorites/${movie_id}`, {
            method: 'DELETE'
        })
    },
    reviews: {
        listByMovie: (movieId) => request(`/reviews/movie/${movieId}`),
        create: (data) => request('/reviews', {
            method: 'POST',
            body: JSON.stringify(data)
        })
    },
    notifications: {
        list: () => request('/notifications'),
        markAsRead: (id) => request(`/notifications/${id}/read`, {
            method: 'PUT'
        }),
        markAllRead: () => request('/notifications/mark-all-read', {
            method: 'PUT'
        })
    }
};
