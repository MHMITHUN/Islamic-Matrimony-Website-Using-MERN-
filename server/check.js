require('dotenv').config();
const Biodata = require('./models/Biodata');
const connectDB = require('./config/db');

connectDB().then(async () => {
    const count = await Biodata.countDocuments({});
    const sukoon = await Biodata.countDocuments({ sukoon: true });
    console.log('Total biodatas:', count);
    console.log('Sukoon marked:', sukoon);
    // Try manually marking some
    const samples = await Biodata.find({}).limit(5).select('_id biodataId biodataType');
    console.log('Sample biodatas:', JSON.stringify(samples, null, 2));
    process.exit(0);
});
