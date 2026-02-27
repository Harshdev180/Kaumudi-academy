
import { Subscriber } from '../models/Subscriber.model.js';
import { 
  sendSubscriptionConfirmation, 
  sendSubscriptionAdminNotification 
} from '../services/mail.service.js';

export const subscribeNewsletter = async (req, res) => {
  try {
    const { email } = req.body;

    // Validate email
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    // Check if already subscribed
    const existingSubscriber = await Subscriber.findOne({ email });
    
    if (existingSubscriber) {
      if (existingSubscriber.status === 'unsubscribed') {
        // Reactivate subscription
        existingSubscriber.status = 'active';
        await existingSubscriber.save();
        
        // Send emails
        await Promise.all([
          sendSubscriptionConfirmation({ email }),
          sendSubscriptionAdminNotification({ email })
        ]);

        return res.status(200).json({
          success: true,
          message: 'Your subscription has been reactivated successfully!'
        });
      }

      return res.status(400).json({
        success: false,
        message: 'This email is already subscribed to our newsletter'
      });
    }

    // Create new subscriber
    const subscriber = new Subscriber({ email });
    await subscriber.save();

    // Send confirmation emails
    await Promise.all([
      sendSubscriptionConfirmation({ email }),
      sendSubscriptionAdminNotification({ email })
    ]);

    res.status(201).json({
      success: true,
      message: 'Successfully subscribed to Kaumudi Sanskrit Academy newsletter!'
    });

  } catch (error) {
    console.error('Subscription error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to subscribe. Please try again later.'
    });
  }
};

export const unsubscribeNewsletter = async (req, res) => {
  try {
    const { email } = req.body;

    const subscriber = await Subscriber.findOne({ email });
    
    if (!subscriber) {
      return res.status(404).json({
        success: false,
        message: 'Email not found in our subscription list'
      });
    }

    subscriber.status = 'unsubscribed';
    await subscriber.save();

    res.status(200).json({
      success: true,
      message: 'You have been unsubscribed successfully. We\'re sorry to see you go!'
    });

  } catch (error) {
    console.error('Unsubscribe error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to unsubscribe. Please try again later.'
    });
  }
};

export const getSubscribers = async (req, res) => {
  try {
    // Check if the authenticated user is an admin or super admin
    if (req.user.role !== 'ADMIN' && req.user.role !== 'SUPER_ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }

    const subscribers = await Subscriber.find({ status: 'active' })
      .sort({ subscribedAt: -1 });

    res.status(200).json({
      success: true,
      count: subscribers.length,
      data: subscribers
    });
  } catch (error) {
    console.error('Get subscribers error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch subscribers'
    });
  }
};