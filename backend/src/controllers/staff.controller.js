import Staff from "../models/Staff.model.js";

const normalizeStatus = (status) => {
  if (!status) return status;
  const upper = String(status).toUpperCase();
  if (upper === "ACTIVE") return "ACTIVE";
  if (upper === "INACTIVE") return "INACTIVE";
  return status;
};

const parseMoney = (value) => {
  if (value === undefined || value === null) return NaN;
  const cleaned = String(value).replace(/[^0-9.-]/g, "");
  return Number(cleaned);
};

export const createStaff = async (req, res) => {
  try {
    const {
      name,
      role,
      salary,
      bonus = 0,
      deduction = 0,
      status = "ACTIVE",
      image = ""
    } = req.body;

    if (!name || !role || salary === undefined || salary === null) {
      return res.status(400).json({
        success: false,
        message: "Name, role and salary are required"
      });
    }

    const salaryNum = parseMoney(salary);
    const bonusNum = parseMoney(bonus);
    const deductionNum = parseMoney(deduction);

    if (Number.isNaN(salaryNum) || Number.isNaN(bonusNum) || Number.isNaN(deductionNum)) {
      return res.status(400).json({
        success: false,
        message: "Salary, bonus, and deduction must be valid numbers"
      });
    }

    // Validate non-negative values
    if (salaryNum < 0) {
      return res.status(400).json({
        success: false,
        message: "Salary must be a non-negative number"
      });
    }
    if (bonusNum < 0) {
      return res.status(400).json({
        success: false,
        message: "Bonus must be a non-negative number"
      });
    }
    if (deductionNum < 0) {
      return res.status(400).json({
        success: false,
        message: "Deduction must be a non-negative number"
      });
    }

    const payload = {
      name: String(name).trim(),
      role: String(role).trim(),
      salary: salaryNum,
      bonus: bonusNum,
      deduction: deductionNum,
      status: normalizeStatus(status),
      image
    };

    const staff = await Staff.create(payload);

    res.status(201).json({
      success: true,
      message: "Staff created successfully",
      data: staff
    });
  } catch (error) {
    console.error("CREATE STAFF ERROR:", error);
    if (error?.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
    if (error?.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Staff already exists"
      });
    }
    return res.status(500).json({
      success: false,
      message: error?.message || "Failed to create staff"
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
    if (error?.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
    return res.status(500).json({
      success: false,
      message: error?.message || "Failed to update staff"
    });
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

    const payload = { ...req.body };
    if (payload.status) payload.status = normalizeStatus(payload.status);
    if (payload.salary !== undefined) {
      const salaryNum = parseMoney(payload.salary);
      if (Number.isNaN(salaryNum)) {
        return res.status(400).json({
          success: false,
          message: "Salary must be a valid number"
        });
      }
      if (salaryNum < 0) {
        return res.status(400).json({
          success: false,
          message: "Salary must be a non-negative number"
        });
      }
      payload.salary = salaryNum;
    }
    if (payload.bonus !== undefined) {
      const bonusNum = parseMoney(payload.bonus);
      if (Number.isNaN(bonusNum)) {
        return res.status(400).json({
          success: false,
          message: "Bonus must be a valid number"
        });
      }
      if (bonusNum < 0) {
        return res.status(400).json({
          success: false,
          message: "Bonus must be a non-negative number"
        });
      }
      payload.bonus = bonusNum;
    }
    if (payload.deduction !== undefined) {
      const deductionNum = parseMoney(payload.deduction);
      if (Number.isNaN(deductionNum)) {
        return res.status(400).json({
          success: false,
          message: "Deduction must be a valid number"
        });
      }
      if (deductionNum < 0) {
        return res.status(400).json({
          success: false,
          message: "Deduction must be a non-negative number"
        });
      }
      payload.deduction = deductionNum;
    }
    Object.assign(staff, payload);
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
