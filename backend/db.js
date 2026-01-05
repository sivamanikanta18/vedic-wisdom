import mongoose from 'mongoose';

const state = globalThis.__MONGOOSE_STATE__ || { conn: null, promise: null };
if (!globalThis.__MONGOOSE_STATE__) {
  globalThis.__MONGOOSE_STATE__ = state;
}

export async function connectDb() {
  if (state.conn) return state.conn;

  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/vedic-spiritual-tracker';
  const fallback = process.env.MONGODB_URI_FALLBACK;

  if (!state.promise) {
    state.promise = (async () => {
      try {
        await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
      } catch (err) {
        const shouldTryFallback =
          err?.code === 'ENOTFOUND' &&
          typeof uri === 'string' &&
          uri.startsWith('mongodb+srv://') &&
          typeof fallback === 'string' &&
          fallback.length > 0 &&
          fallback !== uri;

        if (!shouldTryFallback) throw err;

        await mongoose.connect(fallback, { serverSelectionTimeoutMS: 10000 });
      }

      return mongoose.connection;
    })();
  }

  state.conn = await state.promise;
  return state.conn;
}
