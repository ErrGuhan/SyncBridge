const bcrypt = require('bcryptjs');
const prisma = require('../lib/prisma');

/**
 * Register a new Customer.
 * POST /api/users/register/customer
 */
async function registerCustomer(req, res) {
  try {
    const { email, password, firstName, lastName, phone } = req.body;

    // Check duplicate
    const existing = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email.toLowerCase() },
          ...(phone ? [{ phone }] : [])
        ]
      }
    });

    if (existing) {
      return res.status(409).json({
        error: 'Conflict',
        message: existing.email === email.toLowerCase() 
          ? 'An account with this email already exists' 
          : 'An account with this phone number already exists'
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        passwordHash,
        firstName,
        lastName,
        phone,
        role: 'CUSTOMER',
        status: 'ACTIVE'
      },
      select: {
        id: email,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        status: true,
        createdAt: true
      }
    });

    return res.status(201).json({
      success: true,
      message: 'Customer registered successfully',
      data: user
    });
  } catch (error) {
    console.error('[registerCustomer Error]:', error);
    return res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
}

/**
 * Fetch Customer Profile.
 * GET /api/users/profile/customer
 */
async function getCustomerProfile(req, res) {
  try {
    const targetUserId = req.params.id || req.user.id;

    // Ensure customers can only access their own profile unless requester is Admin
    if (req.user.role === 'CUSTOMER' && targetUserId !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden', message: 'Unauthorized access to profile' });
    }

    const customer = await prisma.user.findUnique({
      where: { id: targetUserId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        avatarUrl: true,
        role: true,
        status: true,
        createdAt: true,
        customerBookings: {
          take: 10,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            bookingNumber: true,
            status: true,
            scheduledDate: true,
            totalAmount: true,
            serviceCategory: { select: { name: true } }
          }
        },
        reviewsAuthored: {
          take: 5,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            rating: true,
            comment: true,
            createdAt: true
          }
        }
      }
    });

    if (!customer) {
      return res.status(404).json({ error: 'Not Found', message: 'Customer not found' });
    }

    return res.status(200).json({
      success: true,
      data: customer
    });
  } catch (error) {
    console.error('[getCustomerProfile Error]:', error);
    return res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
}

module.exports = {
  registerCustomer,
  getCustomerProfile
};
