import { Response } from 'express';
import { query } from '../db/pool.js';
import { AuthRequest, ApiResponse } from '../types/index.js';

export const getSchedules = async (
  req: AuthRequest,
  res: Response<ApiResponse>
) => {
  try {
    const { user_id, start_date, end_date } = req.query;

    let sql = `
      SELECT s.*, u.first_name, u.last_name, u.email
      FROM schedules s
      JOIN users u ON s.user_id = u.id
    `;
    const params: any[] = [];
    let paramCount = 1;

    // PPO can only see their own schedule
    if (req.user?.role === 'ppo') {
      sql += ` WHERE s.user_id = $${paramCount++}`;
      params.push(req.user.id);
    } else if (user_id) {
      sql += ` WHERE s.user_id = $${paramCount++}`;
      params.push(user_id);
    }

    if (start_date) {
      sql += ` AND s.shift_date >= $${paramCount++}`;
      params.push(start_date);
    }

    if (end_date) {
      sql += ` AND s.shift_date <= $${paramCount++}`;
      params.push(end_date);
    }

    sql += ` ORDER BY s.shift_date DESC`;

    const result = await query(sql, params);

    res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error('Get schedules error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch schedules' });
  }
};

export const getUserSchedule = async (
  req: AuthRequest,
  res: Response<ApiResponse>
) => {
  try {
    const { userId } = req.params;

    // PPO can only view their own schedule
    if (
      req.user?.role === 'ppo' &&
      req.user.id !== parseInt(userId)
    ) {
      return res.status(403).json({
        success: false,
        error: 'Access denied',
      });
    }

    const result = await query(
      `SELECT * FROM schedules WHERE user_id = $1 ORDER BY shift_date DESC`,
      [userId]
    );

    res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error('Get user schedule error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch schedule' });
  }
};

export const createShift = async (
  req: AuthRequest,
  res: Response<ApiResponse>
) => {
  try {
    const { user_id, shift_date, shift_type, start_time, end_time, is_split_shift, is_on_call, notes } = req.body;

    // PPO can only create shifts for themselves
    if (req.user?.role === 'ppo' && req.user.id !== user_id) {
      return res.status(403).json({
        success: false,
        error: 'Access denied',
      });
    }

    if (!user_id || !shift_date || !shift_type) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
      });
    }

    const result = await query(
      `INSERT INTO schedules (user_id, shift_date, shift_type, start_time, end_time, is_split_shift, is_on_call, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [user_id, shift_date, shift_type, start_time, end_time, is_split_shift || false, is_on_call || false, notes]
    );

    res.status(201).json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Create shift error:', error);
    res.status(500).json({ success: false, error: 'Failed to create shift' });
  }
};

export const updateShift = async (
  req: AuthRequest,
  res: Response<ApiResponse>
) => {
  try {
    const { id } = req.params;
    const { shift_type, start_time, end_time, is_split_shift, is_on_call, notes } = req.body;

    // Get the shift to check permissions
    const shiftResult = await query('SELECT user_id FROM schedules WHERE id = $1', [id]);
    if (shiftResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Shift not found',
      });
    }

    const shift = shiftResult.rows[0];

    // PPO can only update their own shifts
    if (req.user?.role === 'ppo' && req.user.id !== shift.user_id) {
      return res.status(403).json({
        success: false,
        error: 'Access denied',
      });
    }

    const result = await query(
      `UPDATE schedules
       SET shift_type = COALESCE($1, shift_type),
           start_time = COALESCE($2, start_time),
           end_time = COALESCE($3, end_time),
           is_split_shift = COALESCE($4, is_split_shift),
           is_on_call = COALESCE($5, is_on_call),
           notes = COALESCE($6, notes),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $7
       RETURNING *`,
      [shift_type, start_time, end_time, is_split_shift, is_on_call, notes, id]
    );

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Update shift error:', error);
    res.status(500).json({ success: false, error: 'Failed to update shift' });
  }
};

export const deleteShift = async (
  req: AuthRequest,
  res: Response<ApiResponse>
) => {
  try {
    const { id } = req.params;

    // Get the shift to check permissions
    const shiftResult = await query('SELECT user_id FROM schedules WHERE id = $1', [id]);
    if (shiftResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Shift not found',
      });
    }

    const shift = shiftResult.rows[0];

    // PPO can only delete their own shifts
    if (req.user?.role === 'ppo' && req.user.id !== shift.user_id) {
      return res.status(403).json({
        success: false,
        error: 'Access denied',
      });
    }

    await query('DELETE FROM schedules WHERE id = $1', [id]);

    res.json({
      success: true,
      data: { message: 'Shift deleted successfully' },
    });
  } catch (error) {
    console.error('Delete shift error:', error);
    res.status(500).json({ success: false, error: 'Failed to delete shift' });
  }
};
