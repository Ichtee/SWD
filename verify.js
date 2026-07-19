const BASE_URL = 'http://localhost:9999/api';

const runVerification = async () => {
    try {
        console.log('=== STARTING INTEGRATION VERIFICATION ===');
        
        // 1. Test Customer Register
        console.log('\n[1] Registering a new customer account...');
        const email = `customer_test_${Date.now()}@test.com`;
        const regRes = await fetch(`${BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                full_name: 'Jane Doe Tester',
                email,
                password: 'password123',
                phone: '0911223344'
            })
        });
        const regData = await regRes.json();
        if (!regRes.ok) throw new Error(`Register failed: ${regData.error}`);
        console.log('Customer registered successfully. Token received.');
        const customerToken = regData.token;

        // 2. Test Customer Login
        console.log('\n[2] Logging in with customer account...');
        const logRes = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email,
                password: 'password123'
            })
        });
        const logData = await logRes.json();
        if (!logRes.ok) throw new Error(`Login failed: ${logData.error}`);
        console.log('Customer login successful. Token verified.');

        // 3. Test Retrieve Movies Catalog
        console.log('\n[3] Fetching movies catalog...');
        const moviesRes = await fetch(`${BASE_URL}/movies`);
        const movies = await moviesRes.json();
        if (!moviesRes.ok) throw new Error(`Fetch movies failed`);
        console.log(`Movies catalog loaded successfully. Found ${movies.length} movies.`);
        const showingMovie = movies.find(m => m.status === 'SHOWING');
        if (!showingMovie) throw new Error('No active showing movies found to test booking');
        console.log(`Selected showing movie for booking: "${showingMovie.title}"`);

        // 4. Retrieve Showtimes for selected movie
        console.log('\n[4] Fetching showtimes for the movie...');
        const showtimesRes = await fetch(`${BASE_URL}/showtimes?movie_id=${showingMovie.movie_id}`);
        const showtimes = await showtimesRes.json();
        if (!showtimesRes.ok) throw new Error(`Fetch showtimes failed`);
        console.log(`Found ${showtimes.length} showtimes.`);
        if (showtimes.length === 0) throw new Error('No showtimes scheduled for test movie');
        const showtime = showtimes[0];

        // 5. Check Seat Layout
        console.log(`\n[5] Fetching room layout for showtime ID: ${showtime.showtime_id}...`);
        const seatsRes = await fetch(`${BASE_URL}/showtimes/${showtime.showtime_id}/seats`);
        const seatData = await seatsRes.json();
        if (!seatsRes.ok) throw new Error(`Fetch room layout failed`);
        console.log(`Room: "${seatData.room_name}". Total seats: ${seatData.seats.length}`);
        const availableSeat = seatData.seats.find(s => s.status === 'AVAILABLE');
        if (!availableSeat) throw new Error('No available seats left for test showtime');
        console.log(`Selected seat: ${availableSeat.seat_row}${availableSeat.seat_number} (Type: ${availableSeat.seat_type})`);

        // 6. Lock Seat and Create Booking
        console.log('\n[6] Creating booking hold for selected seat...');
        const bookingRes = await fetch(`${BASE_URL}/bookings`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${customerToken}`
            },
            body: JSON.stringify({
                showtime_id: showtime.showtime_id,
                seat_ids: [availableSeat.seat_id],
                food_items: [],
                notes: 'Verification test booking'
            })
        });
        const bookingData = await bookingRes.json();
        if (!bookingRes.ok) throw new Error(`Create booking failed: ${bookingData.error}`);
        const booking = bookingData.booking;
        console.log(`Booking created successfully. ID: #${booking.booking_id}, Status: ${booking.status}, Total: ${booking.total_price} VND.`);
        const ticket = booking.TicketDetails[0];

        // 7. Make Payment
        console.log(`\n[7] Processing payment for Booking ID: #${booking.booking_id}...`);
        const paymentRes = await fetch(`${BASE_URL}/payments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${customerToken}`
            },
            body: JSON.stringify({
                booking_id: booking.booking_id,
                method: 'MOMO'
            })
        });
        const paymentData = await paymentRes.json();
        if (!paymentRes.ok) throw new Error(`Payment failed: ${paymentData.error}`);
        console.log(`Payment processed successfully. Status: ${paymentData.payment.status}. Msg: ${paymentData.message}`);

        // 8. Staff login & Validate Ticket
        console.log('\n[8] Logging in as Staff to perform check-in entry check...');
        const staffLogRes = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'staff@cinema.com',
                password: 'staff123'
            })
        });
        const staffLogData = await staffLogRes.json();
        if (!staffLogRes.ok) throw new Error(`Staff login failed: ${staffLogData.error}`);
        const staffToken = staffLogData.token;

        console.log(`Validating customer ticket QR code: ${ticket.qr_code}...`);
        const validateRes = await fetch(`${BASE_URL}/bookings/validate-ticket`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${staffToken}`
            },
            body: JSON.stringify({
                qr_code: ticket.qr_code
            })
        });
        const validateData = await validateRes.json();
        if (!validateRes.ok) throw new Error(`Ticket validation failed: ${validateData.error}`);
        console.log(`Ticket check-in completed. Response: "${validateData.message}"`);
        console.log(`Validated Movie: "${validateData.ticket.movie_title}", Room: "${validateData.ticket.room_name}", Seat Type: ${availableSeat.seat_type}`);

        // 9. Manager login & Get reports
        console.log('\n[9] Logging in as Manager to check revenue reports...');
        const managerLogRes = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'manager@cinema.com',
                password: 'manager123'
            })
        });
        const managerLogData = await managerLogRes.json();
        if (!managerLogRes.ok) throw new Error(`Manager login failed: ${managerLogData.error}`);
        const managerToken = managerLogData.token;

        const dateStr = new Date().toISOString().split('T')[0];
        console.log(`Generating branch revenue report for ${dateStr}...`);
        const reportRes = await fetch(`${BASE_URL}/reports/revenue?startDate=${dateStr}&endDate=${dateStr}`, {
            headers: { 'Authorization': `Bearer ${managerToken}` }
        });
        const reportData = await reportRes.json();
        if (!reportRes.ok) throw new Error(`Generate report failed: ${reportData.error}`);
        console.log(`Revenue Report success. Total revenue for today: ${reportData.summary.total_revenue} VND.`);

        // 10. Verification of notifications
        console.log('\n[10] Fetching notifications for the registered customer...');
        const notificationsRes = await fetch(`${BASE_URL}/notifications`, {
            headers: { 'Authorization': `Bearer ${customerToken}` }
        });
        const resData = await notificationsRes.json();
        if (!notificationsRes.ok) throw new Error('Fetch notifications failed');
        const notificationsList = resData.data || resData;
        console.log(`Found ${notificationsList.length} notifications:`);
        notificationsList.forEach((n, i) => {
            console.log(`  [${i+1}] Title: "${n.title}", Msg: "${n.message}"`);
        });

        console.log('\n=============================================');
        console.log('🎉 ALL INTEGRATION API TESTS PASSED SUCCESSFULLY! 🎉');
        console.log('=============================================');
        process.exit(0);
    } catch (err) {
        console.error('\n❌ VERIFICATION TEST FAILED:', err.message);
        process.exit(1);
    }
};

runVerification();
