const firstName: string = "Olha";
const lastName: string = "Rud";
const dateOfBirth: Date = new Date("2004-07-24");
const sex: string = "female";
let phoneNumber: string = "+380631934567";
let email: string | undefined;


function personInfo(
  firstName: string,
  lastName: string,
  dateOfBirth: Date,
  phoneNumber: string): string {
   return `Картка користувача\n Ім'я: ${firstName}\n Прізвище: ${lastName}\n Дата народження: ${dateOfBirth.toLocaleDateString()}\n Стать: ${phoneNumber}`;
}

console.log(personInfo(firstName, lastName, dateOfBirth, phoneNumber));