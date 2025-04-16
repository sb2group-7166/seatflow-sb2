import { Request, Response } from 'express';
import { Student } from '../models/student.model';
import { uploadToCloudinary } from '../utils/cloudinary';

export const createStudent = async (req: Request, res: Response) => {
  try {
    const { name, fatherName, studentId, email, phone, status } = req.body;
    
    // Check if student already exists
    const existingStudent = await Student.findOne({ 
      $or: [{ email }, { studentId }] 
    });
    
    if (existingStudent) {
      return res.status(400).json({
        success: false,
        message: 'Student with this email or ID already exists'
      });
    }

    // Upload files if they exist
    let profilePhotoUrl = null;
    let idProofUrl = null;

    if (req.files) {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      
      if (files['profilePhoto']?.[0]) {
        profilePhotoUrl = await uploadToCloudinary(files['profilePhoto'][0].path);
      }
      
      if (files['idProof']?.[0]) {
        idProofUrl = await uploadToCloudinary(files['idProof'][0].path);
      }
    }

    const student = await Student.create({
      name,
      fatherName,
      studentId,
      email,
      phone,
      profilePhoto: profilePhotoUrl,
      idProof: idProofUrl,
      status
    });

    res.status(201).json({
      success: true,
      data: student
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating student',
      error: error.message
    });
  }
};

export const getStudents = async (req: Request, res: Response) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: students
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching students',
      error: error.message
    });
  }
};

export const getStudentById = async (req: Request, res: Response) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }
    res.status(200).json({
      success: true,
      data: student
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching student',
      error: error.message
    });
  }
};

export const updateStudent = async (req: Request, res: Response) => {
  try {
    const { name, fatherName, studentId, email, phone, status } = req.body;
    
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Check if email or studentId is being changed to an existing one
    if (email !== student.email || studentId !== student.studentId) {
      const existingStudent = await Student.findOne({
        $or: [
          { email, _id: { $ne: student._id } },
          { studentId, _id: { $ne: student._id } }
        ]
      });

      if (existingStudent) {
        return res.status(400).json({
          success: false,
          message: 'Email or Student ID already exists'
        });
      }
    }

    // Upload new files if they exist
    if (req.files) {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      
      if (files['profilePhoto']?.[0]) {
        student.profilePhoto = await uploadToCloudinary(files['profilePhoto'][0].path);
      }
      
      if (files['idProof']?.[0]) {
        student.idProof = await uploadToCloudinary(files['idProof'][0].path);
      }
    }

    // Update student fields
    student.name = name;
    student.fatherName = fatherName;
    student.studentId = studentId;
    student.email = email;
    student.phone = phone;
    student.status = status;

    await student.save();

    res.status(200).json({
      success: true,
      data: student
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating student',
      error: error.message
    });
  }
};

export const deleteStudent = async (req: Request, res: Response) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Student deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting student',
      error: error.message
    });
  }
}; 