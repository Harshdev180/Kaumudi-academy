import Student from "../models/Student.model.js";

export const getStudentProfile = async (req, res) => {
  try {
    const student = await Student.findById(req.user._id).select("-password");

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }

    res.json({
      success: true,
      data: student
    });
  } catch (error) {
    console.error("GET STUDENT PROFILE ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch profile"
    });
  }
};

export const updateStudentProfile = async (req, res) => {
  try {
    const { firstName, lastName, phoneNumber, address, city, state, sanskritKnowledge, occupation } = req.body;

    const student = await Student.findByIdAndUpdate(
      req.user._id,
      {
        firstName,
        lastName,
        phoneNumber,
        address,
        city,
        state,
        sanskritKnowledge,
        occupation
      },
      { new: true, runValidators: true }
    ).select("-password");

    res.json({
      success: true,
      message: "Profile updated successfully",
      data: student
    });
  } catch (error) {
    console.error("UPDATE STUDENT PROFILE ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update profile"
    });
  }
};
