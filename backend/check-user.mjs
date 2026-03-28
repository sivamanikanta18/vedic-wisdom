import mongoose from 'mongoose';

async function checkUser() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/vedic-spiritual-tracker');
    
    const user = await mongoose.connection.db.collection('users').findOne(
      { email: 'sivamanikanta92005@gmail.com' }
    );
    
    if (!user) {
      console.log('❌ User not found');
    } else {
      console.log('✅ User found:');
      console.log('  Name:', user.name);
      console.log('  Email:', user.email);
      console.log('  Role:', user.userType);
      console.log('  ID:', user._id);
    }
    
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

checkUser();
