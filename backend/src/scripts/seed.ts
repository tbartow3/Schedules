import { query } from '../db/pool.js';
import { hashPassword } from '../utils/auth.js';

const seedDatabase = async () => {
  try {
    console.log('🌱 Seeding database...');

    // Create units
    const units = ['Unit A', 'Unit B', 'Unit C', 'Unit D'];
    for (const unit of units) {
      await query('INSERT INTO units (name) VALUES ($1) ON CONFLICT DO NOTHING', [
        unit,
      ]);
    }
    console.log('✅ Units created');

    // Create admin user
    const adminPassword = await hashPassword('admin123');
    await query(
      `INSERT INTO users (email, password, first_name, last_name, role)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT DO NOTHING`,
      ['admin@cosync.com', adminPassword, 'Admin', 'User', 'admin']
    );
    console.log('✅ Admin user created');

    // Create sample CPPO users
    const cppoPassword = await hashPassword('cppo123');
    for (let i = 1; i <= 2; i++) {
      await query(
        `INSERT INTO users (email, password, first_name, last_name, role, unit_id)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT DO NOTHING`,
        [
          `cppo${i}@cosync.com`,
          cppoPassword,
          `Manager`,
          `${i}`,
          'cppo',
          i,
        ]
      );
    }
    console.log('✅ CPPO users created');

    // Create sample PPO users
    const ppoPassword = await hashPassword('ppo123');
    for (let i = 1; i <= 10; i++) {
      await query(
        `INSERT INTO users (email, password, first_name, last_name, role, unit_id)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT DO NOTHING`,
        [
          `ppo${i}@cosync.com`,
          ppoPassword,
          `Officer`,
          `${i}`,
          'ppo',
          (i % 4) + 1,
        ]
      );
    }
    console.log('✅ PPO users created');

    console.log('\n✅ Database seeding complete!');
    console.log('\nTest Credentials:');
    console.log('Admin: admin@cosync.com / admin123');
    console.log('Manager: cppo1@cosync.com / cppo123');
    console.log('Staff: ppo1@cosync.com / ppo123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase();
