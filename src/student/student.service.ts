import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { Student } from './entities/student.entity';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
  ) { }

  async create(createStudentDto: CreateStudentDto): Promise<Student> {
    try {
      const existingStudent = await this.studentRepository.findOne({
        where: { email: createStudentDto.email }
      });

      if (existingStudent) {
        throw new HttpException('Student with this email already exists', HttpStatus.CONFLICT);
      }

      const student = this.studentRepository.create(createStudentDto);
      const savedStudent = await this.studentRepository.save(student);

      return savedStudent;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException('Failed to create student', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAll(): Promise<Student[]> {
    try {
      const students = await this.studentRepository.find({
        order: {
          createdAt: 'DESC'
        }
      });
      return students;
    } catch (error) {
      throw new HttpException('Failed to fetch students', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findOne(id: string): Promise<Student> {
    try {
      const student = await this.studentRepository.findOne({ where: { id: id } });

      if (!student) {
        throw new HttpException('Student not found', HttpStatus.NOT_FOUND);
      }

      return student;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException('Failed to fetch student', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async update(id: string, updateStudentDto: UpdateStudentDto): Promise<Student> {
    try {
      const student = await this.studentRepository.findOne({ where: { id: id } });

      if (!student) {
        throw new HttpException('Student not found', HttpStatus.NOT_FOUND);
      }

      if (updateStudentDto.email && updateStudentDto.email !== student.email) {
        const existingStudent = await this.studentRepository.findOne({
          where: { email: updateStudentDto.email }
        });

        if (existingStudent) {
          throw new HttpException('Student with this email already exists', HttpStatus.CONFLICT);
        }
      }

      Object.assign(student, updateStudentDto);
      const updatedStudent = await this.studentRepository.save(student);

      return updatedStudent;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException('Failed to update student', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const student = await this.studentRepository.findOne({ where: { id: id } });

      if (!student) {
        throw new HttpException('Student not found', HttpStatus.NOT_FOUND);
      }

      await this.studentRepository.remove(student);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException('Failed to delete student', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
