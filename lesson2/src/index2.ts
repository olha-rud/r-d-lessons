// 1. Доступ до властивостей об'єкта
type Book = {
  title: string;
  author: string;
  pages: number;
  isRead: boolean;
  year?: number;
  rating?: number;
}

const book1: Book = {
  title: 'IT',
  author: 'Stephen King',
  pages: 152,
  isRead: true
}

//console.log (book1);
//console.log (book1.title);
//console.log (book1.author);

//console.log(book1['title']);

// 2. Доступ до елементів масиву
const books: Book[] = [
  { title: 'The Hobbit', author: 'J.R.R. Tolkien', pages: 310, isRead: true, year: 1937, rating: 4.8 },
  { title: 'Harry Potter and the Philosopher\'s Stone', author: 'J. K. Rowling', pages: 223, isRead: false, year: 1997, rating: 3.0},
  { title: 'Alice\'s Adventures in Wonderland', author: 'Lewis Carroll', pages: 759, isRead: true},
  { title: 'Little Women', author: 'Louisa May Alcott', pages: 759, isRead: true, year: 1868},
];

//console.log (books);
//console.log (books[0]);
//console.log (books[0]?.author);

//3. Доступ до вкладених об'єктів
type Address = {
  city: string;
  street: string;
}

type Student = {
  name: string;
  age: number;
  address: Address;
  grades: number[]; // масив оцінок
}

const students: Student = {
    name: "Олена Коваленко",
    age: 20,
    address: {
      city: "Київ",
      street: "вул. Хрещатик, 22"
    },
    grades: [90, 85, 92, 88]
  }

//console.log (students);
//console.log (students.address);
//console.log (students.address.city);
//console.log (students.grades[0]);

// forEach - для перебору

const students2: Student[] = [
  {
    name: "Олена Коваленко",
    age: 20,
    address: {
      city: "Київ",
      street: "вул. Хрещатик, 22"
    },
    grades: [90, 85, 92, 88]
  },
  {
    name: "Андрій Шевченко",
    age: 22,
    address: {
      city: "Львів",
      street: "вул. Шевченка, 15"
    },
    grades: [88, 90, 87, 91]
  },
  {
    name: "Марія Петренко",
    age: 19,
    address: {
      city: "Одеса",
      street: "Дерибасівська, 10"
    },
    grades: [95, 92, 89, 94]
  }
];


students2.forEach(student => {
  //console.log(student.name);              // ім'я студента
  //console.log(student.address.city);      // місто студента
  //console.log(student.grades[0]);         // перша оцінка
});

// map - для трансформації
const cities = students2.map(student => student.address.city);
//console.log(cities); // ["Київ", "Львів", "Одеса"]

// filter - для фільтрації
const youngStudents = students2.filter(student => student.age < 21);
console.log(youngStudents);