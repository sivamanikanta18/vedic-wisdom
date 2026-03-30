import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://sivamanikantacharyasivas:<sivaS_997>@vedicwisdom.oxegx.mongodb.net/?retryWrites=true&w=majority&appName=VedicWisdom';

async function forceFixRoles() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Force update sivamanikanta to folk_guide
    const sivaResult = await User.updateOne(
      { email: { $regex: 'sivamanikanta', $options: 'i' } },
      { $set: { userType: 'folk_guide' } }
    );
    console.log(`✅ siva manikanta: ${sivaResult.modifiedCount} updated to FOLK GUIDE`);

    // Force update admin@gmail.com to admin
    const adminResult = await User.updateOne(
      { email: 'admin@gmail.com' },
      { $set: { userType: 'admin' } }
    );
    console.log(`✅ admin: ${adminResult.modifiedCount} updated to ADMIN`);

    // Set everyone else to folk_boy (except the two above)
    const othersResult = await User.updateMany(
      { 
        email: { 
          $not: { $regex: 'sivamanikanta', $options: 'i' },
          $ne: 'admin@gmail.com'
        }
      },
      { $set: { userType: 'folk_boy' } }
    );
    console.log(`✅ Others: ${othersResult.modifiedCount} updated to FOLK BOY`);

    // Verify
    const users = await User.find({}).select('name email userType');
    console.log('\n--- Final Roles ---');
    users.forEach(u => {
      console.log(`${u.name}: ${u.userType}`);
    });

    console.log('\n🎉 All roles force-fixed!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

forceFixRoles();
