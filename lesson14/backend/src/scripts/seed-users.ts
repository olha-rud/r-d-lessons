import sequelize from "../config/database.js";
import User from "../models/User.model.js";

const seedUsers = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected successfully");

    // Create test users
    const users = await User.bulkCreate(
      [
        {
          firstName: "Olha",
          lastName: "Rud",
          email: "olha.rud@example.com",
        },
        {
          firstName: "Ivan",
          lastName: "Petrov",
          email: "ivan.petrov@example.com",
        },
        {
          firstName: "Maria",
          lastName: "Kovalenko",
          email: "maria.kovalenko@example.com",
        },
        {
          firstName: "Andriy",
          lastName: "Shevchenko",
          email: "andriy.shevchenko@example.com",
        },
        {
          firstName: "Yulia",
          lastName: "Tymoshenko",
          email: "yulia.tymoshenko@example.com",
        },
      ],
      { ignoreDuplicates: true },
    );

    console.log(`✅ Created ${users.length} users successfully!`);
    console.log(
      users
        .map((u) => `  - ${u.firstName} ${u.lastName} (${u.email})`)
        .join("\n"),
    );

    await sequelize.close();
  } catch (error) {
    console.error("❌ Error seeding users:", error);
    process.exit(1);
  }
};

seedUsers();
