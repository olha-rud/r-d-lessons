import User from "../models/User.model.js";

export const getAllUsers = async (): Promise<User[]> => {
  return User.findAll({
    order: [["firstName", "ASC"]],
  });
};

export const getUserById = async (id: number): Promise<User | null> => {
  return User.findByPk(id);
};

export const createUser = async (userData: {
  firstName: string;
  lastName: string;
  email: string;
}): Promise<User> => {
  return User.create(userData);
};

export const getUserByEmail = async (email: string): Promise<User | null> => {
  return User.findOne({ where: { email } });
};
