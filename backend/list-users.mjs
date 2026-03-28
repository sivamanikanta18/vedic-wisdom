import mongoose from 'mongoose';

async function listAllUsers() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/vedic-spiritual-tracker');
    
    const users = await mongoose.connection.db.collection('users')
      .find({}, { projection: { name: 1, email: 1, userType: 1 } })
      .toArray();
    
    console.log('All users in database:');
    users.forEach((u, i) => {
      console.log(`${i + 1}. ${u.name || 'N/A'} | ${u.email} | ${u.userType || 'NO ROLE'}`);
    });
    
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

listAllUsers();
