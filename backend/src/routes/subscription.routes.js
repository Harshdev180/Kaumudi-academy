// routes/subscription.routes.js
import express from 'express';
import { 
  subscribeNewsletter, 
  unsubscribeNewsletter,
  getSubscribers 
} from '../controllers/subscription.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js'; // Changed from authenticateAdmin to authMiddleware

const router = express.Router();

// Public routes
router.post('/subscribe', subscribeNewsletter);
router.post('/unsubscribe', unsubscribeNewsletter);

// Admin routes - Now using authMiddleware which will check for any authenticated user
// We'll check for admin role in the controller
router.get('/subscribers', authMiddleware, getSubscribers);

export default router;