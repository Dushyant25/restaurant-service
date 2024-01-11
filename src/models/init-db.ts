import pool from '../db';

const createTables = async () => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Create Restaurants Table
    await client.query(`
CREATE TABLE IF NOT EXISTS restaurants (
  restaurant_id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL
)
`);

    // Create Restaurants branches Table
    await client.query(`
CREATE TABLE IF NOT EXISTS branches (
  branch_id SERIAL PRIMARY KEY,
  restaurant_id INT NOT NULL,
  location VARCHAR(255) NOT NULL,
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(restaurant_id)
)
`);

    // Create Tables Table
    await client.query(`
CREATE TABLE IF NOT EXISTS tables (
  table_id SERIAL PRIMARY KEY,
  branch_id INT NOT NULL,
  table_number INT NOT NULL,
  status VARCHAR(50) NOT NULL,
  FOREIGN KEY (branch_id) REFERENCES branches(branch_id)
)
`);

    // Create Users Table
    await client.query(`
CREATE TABLE IF NOT EXISTS users (
  user_id SERIAL PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL,
  branch_id INT NOT NULL,
  is_active BOOLEAN NOT NULL,
  mobile_no VARCHAR(15) NOT NULL,
  FOREIGN KEY (branch_id) REFERENCES branches(branch_id)
  )
  `);

    // Create Menu Items Table
    await client.query(`
CREATE TABLE IF NOT EXISTS menu_items (
  item_id SERIAL PRIMARY KEY,
  branch_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL,
  is_active BOOLEAN NOT NULL,
  FOREIGN KEY (branch_id) REFERENCES branches(branch_id)
)
`);

    // Create Orders Table
    await client.query(`
CREATE TABLE IF NOT EXISTS orders (
  order_id SERIAL PRIMARY KEY,
  table_id INT NOT NULL,
  status VARCHAR(50) NOT NULL,
  FOREIGN KEY (table_id) REFERENCES tables(table_id)
)
`);


    // Create Order Item Table
    await client.query(`
CREATE TABLE IF NOT EXISTS order_items (
  order_item_id SERIAL PRIMARY KEY,
  quantity INT NOT NULL,
  item_id INT NOT NULL,
  order_id INTEGER REFERENCES orders(order_id),
  FOREIGN KEY (item_id) REFERENCES menu_items(item_id)
)
`);


    // Create Payments Table
    await client.query(`
       CREATE TABLE IF NOT EXISTS payments (
         payment_id SERIAL PRIMARY KEY,
         order_id INT NOT NULL,
         amount NUMERIC(10, 2) NOT NULL,
         payment_status VARCHAR(50) NOT NULL,
         payment_date TIMESTAMP NOT NULL,
         FOREIGN KEY (order_id) REFERENCES orders(order_id)
       )
       `);

    await client.query('COMMIT');
    console.log('Tables created successfully.');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating tables:', error);
  } finally {
    client.release();
  }
};

createTables();

