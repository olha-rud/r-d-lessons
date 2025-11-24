import { statuses, priorities, severities } from './task.types';
import type { Status, Priority, Severity } from './task.types';

// Для Task
export function validateId(id: number): void {
    if (id <= 0) {
        throw new Error('Task ID must be positive');
    }
}

export function validateTitle(title: string): void {
    if (!title || title.trim() === '') {
        throw new Error('Title cannot be empty');
    }
}

export function validateStatus(status: Status): void {
    if (!statuses.includes(status)) {
        throw new Error(`Invalid status: ${status}`);
    }
}

export function validatePriority(priority: Priority): void {
    if (!priorities.includes(priority)) {
        throw new Error(`Invalid priority: ${priority}`);
    }
}

export function validateDescription(description: string | undefined): void {
    if (description !== undefined && description.trim() === '') {
        throw new Error('Description cannot be empty string');
    }
}

export function validateDates(
    createdAt: string,
    completedAt: string | undefined,
    deadline: string | undefined
): void {
    if (completedAt && completedAt < createdAt) {
        throw new Error('Completed date cannot be earlier than created date');
    }
    
    if (deadline && deadline < createdAt) {
        throw new Error('Deadline cannot be earlier than created date');
    }
}

// Для Bug
export function validateSeverity(severity: Severity | undefined): void {
    if (severity === undefined) {
        return;
    }
    
    if (!severities.includes(severity)) {
        throw new Error(`Invalid severity: ${severity}`);
    }
}

// Для Subtask
export function validateParentTaskId(parentTaskId: number): void {
    if (parentTaskId <= 0) {
        throw new Error('Parent task ID must be positive');
    }
}

// Для Story
export function validateStoryPoints(storyPoints: number | undefined): void {
    if (storyPoints !== undefined && storyPoints <= 0) {
        throw new Error('Story points must be positive');
    }
}

// Для Epic
export function validateSubtaskIds(subtaskIds: number[]): void {
    for (const id of subtaskIds) {
        if (id <= 0) {
            throw new Error('Subtask ID must be positive');
        }
    }
}