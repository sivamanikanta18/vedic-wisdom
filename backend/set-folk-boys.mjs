import mongoose from 'mongoose';

async function setAllToFolkBoy() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/vedic-spiritual-tracker');
    
    // Find all users without a valid role and set them to folk_boy
    const result = await mongoose.connection.db.collection('users').updateMany(
      { 
        $or: [
          { userType: { $exists: false } },
          { userType: null },
          { userType: '' },
          { userType: 'devotee' }
        ]
      },
      { $set: { userType: 'folk_boy' } }
    );
    
    console.log('Updated users to Folk Boy:', result.modifiedCount);
    
    // Show current state
    const users = await mongoose.connection.db.collection('users')
      .find({}, { projection: { name: 1, email: 1, userType: 1 } })
      .toArray();
    
    console.log('\nCurrent users:');
    users.forEach(u => {
      console.log(`- ${u.name || 'N/A'} (${u.email}): ${u.userType || 'NO ROLE'}`);
    });
    
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

setAllToFolkBoy();
