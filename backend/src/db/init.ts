import { query } from './pool.js';

export const initializeDatabase = async () => {
  try {
    // Users table
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        first_name VARCHAR(255) NOT NULL,
        last_name VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'cppo', 'ppo')),
        unit_id INTEGER,
        active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Units table
    await query(`
      CREATE TABLE IF NOT EXISTS units (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Schedules table
    await query(`
      CREATE TABLE IF NOT EXISTS schedules (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        shift_date DATE NOT NULL,
        shift_type VARCHAR(50) NOT NULL CHECK (shift_type IN ('Office Hours', 'In the Field', 'E-Day')),
        start_time TIME,
        end_time TIME,
        is_split_shift BOOLEAN DEFAULT false,
        is_on_call BOOLEAN DEFAULT false,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, shift_date)
      )
    `);

    // Create indexes
    await query(`
      CREATE INDEX IF NOT EXISTS idx_schedules_user_id ON schedules(user_id);
      CREATE INDEX IF NOT EXISTS idx_schedules_shift_date ON schedules(shift_date);
      CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
    `);

    console.log('✅ Database initialized successfully');
  } catch (err) {
    console.error('❌ Database initialization failed:', err);
    throw err;
  }
};
