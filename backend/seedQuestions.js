require("dotenv").config();
const mongoose = require("mongoose");
const Question = require("./models/Question");

mongoose.connect(process.env.MONGODB_URI) // Connect to correct DB
  .then(() => console.log("DB connected"))
  .catch(err => console.error(err));

const questions = [
  // Fsd Questions
  {
    _id: "fsd1",
    subject: "Fsd",
    question: "What does OOP stand for?",
    options: ["Object Oriented Programming", "Open Online Protocol", "Operational Output Processing", "Other"],
    answer: "Object Oriented Programming"
  },
  {
    _id: "fsd2",
    subject: "Fsd",
    question: "Which is NOT a pillar of OOP?",
    options: ["Encapsulation", "Inheritance", "Polymorphism", "Networking"],
    answer: "Networking"
  },
  {
    _id: "fsd3",
    subject: "Fsd",
    question: "MVC stands for?",
    options: ["Model View Controller", "Master View Control", "Module Version Control", "Main View Code"],
    answer: "Model View Controller"
  },
  {
    _id: "fsd4",
    subject: "Fsd",
    question: "What is REST?",
    options: ["Representation State Transfer", "Rapid Execution Standard Technique", "Remote Server Task", "None"],
    answer: "Representation State Transfer"
  },
  {
    _id: "fsd5",
    subject: "Fsd",
    question: "Which is a database?",
    options: ["MySQL", "React", "CSS", "Node"],
    answer: "MySQL"
  },

  // DotNet Questions
  {
    _id: "dotnet1",
    subject: "DotNet",
    question: "What is CLR in .NET?",
    options: ["Common Language Runtime", "Common Linker Runtime", "Central Logic Reader", "None of these"],
    answer: "Common Language Runtime"
  },
  {
    _id: "dotnet2",
    subject: "DotNet",
    question: "Which language is primary in .NET?",
    options: ["C#", "Java", "Python", "C++"],
    answer: "C#"
  },
  {
    _id: "dotnet3",
    subject: "DotNet",
    question: "Which company developed .NET?",
    options: ["Microsoft", "Google", "Oracle", "Apple"],
    answer: "Microsoft"
  },
  {
    _id: "dotnet4",
    subject: "DotNet",
    question: "What is ASP.NET used for?",
    options: ["Web applications", "Desktop applications", "Mobile apps", "Hardware programming"],
    answer: "Web applications"
  },

  // Python Questions
  {
    _id: "python1",
    subject: "Python",
    question: "How do you define a function in Python?",
    options: ["def", "function", "fun", "define"],
    answer: "def"
  },
  {
    _id: "python2",
    subject: "Python",
    question: "Which data type is mutable?",
    options: ["list", "tuple", "string", "int"],
    answer: "list"
  },
  {
    _id: "python3",
    subject: "Python",
    question: "Which keyword is used to import a module?",
    options: ["import", "include", "require", "using"],
    answer: "import"
  },
  {
    _id: "python4",
    subject: "Python",
    question: "What is a tuple?",
    options: ["An immutable list", "A mutable list", "A key-value pair dictionary", "A set of unique elements"],
    answer: "An immutable list"
  },

  // Java Questions
  {
    _id: "java1",
    subject: "Java",
    question: "Which keyword is used to create a subclass in Java?",
    options: ["extends", "implements", "inherits", "subclass"],
    answer: "extends"
  },
  {
    _id: "java2",
    subject: "Java",
    question: "What is JVM?",
    options: ["Java Virtual Machine", "Java Version Manager", "Java Variable Method", "None of these"],
    answer: "Java Virtual Machine"
  },
  {
    _id: "java3",
    subject: "Java",
    question: "Which method is the entry point of Java programs?",
    options: ["main", "start", "init", "run"],
    answer: "main"
  },
  {
    _id: "java4",
    subject: "Java",
    question: "Which package is imported by default?",
    options: ["java.lang", "java.util", "java.io", "java.net"],
    answer: "java.lang"
  }
];

Question.deleteMany({}) // clear existing questions first
  .then(() => Question.insertMany(questions))
  .then(() => {
    console.log("Questions seeded successfully!");
    mongoose.disconnect();
  })
  .catch(err => console.error(err));