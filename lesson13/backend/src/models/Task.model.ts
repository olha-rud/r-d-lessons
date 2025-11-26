import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database.js";
import User from "./User.model.js";
import { TASK_STATUSES, TASK_PRIORITIES, TaskStatus, TaskPriority } from "../constants/task.constants.js";

interface TaskAttributes {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId: number | null;
  createdAt?: Date;
  updatedAt?: Date;
}

interface TaskCreationAttributes extends Optional<TaskAttributes, "id" | "status" | "priority" | "assigneeId"> {}

class Task extends Model<TaskAttributes, TaskCreationAttributes> implements TaskAttributes {
  declare id: number;
  declare title: string;
  declare description: string;
  declare status: TaskStatus;
  declare priority: TaskPriority;
  declare assigneeId: number | null;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;

  declare readonly assignee?: User;
}

Task.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(...TASK_STATUSES),
      defaultValue: "pending",
    },
    priority: {
      type: DataTypes.ENUM(...TASK_PRIORITIES),
      defaultValue: "medium",
    },
    assigneeId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: User,
        key: "id",
      },
    },
  },
  {
    sequelize,
    tableName: "tasks",
  }
);

Task.belongsTo(User, { foreignKey: "assigneeId", as: "assignee" });
User.hasMany(Task, { foreignKey: "assigneeId", as: "tasks" });

export default Task;
