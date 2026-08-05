const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');
const Biodata = require('./models/Biodata');
const SuccessStory = require('./models/SuccessStory');
const connectDB = require('./config/db');

const seedData = async () => {
    try {
        await connectDB();

        console.log('🗑️  Clearing existing data...');
        await User.deleteMany({});
        await Biodata.deleteMany({});
        await SuccessStory.deleteMany({});

        console.log('👤 Creating admin user...');
        const admin = await User.create({
            name: 'Admin',
            email: 'admin@islamicmatrimony.com',
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
            'Arif Chowdhury', 'Nasir Udding', 'Kamal Hossain', 'Sajid Ahmed', 'Murad Ali',
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

        const maleImages = [
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
            'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
            'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400',
            'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
            'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400',
            'https://images.unsplash.com/photo-1463453091185-61582044d556?w=400',
            'https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=400',
            'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400',
            'https://images.unsplash.com/photo-1522556189639-b150ed9c4330?w=400',
            'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=400'
        ];

        const femaleImages = [
            'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
            'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
            'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400',
            'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400',
            'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400',
            'https://images.unsplash.com/photo-1506863530036-1efeddceb993?w=400',
            'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400',
            'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400',
            'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400'
        ];

        const users = [];

        for (let i = 0; i < 50; i++) {
            users.push({
                name: maleNames[i],
                email: `${maleNames[i].toLowerCase().replace(/\s+/g, '.')}@example.com`,
                role: 'user',
                isPremium: i < 40
            });
        }

        for (let i = 0; i < 50; i++) {
            users.push({
                name: femaleNames[i],
                email: `${femaleNames[i].toLowerCase().replace(/\s+/g, '.')}@example.com`,
                role: 'user',
                isPremium: i < 40
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
                premiumRequestStatus: user.isPremium ? 'approved' : 'none'
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
                premiumRequestStatus: user.isPremium ? 'approved' : 'none'
            });
        }

        await Biodata.insertMany(biodatas);

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

        console.log('✅ Seed data created successfully!');
        console.log('📊 Summary:');
        console.log(`   - Admin: admin@islamicmatrimony.com`);
        console.log(`   - Users: ${createdUsers.length}`);
        console.log(`   - Male Biodatas: 50`);
        console.log(`   - Female Biodatas: 50`);
        console.log(`   - Total Biodatas: ${biodatas.length}`);
        console.log(`   - Success Stories: 5`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding data:', error);
        process.exit(1);
    }
};

seedData();
