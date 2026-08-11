const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');
const Biodata = require('./models/Biodata');
const SuccessStory = require('./models/SuccessStory');
const ContactRequest = require('./models/ContactRequest');
const ContactMessage = require('./models/ContactMessage');
const ServiceProvider = require('./models/ServiceProvider');
const Endorsement = require('./models/Endorsement');
const { computeTrust } = require('./lib/trust');
const connectDB = require('./config/db');

const seedData = async () => {
    try {
        await connectDB();

        console.log('🗑️  Clearing existing data...');
        await User.deleteMany({});
        await Biodata.deleteMany({});
        await SuccessStory.deleteMany({});
        await ContactRequest.deleteMany({});
        await ContactMessage.deleteMany({});
        await ServiceProvider.deleteMany({});
        await Endorsement.deleteMany({});

        console.log('👤 Creating admin user...');
        const adminEmail = (process.env.ADMIN_EMAIL || 'admin@islamicmatrimony.com').trim();
        const admin = await User.create({
            name: 'Admin',
            email: adminEmail,
            photoURL: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
            role: 'admin',
            isPremium: true,
            premiumRequestStatus: 'approved'
        });

        console.log('👥 Creating 100 users...');
        const maleNames = [
            'Abdullah Rahman', 'Mohammad Hasan', 'Ahmed Ali', 'Ibrahim Khan', 'Yusuf Mahmud',
            'Omar Farooq', 'Khalid Hussain', 'Tariq Aziz', 'Bilal Sheikh', 'Hamza Chowdhury',
            'Sufyan Islam', 'Rashid Alam', 'Imran Siddique', 'Faisal Karim', 'Adnan Miah',
            'Zubair Hossain', 'Salman Ahmed', 'Waseem Uddin', 'Junaid Akbar', 'Kamran Iqbal',
            'Nabil Rahman', 'Rizwan Ali', 'Fahad Khan', 'Azhar Hussain', 'Shakil Mahmood',
            'Arif Chowdhury', 'Nasir Uddin', 'Kamal Hossain', 'Sajid Ahmed', 'Murad Ali',
            'Saif Rahman', 'Tanvir Islam', 'Asif Khan', 'Rafi Mahmud', 'Amin Haque',
            'Naeem Siddique', 'Harun Rashid', 'Farhan Alam', 'Shafiq Aziz', 'Zahir Karim',
            'Mahbub Rahman', 'Iqbal Hussain', 'Salam Sheikh', 'Kashem Ali', 'Jamal Khan',
            'Munir Ahmed', 'Habib Islam', 'Taher Chowdhury', 'Raihan Hossain', 'Momin Uddin'
        ];

        const femaleNames = [
            'Fatima Khatun', 'Ayesha Begum', 'Khadija Akter', 'Zainab Rahman', 'Maryam Islam',
            'Hafsa Ahmed', 'Ruqayyah Khan', 'Sumayyah Hasan', 'Aisha Sultana', 'Safiyyah Begum',
            'Hafiza Noor', 'Amina Siddique', 'Rahma Chowdhury', 'Salma Akhter', 'Nusrat Jahan',
            'Tasneem Parvin', 'Farah Nazneen', 'Lubna Karim', 'Sadia Rahman', 'Farhana Begum',
            'Bushra Akter', 'Naima Islam', 'Sabrina Khan', 'Humayra Ahmed', 'Mehrun Nesa',
            'Razia Sultana', 'Shahnaz Begum', 'Nasima Akter', 'Anjum Ara', 'Tanzila Khatun',
            'Masuma Rahman', 'Rahima Islam', 'Shirin Ahmed', 'Dilruba Khan', 'Maksuda Begum',
            'Shamima Akhter', 'Ferdous Jahan', 'Hosneara Parvin', 'Roksana Nazneen', 'Sharmin Sultana',
            'Tahmina Akter', 'Nasreen Begum', 'Rowshan Ara', 'Sultana Rahman', 'Parveen Khatun',
            'Yasmin Islam', 'Rubina Ahmed', 'Nazma Begum', 'Rehana Akter', 'Asma Khatun'
        ];

        // 100% Verified Muslim men with beard/kufi
        const maleImages = [
            'https://images.unsplash.com/photo-1584043720379-b56cd9199c94?w=400&fit=crop',
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&fit=crop',
            'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&fit=crop',
            'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&fit=crop',
            'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&fit=crop',
            'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&fit=crop',
            'https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=400&fit=crop',
            'https://images.unsplash.com/photo-1522556189639-b150ed9c4330?w=400&fit=crop',
            'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=400&fit=crop',
            'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&fit=crop'
        ];

        // 100% Verified Muslim women with hijab/niqab
        const femaleImages = [
            'https://images.unsplash.com/photo-1574297500578-afae55026ff3?w=400&fit=crop',
            'https://images.unsplash.com/photo-1545039539-69addd43b249?w=400&fit=crop',
            'https://images.unsplash.com/photo-1585728748176-455ac5eed962?w=400&fit=crop',
            'https://images.unsplash.com/photo-1613611864136-0ace2a3b9926?w=400&fit=crop',
            'https://images.unsplash.com/photo-1559468213-7650336d390d?w=400&fit=crop',
            'https://images.unsplash.com/photo-1547527392-bd5d50305ca0?w=400&fit=crop',
            'https://images.unsplash.com/photo-1613837770636-cae46b162c28?w=400&fit=crop',
            'https://images.unsplash.com/photo-1662806407800-56793fa8e924?w=400&fit=crop',
            'https://images.unsplash.com/photo-1589998059171-989d887dda6e?w=400&fit=crop',
            'https://images.unsplash.com/photo-1522219406764-db207f1f7640?w=400&fit=crop'
        ];

        const users = [];

        for (let i = 0; i < 50; i++) {
            let isPrem = i < 15;
            let reqStatus = isPrem ? 'approved' : (i >= 15 && i < 20 ? 'pending' : 'none');
            users.push({
                name: maleNames[i],
                email: `${maleNames[i].toLowerCase().replace(/\s+/g, '.')}@example.com`,
                role: 'user',
                isPremium: isPrem,
                premiumRequestStatus: reqStatus
            });
        }

        for (let i = 0; i < 50; i++) {
            let isPrem = i < 15;
            let reqStatus = isPrem ? 'approved' : (i >= 15 && i < 20 ? 'pending' : 'none');
            users.push({
                name: femaleNames[i],
                email: `${femaleNames[i].toLowerCase().replace(/\s+/g, '.')}@example.com`,
                role: 'user',
                isPremium: isPrem,
                premiumRequestStatus: reqStatus
            });
        }

        const createdUsers = await User.insertMany(users);

        console.log('📝 Creating 100 biodatas...');

        const divisions = ['Dhaka', 'Chattagram', 'Sylhet', 'Khulna', 'Rangpur', 'Barisal', 'Mymensingh'];
        const occupations = ['Engineer', 'Doctor', 'Teacher', 'Business', 'Job', 'Student', 'Housewife', 'Other'];
        const races = ['Fair', 'Light Brown', 'Brown', 'Dark'];
        const heights = ['5\'2"', '5\'3"', '5\'4"', '5\'5"', '5\'6"', '5\'7"', '5\'8"', '5\'9"', '5\'10"', '5\'11"', '6\'0"'];

        const biodatas = [];

        for (let i = 0; i < 50; i++) {
            const user = createdUsers[i];
            const age = 25 + Math.floor(Math.random() * 11);
            const height = heights[6 + Math.floor(Math.random() * 5)];

            biodatas.push({
                biodataId: i + 1,
                userId: user._id,
                userEmail: user.email,
                biodataType: 'Male',
                name: maleNames[i],
                profileImage: maleImages[i % maleImages.length],
                dateOfBirth: new Date(new Date().getFullYear() - age, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
                height: height,
                weight: `${70 + Math.floor(Math.random() * 15)}-${75 + Math.floor(Math.random() * 15)} kg`,
                age: age,
                occupation: occupations[Math.floor(Math.random() * occupations.length)],
                race: races[Math.floor(Math.random() * races.length)],
                fathersName: `Abdul ${['Rahman', 'Karim', 'Aziz', 'Latif', 'Malik'][Math.floor(Math.random() * 5)]}`,
                mothersName: `${['Amina', 'Fatima', 'Khadija', 'Ayesha', 'Zainab'][Math.floor(Math.random() * 5)]} Begum`,
                permanentDivision: divisions[Math.floor(Math.random() * divisions.length)],
                presentDivision: divisions[Math.floor(Math.random() * divisions.length)],
                expectedPartnerAge: `${age - 5}-${age + 2}`,
                expectedPartnerHeight: heights[Math.floor(Math.random() * 5)],
                expectedPartnerWeight: '48-60 kg',
                mobileNumber: `+8801${7 + Math.floor(Math.random() * 2)}${Math.floor(Math.random() * 10000000).toString().padStart(8, '0')}`,
                isPremium: user.isPremium,
                premiumRequestStatus: user.premiumRequestStatus
            });
        }

        for (let i = 0; i < 50; i++) {
            const user = createdUsers[50 + i];
            const age = 22 + Math.floor(Math.random() * 9);
            const height = heights[Math.floor(Math.random() * 5)];

            biodatas.push({
                biodataId: 51 + i,
                userId: user._id,
                userEmail: user.email,
                biodataType: 'Female',
                name: femaleNames[i],
                profileImage: femaleImages[i % femaleImages.length],
                dateOfBirth: new Date(new Date().getFullYear() - age, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
                height: height,
                weight: `${45 + Math.floor(Math.random() * 10)}-${50 + Math.floor(Math.random() * 10)} kg`,
                age: age,
                occupation: occupations[Math.floor(Math.random() * occupations.length)],
                race: races[Math.floor(Math.random() * races.length)],
                fathersName: `${['Mohammad', 'Abdul', 'Ahmed', 'Ibrahim', 'Yusuf'][Math.floor(Math.random() * 5)]} ${['Rahman', 'Khan', 'Ali', 'Hossain', 'Islam'][Math.floor(Math.random() * 5)]}`,
                mothersName: `${['Fatima', 'Amina', 'Khadija', 'Ayesha', 'Halima'][Math.floor(Math.random() * 5)]} ${['Begum', 'Khatun', 'Akter'][Math.floor(Math.random() * 3)]}`,
                permanentDivision: divisions[Math.floor(Math.random() * divisions.length)],
                presentDivision: divisions[Math.floor(Math.random() * divisions.length)],
                expectedPartnerAge: `${age}-${age + 10}`,
                expectedPartnerHeight: heights[5 + Math.floor(Math.random() * 5)],
                expectedPartnerWeight: '65-80 kg',
                mobileNumber: `+8801${7 + Math.floor(Math.random() * 2)}${Math.floor(Math.random() * 10000000).toString().padStart(8, '0')}`,
                isPremium: user.isPremium,
                premiumRequestStatus: user.premiumRequestStatus
            });
        }

        await Biodata.insertMany(biodatas);

        console.log('💳 Creating sample contact requests...');
        const contactRequests = [
            {
                requesterId: createdUsers[0]._id,
                requesterEmail: createdUsers[0].email,
                requesterName: createdUsers[0].name,
                biodataId: 51,
                biodataUserId: createdUsers[50]._id,
                status: 'approved',
                paymentId: 'pi_3Mtw2eLkdIwHu7ix0AaBbCc1',
                amount: 500
            },
            {
                requesterId: createdUsers[1]._id,
                requesterEmail: createdUsers[1].email,
                requesterName: createdUsers[1].name,
                biodataId: 52,
                biodataUserId: createdUsers[51]._id,
                status: 'pending',
                paymentId: 'pi_3Mtw2eLkdIwHu7ix0AaBbCc2',
                amount: 500
            },
            {
                requesterId: createdUsers[2]._id,
                requesterEmail: createdUsers[2].email,
                requesterName: createdUsers[2].name,
                biodataId: 53,
                biodataUserId: createdUsers[52]._id,
                status: 'approved',
                paymentId: 'pi_3Mtw2eLkdIwHu7ix0AaBbCc3',
                amount: 500
            },
            {
                requesterId: createdUsers[50]._id,
                requesterEmail: createdUsers[50].email,
                requesterName: createdUsers[50].name,
                biodataId: 1,
                biodataUserId: createdUsers[0]._id,
                status: 'pending',
                paymentId: 'pi_3Mtw2eLkdIwHu7ix0AaBbCc4',
                amount: 500
            },
            {
                requesterId: createdUsers[51]._id,
                requesterEmail: createdUsers[51].email,
                requesterName: createdUsers[51].name,
                biodataId: 2,
                biodataUserId: createdUsers[1]._id,
                status: 'approved',
                paymentId: 'pi_3Mtw2eLkdIwHu7ix0AaBbCc5',
                amount: 500
            }
        ];
        await ContactRequest.insertMany(contactRequests);

        console.log('📩 Creating sample contact messages...');
        await ContactMessage.insertMany([
            {
                name: 'Tariq Islam',
                email: 'tariq.islam@example.com',
                subject: 'Payment verification inquiry',
                message: 'Assalamu Alaikum, I completed payment for contact request on Biodata #51. Kindly verify my request.',
                status: 'new'
            },
            {
                name: 'Nusrat Jahan',
                email: 'nusrat.jahan@example.com',
                subject: 'How to make profile premium?',
                message: 'Assalamu Alaikum admin, I want to upgrade my profile to Premium. Please guide me on the process.',
                status: 'read'
            },
            {
                name: 'Tanvir Hossain',
                email: 'tanvir.hossain@example.com',
                subject: 'Feedback on website UX',
                message: 'MashaAllah, the website is very clean and easy to navigate. May Allah bless your efforts!',
                status: 'new'
            }
        ]);

        console.log('💍 Creating sample success stories...');
        await SuccessStory.insertMany([
            {
                selfBiodataId: 1,
                partnerBiodataId: 51,
                maleBiodataId: 1,
                femaleBiodataId: 51,
                coupleImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600',
                marriageDate: new Date('2024-06-15'),
                reviewStar: 5,
                successStoryText: 'Alhamdulillah, we found each other through this platform. After months of talking and understanding each other, our families agreed and we had a beautiful Nikah ceremony. This platform made the process so easy and halal. Highly recommended for all Muslims looking for a life partner!',
                userId: createdUsers[0]._id
            },
            {
                selfBiodataId: 3,
                partnerBiodataId: 55,
                maleBiodataId: 3,
                femaleBiodataId: 55,
                coupleImage: 'https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?w=600',
                marriageDate: new Date('2024-03-20'),
                reviewStar: 5,
                successStoryText: 'SubhanAllah! I was skeptical about online matrimony platforms, but Nikah Matrimony proved me wrong. The verification process and Islamic approach gave me confidence. Within 3 months of joining, I found my perfect match. May Allah bless this platform!',
                userId: createdUsers[2]._id
            },
            {
                selfBiodataId: 5,
                partnerBiodataId: 60,
                maleBiodataId: 5,
                femaleBiodataId: 60,
                coupleImage: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600',
                marriageDate: new Date('2024-01-10'),
                reviewStar: 4,
                successStoryText: 'JazakAllah khair to this wonderful platform. We connected, spoke with our families, and everything fell into place so smoothly. The premium features really helped us communicate properly. Now we are happily married and blessed with a beautiful life together.',
                userId: createdUsers[4]._id
            },
            {
                selfBiodataId: 8,
                partnerBiodataId: 65,
                maleBiodataId: 8,
                femaleBiodataId: 65,
                coupleImage: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=600',
                marriageDate: new Date('2024-08-25'),
                reviewStar: 5,
                successStoryText: 'MashaAllah, Allah answered our dua through this platform. We both were looking for practicing Muslims who value deen, and Alhamdulillah we found that in each other. Our nikah was beautiful and our journey has been blessed. May Allah reward the team behind this platform!',
                userId: createdUsers[7]._id
            },
            {
                selfBiodataId: 12,
                partnerBiodataId: 70,
                maleBiodataId: 12,
                femaleBiodataId: 70,
                coupleImage: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=600',
                marriageDate: new Date('2023-12-05'),
                reviewStar: 5,
                successStoryText: 'After losing hope in finding a suitable match, my family suggested I try Nikah Matrimony. Within weeks, I connected with my spouse. Our values, goals, and understanding of deen aligned perfectly. Today we are happily married with Allah\'s blessings. JazakAllah khair!',
                userId: createdUsers[11]._id
            }
        ]);

        // ===================== FLAGSHIP SEED DATA =====================
        console.log('🛡️  Seeding flagship data (imams, kazis, counselors, tazkiya, sukoon)...');

        // ---- Imam user + ServiceProviders ----
        const imamUser = await User.create({
            name: 'Imam Yusuf Ahmad',
            email: 'imam.yusuf@nikah.demo',
            photoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&fit=crop',
            role: 'imam',
            isPremium: true,
        });

        await ServiceProvider.create([
            // ---- IMAMS ----
            {
                name: 'Imam Yusuf Ahmad', userId: imamUser._id, serviceType: 'imam',
                title: 'Head Imam', organization: 'Jamuna Masjid', city: 'Dhaka', area: 'Gulshan',
                phone: '+8801710000001', email: 'imam.yusuf@nikah.demo',
                photoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&fit=crop',
                bio: 'Head Imam of Jamuna Masjid with 15 years of community service. Specializes in Tazkiya attestation and pre-marriage guidance for couples.',
                specialties: ['Tazkiya attestation', 'Nikah ceremony', 'Marriage guidance', 'Conflict resolution'],
                languages: ['Bangla', 'English', 'Arabic'], yearsExperience: 15, rating: 4.9, reviewCount: 48,
                verified: true, active: true, partnerSince: new Date('2023-01-01')
            },
            {
                name: 'Imam Abdul Karim', serviceType: 'imam',
                title: 'Imam & Khateeb', organization: 'Baitul Mukarram South Gate Masjid', city: 'Dhaka', area: 'Motijheel',
                phone: '+8801711000002',
                photoURL: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&fit=crop',
                bio: 'Serving as Imam for over 20 years. Known for his deep knowledge of Islamic jurisprudence related to marriage and family law.',
                specialties: ['Islamic family law', 'Tazkiya attestation', 'Nikah ceremony'],
                languages: ['Bangla', 'Arabic', 'Urdu'], yearsExperience: 20, rating: 4.8, reviewCount: 61,
                verified: true, active: true, partnerSince: new Date('2023-03-15')
            },
            {
                name: 'Mawlana Tariqul Islam', serviceType: 'imam',
                title: 'Imam', organization: 'Central Mosque Chattagram', city: 'Chattagram', area: 'Agrabad',
                phone: '+8801812000003',
                photoURL: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&fit=crop',
                bio: 'Hafiz and Alim with expertise in community reconciliation and premarital counseling.',
                specialties: ['Tazkiya attestation', 'Community counseling', 'Premarital guidance'],
                languages: ['Bangla', 'Arabic'], yearsExperience: 12, rating: 4.7, reviewCount: 29,
                verified: true, active: true, partnerSince: new Date('2023-06-01')
            },
            {
                name: 'Imam Hafiz Rahmatullah', serviceType: 'imam',
                title: 'Imam & Hifz Teacher', organization: 'Sylhet Grand Mosque', city: 'Sylhet', area: 'Ambarkhana',
                phone: '+8801613000004',
                photoURL: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&fit=crop',
                bio: 'Hafiz of the Holy Quran and community Imam. Provides character attestations for members of his congregation.',
                specialties: ['Tazkiya attestation', 'Quran teaching', 'Marriage ceremony'],
                languages: ['Bangla', 'Arabic'], yearsExperience: 10, rating: 4.6, reviewCount: 22,
                verified: true, active: true, partnerSince: new Date('2024-01-10')
            },
            {
                name: 'Sheikh Aminul Haque', serviceType: 'imam',
                title: 'Imam & Islamic Scholar', organization: 'Baitul Aman Masjid', city: 'Khulna', area: 'Sonadanga',
                phone: '+8801914000005',
                photoURL: 'https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=400&fit=crop',
                bio: 'Islamic scholar specializing in Fiqh al-Munakahaat (Islamic Marriage Law). Available for Tazkiya endorsements and Nikah ceremonies.',
                specialties: ['Islamic marriage law', 'Tazkiya attestation', 'Nikah ceremony'],
                languages: ['Bangla', 'Arabic', 'English'], yearsExperience: 18, rating: 4.9, reviewCount: 55,
                verified: true, active: true, partnerSince: new Date('2023-02-20')
            },

            // ---- KAZIS ----
            {
                name: 'Kazi Abdul Wahab', serviceType: 'kazi',
                title: 'Licensed Nikah Registrar', organization: 'Dhaka City Kazi Office', city: 'Dhaka', area: 'Mirpur',
                phone: '+8801715000001',
                photoURL: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&fit=crop',
                bio: 'Government-registered Nikah Registrar with 12 years of experience. Handles all legal documentation for Islamic marriages in Dhaka.',
                specialties: ['Nikah registration', 'Marriage certificate', 'Legal documentation'],
                languages: ['Bangla'], fee: 5000, yearsExperience: 12, rating: 4.7, reviewCount: 83,
                verified: true, active: true, partnerSince: new Date('2023-01-01')
            },
            {
                name: 'Kazi Rafiq Uddin', serviceType: 'kazi',
                title: 'Licensed Kazi', organization: 'Chattagram Kazi Office', city: 'Chattagram', area: 'Nasirabad',
                phone: '+8801716000002',
                photoURL: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=400&fit=crop',
                bio: 'Serving the Chattagram division for over 8 years as a licensed Kazi. Known for his efficiency and transparent process.',
                specialties: ['Nikah registration', 'Marriage documentation'],
                languages: ['Bangla'], fee: 4000, yearsExperience: 8, rating: 4.5, reviewCount: 46,
                verified: true, active: true, partnerSince: new Date('2023-04-01')
            },
            {
                name: 'Kazi Mosharraf Hossain', serviceType: 'kazi',
                title: 'Senior Nikah Registrar', organization: 'Sylhet Sadar Kazi Office', city: 'Sylhet', area: 'Zindabazar',
                phone: '+8801717000003',
                bio: 'Senior Nikah Registrar serving Sylhet for 15 years. Available for home visits for elderly or differently-abled families.',
                specialties: ['Nikah registration', 'Home visits', 'Marriage documentation'],
                languages: ['Bangla', 'Sylheti'], fee: 3500, yearsExperience: 15, rating: 4.8, reviewCount: 37,
                verified: true, active: true, partnerSince: new Date('2023-07-15')
            },
            {
                name: 'Kazi Shafiul Islam', serviceType: 'kazi',
                title: 'Licensed Kazi', organization: 'Rajshahi Kazi Office', city: 'Rajshahi', area: 'Shaheb Bazaar',
                phone: '+8801718000004',
                bio: 'Licensed Kazi serving Rajshahi. Experienced in handling international marriages (NRBs returning to Bangladesh).',
                specialties: ['Nikah registration', 'NRB marriages', 'Legal documentation'],
                languages: ['Bangla', 'English'], fee: 4500, yearsExperience: 9, rating: 4.6, reviewCount: 28,
                verified: true, active: true, partnerSince: new Date('2024-02-01')
            },

            // ---- COUNSELORS ----
            {
                name: 'Dr. Sarah Karim', serviceType: 'counselor',
                title: 'Islamic Family Counselor (PhD)', organization: 'Barakah Counseling Center', city: 'Dhaka', area: 'Dhanmondi',
                phone: '+8801719000001', email: 'sarah.karim@barakah.demo',
                photoURL: 'https://images.unsplash.com/photo-1559468213-7650336d390d?w=400&fit=crop',
                bio: 'PhD in Family Psychology. Specializes in premarital counseling grounded in Islamic principles. Has helped over 200 couples build strong, faith-centered marriages.',
                specialties: ['Premarital counseling', 'Conflict resolution', 'Divorce counseling', 'Communication skills'],
                languages: ['Bangla', 'English'], fee: 2000, yearsExperience: 10, rating: 4.9, reviewCount: 127,
                verified: true, active: true, partnerSince: new Date('2023-01-01')
            },
            {
                name: 'Br. Mahmud Hasan', serviceType: 'counselor',
                title: 'Islamic Family Counselor', organization: 'Sylhet Islamic Center', city: 'Sylhet', area: 'Upashahar',
                phone: '+8801720000002',
                bio: 'Certified family counselor with a focus on Islamic principles. Helps couples and families navigate relationship challenges through the lens of Quran and Sunnah.',
                specialties: ['Premarital counseling', 'Family reconciliation', 'Anger management'],
                languages: ['Bangla', 'English'], fee: 1500, yearsExperience: 6, rating: 4.7, reviewCount: 54,
                verified: true, active: true, partnerSince: new Date('2023-05-20')
            },
            {
                name: 'Sr. Nusaiba Rahman', serviceType: 'counselor',
                title: 'Women\'s Wellness Counselor', organization: 'Noor Counseling', city: 'Chattagram', area: 'GEC Circle',
                phone: '+8801821000003',
                photoURL: 'https://images.unsplash.com/photo-1547527392-bd5d50305ca0?w=400&fit=crop',
                bio: 'Specialized in women\'s mental and emotional wellness within an Islamic framework. Particularly experienced in supporting widows and divorcees seeking second marriages.',
                specialties: ['Women\'s wellness', 'Sukoon guidance', 'Trauma recovery', 'Premarital counseling'],
                languages: ['Bangla', 'English'], fee: 1800, yearsExperience: 8, rating: 4.8, reviewCount: 71,
                verified: true, active: true, partnerSince: new Date('2023-08-01')
            },
            {
                name: 'Ustaz Farhan Abdullah', serviceType: 'counselor',
                title: 'Islamic Life Coach & Counselor', organization: 'Tarbiyyah Institute', city: 'Dhaka', area: 'Uttara',
                phone: '+8801722000004',
                photoURL: 'https://images.unsplash.com/photo-1522556189639-b150ed9c4330?w=400&fit=crop',
                bio: 'Life coach and counselor helping young Muslims build healthy relationships based on Islamic values. Conducts group workshops and individual sessions.',
                specialties: ['Premarital counseling', 'Youth guidance', 'Communication skills', 'Islamic life coaching'],
                languages: ['Bangla', 'English', 'Arabic'], fee: 1200, yearsExperience: 5, rating: 4.6, reviewCount: 39,
                verified: true, active: true, partnerSince: new Date('2024-03-01')
            }
        ]);

        // ---- Tazkiya endorsements ----
        if (biodatas.length > 10) {
            const target = biodatas[2];
            const endorsers = [createdUsers[3], createdUsers[4], createdUsers[5]];
            for (const e of endorsers) {
                await Endorsement.create({
                    endorserId: e._id, endorserEmail: e.email, endorserName: e.name, endorserRole: 'user',
                    endorserTrustAtSubmit: 0,
                    endorsedBiodataId: target.biodataId, endorsedUserId: target.userId, endorsedName: target.name,
                    categories: ['honest', 'good_character', 'prays_regularly'],
                    weight: 1, note: 'A trustworthy, practicing brother.'
                });
            }
            await Endorsement.create({
                endorserId: imamUser._id, endorserEmail: imamUser.email, endorserName: imamUser.name, endorserRole: 'imam',
                endorserTrustAtSubmit: 0,
                endorsedBiodataId: target.biodataId, endorsedUserId: target.userId, endorsedName: target.name,
                categories: ['good_character', 'knowledgeable_deen', 'prays_regularly'],
                weight: 10, note: 'Attested by a verified Imam — known to the masjid community.'
            });
            await computeTrust(target.biodataId);
        }

        // ---- Sukoon (second-marriage) profiles ----
        console.log('🌿 Marking Sukoon profiles...');

        // 4 male Sukoon profiles (divorced/widowed)
        const sukoonMaleIndices = [20, 22, 24, 26];
        const sukoonMaleStatuses = ['Divorced', 'Widowed', 'Divorced', 'Divorced'];
        const sukoonMaleChildren = [
            { hasChildren: true, childrenCount: 1, childrenLivingWith: 'Yes' },
            { hasChildren: false, childrenCount: 0, childrenLivingWith: '' },
            { hasChildren: true, childrenCount: 2, childrenLivingWith: 'Shared' },
            { hasChildren: false, childrenCount: 0, childrenLivingWith: '' },
        ];

        for (let i = 0; i < sukoonMaleIndices.length; i++) {
            const idx = sukoonMaleIndices[i];
            if (idx < biodatas.length) {
                const bioId = biodatas[idx].biodataId;
                await Biodata.findOneAndUpdate({ biodataId: bioId }, {
                    maritalStatus: sukoonMaleStatuses[i],
                    hasChildren: sukoonMaleChildren[i].hasChildren,
                    childrenCount: sukoonMaleChildren[i].childrenCount,
                    childrenLivingWith: sukoonMaleChildren[i].childrenLivingWith || undefined,
                    sukoon: true,
                    sukoonPhotoReveal: 'blurred',
                    religiousCommitment: 'Practicing',
                    prayerFrequency: 'Five Daily',
                });
            }
        }

        // 4 female Sukoon profiles
        const sukoonFemaleRawIndices = [50, 52, 54, 56]; // female biodatas start at index 50 in the array
        const sukoonFemaleStatuses = ['Divorced', 'Widowed', 'Divorced', 'Widowed'];
        const sukoonFemaleChildren = [
            { hasChildren: true, childrenCount: 1, childrenLivingWith: 'Yes' },
            { hasChildren: true, childrenCount: 2, childrenLivingWith: 'Yes' },
            { hasChildren: false, childrenCount: 0, childrenLivingWith: '' },
            { hasChildren: false, childrenCount: 0, childrenLivingWith: '' },
        ];

        for (let i = 0; i < sukoonFemaleRawIndices.length; i++) {
            const idx = sukoonFemaleRawIndices[i];
            if (idx < biodatas.length) {
                const bioId = biodatas[idx].biodataId;
                await Biodata.findOneAndUpdate({ biodataId: bioId }, {
                    maritalStatus: sukoonFemaleStatuses[i],
                    hasChildren: sukoonFemaleChildren[i].hasChildren,
                    childrenCount: sukoonFemaleChildren[i].childrenCount,
                    childrenLivingWith: sukoonFemaleChildren[i].childrenLivingWith || undefined,
                    sukoon: true,
                    sukoonPhotoReveal: 'blurred',
                    religiousCommitment: 'Practicing',
                    prayerFrequency: 'Five Daily',
                });
            }
        }

        console.log('✅ Seed data created successfully!');
        console.log('📊 Summary:');
        console.log(`   - Admin: ${adminEmail}`);
        console.log(`   - Imam user: imam.yusuf@nikah.demo`);
        console.log(`   - Users: ${createdUsers.length}`);
        console.log(`   - Male Biodatas: 50`);
        console.log(`   - Female Biodatas: 50`);
        console.log(`   - Total Biodatas: ${biodatas.length}`);
        console.log(`   - Sukoon profiles: 8 (4 male, 4 female)`);
        console.log(`   - Service Providers: 5 Imams + 4 Kazis + 4 Counselors`);
        console.log(`   - Contact Requests: ${contactRequests.length}`);
        console.log(`   - Success Stories: 5`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding data:', error);
        process.exit(1);
    }
};

seedData();
