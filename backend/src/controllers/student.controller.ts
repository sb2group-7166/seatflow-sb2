import { Request, Response } from 'express';
import { Student } from '../models/student.model';
import { uploadToCloudinary } from '../utils/cloudinary';
import { Multer } from 'multer';

interface MulterRequest extends Request {
  files?: Express.Multer.File[];
}

export const createStudent = async (req: MulterRequest, res: Response) => {
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

    if (req.files && req.files.length > 0) {
      // First file is profile photo, second is ID proof
      if (req.files[0]) {
        profilePhotoUrl = await uploadToCloudinary(req.files[0].path);
      }
      
      if (req.files[1]) {
        idProofUrl = await uploadToCloudinary(req.files[1].path);
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
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    res.status(500).json({
      success: false,
      message: 'Error creating student',
      error: errorMessage
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
  } catch (error: any) {
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
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching student',
      error: error.message
    });
  }
};

export const updateStudent = async (req: MulterRequest, res: Response) => {
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
    if (req.files && req.files.length > 0) {
      // First file is profile photo, second is ID proof
      if (req.files[0]) {
        student.profilePhoto = await uploadToCloudinary(req.files[0].path);
      }
      
      if (req.files[1]) {
        student.idProof = await uploadToCloudinary(req.files[1].path);
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
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    res.status(500).json({
      success: false,
      message: 'Error updating student',
      error: errorMessage
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
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error deleting student',
      error: error.message
    });
  }
}; 