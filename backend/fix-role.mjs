import mongoose from 'mongoose';

async function fixUserRole() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/vedic-spiritual-tracker');
    
    // Update all users with old 'devotee' role to 'folk_boy'
    const result = await mongoose.connection.db.collection('users').updateMany(
      { userType: 'devotee' },
      { $set: { userType: 'folk_boy' } }
    );
    
    console.log('Fixed users with devotee role:', result.modifiedCount);
    
    // Also fix any other invalid roles
    const result2 = await mongoose.connection.db.collection('users').updateMany(
      { userType: { $nin: ['folk_boy', 'folk_guide', 'admin'] } },
      { $set: { userType: 'folk_boy' } }
    );
    
    console.log('Fixed other invalid roles:', result2.modifiedCount);
    
    // Check specific user
    const user = await mongoose.connection.db.collection('users').findOne(
      { email: 'sivamanikanta92005@gmail.com' }
    );
    console.log('Your role is now:', user?.userType);
    
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

fixUserRole();
