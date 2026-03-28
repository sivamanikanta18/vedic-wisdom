import mongoose from 'mongoose';

async function setSpecificUsersToFolkBoy() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/vedic-spiritual-tracker');
    
    const emailsToUpdate = [
      'chandu@gmail.com',
      'valetipopi4@gmail.com',
      'palaganimanis@gmail.com',
      '231fa18454@gmail.com',
      'pothurajuvedavyshnavi@gmail.com',
      'kilariojeswaridevi@gmail.com',
      'kasinikotaharshavardhansai@gmail.com',
      'charanpadarthi1430@gmail.com',
      '231fa04332@gmail.com'
    ];
    
    let updatedCount = 0;
    
    for (const email of emailsToUpdate) {
      const result = await mongoose.connection.db.collection('users').updateOne(
        { email: email },
        { $set: { userType: 'folk_boy' } }
      );
      if (result.modifiedCount > 0) {
        console.log(`✅ Set ${email} to Folk Boy`);
        updatedCount++;
      } else {
        const user = await mongoose.connection.db.collection('users').findOne({ email });
        if (user) {
          console.log(`ℹ️ ${email} already has role: ${user.userType}`);
        } else {
          console.log(`❌ ${email} not found`);
        }
      }
    }
    
    console.log(`\nTotal updated: ${updatedCount}`);
    
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

setSpecificUsersToFolkBoy();
