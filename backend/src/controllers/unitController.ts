import { Response } from 'express';
import { query } from '../db/pool.js';
import { AuthRequest, ApiResponse } from '../types/index.js';

export const getUnits = async (
  req: AuthRequest,
  res: Response<ApiResponse>
) => {
  try {
    const result = await query('SELECT * FROM units ORDER BY name');

    res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error('Get units error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch units' });
  }
};

export const createUnit = async (
  req: AuthRequest,
  res: Response<ApiResponse>
) => {
  try {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Only admins can create units',
      });
    }

    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        error: 'Unit name is required',
      });
    }

    const result = await query(
      'INSERT INTO units (name) VALUES ($1) RETURNING *',
      [name]
    );

    res.status(201).json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Create unit error:', error);
    res.status(500).json({ success: false, error: 'Failed to create unit' });
  }
};

export const deleteUnit = async (
  req: AuthRequest,
  res: Response<ApiResponse>
) => {
  try {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Only admins can delete units',
      });
    }

    const { id } = req.params;

    const result = await query('DELETE FROM units WHERE id = $1 RETURNING id', [
      id,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Unit not found',
      });
    }

    res.json({
      success: true,
      data: { message: 'Unit deleted successfully' },
    });
  } catch (error) {
    console.error('Delete unit error:', error);
    res.status(500).json({ success: false, error: 'Failed to delete unit' });
  }
};
