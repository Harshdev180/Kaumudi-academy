import Staff from "../models/Staff.model.js";

/**
 * @desc    Create staff member
 * @route   POST /staff
 * @access  Admin
 */
export const createStaff = async (req, res) => {
  try {
    const staff = await Staff.create(req.body);

    res.status(201).json({
      success: true,
      message: "Staff created successfully",
      data: staff
    });
  } catch (error) {
    console.error("CREATE STAFF ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create staff"
    });
  }
};

/**
 * @desc    Get all staff
 * @route   GET /staff
 * @access  Admin
 */
export const getAllStaff = async (req, res) => {
  try {
    const staff = await Staff.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      data: staff
    });
  } catch (error) {
    res.status(500).json({ success: false });
  }
};

/**
 * @desc    Update staff
 * @route   PUT /staff/:id
 * @access  Admin
 */
export const updateStaff = async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id);
    if (!staff) {
      return res.status(404).json({
        success: false,
        message: "Staff not found"
      });
    }

    Object.assign(staff, req.body);
    await staff.save();

    res.json({
      success: true,
      message: "Staff updated successfully",
      data: staff
    });
  } catch (error) {
    res.status(500).json({ success: false });
  }
};

/**
 * @desc    Delete staff
 * @route   DELETE /staff/:id
 * @access  Admin
 */
export const deleteStaff = async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id);
    if (!staff) {
      return res.status(404).json({
        success: false,
        message: "Staff not found"
      });
    }

    await staff.deleteOne();

    res.json({
      success: true,
      message: "Staff removed successfully"
    });
  } catch (error) {
    res.status(500).json({ success: false });
  }
};

/**
 * @desc    Toggle salary paid / pending
 * @route   PATCH /staff/:id/pay
 * @access  Admin
 */
export const toggleStaffPayment = async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id);
    if (!staff) {
      return res.status(404).json({ success: false });
    }

    staff.paid = !staff.paid;
    await staff.save();

    res.json({
      success: true,
      message: "Payment status updated",
      paid: staff.paid
    });
  } catch (error) {
    res.status(500).json({ success: false });
  }
};

/**
 * @desc    Toggle staff active/inactive
 * @route   PATCH /staff/:id/status
 * @access  Admin
 */
export const toggleStaffStatus = async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id);
    if (!staff) {
      return res.status(404).json({ success: false });
    }

    staff.status = staff.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    await staff.save();

    res.json({
      success: true,
      message: "Staff status updated",
      status: staff.status
    });
  } catch (error) {
    res.status(500).json({ success: false });
  }
};

/**
 * @desc    Dashboard stats
 * @route   GET /staff/stats
 * @access  Admin
 */
export const getStaffStats = async (req, res) => {
  try {
    const totalStaff = await Staff.countDocuments();
    const activeStaff = await Staff.countDocuments({ status: "ACTIVE" });
    const salaryPaid = await Staff.countDocuments({ paid: true });
    const pendingSalary = await Staff.countDocuments({ paid: false });

    res.json({
      success: true,
      data: {
        totalStaff,
        activeStaff,
        salaryPaid,
        pendingSalary
      }
    });
  } catch (error) {
    res.status(500).json({ success: false });
  }
};
