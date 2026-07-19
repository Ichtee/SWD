const { sequelize, Cinema, User, Movie, Room, Seat, Showtime, FoodItem } = require('./models');

const seedDatabase = async () => {
    try {
        console.log('Synchronizing database (force: true)...');
        await sequelize.sync({ force: true });
        console.log('Database synced. Seeding database contents...');

        // 1. Create Cinema Branch
        const cinema1 = await Cinema.create({
            cinema_name: 'CGV Vincom Center',
            city: 'Hanoi',
            address: '54A Nguyen Chi Thanh, Dong Da, Hanoi',
            phone: '02437759999',
            status: 'ACTIVE'
        });
        console.log('Created Cinema branch.');

        // 2. Create Users
        const users = [
            {
                full_name: 'Admin System',
                email: 'admin@cinema.com',
                password: 'admin123',
                phone: '0987654321',
                role: 'ADMIN',
                status: 'ACTIVE'
            },
            {
                full_name: 'Manager Branch',
                email: 'manager@cinema.com',
                password: 'manager123',
                phone: '0912345678',
                role: 'MANAGER',
                status: 'ACTIVE'
            },
            {
                full_name: 'Staff Counter',
                email: 'staff@cinema.com',
                password: 'staff123',
                phone: '0901234567',
                role: 'STAFF',
                status: 'ACTIVE'
            },
            {
                full_name: 'John Doe Customer',
                email: 'customer@cinema.com',
                password: 'customer123',
                phone: '0933334444',
                role: 'CUSTOMER',
                status: 'ACTIVE'
            }
        ];

        // We must create users sequentially so that hooks (bcrypt hashing) trigger properly
        for (const u of users) {
            await User.create({
                ...u,
                raw_password: u.password
            });
        }
        console.log('Created Users:');
        console.log('- Admin: admin@cinema.com / admin123');
        console.log('- Manager: manager@cinema.com / manager123');
        console.log('- Staff: staff@cinema.com / staff123');
        console.log('- Customer: customer@cinema.com / customer123');

        // 2. Create Movies
        const movies = [
            {
                title: 'Doctor Strange in the Multiverse of Madness',
                categories: 'Action, Fantasy, Sci-Fi',
                duration: 126,
                release_date: '2026-05-04',
                description: 'Doctor Strange teams up with a mysterious teenage girl from his dreams who can travel across multiverses, to battle multiple threats, including alternate-universe versions of himself.',
                poster_url: 'https://images.unsplash.com/photo-1618336753974-aae8e04506aa?q=80&w=300&auto=format&fit=crop',
                banner_url: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=800&auto=format&fit=crop',
                trailer_url: 'https://www.youtube.com/embed/aWzlQ2N6qqg',
                language: 'English (Subbed)',
                director: 'Sam Raimi',
                cast: 'Benedict Cumberbatch, Elizabeth Olsen, Chiwetel Ejiofor',
                age_rating: 'T13',
                status: 'SHOWING'
            },
            {
                title: 'Minions: The Rise of Gru',
                categories: 'Animation, Comedy, Family',
                duration: 87,
                release_date: '2026-07-01',
                description: 'The untold story of one twelve-year-old\'s dream to become the world\'s greatest supervillain.',
                poster_url: 'https://images.unsplash.com/photo-1608889175123-8ec330b86f84?q=80&w=300&auto=format&fit=crop',
                banner_url: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=800&auto=format&fit=crop',
                trailer_url: 'https://www.youtube.com/embed/Hh91H8Mizn8',
                language: 'Vietnamese (Dubbed)',
                director: 'Kyle Balda',
                cast: 'Steve Carell, Pierre Coffin, Alan Arkin',
                age_rating: 'P',
                status: 'SHOWING'
            },
            {
                title: 'Avatar: The Way of Water',
                categories: 'Action, Adventure, Sci-Fi',
                duration: 192,
                release_date: '2026-12-16',
                description: 'Jake Sully lives with his newfound family formed on the extrasolar moon Pandora. Once a familiar threat returns to finish what was previously started, Jake must work with Neytiri and the army of the Na\'vi race to protect their home.',
                poster_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=300&auto=format&fit=crop',
                banner_url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=800&auto=format&fit=crop',
                trailer_url: 'https://www.youtube.com/embed/d9MyW72ELq0',
                language: 'English (Subbed)',
                director: 'James Cameron',
                cast: 'Sam Worthington, Zoe Saldana, Sigourney Weaver',
                age_rating: 'T13',
                status: 'COMING_SOON'
            }
        ];

        const dbMovies = await Movie.bulkCreate(movies);
        console.log('Created Movies.');

        // 3. Create Rooms
        const room1 = await Room.create({
            cinema_id: cinema1.cinema_id,
            room_name: 'Room 1 (IMAX)',
            capacity: 20,
            screen_type: 'IMAX',
            status: 'ACTIVE'
        });

        const room2 = await Room.create({
            cinema_id: cinema1.cinema_id,
            room_name: 'Room 2 (Standard 2D)',
            capacity: 10,
            screen_type: '2D',
            status: 'ACTIVE'
        });

        console.log('Created Screening Rooms.');

        // 4. Create Seats for Room 1 (20 seats: Row A 1-10, Row B 1-10)
        const seats1 = [];
        for (let i = 1; i <= 10; i++) {
            seats1.push({
                room_id: room1.room_id,
                seat_row: 'A',
                seat_number: i,
                seat_type: 'NORMAL'
            });
        }
        for (let i = 1; i <= 8; i++) {
            seats1.push({
                room_id: room1.room_id,
                seat_row: 'B',
                seat_number: i,
                seat_type: 'VIP'
            });
        }
        // Couple seats in Row B
        seats1.push({
            room_id: room1.room_id,
            seat_row: 'B',
            seat_number: 9,
            seat_type: 'COUPLE'
        });
        seats1.push({
            room_id: room1.room_id,
            seat_row: 'B',
            seat_number: 10,
            seat_type: 'COUPLE'
        });

        // Seats for Room 2 (10 seats: Row A 1-10)
        const seats2 = [];
        for (let i = 1; i <= 8; i++) {
            seats2.push({
                room_id: room2.room_id,
                seat_row: 'A',
                seat_number: i,
                seat_type: 'NORMAL'
            });
        }
        seats2.push({
            room_id: room2.room_id,
            seat_row: 'A',
            seat_number: 9,
            seat_type: 'COUPLE'
        });
        seats2.push({
            room_id: room2.room_id,
            seat_row: 'A',
            seat_number: 10,
            seat_type: 'COUPLE'
        });

        await Seat.bulkCreate(seats1);
        await Seat.bulkCreate(seats2);
        console.log('Generated Seating layouts.');

        // 5. Create Showtimes
        const today = new Date();
        
        // Showtime 1: Movie 1, Room 1 (IMAX), starts in 2 hours
        const startTime1 = new Date(today.getTime() + 2 * 60 * 60 * 1000);
        const endTime1 = new Date(startTime1.getTime() + (dbMovies[0].duration + 15) * 60 * 1000);

        // Showtime 2: Movie 2, Room 2 (2D), starts in 5 hours
        const startTime2 = new Date(today.getTime() + 5 * 60 * 60 * 1000);
        const endTime2 = new Date(startTime2.getTime() + (dbMovies[1].duration + 15) * 60 * 1000);

        await Showtime.create({
            movie_id: dbMovies[0].movie_id,
            room_id: room1.room_id,
            format_name: 'IMAX',
            price_surcharge: 50000.00,
            start_time: startTime1,
            end_time: endTime1,
            base_price: 120000.00,
            status: 'SCHEDULED'
        });

        await Showtime.create({
            movie_id: dbMovies[1].movie_id,
            room_id: room2.room_id,
            format_name: '2D',
            price_surcharge: 0.00,
            start_time: startTime2,
            end_time: endTime2,
            base_price: 80000.00,
            status: 'SCHEDULED'
        });

        console.log('Created Showtimes schedules.');

        // 6. Concessions items
        const foodItems = [
            {
                name: 'Single Popcorn',
                type: 'FOOD',
                price: 55000.00,
                status: 'AVAILABLE',
                description: '1 Bag of sweet/salty popcorn (M)'
            },
            {
                name: 'Soda Coke Drink',
                type: 'DRINK',
                price: 35000.00,
                status: 'AVAILABLE',
                description: '1 Cup of Coca-Cola (L)'
            },
            {
                name: 'Single Combo (1 Popcorn + 1 Coke)',
                type: 'COMBO',
                price: 80000.00,
                status: 'AVAILABLE',
                description: '1 Popcorn bag (M) and 1 drink (L) cup'
            },
            {
                name: 'Couple Combo (1 Popcorn Large + 2 Coke)',
                type: 'COMBO',
                price: 115000.00,
                status: 'AVAILABLE',
                description: '1 Big popcorn bag (L) and 2 soft drinks (L)'
            }
        ];

        await FoodItem.bulkCreate(foodItems);
        console.log('Populated Food and Concessions inventory.');

        console.log('Seeding Database Completed successfully!');
        process.exit(0);
    } catch (err) {
        console.error('Failed to seed database:', err);
        process.exit(1);
    }
};

seedDatabase();
