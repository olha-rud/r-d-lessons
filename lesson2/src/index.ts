// ЗАВДАННЯ 1: Робота з книгами
// Створи тип Book з необхідними властивостями
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

//console.log(book1);

// Створюємо масив книг для роботи
const books: Book[] = [
  { title: 'The Hobbit', author: 'J.R.R. Tolkien', pages: 310, isRead: true, year: 1937, rating: 4.8 },
  { title: 'Harry Potter and the Philosopher\'s Stone', author: 'J. K. Rowling', pages: 223, isRead: false, year: 1997, rating: 3.0},
  { title: 'Alice\'s Adventures in Wonderland', author: 'Lewis Carroll', pages: 759, isRead: true},
  { title: 'Little Women', author: 'Louisa May Alcott', pages: 759, isRead: true, year: 1868},
];

// Підзавдання 1.1: Виведи назви всіх книг
books.forEach(book => {
  //console.log(book.title);
});

// Підзавдання 1.2: Знайди книги з найбільшою кількістю сторінок
const maxPages = Math.max(...books.map(book => book.pages));
const booksWithMaxPages = books.filter(book => book.pages === maxPages);
//console.log('Книги з найбільшою кількістю сторінок:', booksWithMaxPages);

// Підзавдання 1.3: Виведи тільки прочитані книги
const booksIsRead = books.filter(book => book.isRead);
//console.log('Книги, які прочитані:', booksIsRead);



// ЗАВДАННЯ 2: Створи функції для роботи з книгами
// - Функція для отримання прочитаних книг
// - Функція для пошуку книг конкретного автора

function getReadBooks() {
  const booksIsRead = books.filter(book => book.isRead);
  console.log('Функція виводить прочитані книги', booksIsRead);
}
//getReadBooks();

function getBooksByAuthor (author: string): Book[] {
  const authorBooks = books.filter(book => book.author === author);
  console.log(`Книги автора ${author}`, authorBooks);
  return authorBooks;
}
//getBooksByAuthor('J. K. Rowling');

//////////////////////////////////////////////////////////////////////

// ЗАВДАННЯ 3: Робота зі студентами
// Створи типи для адреси та студента
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

// Підзавдання 3.1: Створи 2-3 студентів
// Підзавдання 3.2: Виведи міста, в яких живуть студенти
// Підзавдання 3.3: Порахуй середній бал кожного студента

const students: Student[] = [
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

students.forEach(student => {
  //console.log(student.name);
});

const averageGrades = students.map(student => {
  const sum = student.grades.reduce((acc, grade) => acc + grade, 0);
  const average = sum / student.grades.length;
  return {
    name: student.name,
    average: average
  };
});

students.forEach(student => {
  const average = student.grades.reduce((a, b) => a + b) / student.grades.length;
  //console.log(`${student.name}: ${average}`);
});


//////////////////////////////////////////////////////////////////
// ЗАВДАННЯ 4: Інтернет-магазин
// Створи систему для управління замовленнями

type OrderStatus = "pending" | "processing" | "shipped" | "delivered";

type Order = {
  id: number;
  product: string;
  price: number;
  status: OrderStatus;
}

const orders: Order[] = [
  { id: 1, product: "Laptop", price: 15000, status: "pending" },
  { id: 2, product: "Phone", price: 8000, status: "shipped" },
  { id: 3, product: "Headphone", price: 21000, status: "delivered" },
  { id: 4, product: "Display", price: 1300, status: "processing" }
];  

///////////////////////////////////////////////////////////////
// ЗАВДАННЯ 5: Географічні координати
// Напиши функцію, яка знаходить найпівнічніше місто (з найбільшою широтою latitude)

type CityCoordinates = [city: string, latitude: number, longitude: number];

const cities: CityCoordinates[] = [
  ["Kyiv", 50.4501, 30.5234],
  ["Lviv", 49.8397, 24.0297],
  ["Odesa", 46.4825, 30.7233],
  ["Kharkiv", 49.9935, 36.2304],
  ["Dnipro", 48.4647, 35.0462]
];

function findNorthernmostCity(): string {
return cities.reduce((max, city) => 
    city[1] > max[1] ? city : max
  )[0];
}

//console.log('Найпівнічніше місто:', findNorthernmostCity());

////////////////////////////////////////////////////////////////
// ЗАВДАННЯ 6: Readonly конфігурація
// Створи конфігурацію додатку, яку неможливо змінити після створення

type Config = {
  readonly appName: string;
  readonly version: string;
  readonly maxUsers: number;
}

const config: Config = {
  appName: "MyApp",
  version: "1.0.0",
  maxUsers: 100
};

// Спробуй змінити значення - має бути помилка компілятора
//config.version = "1.0.1"; // Помилка: неможливо змінити readonly властивість


