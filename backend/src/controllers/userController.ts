import { Response } from 'express';
import { query } from '../db/pool.js';
import { AuthRequest, ApiResponse } from '../types/index.js';

export const getAllUsers = async (
  req: AuthRequest,
  res: Response<ApiResponse>
) => {
  try {
    if (!req.user || !['admin', 'cppo'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: 'Access denied',
      });
    }

    const result = await query(
      `SELECT id, email, first_name, last_name, role, unit_id, active, created_at
       FROM users ORDER BY created_at DESC`
    );

    res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch users' });
  }
};

export const getUserById = async (
  req: AuthRequest,
  res: Response<ApiResponse>
) => {
  try {
    const { id } = req.params;

    // Users can only view their own profile unless they're admin/cppo
    if (
      req.user?.id !== parseInt(id) &&
      !['admin', 'cppo'].includes(req.user?.role || '')
    ) {
      return res.status(403).json({
        success: false,
        error: 'Access denied',
      });
    }

    const result = await query(
      `SELECT id, email, first_name, last_name, role, unit_id, active, created_at, updated_at
       FROM users WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch user' });
  }
};

export const updateUser = async (
  req: AuthRequest,
  res: Response<ApiResponse>
) => {
  try {
    const { id } = req.params;
    const { first_name, last_name, unit_id } = req.body;

    // Users can only update their own profile unless they're admin
    if (
      req.user?.id !== parseInt(id) &&
      req.user?.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        error: 'Access denied',
      });
    }

    const result = await query(
      `UPDATE users
       SET first_name = COALESCE($1, first_name),
           last_name = COALESCE($2, last_name),
           unit_id = COALESCE($3, unit_id),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $4
       RETURNING id, email, first_name, last_name, role, unit_id, active, created_at, updated_at`,
      [first_name, last_name, unit_id, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ success: false, error: 'Failed to update user' });
  }
};

export const deleteUser = async (
  req: AuthRequest,
  res: Response<ApiResponse>
) => {
  try {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Only admins can delete users',
      });
    }

    const { id } = req.params;

    const result = await query('DELETE FROM users WHERE id = $1 RETURNING id', [
      id,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    res.json({
      success: true,
      data: { message: 'User deleted successfully' },
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ success: false, error: 'Failed to delete user' });
  }
};
