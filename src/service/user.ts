import { generateToken, hashPassword, comparePasswords } from '../middleware/authMiddleware';
import pool from '../db';

class UserService {
  async getUserById(userId: string) {
    try {
      const query = 'SELECT * FROM users WHERE user_id = $1 AND is_active = true';
      const values = [userId];
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Error retrieving user:', error);
      throw new Error('Internal Server Error');
    }
  }

  async createUser(data:any) {
    try {
         let {userName, branch_id, mobileNo, password, role} =data;
      // Check if the mobile number is already taken
      const mobileNoExists = await pool.query('SELECT * FROM users WHERE mobile_no = $1', [mobileNo]);
      if (mobileNoExists.rows.length > 0) {
        return { status: 400, error: 'Mobile number is already taken' }
      }

      // Hash the password before saving to the database
      const hashedPassword = await hashPassword(password);

      // Save the user to the database
      const result = await pool.query(
        'INSERT INTO users (username, mobile_no, password, role, branch_id, is_active) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [userName, mobileNo, hashedPassword, role, branch_id, true] //is_active by default true 
      );

      const user = result.rows[0];
      const token = generateToken(user.user_id.toString(), user.role, user.mobile_no);
      return { token };
    } catch (error) {
      console.error('Registration error:', error);
      throw new Error('Internal Server Error');
    }
  }

  async loginUser(mobileNo: string, password: string) {
    try {
      const result = await pool.query('SELECT * FROM users WHERE mobile_no = $1', [mobileNo]);
      if (result.rows.length === 0) {
        return { status: 401, error: 'Invalid credentials' }
      }
      const user = result.rows[0];
      const passwordMatch = await comparePasswords(password, user.password);

      if (!passwordMatch) {
        return { status: 401, error: 'Invalid credentials' }
      }
      const token = generateToken(user.user_id.toString(), user.role, user.mobile_no);

      return { token };
    } catch (error) {
      console.error('Login error:', error);
      throw new Error('Internal Server Error');
    }
  }
}
export default new UserService();
