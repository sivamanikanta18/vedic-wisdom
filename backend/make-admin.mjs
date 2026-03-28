import mongoose from 'mongoose';

async function makeAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/vedic-spiritual-tracker');
    
    const result = await mongoose.connection.db.collection('users').updateOne(
      { email: 'sivamanikanta92005@gmail.com' },
      { $set: { userType: 'admin' } }
    );
    
    if (result.matchedCount === 0) {
      console.log('❌ User not found');
    } else if (result.modifiedCount === 0) {
      console.log('⚠️ User already has this role or no change needed');
      // Check current role
      const user = await mongoose.connection.db.collection('users').findOne({ email: 'sivamanikanta92005@gmail.com' });
      console.log('Current role:', user?.userType);
    } else {
      console.log('✅ Successfully updated to ADMIN');
    }
    
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

makeAdmin();
