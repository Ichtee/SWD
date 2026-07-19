import React, { useState, useEffect } from 'react';
import { api } from './services/api';

// Simple SVG Icons
const Icons = {
  Search: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>,
  Ticket: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"></path><path d="M13 5v2"></path><path d="M13 17v2"></path><path d="M13 11v2"></path></svg>,
  History: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path><path d="M12 7v5l4 2"></path></svg>,
  LogOut: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>,
  Settings: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>,
  User: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>,
  Trash: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>,
  Heart: ({ filled }) => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill={filled ? "var(--color-primary)" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></svg>,
  Bell: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path></svg>,
  Star: ({ filled }) => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill={filled ? "#fbbf24" : "none"} stroke={filled ? "#fbbf24" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
};

function App() {
  // Navigation State
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [createdBooking, setCreatedBooking] = useState(null);

  // Authentication State
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState(null);

  // Dynamic Lists State
  const [movies, setMovies] = useState([]);
  const [showtimes, setShowtimes] = useState([]);
  const [foodItems, setFoodItems] = useState([]);
  const [seats, setSeats] = useState([]);

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Selected Booking details
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedFood, setSelectedFood] = useState({}); // { foodId: qty }
  const [checkoutNotes, setCheckoutNotes] = useState('');

  // Auth Forms State
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authConfirmPass, setAuthConfirmPass] = useState('');
  const [authFullName, setAuthFullName] = useState('');
  const [authPhone, setAuthPhone] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');

  // Admin / Manager / Staff Dashboards State
  const [dashboardTab, setDashboardTab] = useState('movies'); // 'movies', 'showtimes', 'concessions', 'reports'
  const [adminReport, setAdminReport] = useState(null);
  const [revenueReport, setRevenueReport] = useState(null);
  const [repStart, setRepStart] = useState('2026-07-01');
  const [repEnd, setRepEnd] = useState('2026-07-31');

  // Staff scanner
  const [ticketSearchCode, setTicketSearchCode] = useState('');
  const [validationResult, setValidationResult] = useState(null);
  const [validationError, setValidationError] = useState('');
  const [posCart, setPosCart] = useState({}); // { foodId: qty }
  const [posCustomerEmail, setPosCustomerEmail] = useState('');

  // CRUD Forms State
  const [movieForm, setMovieForm] = useState({ title: '', categories: '', duration: 120, release_date: '', description: '', poster_url: '', age_rating: 'P', status: 'COMING_SOON' });
  const [showtimeForm, setShowtimeForm] = useState({ movie_id: '', room_id: '', format_name: '2D', price_surcharge: 0, start_time: '', base_price: 80000 });
  const [foodForm, setFoodForm] = useState({ name: '', type: 'FOOD', price: 50000, status: 'AVAILABLE', description: '' });
  const [allMovies, setAllMovies] = useState([]);

  // New states for extended modules
  const [favorites, setFavorites] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [userList, setUserList] = useState([]);
  const [movieReviews, setMovieReviews] = useState([]);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  const loadFavorites = () => {
    api.favorites.list()
      .then(data => setFavorites(data))
      .catch(err => console.error('Failed to load favorites', err));
  };

  const loadNotifications = () => {
    api.notifications.list()
      .then(data => setNotifications(data))
      .catch(err => console.error('Failed to load notifications', err));
  };

  const loadUsers = () => {
    api.users.list()
      .then(data => setUserList(data))
      .catch(err => console.error('Failed to load users', err));
  };

  // Fetch Current User on Load or Token Change
  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      api.auth.getMe()
        .then(u => {
          setUser(u);
          loadFavorites();
          loadNotifications();
          if (u.role === 'ADMIN') {
            loadUsers();
          }
        })
        .catch(err => {
          console.error(err);
          logout();
        });
    } else {
      localStorage.removeItem('token');
      setUser(null);
      setFavorites([]);
      setNotifications([]);
      setUserList([]);
    }
  }, [token]);

  // Load Initial Movies Catalog
  useEffect(() => {
    loadMovies();
    loadFood();
  }, [searchTerm, categoryFilter, statusFilter]);

  useEffect(() => {
    loadAllMovies();
  }, []);

  const loadMovies = () => {
    api.movies.list({ search: searchTerm, category: categoryFilter, status: statusFilter })
      .then(data => setMovies(data))
      .catch(err => console.error(err));
  };

  const loadAllMovies = () => {
    api.movies.list()
      .then(data => setAllMovies(data))
      .catch(err => console.error(err));
  };

  const loadFood = () => {
    api.food.list()
      .then(data => setFoodItems(data))
      .catch(err => console.error(err));
  };

  const logout = () => {
    setToken('');
    setUser(null);
    setCurrentPage('home');
  };

  // Navigations
  const navigateToMovieDetail = (movie) => {
    setSelectedMovie(movie);
    // Fetch showtimes for this movie
    api.showtimes.list({ movie_id: movie.id })
      .then(data => {
        setShowtimes(data);
        setCurrentPage('movie-detail');
      })
      .catch(err => console.error(err));
    // Fetch reviews for this movie
    api.reviews.listByMovie(movie.id)
      .then(data => setMovieReviews(data))
      .catch(err => console.error(err));
  };

  const navigateToSeatSelection = (showtime) => {
    if (!token) {
      setAuthError('You must be logged in to book tickets.');
      setCurrentPage('login');
      return;
    }
    setSelectedShowtime(showtime);
    setSelectedSeats([]);
    setSelectedFood({});
    setCheckoutNotes('');

    // Fetch real-time seat layout
    api.showtimes.getSeats(showtime.id)
      .then(data => {
        setSeats(data.seats);
        setCurrentPage('seat-selection');
      })
      .catch(err => console.error(err));
  };

  const navigateToCheckout = () => {
    if (selectedSeats.length === 0) {
      alert('Please select at least one seat.');
      return;
    }
    setCurrentPage('checkout');
  };

  // Ticket booking execution
  const executeBooking = () => {
    const food_items = Object.keys(selectedFood)
      .filter(id => selectedFood[id] > 0)
      .map(id => ({ food_id: parseInt(id), quantity: selectedFood[id] }));

    api.bookings.create(selectedShowtime.id, selectedSeats, food_items, checkoutNotes)
      .then(res => {
        setCreatedBooking(res.booking);
        loadNotifications(); // Reload notifications to get seat hold alert
        setCurrentPage('payment-gateway');
      })
      .catch(err => alert(err.message));
  };

  // Payment execution
  const processPayment = (method) => {
    api.payments.create({ booking_id: createdBooking.id, method })
      .then(res => {
        alert(res.message + ' ' + (res.ticketMessage || ''));
        loadNotifications(); // Reload notifications to get payment success alert
        setCurrentPage('history');
      })
      .catch(err => alert(err.message));
  };

  // Favorites toggle
  const toggleFavorite = (movieId) => {
    if (!token) {
      alert('You must be logged in to favorite movies.');
      return;
    }
    const isFav = favorites.some(m => m.id === movieId);
    if (isFav) {
      api.favorites.remove(movieId)
        .then(() => loadFavorites())
        .catch(err => alert(err.message));
    } else {
      api.favorites.add(movieId)
        .then(() => loadFavorites())
        .catch(err => alert(err.message));
    }
  };

  // Submit Review
  const handlePostReview = (e) => {
    e.preventDefault();
    if (!token) {
      alert('You must be logged in to submit a review.');
      return;
    }
    api.reviews.create({
      movie_id: selectedMovie.id,
      rating: reviewRating,
      comment: reviewComment
    })
      .then(() => {
        alert('Review submitted successfully.');
        setReviewComment('');
        // Reload reviews
        api.reviews.listByMovie(selectedMovie.id)
          .then(data => setMovieReviews(data))
          .catch(err => console.error(err));
      })
      .catch(err => alert(err.message));
  };

  // User Management
  const handleUpdateUserRole = (userId, newRole) => {
    api.users.updateRole(userId, newRole)
      .then(res => {
        alert(res.message);
        loadUsers();
      })
      .catch(err => alert(err.message));
  };

  const handleUpdateUserStatus = (userId, newStatus) => {
    api.users.updateStatus(userId, newStatus)
      .then(res => {
        alert(res.message);
        loadUsers();
      })
      .catch(err => alert(err.message));
  };

  // Notification management
  const handleMarkNotifRead = (id) => {
    api.notifications.markAsRead(id)
      .then(() => loadNotifications())
      .catch(err => console.error(err));
  };

  const handleMarkAllNotifRead = () => {
    api.notifications.markAllRead()
      .then(() => loadNotifications())
      .catch(err => console.error(err));
  };

  // OTP Reset password request
  const requestForgotPassword = (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');
    api.auth.forgotPassword(authEmail)
      .then(res => {
        setAuthSuccess(res.message);
        setCurrentPage('verify-otp');
      })
      .catch(err => setAuthError(err.message));
  };

  // Verify OTP
  const executeVerifyOtp = (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');
    api.auth.verifyOtp(authEmail, otpCode)
      .then(res => {
        setAuthSuccess(res.message);
        setCurrentPage('reset-password');
      })
      .catch(err => setAuthError(err.message));
  };

  // Submit Password Reset
  const executeResetPass = (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');
    api.auth.resetPassword(authEmail, authPassword, authConfirmPass)
      .then(res => {
        setAuthSuccess(res.message + ' Please login.');
        setCurrentPage('login');
      })
      .catch(err => setAuthError(err.message));
  };

  // Register account
  const executeRegister = (e) => {
    e.preventDefault();
    setAuthError('');
    api.auth.register(authFullName, authEmail, authPassword, authPhone)
      .then(res => {
        setToken(res.token);
        setCurrentPage('home');
      })
      .catch(err => setAuthError(err.message));
  };

  // Login
  const executeLogin = (e) => {
    e.preventDefault();
    setAuthError('');
    api.auth.login(authEmail, authPassword)
      .then(res => {
        setToken(res.token);
        // Redirect according to roles
        if (res.user.role === 'CUSTOMER') {
          setCurrentPage('home');
        } else if (res.user.role === 'STAFF') {
          setCurrentPage('staff-panel');
        } else {
          loadManagerReports();
          setCurrentPage('manager-panel');
        }
      })
      .catch(err => setAuthError(err.message));
  };

  // Manager Reports
  const loadManagerReports = () => {
    api.reports.system()
      .then(data => setAdminReport(data))
      .catch(err => console.error(err));

    api.reports.revenue(repStart, repEnd)
      .then(data => setRevenueReport(data))
      .catch(err => console.error(err));
  };

  // Ticket check in (Staff validation)
  const handleTicketValidation = (e) => {
    e.preventDefault();
    setValidationError('');
    setValidationResult(null);
    api.bookings.validateTicket(null, ticketSearchCode)
      .then(res => {
        setValidationResult(res);
      })
      .catch(err => setValidationError(err.message));
  };

  // Concessions sale at POS
  const executePosSale = () => {
    const items = Object.keys(posCart)
      .filter(id => posCart[id] > 0)
      .map(id => ({ food_id: parseInt(id), quantity: posCart[id] }));

    if (items.length === 0) {
      alert('Please add concessions to cart');
      return;
    }

    api.food.createCounterSale(items, posCustomerEmail || null)
      .then(res => {
        alert(res.message);
        setPosCart({});
        setPosCustomerEmail('');
      })
      .catch(err => alert(err.message));
  };

  // CRUD Movie Operations
  const handleCreateMovie = (e) => {
    e.preventDefault();
    api.movies.create(movieForm)
      .then(() => {
        alert('Movie created successfully');
        loadMovies();
        loadAllMovies();
        setMovieForm({ title: '', categories: '', duration: 120, release_date: '', description: '', poster_url: '', age_rating: 'P', status: 'COMING_SOON' });
      })
      .catch(err => alert(err.message));
  };

  const handleDeleteMovie = (id) => {
    if (confirm('Are you sure you want to delete this movie?')) {
      api.movies.delete(id)
        .then(res => {
          alert(res.message);
          loadMovies();
          loadAllMovies();
        })
        .catch(err => alert(err.message));
    }
  };

  const handleUpdateMovieStatus = (movieId, newStatus) => {
    api.movies.update(movieId, { status: newStatus })
      .then(() => {
        alert('Movie status updated successfully');
        loadMovies();
        loadAllMovies();
      })
      .catch(err => alert(err.message));
  };

  // CRUD Showtime Operations
  const handleCreateShowtime = (e) => {
    e.preventDefault();
    api.showtimes.create(showtimeForm)
      .then(() => {
        alert('Showtime scheduled successfully');
        loadMovies(); // refresh
      })
      .catch(err => alert(err.message));
  };

  // CRUD Concessions
  const handleCreateFood = (e) => {
    e.preventDefault();
    api.food.createItem(foodForm)
      .then(() => {
        alert('Concession item created');
        loadFood();
      })
      .catch(err => alert(err.message));
  };

  return (
    <div>
      {/* Top Navbar */}
      <nav className="glass" style={{ padding: '1rem 2rem', position: 'sticky', top: 0, zIndex: 100, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <h1 onClick={() => setCurrentPage('home')} style={{ cursor: 'pointer', fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '2px' }}>
            ✨ GOLDEN SCREEN
          </h1>
          <div style={{ display: 'flex', gap: '1.25rem' }}>
            <span onClick={() => setCurrentPage('home')} style={{ cursor: 'pointer', fontWeight: 500, color: currentPage === 'home' ? 'var(--color-primary)' : 'var(--color-text-muted)' }}>Movies</span>
            {user && user.role === 'CUSTOMER' && (
              <span onClick={() => {
                setCurrentPage('history');
              }} style={{ cursor: 'pointer', fontWeight: 500, color: currentPage === 'history' ? 'var(--color-primary)' : 'var(--color-text-muted)' }}>
                My Bookings
              </span>
            )}
            {user && user.role === 'STAFF' && (
              <span onClick={() => setCurrentPage('staff-panel')} style={{ cursor: 'pointer', fontWeight: 600, color: 'var(--color-primary)' }}>
                Staff POS Desk
              </span>
            )}
            {user && (user.role === 'MANAGER' || user.role === 'ADMIN') && (
              <span onClick={() => {
                loadManagerReports();
                setCurrentPage('manager-panel');
              }} style={{ cursor: 'pointer', fontWeight: 600, color: 'var(--color-primary)' }}>
                Management Center
              </span>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', position: 'relative' }}>
          {user && (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="btn btn-secondary"
                style={{ padding: '0.4rem 0.8rem', display: 'flex', gap: '0.35rem', alignItems: 'center', position: 'relative' }}
              >
                <Icons.Bell />
                {notifications.filter(n => !n.is_read).length > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '-6px',
                    right: '-6px',
                    background: 'var(--color-primary)',
                    color: '#000',
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {notifications.filter(n => !n.is_read).length}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="glass" style={{
                  position: 'absolute',
                  top: '45px',
                  right: 0,
                  width: '320px',
                  maxHeight: '400px',
                  overflowY: 'auto',
                  borderRadius: '0.75rem',
                  padding: '1rem',
                  zIndex: 200,
                  boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                  border: '1px solid var(--color-border)',
                  background: 'var(--color-surface)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>
                    <strong style={{ fontSize: '0.9rem' }}>Notifications</strong>
                    <span onClick={handleMarkAllNotifRead} style={{ fontSize: '0.75rem', color: 'var(--color-primary)', cursor: 'pointer', fontWeight: 600 }}>Mark all read</span>
                  </div>
                  {notifications.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {notifications.map(n => (
                        <div
                          key={n.id}
                          onClick={() => handleMarkNotifRead(n.id)}
                          style={{
                            padding: '0.5rem',
                            borderRadius: '0.4rem',
                            background: n.is_read ? 'transparent' : 'rgba(255,255,255,0.03)',
                            borderLeft: n.is_read ? '2px solid transparent' : '2px solid var(--color-primary)',
                            cursor: 'pointer',
                            fontSize: '0.8rem'
                          }}
                        >
                          <div style={{ fontWeight: 700, marginBottom: '0.15rem', color: n.is_read ? 'var(--color-text-muted)' : 'var(--color-text)' }}>{n.title}</div>
                          <div style={{ color: 'var(--color-text-muted)', lineHeight: '1.3' }}>{n.message}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', textAlign: 'center', padding: '1rem 0' }}>No notifications yet.</div>
                  )}
                </div>
              )}
            </div>
          )}

          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{user.full_name}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-primary)', fontWeight: 700 }}>{user.role}</div>
              </div>
              <button onClick={logout} className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', display: 'flex', gap: '0.5rem', fontSize: '0.85rem' }}>
                <Icons.LogOut /> Log Out
              </button>
            </div>
          ) : (
            <button onClick={() => {
              setAuthError('');
              setCurrentPage('login');
            }} className="btn btn-primary" style={{ padding: '0.5rem 1.25rem' }}>
              Log In
            </button>
          )}
        </div>
      </nav>

      {/* Pages Router Container */}
      <main className="container" style={{ padding: '2rem 0' }}>

        {/* ==================== HOME PAGE (MOVIES CATALOG) ==================== */}
        {currentPage === 'home' && (
          <div>
            <div style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
              <h2 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>What's playing today?</h2>
              <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>Search and book the latest blockbusters instantly</p>

              {/* Search Bars */}
              <div className="glass" style={{ display: 'inline-flex', gap: '1rem', padding: '0.75rem 1.5rem', borderRadius: '1rem', flexWrap: 'wrap', width: '100%', maxWidth: '750px' }}>
                <input
                  type="text"
                  placeholder="Search movies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-input"
                  style={{ flex: 2, background: 'transparent', border: 'none', outline: 'none' }}
                />
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="form-input"
                  style={{ flex: 1, background: 'transparent', border: 'none' }}
                >
                  <option value="" style={{ background: 'var(--color-surface)' }}>All Genres</option>
                  <option value="Action" style={{ background: 'var(--color-surface)' }}>Action</option>
                  <option value="Fantasy" style={{ background: 'var(--color-surface)' }}>Fantasy</option>
                  <option value="Animation" style={{ background: 'var(--color-surface)' }}>Animation</option>
                  <option value="Comedy" style={{ background: 'var(--color-surface)' }}>Comedy</option>
                </select>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="form-input"
                  style={{ flex: 1, background: 'transparent', border: 'none' }}
                >
                  <option value="" style={{ background: 'var(--color-surface)' }}>All Status</option>
                  <option value="SHOWING" style={{ background: 'var(--color-surface)' }}>Now Showing</option>
                  <option value="COMING_SOON" style={{ background: 'var(--color-surface)' }}>Coming Soon</option>
                </select>
              </div>
            </div>

            {/* Movies List */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '2rem' }}>
              {movies.length > 0 ? (
                movies.map(movie => (
                  <div key={movie.id} className="glass" style={{ borderRadius: '1rem', overflow: 'hidden', display: 'flex', flexDirection: 'column', transition: 'transform 0.2s', cursor: 'pointer' }} onClick={() => navigateToMovieDetail(movie)}>
                    <div style={{ height: '380px', overflow: 'hidden', position: 'relative' }}>
                      <img src={movie.poster_url || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=300'} alt={movie.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <div style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
                        <span className={`badge ${movie.status === 'SHOWING' ? 'badge-showing' : 'badge-coming'}`}>
                          {movie.status === 'SHOWING' ? 'Now Showing' : 'Coming Soon'}
                        </span>
                      </div>
                    </div>
                    <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--color-primary)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.25rem' }}>{movie.categories}</div>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, lineHeight: 1.3, marginBottom: '0.5rem' }}>{movie.title}</h3>
                        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Duration: {movie.duration} mins • Rated: {movie.age_rating}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ gridColumn: '1/-1', textAlign: 'center', color: 'var(--color-text-muted)', padding: '3rem' }}>
                  No movies found matching search criteria.
                </div>
              )}
            </div>
          </div>
        )}

        {/* ==================== MOVIE DETAIL SCREEN ==================== */}
        {currentPage === 'movie-detail' && selectedMovie && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
            <button onClick={() => setCurrentPage('home')} className="btn btn-secondary" style={{ alignSelf: 'flex-start' }}>
              ← Back to list
            </button>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '3rem', alignItems: 'start' }}>
              <div className="glass" style={{ borderRadius: '1rem', overflow: 'hidden', height: '500px' }}>
                <img src={selectedMovie.poster_url} alt={selectedMovie.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span className="badge badge-showing" style={{ marginBottom: '1rem' }}>{selectedMovie.status}</span>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: 800, lineHeight: 1.2, marginBottom: '0.5rem' }}>{selectedMovie.title}</h2>
                    <p style={{ color: 'var(--color-primary)', fontWeight: 600 }}>{selectedMovie.categories} • {selectedMovie.duration} Mins • Age Limit: {selectedMovie.age_rating}</p>
                  </div>
                  {user && (
                    <button
                      onClick={() => toggleFavorite(selectedMovie.id)}
                      className="btn btn-secondary"
                      style={{ padding: '0.75rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      title={favorites.some(f => f.id === selectedMovie.id) ? "Remove from Favorites" : "Add to Favorites"}
                    >
                      <Icons.Heart filled={favorites.some(f => f.id === selectedMovie.id)} />
                    </button>
                  )}
                </div>

                <div className="glass" style={{ padding: '1.5rem', borderRadius: '1rem' }}>
                  <h3 style={{ marginBottom: '0.75rem', fontWeight: 700 }}>Synopsis</h3>
                  <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.6 }}>{selectedMovie.description}</p>
                  <div style={{ marginTop: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.9rem' }}>
                    <div><strong>Director:</strong> <span style={{ color: 'var(--color-text-muted)' }}>{selectedMovie.director}</span></div>
                    <div><strong>Language:</strong> <span style={{ color: 'var(--color-text-muted)' }}>{selectedMovie.language}</span></div>
                    <div style={{ gridColumn: '1/-1' }}><strong>Cast:</strong> <span style={{ color: 'var(--color-text-muted)' }}>{selectedMovie.cast}</span></div>
                  </div>
                </div>

                {/* Showtimes Selector */}
                <div>
                  <h3 style={{ marginBottom: '1rem', fontWeight: 700 }}>Select Screening Showtime</h3>
                  {showtimes.length > 0 ? (
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                      {showtimes.map(st => (
                        <div
                          key={st.id}
                          className="glass"
                          style={{ padding: '1.25rem', borderRadius: '0.75rem', cursor: 'pointer', border: '1px solid var(--color-border)', transition: 'border 0.2s', minWidth: '180px' }}
                          onClick={() => navigateToSeatSelection(st)}
                        >
                          <div style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--color-primary)' }}>
                            {new Date(st.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                          <div style={{ fontSize: '0.85rem', fontWeight: 500, margin: '0.25rem 0' }}>{st.Room.room_name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Format: {st.format_name} • Base: {parseFloat(st.base_price).toLocaleString()} VND</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
                      No showtimes scheduled currently for this movie.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="glass" style={{ padding: '2rem', borderRadius: '1rem', marginTop: '2rem' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem', color: 'var(--color-primary)' }}>Customer Reviews</h3>

              {user && (
                <form onSubmit={handlePostReview} style={{ marginBottom: '2rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '1.5rem' }}>
                  <h4 style={{ fontWeight: 700, marginBottom: '1rem' }}>Write a Review</h4>
                  <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <label className="form-label" style={{ marginBottom: 0 }}>Rating:</label>
                    <div style={{ display: 'flex', gap: '0.25rem' }}>
                      {[1, 2, 3, 4, 5].map(star => (
                        <span
                          key={star}
                          onClick={() => setReviewRating(star)}
                          style={{ cursor: 'pointer' }}
                        >
                          <Icons.Star filled={star <= reviewRating} />
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Comment</label>
                    <textarea
                      required
                      value={reviewComment}
                      onChange={e => setReviewComment(e.target.value)}
                      className="form-input"
                      placeholder="Share your thoughts about this movie..."
                      style={{ height: '80px', resize: 'none' }}
                    />
                  </div>
                  <button type="submit" className="btn btn-primary">Submit Review</button>
                </form>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {movieReviews.length > 0 ? (
                  movieReviews.map(rev => (
                    <div key={rev.id} style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem' }}>
                      <div style={{
                        width: '45px',
                        height: '45px',
                        borderRadius: '50%',
                        background: 'rgba(255,255,255,0.08)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: '1rem',
                        color: 'var(--color-primary)'
                      }}>
                        {rev.User?.full_name?.charAt(0) || 'U'}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                          <strong style={{ fontSize: '0.95rem' }}>{rev.User?.full_name || 'Anonymous User'}</strong>
                          <div style={{ display: 'flex', gap: '0.1rem' }}>
                            {[1, 2, 3, 4, 5].map(star => (
                              <Icons.Star key={star} filled={star <= rev.rating} />
                            ))}
                          </div>
                        </div>
                        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', lineHeight: '1.4' }}>{rev.comment}</p>
                        <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.25)' }}>{new Date(rev.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ color: 'var(--color-text-muted)', fontStyle: 'italic', fontSize: '0.9rem' }}>No reviews posted for this movie yet.</div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ==================== SEAT SELECTION GRID ==================== */}
        {currentPage === 'seat-selection' && selectedShowtime && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <button onClick={() => navigateToMovieDetail(selectedMovie)} className="btn btn-secondary" style={{ alignSelf: 'flex-start' }}>
              ← Back to showtimes
            </button>
            <div style={{ textAlign: 'center' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Choose Your Seats</h2>
              <p style={{ color: 'var(--color-text-muted)' }}>{selectedMovie.title} | {selectedShowtime.Room.room_name} at {new Date(selectedShowtime.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
            </div>

            {/* Interactive Screen Indicator */}
            <div style={{ margin: '1.5rem 0', textAlign: 'center' }}>
              <div style={{ width: '80%', height: '8px', background: 'var(--color-primary)', margin: '0 auto 0.5rem auto', borderRadius: '4px', boxShadow: '0 0 15px var(--color-primary)' }}></div>
              <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', tracking: '0.1em', color: 'var(--color-text-muted)' }}>CINEMA SCREEN</span>
            </div>

            {/* Seat Map grid */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', overflowX: 'auto', padding: '1rem 0' }}>
              {/* Row grouping */}
              {Array.from(new Set(seats.map(s => s.seat_row))).sort().map(row => (
                <div key={row} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <strong style={{ width: '20px', color: 'var(--color-text-muted)' }}>{row}</strong>
                  {seats.filter(s => s.seat_row === row).sort((a, b) => a.seat_number - b.seat_number).map(seat => {
                    const isSelected = selectedSeats.includes(seat.id);
                    const isReserved = seat.status === 'RESERVED';

                    let bg = 'rgba(255,255,255,0.08)';
                    let border = 'rgba(255,255,255,0.15)';
                    if (isReserved) {
                      bg = '#ef4444';
                      border = '#ef4444';
                    } else if (isSelected) {
                      bg = 'var(--color-primary)';
                      border = 'var(--color-primary)';
                    } else {
                      if (seat.seat_type === 'VIP') {
                        border = 'var(--color-vip)';
                      } else if (seat.seat_type === 'COUPLE') {
                        border = 'var(--color-couple)';
                      }
                    }

                    return (
                      <div
                        key={seat.id}
                        onClick={() => {
                          if (isReserved) return;
                          if (isSelected) {
                            setSelectedSeats(selectedSeats.filter(id => id !== seat.id));
                          } else {
                            setSelectedSeats([...selectedSeats, seat.id]);
                          }
                        }}
                        style={{
                          width: '40px',
                          height: '40px',
                          background: bg,
                          border: `2px solid ${border}`,
                          borderRadius: '6px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          cursor: isReserved ? 'not-allowed' : 'pointer',
                          color: isSelected ? '#000' : 'var(--color-text)'
                        }}
                        title={`Seat ${seat.seat_row}${seat.seat_number} - ${seat.seat_type}`}
                      >
                        {seat.seat_number}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Legend */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap', marginTop: '1rem', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '18px', height: '18px', background: 'rgba(255,255,255,0.08)', border: '2px solid rgba(255,255,255,0.15)', borderRadius: '3px' }}></div> Available
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '18px', height: '18px', border: '2px solid var(--color-vip)', borderRadius: '3px' }}></div> VIP Seat (+20%)
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '18px', height: '18px', border: '2px solid var(--color-couple)', borderRadius: '3px' }}></div> Couple Seat (+50%)
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '18px', height: '18px', background: 'var(--color-primary)', borderRadius: '3px' }}></div> Selected
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '18px', height: '18px', background: '#ef4444', borderRadius: '3px' }}></div> Reserved / Booked
              </div>
            </div>

            {/* Select Concessions (F&B) */}
            <div className="glass" style={{ padding: '2rem', borderRadius: '1rem', marginTop: '2rem' }}>
              <h3 style={{ marginBottom: '1.25rem', fontWeight: 800 }}>🍿 Snacks & Drinks Menu</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                {foodItems.map(food => (
                  <div key={food.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.75rem' }}>
                    <div>
                      <div style={{ fontWeight: 600 }}>{food.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{food.description}</div>
                      <div style={{ color: 'var(--color-primary)', fontWeight: 700, fontSize: '0.9rem', marginTop: '0.25rem' }}>{parseFloat(food.price).toLocaleString()} VND</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <button
                        onClick={() => setSelectedFood({ ...selectedFood, [food.id]: Math.max(0, (selectedFood[food.id] || 0) - 1) })}
                        className="btn btn-secondary"
                        style={{ padding: '0.25rem 0.6rem', fontSize: '0.9rem' }}
                      >
                        -
                      </button>
                      <strong style={{ width: '20px', textAlign: 'center' }}>{selectedFood[food.id] || 0}</strong>
                      <button
                        onClick={() => setSelectedFood({ ...selectedFood, [food.id]: (selectedFood[food.id] || 0) + 1 })}
                        className="btn btn-secondary"
                        style={{ padding: '0.25rem 0.6rem', fontSize: '0.9rem' }}
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button onClick={navigateToCheckout} className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem', alignSelf: 'center', marginTop: '1.5rem' }}>
              Proceed to Booking Summary →
            </button>
          </div>
        )}

        {/* ==================== BOOKING SUMMARY & CHECKOUT ==================== */}
        {currentPage === 'checkout' && selectedShowtime && (
          <div style={{ maxWidth: '650px', margin: '0 auto' }} className="glass">
            <div style={{ padding: '2rem' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '1.5rem', textAlign: 'center' }}>Booking Summary</h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
                <div><strong>Movie:</strong> {selectedMovie.title}</div>
                <div><strong>Showtime:</strong> {new Date(selectedShowtime.start_time).toLocaleString()}</div>
                <div><strong>Format:</strong> {selectedShowtime.format_name}</div>
                <div><strong>Cinema Room:</strong> {selectedShowtime.Room.room_name}</div>
                <div>
                  <strong>Selected Seats:</strong>{' '}
                  {selectedSeats.map(id => {
                    const seat = seats.find(s => s.id === id);
                    return seat ? `${seat.seat_row}${seat.seat_number} (${seat.seat_type})` : '';
                  }).join(', ')}
                </div>
              </div>

              {/* Concessions ordered list */}
              {Object.keys(selectedFood).some(id => selectedFood[id] > 0) && (
                <div style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
                  <h4 style={{ marginBottom: '0.5rem' }}>Food & Snacks:</h4>
                  {Object.keys(selectedFood).filter(id => selectedFood[id] > 0).map(id => {
                    const food = foodItems.find(f => f.id === parseInt(id));
                    return (
                      <div key={id} style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-muted)', fontSize: '0.9rem', margin: '0.25rem 0' }}>
                        <span>{food?.name} x{selectedFood[id]}</span>
                        <span>{(parseFloat(food?.price) * selectedFood[id]).toLocaleString()} VND</span>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Optional Notes / Remarks:</label>
                <textarea
                  value={checkoutNotes}
                  onChange={(e) => setCheckoutNotes(e.target.value)}
                  className="form-input"
                  style={{ height: '80px', resize: 'none' }}
                  placeholder="E.g., request wheel-chair assistance..."
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '1.25rem', fontWeight: 800, marginTop: '2rem', marginBottom: '2rem' }}>
                <span>Total Amount:</span>
                <span style={{ color: 'var(--color-primary)' }}>
                  {/* Local calculation */}
                  {(
                    selectedSeats.reduce((acc, id) => {
                      const seat = seats.find(s => s.id === id);
                      let multiplier = 1.0;
                      if (seat?.seat_type === 'VIP') multiplier = 1.2;
                      else if (seat?.seat_type === 'COUPLE') multiplier = 1.5;
                      return acc + (parseFloat(selectedShowtime.base_price) + parseFloat(selectedShowtime.price_surcharge)) * multiplier;
                    }, 0) +
                    Object.keys(selectedFood).reduce((acc, id) => {
                      const food = foodItems.find(f => f.id === parseInt(id));
                      return acc + (parseFloat(food?.price || 0) * (selectedFood[id] || 0));
                    }, 0)
                  ).toLocaleString()} VND
                </span>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button onClick={() => setCurrentPage('seat-selection')} className="btn btn-secondary" style={{ flex: 1 }}>
                  Back to Seats
                </button>
                <button onClick={executeBooking} className="btn btn-primary" style={{ flex: 2 }}>
                  Lock Seats & Book Ticket
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ==================== PAYMENT GATEWAY MOCK ==================== */}
        {currentPage === 'payment-gateway' && createdBooking && (
          <div style={{ maxWidth: '500px', margin: '0 auto', textAlign: 'center' }} className="glass">
            <div style={{ padding: '2rem' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>Secure Checkout</h2>
              <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>Booking ID: #{createdBooking.id} • Expiration in 15 mins</p>

              <div style={{ padding: '1.25rem', background: 'rgba(255,255,255,0.03)', borderRadius: '0.75rem', marginBottom: '2rem' }}>
                <div style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>Amount to pay:</div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-primary)', marginTop: '0.25rem' }}>
                  {parseFloat(createdBooking.total_price).toLocaleString()} VND
                </div>
              </div>

              <h4 style={{ marginBottom: '1rem', textAlign: 'left', fontWeight: 700 }}>Choose Payment Method:</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
                <button onClick={() => processPayment('MOMO')} className="btn btn-secondary" style={{ background: '#ec4899', color: '#fff', border: 'none' }}>
                  Pay with MoMo Wallet
                </button>
                <button onClick={() => processPayment('VNPAY')} className="btn btn-secondary" style={{ background: '#2563eb', color: '#fff', border: 'none' }}>
                  Pay with VNPay Secure
                </button>
                <button onClick={() => processPayment('STRIPE')} className="btn btn-secondary" style={{ background: '#6366f1', color: '#fff', border: 'none' }}>
                  Pay with Credit Card (Stripe)
                </button>
              </div>

              <button onClick={() => api.bookings.cancel(createdBooking.id).then(() => setCurrentPage('home'))} className="btn btn-danger" style={{ width: '100%' }}>
                Cancel Booking Hold
              </button>
            </div>
          </div>
        )}

        {/* ==================== LOGIN SCREEN ==================== */}
        {currentPage === 'login' && (
          <div style={{ maxWidth: '420px', margin: '4rem auto 0 auto' }} className="glass">
            <div style={{ padding: '2.5rem' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem', textAlign: 'center' }}>Welcome Back</h2>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginBottom: '2rem', textAlign: 'center' }}>Log in to access your bookings and tickets</p>

              {authError && <div style={{ color: 'var(--color-error)', background: 'rgba(239,68,68,0.1)', padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1.25rem', fontSize: '0.85rem', fontWeight: 500 }}>{authError}</div>}
              {authSuccess && <div style={{ color: 'var(--color-success)', background: 'rgba(16,185,129,0.1)', padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1.25rem', fontSize: '0.85rem', fontWeight: 500 }}>{authSuccess}</div>}

              <form onSubmit={executeLogin}>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    required
                    className="form-input"
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    placeholder="E.g., email@domain.com"
                  />
                </div>
                <div className="form-group" style={{ marginBottom: '0.5rem' }}>
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    required
                    className="form-input"
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                </div>
                <div style={{ textAlign: 'right', marginBottom: '1.5rem' }}>
                  <span onClick={() => {
                    setAuthError('');
                    setAuthSuccess('');
                    setCurrentPage('forgot-password');
                  }} style={{ fontSize: '0.8rem', color: 'var(--color-primary)', cursor: 'pointer' }}>
                    Forgot Password?
                  </span>
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.85rem' }}>
                  Log In
                </button>
              </form>

              <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                Don't have an account?{' '}
                <span onClick={() => {
                  setAuthError('');
                  setCurrentPage('register');
                }} style={{ color: 'var(--color-primary)', fontWeight: 600, cursor: 'pointer' }}>
                  Create account
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ==================== REGISTER SCREEN ==================== */}
        {currentPage === 'register' && (
          <div style={{ maxWidth: '450px', margin: '2rem auto 0 auto' }} className="glass">
            <div style={{ padding: '2.5rem' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem', textAlign: 'center' }}>Create Account</h2>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginBottom: '2rem', textAlign: 'center' }}>Sign up to book tickets and order concessions</p>

              {authError && <div style={{ color: 'var(--color-error)', background: 'rgba(239,68,68,0.1)', padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1.25rem', fontSize: '0.85rem', fontWeight: 500 }}>{authError}</div>}

              <form onSubmit={executeRegister}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    value={authFullName}
                    onChange={(e) => setAuthFullName(e.target.value)}
                    placeholder="John Doe"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    required
                    className="form-input"
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    placeholder="john@example.com"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    value={authPhone}
                    onChange={(e) => setAuthPhone(e.target.value)}
                    placeholder="0912345678"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    required
                    className="form-input"
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    placeholder="Min 6 characters"
                  />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.85rem', marginTop: '0.5rem' }}>
                  Register Account
                </button>
              </form>

              <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                Already have an account?{' '}
                <span onClick={() => {
                  setAuthError('');
                  setCurrentPage('login');
                }} style={{ color: 'var(--color-primary)', fontWeight: 600, cursor: 'pointer' }}>
                  Login here
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ==================== FORGOT PASSWORD (OTP GENERATION) ==================== */}
        {currentPage === 'forgot-password' && (
          <div style={{ maxWidth: '420px', margin: '4rem auto 0 auto' }} className="glass">
            <div style={{ padding: '2.5rem' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem', textAlign: 'center' }}>Reset Password</h2>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginBottom: '2rem', textAlign: 'center' }}>Enter your email. A mock OTP verification code will be simulated.</p>

              {authError && <div style={{ color: 'var(--color-error)', background: 'rgba(239,68,68,0.1)', padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1.25rem', fontSize: '0.85rem' }}>{authError}</div>}

              <form onSubmit={requestForgotPassword}>
                <div className="form-group">
                  <label className="form-label">Registered Email</label>
                  <input
                    type="email"
                    required
                    className="form-input"
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    placeholder="E.g., user@domain.com"
                  />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.85rem', marginTop: '0.5rem' }}>
                  Send Verification OTP
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ==================== VERIFY OTP ==================== */}
        {currentPage === 'verify-otp' && (
          <div style={{ maxWidth: '420px', margin: '4rem auto 0 auto' }} className="glass">
            <div style={{ padding: '2.5rem' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem', textAlign: 'center' }}>Verify OTP Code</h2>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginBottom: '2rem', textAlign: 'center' }}>We have printed the OTP in the server terminal logs!</p>

              {authError && <div style={{ color: 'var(--color-error)', background: 'rgba(239,68,68,0.1)', padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1.25rem', fontSize: '0.85rem' }}>{authError}</div>}
              {authSuccess && <div style={{ color: 'var(--color-success)', background: 'rgba(16,185,129,0.1)', padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1.25rem', fontSize: '0.85rem' }}>{authSuccess}</div>}

              <form onSubmit={executeVerifyOtp}>
                <div className="form-group">
                  <label className="form-label">Enter 6-Digit OTP</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="E.g., 583921"
                    maxLength="6"
                  />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.85rem' }}>
                  Verify Code
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ==================== RESET PASSWORD ==================== */}
        {currentPage === 'reset-password' && (
          <div style={{ maxWidth: '420px', margin: '4rem auto 0 auto' }} className="glass">
            <div style={{ padding: '2.5rem' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem', textAlign: 'center' }}>New Password</h2>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginBottom: '2rem', textAlign: 'center' }}>Create a strong password for your account</p>

              {authError && <div style={{ color: 'var(--color-error)', background: 'rgba(239,68,68,0.1)', padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1.25rem', fontSize: '0.85rem' }}>{authError}</div>}
              {authSuccess && <div style={{ color: 'var(--color-success)', background: 'rgba(16,185,129,0.1)', padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1.25rem', fontSize: '0.85rem' }}>{authSuccess}</div>}

              <form onSubmit={executeResetPass}>
                <div className="form-group">
                  <label className="form-label">New Password</label>
                  <input
                    type="password"
                    required
                    className="form-input"
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    placeholder="Min 6 characters"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Confirm New Password</label>
                  <input
                    type="password"
                    required
                    className="form-input"
                    value={authConfirmPass}
                    onChange={(e) => setAuthConfirmPass(e.target.value)}
                    placeholder="Re-enter password"
                  />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.85rem' }}>
                  Update Password
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ==================== CUSTOMER BOOKING HISTORY ==================== */}
        {currentPage === 'history' && (
          <div>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1.5rem' }}>Your Bookings History</h2>

            <BookingHistoryList
              onCancel={(id) => {
                if (confirm('Are you sure you want to cancel this booking?')) {
                  api.bookings.cancel(id)
                    .then(res => {
                      alert(res.message);
                      // Force reload
                      setCurrentPage('home');
                    })
                    .catch(err => alert(err.message));
                }
              }}
            />
          </div>
        )}

        {/* ==================== STAFF CONCESSION & CHECK-IN PANEL ==================== */}
        {currentPage === 'staff-panel' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>

            {/* Ticket validator */}
            <div className="glass" style={{ padding: '2rem', borderRadius: '1rem', height: 'fit-content' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem', color: 'var(--color-primary)' }}>Gate Ticket Validator</h3>

              <form onSubmit={handleTicketValidation} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <input
                  type="text"
                  placeholder="Scan QR or Enter Ticket Code..."
                  value={ticketSearchCode}
                  onChange={(e) => setTicketSearchCode(e.target.value)}
                  className="form-input"
                  required
                />
                <button type="submit" className="btn btn-primary">Validate</button>
              </form>

              {validationError && (
                <div style={{ color: 'var(--color-error)', background: 'rgba(239,68,68,0.1)', padding: '1rem', borderRadius: '0.5rem', fontSize: '0.9rem', fontWeight: 600 }}>
                  ❌ {validationError}
                </div>
              )}

              {validationResult && (
                <div style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid var(--color-success)', padding: '1.5rem', borderRadius: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ color: 'var(--color-success)', fontWeight: 800, fontSize: '1.1rem' }}>
                    ✅ TICKET VALIDATED SUCCESSFULLY
                  </div>
                  <div><strong>Movie:</strong> {validationResult.ticket.movie_title}</div>
                  <div><strong>Time:</strong> {new Date(validationResult.ticket.start_time).toLocaleString()}</div>
                  <div><strong>Room:</strong> {validationResult.ticket.room_name}</div>
                  <div><strong>Holder:</strong> {validationResult.ticket.customer_name}</div>
                  <div><strong>Price:</strong> {parseFloat(validationResult.ticket.final_price).toLocaleString()} VND</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Ticket ID: #{validationResult.ticket.id} • Status: USED</div>
                </div>
              )}
            </div>

            {/* Counter snacks sales */}
            <div className="glass" style={{ padding: '2rem', borderRadius: '1rem' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem', color: 'var(--color-primary)' }}>Counter Concessions POS</h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                {foodItems.map(food => (
                  <div key={food.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 600 }}>{food.name}</div>
                      <div style={{ color: 'var(--color-primary)', fontSize: '0.85rem', fontWeight: 700 }}>{parseFloat(food.price).toLocaleString()} VND</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <button onClick={() => setPosCart({ ...posCart, [food.id]: Math.max(0, (posCart[food.id] || 0) - 1) })} className="btn btn-secondary" style={{ padding: '0.2rem 0.5rem' }}>-</button>
                      <strong>{posCart[food.id] || 0}</strong>
                      <button onClick={() => setPosCart({ ...posCart, [food.id]: (posCart[food.id] || 0) + 1 })} className="btn btn-secondary" style={{ padding: '0.2rem 0.5rem' }}>+</button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="form-group">
                <label className="form-label">Customer Email (Optional):</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="customer@email.com"
                  value={posCustomerEmail}
                  onChange={(e) => setPosCustomerEmail(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.2rem', margin: '1.5rem 0' }}>
                <span>Subtotal:</span>
                <span style={{ color: 'var(--color-primary)' }}>
                  {Object.keys(posCart).reduce((acc, id) => {
                    const food = foodItems.find(f => f.id === parseInt(id));
                    return acc + (parseFloat(food?.price || 0) * (posCart[id] || 0));
                  }, 0).toLocaleString()} VND
                </span>
              </div>

              <button onClick={executePosSale} className="btn btn-primary" style={{ width: '100%', padding: '0.85rem' }}>
                Process Payment & Print Receipt
              </button>
            </div>
          </div>
        )}

        {/* ==================== MANAGER DASHBOARD & REPORTS ==================== */}
        {currentPage === 'manager-panel' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0, minHeight: '80vh' }}>
            {/* Dashboard Header */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(245,158,11,0.12) 0%, rgba(239,68,68,0.08) 100%)',
              border: '1px solid rgba(245,158,11,0.2)',
              borderRadius: '1.25rem',
              padding: '2rem 2.5rem',
              marginBottom: '2rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
                  <span style={{ fontSize: '1.75rem' }}>🎬</span>
                  <h2 style={{ fontSize: '1.85rem', fontWeight: 800, background: 'linear-gradient(90deg,#f59e0b,#ef4444)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    Management Center
                  </h2>
                </div>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                  Manage movies, showtimes, concessions, revenue reports, and user accounts.
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Logged in as</div>
                <div style={{ fontWeight: 700, fontSize: '1.05rem' }}>{user?.full_name}</div>
                <span style={{
                  display: 'inline-block',
                  marginTop: '0.35rem',
                  padding: '0.2rem 0.75rem',
                  borderRadius: '9999px',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  background: user?.role === 'ADMIN' ? 'rgba(168,85,247,0.2)' : 'rgba(245,158,11,0.15)',
                  color: user?.role === 'ADMIN' ? '#a855f7' : 'var(--color-primary)',
                  border: `1px solid ${user?.role === 'ADMIN' ? 'rgba(168,85,247,0.4)' : 'rgba(245,158,11,0.3)'}`,
                }}>
                  {user?.role}
                </span>
              </div>
            </div>

            {/* Tab Navigation + Content layout */}
            <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '1.75rem', alignItems: 'start' }}>
              {/* Sidebar Nav */}
              <div className="glass" style={{ borderRadius: '1rem', padding: '0.75rem', position: 'sticky', top: '6rem' }}>
                {[
                  { key: 'movies', icon: '🎥', label: 'Movies' },
                  { key: 'showtimes', icon: '🕐', label: 'Showtimes' },
                  { key: 'concessions', icon: '🍿', label: 'Concessions' },
                  { key: 'reports', icon: '📊', label: 'Reports' },
                  ...(user?.role === 'ADMIN' ? [{ key: 'users', icon: '👥', label: 'Users', action: loadUsers }] : []),
                ].map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => { if (tab.action) tab.action(); setDashboardTab(tab.key); }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      width: '100%',
                      padding: '0.8rem 1rem',
                      borderRadius: '0.625rem',
                      border: 'none',
                      cursor: 'pointer',
                      marginBottom: '0.25rem',
                      fontWeight: 600,
                      fontSize: '0.9rem',
                      transition: 'all 0.2s ease',
                      background: dashboardTab === tab.key
                        ? 'linear-gradient(135deg, rgba(245,158,11,0.2), rgba(239,68,68,0.12))'
                        : 'transparent',
                      color: dashboardTab === tab.key ? 'var(--color-primary)' : 'var(--color-text-muted)',
                      borderLeft: dashboardTab === tab.key ? '3px solid var(--color-primary)' : '3px solid transparent',
                    }}
                  >
                    <span style={{ fontSize: '1.1rem' }}>{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Main Content */}
              <div>

                {/* TAB CONTENT: MOVIES */}
                {dashboardTab === 'movies' && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.75rem' }}>
                    {/* Add Movie Form */}
                    <form onSubmit={handleCreateMovie} className="glass" style={{ padding: '1.75rem', borderRadius: '1rem', height: 'fit-content' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
                        <span style={{ fontSize: '1.25rem' }}>➕</span>
                        <h4 style={{ fontWeight: 700, fontSize: '1.05rem' }}>Add New Movie</h4>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Movie Title</label>
                        <input type="text" required className="form-input" value={movieForm.title} onChange={e => setMovieForm({ ...movieForm, title: e.target.value })} placeholder="Enter movie title..." />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Genres (comma-separated)</label>
                        <input type="text" className="form-input" value={movieForm.categories} onChange={e => setMovieForm({ ...movieForm, categories: e.target.value })} placeholder="Action, Adventure" />
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                        <div className="form-group">
                          <label className="form-label">Duration (min)</label>
                          <input type="number" required className="form-input" value={movieForm.duration} onChange={e => setMovieForm({ ...movieForm, duration: parseInt(e.target.value) })} />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Age Rating</label>
                          <select className="form-input" value={movieForm.age_rating} onChange={e => setMovieForm({ ...movieForm, age_rating: e.target.value })}>
                            <option value="P">P (General)</option>
                            <option value="K">K (Kids)</option>
                            <option value="T13">T13 (13+)</option>
                            <option value="T16">T16 (16+)</option>
                            <option value="T18">T18 (18+)</option>
                          </select>
                        </div>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Status</label>
                        <select className="form-input" value={movieForm.status} onChange={e => setMovieForm({ ...movieForm, status: e.target.value })}>
                          <option value="COMING_SOON">Coming Soon</option>
                          <option value="SHOWING">Now Showing</option>
                          <option value="ENDED">Ended</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Poster URL</label>
                        <input type="text" className="form-input" value={movieForm.poster_url} onChange={e => setMovieForm({ ...movieForm, poster_url: e.target.value })} placeholder="https://..." />
                      </div>
                      <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
                        🎬 Create Movie
                      </button>
                    </form>

                    {/* Movies Table */}
                    <div className="glass" style={{ borderRadius: '1rem', padding: '1.75rem', overflow: 'hidden' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                        <h4 style={{ fontWeight: 700, fontSize: '1.05rem' }}>Movies Library</h4>
                        <span style={{
                          background: 'rgba(245,158,11,0.15)', color: 'var(--color-primary)',
                          padding: '0.2rem 0.75rem', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 700
                        }}>{movies.length} titles</span>
                      </div>
                      <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                          <thead>
                            <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                              {['ID', 'Title', 'Genres', 'Duration', 'Status', 'Actions'].map(h => (
                                <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', color: 'var(--color-text-muted)', fontWeight: 600, fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {movies.map(m => (
                              <tr key={m.id} style={{ borderBottom: '1px solid var(--color-border)', transition: 'background 0.15s' }}
                                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                              >
                                <td style={{ padding: '0.875rem 1rem', color: 'var(--color-text-muted)', fontFamily: 'monospace', fontSize: '0.8rem' }}>#{m.id}</td>
                                <td style={{ padding: '0.875rem 1rem', fontWeight: 600, maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.title}</td>
                                <td style={{ padding: '0.875rem 1rem', color: 'var(--color-text-muted)', fontSize: '0.82rem' }}>{m.categories || '—'}</td>
                                <td style={{ padding: '0.875rem 1rem', color: 'var(--color-text-muted)' }}>{m.duration}m</td>
                                <td style={{ padding: '0.875rem 1rem' }}>
                                  <select
                                    value={m.status}
                                    onChange={e => handleUpdateMovieStatus(m.id, e.target.value)}
                                    style={{
                                      padding: '0.3rem 0.5rem',
                                      borderRadius: '0.4rem',
                                      border: '1px solid var(--color-border)',
                                      background: m.status === 'SHOWING' ? 'rgba(16,185,129,0.12)' : m.status === 'COMING_SOON' ? 'rgba(245,158,11,0.12)' : 'rgba(156,163,175,0.1)',
                                      color: m.status === 'SHOWING' ? 'var(--color-success)' : m.status === 'COMING_SOON' ? 'var(--color-primary)' : 'var(--color-text-muted)',
                                      fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer',
                                    }}
                                  >
                                    <option value="COMING_SOON">Coming Soon</option>
                                    <option value="SHOWING">Now Showing</option>
                                    <option value="ENDED">Ended</option>
                                  </select>
                                </td>
                                <td style={{ padding: '0.875rem 1rem' }}>
                                  <button onClick={() => handleDeleteMovie(m.id)} className="btn btn-danger" style={{ padding: '0.3rem 0.7rem', fontSize: '0.75rem', gap: '0.25rem' }}>
                                    🗑 Delete
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB CONTENT: SHOWTIMES */}
                {dashboardTab === 'showtimes' && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.75rem' }}>
                    <form onSubmit={handleCreateShowtime} className="glass" style={{ padding: '1.75rem', borderRadius: '1rem', height: 'fit-content' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
                        <span style={{ fontSize: '1.25rem' }}>🕐</span>
                        <h4 style={{ fontWeight: 700, fontSize: '1.05rem' }}>Schedule Showtime</h4>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Movie</label>
                        <select required className="form-input" value={showtimeForm.movie_id || ''} onChange={e => setShowtimeForm({ ...showtimeForm, movie_id: e.target.value ? parseInt(e.target.value) : '' })}>
                          <option value="">— Select Movie —</option>
                          {allMovies.map(m => (
                            <option key={m.id} value={m.id}>{m.title}</option>
                          ))}
                        </select>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                        <div className="form-group">
                          <label className="form-label">Room ID</label>
                          <input type="number" required className="form-input" value={showtimeForm.room_id} onChange={e => setShowtimeForm({ ...showtimeForm, room_id: parseInt(e.target.value) })} placeholder="e.g. 1" />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Format</label>
                          <select className="form-input" value={showtimeForm.format_name} onChange={e => setShowtimeForm({ ...showtimeForm, format_name: e.target.value })}>
                            <option value="2D">2D</option>
                            <option value="3D">3D</option>
                            <option value="IMAX">IMAX</option>
                            <option value="4DX">4DX</option>
                          </select>
                        </div>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                        <div className="form-group">
                          <label className="form-label">Base Price (VND)</label>
                          <input type="number" className="form-input" value={showtimeForm.base_price} onChange={e => setShowtimeForm({ ...showtimeForm, base_price: parseFloat(e.target.value) })} />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Surcharge (VND)</label>
                          <input type="number" className="form-input" value={showtimeForm.price_surcharge} onChange={e => setShowtimeForm({ ...showtimeForm, price_surcharge: parseFloat(e.target.value) })} />
                        </div>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Start Date & Time</label>
                        <input type="datetime-local" required className="form-input" value={showtimeForm.start_time} onChange={e => setShowtimeForm({ ...showtimeForm, start_time: e.target.value })} />
                      </div>
                      <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
                        📅 Schedule Showtime
                      </button>
                    </form>

                    <div className="glass" style={{ borderRadius: '1rem', padding: '1.75rem' }}>
                      <div style={{ marginBottom: '1.25rem' }}>
                        <h4 style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: '0.4rem' }}>Scheduled Showtimes</h4>
                        <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>Conflict checks prevent overlapping screenings in the same room.</p>
                      </div>
                      <ShowtimesList />
                    </div>
                  </div>
                )}

                {/* TAB CONTENT: CONCESSIONS */}
                {dashboardTab === 'concessions' && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.75rem' }}>
                    <form onSubmit={handleCreateFood} className="glass" style={{ padding: '1.75rem', borderRadius: '1rem', height: 'fit-content' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
                        <span style={{ fontSize: '1.25rem' }}>🍿</span>
                        <h4 style={{ fontWeight: 700, fontSize: '1.05rem' }}>Add Concession Item</h4>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Item Name</label>
                        <input type="text" required className="form-input" value={foodForm.name} onChange={e => setFoodForm({ ...foodForm, name: e.target.value })} placeholder="e.g. Large Popcorn" />
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                        <div className="form-group">
                          <label className="form-label">Category</label>
                          <select className="form-input" value={foodForm.type} onChange={e => setFoodForm({ ...foodForm, type: e.target.value })}>
                            <option value="FOOD">🍔 Food</option>
                            <option value="DRINK">🥤 Drink</option>
                            <option value="COMBO">🎁 Combo</option>
                          </select>
                        </div>
                        <div className="form-group">
                          <label className="form-label">Price (VND)</label>
                          <input type="number" required className="form-input" value={foodForm.price} onChange={e => setFoodForm({ ...foodForm, price: parseFloat(e.target.value) })} />
                        </div>
                      </div>
                      <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
                        ➕ Add Item
                      </button>
                    </form>

                    <div className="glass" style={{ borderRadius: '1rem', padding: '1.75rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                        <h4 style={{ fontWeight: 700, fontSize: '1.05rem' }}>Concessions Catalog</h4>
                        <span style={{ background: 'rgba(245,158,11,0.15)', color: 'var(--color-primary)', padding: '0.2rem 0.75rem', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 700 }}>
                          {foodItems.length} items
                        </span>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
                        {foodItems.map(f => (
                          <div key={f.id} style={{
                            padding: '1rem 1.25rem',
                            borderRadius: '0.75rem',
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid var(--color-border)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            transition: 'border-color 0.2s',
                          }}
                            onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(245,158,11,0.3)'}
                            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--color-border)'}
                          >
                            <div>
                              <div style={{ fontWeight: 600, marginBottom: '0.2rem' }}>{f.name}</div>
                              <span style={{
                                fontSize: '0.7rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: '9999px',
                                background: f.type === 'FOOD' ? 'rgba(245,158,11,0.15)' : f.type === 'DRINK' ? 'rgba(16,185,129,0.15)' : 'rgba(168,85,247,0.15)',
                                color: f.type === 'FOOD' ? 'var(--color-primary)' : f.type === 'DRINK' ? 'var(--color-success)' : '#a855f7',
                              }}>{f.type === 'FOOD' ? '🍔 Food' : f.type === 'DRINK' ? '🥤 Drink' : '🎁 Combo'}</span>
                            </div>
                            <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--color-primary)', whiteSpace: 'nowrap' }}>
                              {parseFloat(f.price).toLocaleString()}đ
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB CONTENT: REPORTS */}
                {dashboardTab === 'reports' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
                    {/* Revenue Report Card */}
                    <div className="glass" style={{ padding: '1.75rem', borderRadius: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
                        <span style={{ fontSize: '1.25rem' }}>💰</span>
                        <h3 style={{ fontWeight: 800, fontSize: '1.15rem' }}>Branch Revenue Report</h3>
                      </div>
                      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                        <div>
                          <label className="form-label">Start Date</label>
                          <input type="date" className="form-input" style={{ width: 'auto' }} value={repStart} onChange={e => setRepStart(e.target.value)} />
                        </div>
                        <div>
                          <label className="form-label">End Date</label>
                          <input type="date" className="form-input" style={{ width: 'auto' }} value={repEnd} onChange={e => setRepEnd(e.target.value)} />
                        </div>
                        <button onClick={loadManagerReports} className="btn btn-primary">📊 Generate Report</button>
                      </div>

                      {revenueReport && (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem' }}>
                          {[
                            { label: 'Ticket Revenue', value: `${parseFloat(revenueReport.summary.ticket_booking_revenue).toLocaleString()}đ`, icon: '🎟', color: 'var(--color-primary)' },
                            { label: 'Concessions Revenue', value: `${parseFloat(revenueReport.summary.standalone_concessions_revenue).toLocaleString()}đ`, icon: '🍿', color: '#a855f7' },
                            { label: 'Total Revenue', value: `${parseFloat(revenueReport.summary.total_revenue).toLocaleString()}đ`, icon: '💵', color: 'var(--color-success)', big: true },
                            { label: 'Paid Orders', value: revenueReport.summary.paid_bookings_count + revenueReport.summary.paid_standalone_food_orders_count, icon: '✅', color: 'var(--color-success)' },
                          ].map((stat, i) => (
                            <div key={i} style={{
                              padding: '1.25rem',
                              borderRadius: '0.875rem',
                              background: `linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))`,
                              border: `1px solid ${stat.color}33`,
                              textAlign: 'center',
                            }}>
                              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{stat.icon}</div>
                              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.4rem', fontWeight: 500 }}>{stat.label}</div>
                              <div style={{ fontSize: stat.big ? '1.4rem' : '1.15rem', fontWeight: 800, color: stat.color }}>{stat.value}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* System Diagnostics */}
                    {adminReport && (
                      <div className="glass" style={{ padding: '1.75rem', borderRadius: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
                          <span style={{ fontSize: '1.25rem' }}>🖥</span>
                          <h3 style={{ fontWeight: 800, fontSize: '1.15rem' }}>System Diagnostics</h3>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem' }}>
                          {[
                            {
                              title: '👤 Users', color: 'var(--color-primary)',
                              items: [
                                { label: 'Customers', value: adminReport.users.customers },
                                { label: 'Staff', value: adminReport.users.staff },
                                { label: 'Managers', value: adminReport.users.managers },
                              ]
                            },
                            {
                              title: '🎫 Bookings', color: 'var(--color-success)',
                              items: [
                                { label: 'Paid', value: adminReport.bookings.paid, color: 'var(--color-success)' },
                                { label: 'Pending', value: adminReport.bookings.pending, color: 'var(--color-primary)' },
                                { label: 'Cancelled', value: adminReport.bookings.cancelled, color: 'var(--color-error)' },
                              ]
                            },
                            {
                              title: '📽 Catalog', color: '#a855f7',
                              items: [
                                { label: 'Movies', value: adminReport.catalog.movies },
                                { label: 'Showtimes', value: adminReport.catalog.showtimes },
                              ]
                            },
                          ].map((group, i) => (
                            <div key={i} style={{ padding: '1.25rem', borderRadius: '0.875rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--color-border)' }}>
                              <div style={{ fontWeight: 700, marginBottom: '1rem', paddingBottom: '0.6rem', borderBottom: '1px solid var(--color-border)', color: group.color }}>{group.title}</div>
                              {group.items.map((item, j) => (
                                <div key={j} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.35rem 0' }}>
                                  <span style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>{item.label}</span>
                                  <span style={{ fontWeight: 700, fontSize: '1rem', color: item.color || group.color }}>{item.value}</span>
                                </div>
                              ))}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* TAB CONTENT: USER ACCOUNTS (ADMIN ONLY) */}
                {dashboardTab === 'users' && user?.role === 'ADMIN' && (
                  <div className="glass" style={{ borderRadius: '1rem', padding: '1.75rem', overflow: 'hidden' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <span style={{ fontSize: '1.25rem' }}>👥</span>
                        <h4 style={{ fontWeight: 700, fontSize: '1.05rem' }}>User Accounts & Role Management</h4>
                      </div>
                      <span style={{ background: 'rgba(168,85,247,0.15)', color: '#a855f7', padding: '0.2rem 0.75rem', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 700 }}>
                        {userList.length} accounts
                      </span>
                    </div>
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                        <thead>
                          <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                            {['ID', 'Name', 'Email', 'Phone', 'Role', 'Status', 'Actions'].map(h => (
                              <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', color: 'var(--color-text-muted)', fontWeight: 600, fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {userList.map(u => (
                            <tr key={u.user_id} style={{ borderBottom: '1px solid var(--color-border)', transition: 'background 0.15s' }}
                              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                            >
                              <td style={{ padding: '0.875rem 1rem', color: 'var(--color-text-muted)', fontFamily: 'monospace', fontSize: '0.8rem' }}>#{u.user_id}</td>
                              <td style={{ padding: '0.875rem 1rem', fontWeight: 600 }}>{u.full_name}</td>
                              <td style={{ padding: '0.875rem 1rem', color: 'var(--color-text-muted)' }}>{u.email}</td>
                              <td style={{ padding: '0.875rem 1rem', color: 'var(--color-text-muted)' }}>{u.phone}</td>
                              <td style={{ padding: '0.875rem 1rem' }}>
                                <select
                                  value={u.role}
                                  onChange={e => handleUpdateUserRole(u.user_id, e.target.value)}
                                  style={{
                                    padding: '0.3rem 0.5rem', borderRadius: '0.4rem',
                                    border: '1px solid var(--color-border)',
                                    background: 'rgba(255,255,255,0.05)',
                                    color: 'var(--color-text)', fontSize: '0.8rem', cursor: 'pointer'
                                  }}
                                >
                                  <option value="CUSTOMER">Customer</option>
                                  <option value="STAFF">Staff</option>
                                  <option value="MANAGER">Manager</option>
                                  <option value="ADMIN">Admin</option>
                                </select>
                              </td>
                              <td style={{ padding: '0.875rem 1rem' }}>
                                <span style={{
                                  display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                                  padding: '0.2rem 0.6rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700,
                                  background: u.status === 'ACTIVE' ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
                                  color: u.status === 'ACTIVE' ? 'var(--color-success)' : 'var(--color-error)',
                                }}>
                                  {u.status === 'ACTIVE' ? '✓' : '✕'} {u.status}
                                </span>
                              </td>
                              <td style={{ padding: '0.875rem 1rem' }}>
                                <button
                                  onClick={() => handleUpdateUserStatus(u.user_id, u.status === 'ACTIVE' ? 'LOCKED' : 'ACTIVE')}
                                  className={`btn ${u.status === 'ACTIVE' ? 'btn-danger' : 'btn-primary'}`}
                                  style={{ padding: '0.3rem 0.7rem', fontSize: '0.75rem' }}
                                >
                                  {u.status === 'ACTIVE' ? '🔒 Lock' : '🔓 Activate'}
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// Sub-Component: Booking History List (Customer)
function BookingHistoryList({ onCancel }) {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    api.bookings.getMyBookings()
      .then(data => setHistory(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {history.length > 0 ? (
        history.map(b => (
          <div key={b.id} className="glass" style={{ padding: '1.5rem', borderRadius: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-primary)', fontWeight: 700 }}>
                BOOKING ID: #{b.id} • {new Date(b.booking_date).toLocaleString()}
              </div>
              <h3 style={{ margin: '0.25rem 0 0.5rem 0', fontSize: '1.25rem' }}>{b.Showtime.Movie.title}</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                Time: {new Date(b.Showtime.start_time).toLocaleTimeString()} | Room: {b.Showtime.Room.room_name} | Seats:{' '}
                <strong>{b.TicketDetails.map(t => `${t.Seat.seat_row}${t.Seat.seat_number}`).join(', ')}</strong>
              </p>
              <div style={{ marginTop: '0.5rem', fontSize: '0.85rem' }}>
                Status:{' '}
                <span style={{
                  fontWeight: 700,
                  color: b.status === 'PAID' ? 'var(--color-success)' : b.status === 'PENDING' ? 'var(--color-primary)' : 'var(--color-error)'
                }}>
                  {b.status}
                </span>
                {b.status === 'PENDING' && (
                  <span style={{ marginLeft: '1rem', color: 'var(--color-text-muted)' }}>
                    (Holds until: {new Date(b.expired_at).toLocaleTimeString()})
                  </span>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-end' }}>
              <div style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--color-primary)' }}>
                {parseFloat(b.total_price).toLocaleString()} VND
              </div>

              {/* If PAID, display QR code ticket download */}
              {b.status === 'PAID' && (
                <div style={{ padding: '0.5rem', background: '#fff', borderRadius: '4px', display: 'inline-block' }}>
                  {/* Simulation of barcode/QR ticket */}
                  <div style={{ width: '120px', height: '40px', background: 'repeating-linear-gradient(90deg, #000, #000 4px, #fff 4px, #fff 8px)', border: '1px solid #000' }}></div>
                  <div style={{ fontSize: '0.5rem', color: '#000', textAlign: 'center', marginTop: '2px', fontFamily: 'monospace' }}>
                    TICKET_VALID_{b.id}
                  </div>
                </div>
              )}

              {b.status === 'PENDING' && (
                <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
                  Please complete payment.
                </span>
              )}

              {/* Cancel Button */}
              {b.status === 'PENDING' && (
                <button onClick={() => onCancel(b.id)} className="btn btn-danger" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}>
                  Cancel Hold
                </button>
              )}
            </div>
          </div>
        ))
      ) : (
        <div style={{ color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
          No previous movie ticket reservations found.
        </div>
      )}
    </div>
  );
}

// Sub-Component: Showtimes List (Manager)
function ShowtimesList() {
  const [stList, setStList] = useState([]);

  useEffect(() => {
    api.showtimes.list()
      .then(data => setStList(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {stList.map(st => (
        <div key={st.id} className="glass" style={{ padding: '1rem', borderRadius: '0.5rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
          <div>
            <strong style={{ fontSize: '1rem' }}>{st.Movie.title}</strong>
            <div>Room: {st.Room.room_name} • Format: {st.format_name}</div>
            <div style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>
              {new Date(st.start_time).toLocaleString()} to {new Date(st.end_time).toLocaleTimeString()}
            </div>
          </div>
          <div style={{ textAlign: 'right', alignSelf: 'center' }}>
            <div style={{ fontWeight: 700 }}>{parseFloat(st.base_price).toLocaleString()} VND</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-primary)' }}>{st.status}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default App;
