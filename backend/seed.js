/**
 * Database Seed Script
 * Creates initial admin, teacher, and student accounts
 * Plus sample exam data for testing
 */

const mongoose = require('mongoose');
const User = require('./models/User');
const Exam = require('./models/Exam');
const Question = require('./models/Question');
require('dotenv').config();

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('📦 Connected to MongoDB');

    // Clear existing data (optional - comment out if you want to keep existing data)
    await User.deleteMany({});
    await Exam.deleteMany({});
    await Question.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create Admin User
    const admin = await User.create({
      name: 'Admin',
      email: 'admin@exam.com',
      password: 'admin123',
      role: 'admin'
    });
    console.log('✅ Admin created:', admin.email);

    // Create Teacher User
    const teacher = await User.create({
      name: 'Teacher John',
      email: 'teacher@exam.com',
      password: 'teacher123',
      role: 'teacher'
    });
    console.log('✅ Teacher created:', teacher.email);

    // Create Student Users
    const students = await User.insertMany([
      {
        name: 'Student Priya',
        email: 'priya@exam.com',
        password: 'student123',
        role: 'student'
      },
      {
        name: 'Student Rahul',
        email: 'rahul@exam.com',
        password: 'student123',
        role: 'student'
      },
      {
        name: 'Student Asha',
        email: 'asha@exam.com',
        password: 'student123',
        role: 'student'
      }
    ]);
    console.log('✅ Students created:', students.length);

    // Create Sample Exam - Java Programming
    const javaExam = await Exam.create({
      title: 'Java Programming Exam',
      subject: 'Java Programming',
      description: 'Comprehensive Java programming test covering basics to advanced concepts',
      duration: 20,
      totalMarks: 10,
      passingMarks: 4,
      scheduledDate: new Date(),
      isActive: true,
      randomizeQuestions: false,
      showResults: true,
      allowReview: true,
      createdBy: teacher._id
    });
    console.log('✅ Java Exam created');

    // Create Questions for Java Exam
    const javaQuestions = [
      {
        examId: javaExam._id,
        questionText: 'What is the default value of an int variable in Java?',
        questionType: 'mcq',
        options: [
          { text: '0', isCorrect: true },
          { text: '1', isCorrect: false },
          { text: 'null', isCorrect: false },
          { text: '0.0', isCorrect: false }
        ],
        marks: 1,
        difficulty: 'easy',
        explanation: 'In Java, the default value of int is 0',
        order: 1
      },
      {
        examId: javaExam._id,
        questionText: 'Which keyword is used to inherit a class in Java?',
        questionType: 'mcq',
        options: [
          { text: 'this', isCorrect: false },
          { text: 'extends', isCorrect: true },
          { text: 'implements', isCorrect: false },
          { text: 'inherits', isCorrect: false }
        ],
        marks: 1,
        difficulty: 'easy',
        explanation: 'The extends keyword is used for class inheritance in Java',
        order: 2
      },
      {
        examId: javaExam._id,
        questionText: 'What is an array in Java?',
        questionType: 'mcq',
        options: [
          { text: 'method', isCorrect: false },
          { text: 'class', isCorrect: false },
          { text: 'A data structure', isCorrect: true },
          { text: 'An interface', isCorrect: false }
        ],
        marks: 1,
        difficulty: 'easy',
        explanation: 'An array is a data structure that stores fixed-size sequential collection of elements',
        order: 3
      },
      {
        examId: javaExam._id,
        questionText: 'What is the main method signature in Java?',
        questionType: 'mcq',
        options: [
          { text: 'C. void main(String args[])', isCorrect: false },
          { text: 'B. public static void main(String[] args)', isCorrect: true },
          { text: 'A. main(String args)', isCorrect: false },
          { text: 'D. An interface', isCorrect: false }
        ],
        marks: 1,
        difficulty: 'medium',
        explanation: 'The correct main method signature is: public static void main(String[] args)',
        order: 4
      },
      {
        examId: javaExam._id,
        questionText: 'Which of the following is NOT a Java keyword?',
        questionType: 'mcq',
        options: [
          { text: 'static', isCorrect: false },
          { text: 'Boolean', isCorrect: true },
          { text: 'void', isCorrect: false },
          { text: 'private', isCorrect: false }
        ],
        marks: 1,
        difficulty: 'medium',
        explanation: 'Boolean (capital B) is a class, not a keyword. The keyword is boolean (lowercase)',
        order: 5
      },
      {
        examId: javaExam._id,
        questionText: 'What is encapsulation in Java?',
        questionType: 'mcq',
        options: [
          { text: 'Hiding implementation details', isCorrect: true },
          { text: 'Creating multiple objects', isCorrect: false },
          { text: 'Inheriting properties', isCorrect: false },
          { text: 'Compiling code', isCorrect: false }
        ],
        marks: 1,
        difficulty: 'medium',
        explanation: 'Encapsulation is the mechanism of hiding data implementation by restricting access to public methods',
        order: 6
      },
      {
        examId: javaExam._id,
        questionText: 'Which collection class allows you to grow or shrink its size?',
        questionType: 'mcq',
        options: [
          { text: 'Array', isCorrect: false },
          { text: 'ArrayList', isCorrect: true },
          { text: 'String', isCorrect: false },
          { text: 'HashMap', isCorrect: false }
        ],
        marks: 1,
        difficulty: 'medium',
        explanation: 'ArrayList is a resizable array implementation',
        order: 7
      },
      {
        examId: javaExam._id,
        questionText: 'What is polymorphism in Java?',
        questionType: 'mcq',
        options: [
          { text: 'Writing multiple methods', isCorrect: false },
          { text: 'Ability to take many forms', isCorrect: true },
          { text: 'Creating objects', isCorrect: false },
          { text: 'None of the above', isCorrect: false }
        ],
        marks: 1,
        difficulty: 'hard',
        explanation: 'Polymorphism allows objects to take on many forms, implementing methods differently',
        order: 8
      },
      {
        examId: javaExam._id,
        questionText: 'What is the purpose of finalize() method?',
        questionType: 'mcq',
        options: [
          { text: 'To initialize objects', isCorrect: false },
          { text: 'To clean up before garbage collection', isCorrect: true },
          { text: 'To compile code', isCorrect: false },
          { text: 'To create threads', isCorrect: false }
        ],
        marks: 1,
        difficulty: 'hard',
        explanation: 'finalize() is called by garbage collector before object is destroyed',
        order: 9
      },
      {
        examId: javaExam._id,
        questionText: 'Which of these is NOT a valid access modifier in Java?',
        questionType: 'mcq',
        options: [
          { text: 'public', isCorrect: false },
          { text: 'private', isCorrect: false },
          { text: 'protected', isCorrect: false },
          { text: 'package', isCorrect: true }
        ],
        marks: 1,
        difficulty: 'hard',
        explanation: 'package is not a valid access modifier. The valid ones are public, private, protected, and default',
        order: 10
      }
    ];

    const createdQuestions = await Question.insertMany(javaQuestions);
    console.log('✅ Questions created:', createdQuestions.length);

    // Update exam with question IDs
    await Exam.findByIdAndUpdate(javaExam._id, {
      questions: createdQuestions.map(q => q._id)
    });
    console.log('✅ Exam updated with questions');

    // Create another sample exam - Database Management
    const dbExam = await Exam.create({
      title: 'Database Management Exam',
      subject: 'Database Management',
      description: 'Test your knowledge of database concepts and SQL',
      duration: 30,
      totalMarks: 10,
      passingMarks: 5,
      scheduledDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
      isActive: true,
      randomizeQuestions: false,
      showResults: true,
      allowReview: true,
      createdBy: teacher._id
    });
    console.log('✅ Database Exam created');

    // Summary
    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📧 Login Credentials:');
    console.log('┌─────────────────────────────────────────┐');
    console.log('│ Admin:   admin@exam.com / admin123     │');
    console.log('│ Teacher: teacher@exam.com / teacher123 │');
    console.log('│ Student: priya@exam.com / student123   │');
    console.log('└─────────────────────────────────────────┘');
    console.log('\n🚀 You can now start the application!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run seed function
seedData();
