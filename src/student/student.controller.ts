import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, Put } from '@nestjs/common';
import { StudentService } from './student.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { Student } from './interface/student.interface';


@Controller('api/students')
export class StudentController {
  constructor(private readonly studentService: StudentService) { }

  @Post()
  async create(@Body() createStudentDto: CreateStudentDto) {
    try {

      const result: Student = await this.studentService.create(createStudentDto);

      return {
        success: true,
        message: 'Student created successfully',
        data: result,
        statusCode: HttpStatus.CREATED
      };

    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      if (error.code === '23505') {
        throw new HttpException('Student with this email already exists', HttpStatus.CONFLICT);
      }

      throw new HttpException('Internal server error while creating student', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('all')
  async findAll() {
    try {
      const students: Student[] = await this.studentService.findAll();

      return {
        success: true,
        message: 'Students retrieved successfully',
        data: students,
        statusCode: HttpStatus.OK
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException('Failed to retrieve students', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const student: Student = await this.studentService.findOne(id);

      return {
        success: true,
        message: 'Student retrieved successfully',
        data: student,
        statusCode: HttpStatus.OK
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException('Failed to retrieve student', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateStudentDto: UpdateStudentDto) {
    try {
      const student: Student = await this.studentService.update(id, updateStudentDto);

      return {
        success: true,
        message: 'Student updated successfully',
        data: student,
        statusCode: HttpStatus.OK
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException('Failed to update student', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      await this.studentService.remove(id);

      return {
        success: true,
        message: 'Student deleted successfully',
        statusCode: HttpStatus.OK
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException('Failed to delete student', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
