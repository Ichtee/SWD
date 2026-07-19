const BASE_URL = 'http://localhost:9999/api';

const runVerification = async () => {
    try {
        console.log('=== STARTING EXTENDED INTEGRATION VERIFICATION ===');

        // 1. Log in as Customer
        console.log('\n[1] Logging in as Customer...');
        const logRes = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'customer@cinema.com',
                password: 'customer123'
            })
        });
        const logData = await logRes.json();
        if (!logRes.ok) throw new Error(`Login failed: ${logData.error}`);
        const customerToken = logData.token;
        const customerId = logData.user.id;
        console.log('Logged in successfully. Customer ID:', customerId);

        // 1.1 Test profile retrieval
        console.log('\n[1.1] Fetching customer profile...');
        const profileRes = await fetch(`${BASE_URL}/users/profile`, {
            headers: { 'Authorization': `Bearer ${customerToken}` }
        });
        const profileData = await profileRes.json();
        if (!profileRes.ok) throw new Error(`Fetch profile failed: ${profileData.message}`);
        console.log('Profile retrieved. Name:', profileData.data.user.full_name, 'Favorites count:', profileData.data.favoriteCount);

        // 1.2 Test profile update
        console.log('\n[1.2] Updating customer profile...');
        const profileUpdateRes = await fetch(`${BASE_URL}/users/profile`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${customerToken}`
            },
            body: JSON.stringify({
                fullName: 'John Doe Customer Updated',
                phone: '0988887777',
                avatar: 'http://avatar.url/avatar.jpg'
            })
        });
        const profileUpdateData = await profileUpdateRes.json();
        if (!profileUpdateRes.ok) throw new Error(`Update profile failed: ${profileUpdateData.message}`);
        console.log('Profile updated successfully. New phone:', profileUpdateData.data.phone);

        // 2. Add movie to favorites (nested movie route)
        console.log('\n[2] Adding movie 1 to favorites via nested route...');
        const favRes = await fetch(`${BASE_URL}/movies/1/favorite`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${customerToken}`
            }
        });
        const favData = await favRes.json();
        if (!favRes.ok) throw new Error(`Favorite failed: ${favData.error}`);
        console.log('Movie added to favorites successfully.');

        // 3. Get favorites list via /api/users/favorites
        console.log('\n[3] Fetching favorites list via users route...');
        const listFavRes = await fetch(`${BASE_URL}/users/favorites`, {
            headers: { 'Authorization': `Bearer ${customerToken}` }
        });
        const listFavData = await listFavRes.json();
        if (!listFavRes.ok) throw new Error(`Fetch favorites failed: ${listFavData.error || JSON.stringify(listFavData)}`);
        const favorites = listFavData.data || listFavData;
        console.log(`Favorites found: ${favorites.length} movies.`);
        if (favorites.length === 0 || favorites[0].movie_id !== 1) {
            throw new Error(`Favorites list mismatch: Expected movie_id 1, got ${favorites.length > 0 ? favorites[0].movie_id : 'empty'}`);
        }

        // 4. Remove movie from favorites (nested movie route)
        console.log('\n[4] Removing movie 1 from favorites via nested route...');
        const removeFavRes = await fetch(`${BASE_URL}/movies/1/favorite`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${customerToken}` }
        });
        const removeFavData = await removeFavRes.json();
        if (!removeFavRes.ok) throw new Error('Remove favorite failed');
        console.log('Movie removed from favorites.');

        // 4.5 Create booking hold & payment to allow review submission
        console.log('\n[4.5] Creating successful booking for movie 1 (required for review)...');
        const seatsRes = await fetch(`${BASE_URL}/showtimes/1/seats`, {
            headers: { 'Authorization': `Bearer ${customerToken}` }
        });
        const seatsData = await seatsRes.json();
        if (!seatsRes.ok) throw new Error('Fetch showtime seats failed');
        const firstSeat = seatsData.seats.find(s => s.status === 'AVAILABLE');
        if (!firstSeat) throw new Error('No available seats for Showtime 1');
        const seatId = firstSeat.seat_id;
        console.log(`Selected seat ID: ${seatId} (${firstSeat.seat_row}${firstSeat.seat_number})`);

        const bookRes = await fetch(`${BASE_URL}/bookings`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${customerToken}`
            },
            body: JSON.stringify({
                showtime_id: 1,
                seat_ids: [seatId],
                food_items: []
            })
        });
        const bookData = await bookRes.json();
        if (!bookRes.ok) throw new Error(`Booking hold failed: ${bookData.error}`);
        const bookingId = bookData.booking.id;
        console.log(`Booking hold created successfully. ID: ${bookingId}`);

        const payRes = await fetch(`${BASE_URL}/payments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${customerToken}`
            },
            body: JSON.stringify({
                booking_id: bookingId,
                method: 'E_WALLET'
            })
        });
        const payData = await payRes.json();
        if (!payRes.ok) throw new Error(`Payment failed: ${payData.error}`);
        console.log('Payment processed successfully. Booking is now PAID.');

        // 5. Submit review for a movie
        console.log('\n[5] Submitting review...');
        const revRes = await fetch(`${BASE_URL}/reviews`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${customerToken}`
            },
            body: JSON.stringify({
                movie_id: 1,
                rating: 5,
                comment: 'Absolutely amazing movie!'
            })
        });
        const revData = await revRes.json();
        if (!revRes.ok) throw new Error(`Review submit failed: ${revData.error}`);
        console.log('Review submitted successfully.');

        // 6. Get movie reviews
        console.log('\n[6] Fetching movie reviews...');
        const getRevRes = await fetch(`${BASE_URL}/reviews/movie/1`);
        const getRevData = await getRevRes.json();
        if (!getRevRes.ok) throw new Error('Fetch reviews failed');
        const reviews = getRevData.data || getRevData;
        console.log(`Found ${reviews.length} reviews for movie 1.`);
        if (reviews.length === 0 || reviews[0].comment !== 'Absolutely amazing movie!') {
            throw new Error('Review comment mismatch');
        }

        // 7. Get user notifications
        console.log('\n[7] Fetching customer notifications...');
        const notifRes = await fetch(`${BASE_URL}/notifications`, {
            headers: { 'Authorization': `Bearer ${customerToken}` }
        });
        const notifData = await notifRes.json();
        if (!notifRes.ok) throw new Error('Fetch notifications failed');
        const notifications = notifData.data || notifData;
        console.log(`Found ${notifications.length} notifications.`);

        // 8. Log in as Admin
        console.log('\n[8] Logging in as Admin...');
        const adminLogRes = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'admin@cinema.com',
                password: 'admin123'
            })
        });
        const adminLogData = await adminLogRes.json();
        if (!adminLogRes.ok) throw new Error(`Admin login failed: ${adminLogData.error}`);
        const adminToken = adminLogData.token;
        console.log('Admin logged in successfully.');

        // 9. Admin gets user list
        console.log('\n[9] Admin fetching user list...');
        const usersRes = await fetch(`${BASE_URL}/users`, {
            headers: { 'Authorization': `Bearer ${adminToken}` }
        });
        const users = await usersRes.json();
        if (!usersRes.ok) throw new Error('Fetch user list failed');
        console.log(`Found ${users.length} users registered in system.`);

        // 10. Admin updates user status (lock & unlock)
        console.log('\n[10] Admin locking user account...');
        const lockRes = await fetch(`${BASE_URL}/users/${customerId}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${adminToken}`
            },
            body: JSON.stringify({ status: 'LOCKED' })
        });
        const lockData = await lockRes.json();
        if (!lockRes.ok) throw new Error('Lock failed');
        console.log('User status updated to:', lockData.user.status);

        // Verify user cannot log in while locked
        console.log('Verifying locked user cannot log in...');
        const failLogRes = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'customer@cinema.com',
                password: 'customer123'
            })
        });
        const failLogData = await failLogRes.json();
        if (failLogRes.ok) throw new Error('User log in succeeded but should have failed');
        console.log('Login rejected correctly with error:', failLogData.error);

        // Unlock user account
        console.log('Admin unlocking user account...');
        const unlockRes = await fetch(`${BASE_URL}/users/${customerId}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${adminToken}`
            },
            body: JSON.stringify({ status: 'ACTIVE' })
        });
        const unlockData = await unlockRes.json();
        if (!unlockRes.ok) throw new Error('Unlock failed');
        console.log('User status updated to:', unlockData.user.status);

        console.log('\n=============================================');
        console.log('🎉 ALL EXTENDED SYSTEM MODULES VERIFIED SUCCESSFULLY! 🎉');
        console.log('=============================================');
        process.exit(0);
    } catch (err) {
        console.error('\n❌ EXTENDED VERIFICATION TEST FAILED:', err.message);
        process.exit(1);
    }
};

runVerification();
