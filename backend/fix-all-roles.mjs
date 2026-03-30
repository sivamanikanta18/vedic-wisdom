import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://sivamanikantacharyasivas:<sivaS_997>@vedicwisdom.oxegx.mongodb.net/?retryWrites=true&w=majority&appName=VedicWisdom';

async function fixAllUserRoles() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Get all users
    const users = await User.find({});
    console.log(`Found ${users.length} users`);

    for (const user of users) {
      const email = user.email.toLowerCase();
      
      // Check if this is sivamanikanta (make Folk Guide)
      if (email.includes('sivamanikanta')) {
        if (user.userType !== 'folk_guide') {
          user.userType = 'folk_guide';
          await user.save();
          console.log(`✅ ${user.name} (${user.email}) upgraded to Folk Guide`);
        } else {
          console.log(`✓ ${user.name} is already Folk Guide`);
        }
      } 
      // Check if this is admin@gmail.com or administrator (make Admin)
      else if (email === 'admin@gmail.com' || email.includes('administrator') || email.includes('sivamanikata')) {
        if (user.userType !== 'admin') {
          user.userType = 'admin';
          await user.save();
          console.log(`✅ ${user.name} (${user.email}) set as Admin`);
        } else {
          console.log(`✓ ${user.name} is already Admin`);
        }
      }
      // Everyone else - make Folk Boy
      else {
        if (user.userType !== 'folk_boy') {
          user.userType = 'folk_boy';
          await user.save();
          console.log(`✅ ${user.name} (${user.email}) set as Folk Boy`);
        } else {
          console.log(`✓ ${user.name} is already Folk Boy`);
        }
      }
    }

    console.log('\n🎉 All user roles fixed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

fixAllUserRoles();
