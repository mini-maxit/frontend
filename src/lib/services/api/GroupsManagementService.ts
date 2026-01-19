import type { ApiService } from './ApiService';
import { ApiError } from '../ApiService';
import type { Group, CreateGroupDto, EditGroupDto } from '$lib/dto/group';
import type { User } from '$lib/dto/user';
import type { ApiResponse } from '$lib/dto/response';

/**
 * Client-side service for group management API calls
 * Mirrors the server-side GroupsManagementService API (throws errors)
 */
export class GroupsManagementService {
  constructor(private apiClient: ApiService) {}

  async getAllGroups(): Promise<Group[]> {
    try {
      const response = await this.apiClient.get<ApiResponse<Group[]>>({
        url: '/groups-management/groups'
      });
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        console.error('Failed to get groups:', error.toJSON());
        throw error;
      }
      throw error;
    }
  }

  async getGroupById(groupId: number): Promise<Group> {
    try {
      const response = await this.apiClient.get<ApiResponse<Group>>({
        url: `/groups-management/groups/${groupId}`
      });
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        console.error('Failed to get group:', error.toJSON());
        throw error;
      }
      throw error;
    }
  }

  async createGroup(data: CreateGroupDto): Promise<{ id: number }> {
    try {
      const response = await this.apiClient.post<ApiResponse<{ id: number }>>({
        url: '/groups-management/groups',
        body: JSON.stringify(data)
      });
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        console.error('Failed to create group:', error.toJSON());
        throw error;
      }
      throw error;
    }
  }

  async updateGroup(groupId: number, data: EditGroupDto): Promise<Group> {
    try {
      const response = await this.apiClient.put<ApiResponse<Group>>({
        url: `/groups-management/groups/${groupId}`,
        body: JSON.stringify(data)
      });
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        console.error('Failed to update group:', error.toJSON());
        throw error;
      }
      throw error;
    }
  }

  async getGroupMembers(groupId: number): Promise<User[]> {
    try {
      const response = await this.apiClient.get<ApiResponse<User[]>>({
        url: `/groups-management/groups/${groupId}/users`
      });
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        console.error('Failed to get group members:', error.toJSON());
        throw error;
      }
      throw error;
    }
  }

  async addUsersToGroup(groupId: number, userIDs: number[]): Promise<void> {
    try {
      await this.apiClient.post<ApiResponse<{ message: string }>>({
        url: `/groups-management/groups/${groupId}/users`,
        body: JSON.stringify({ userIDs })
      });
    } catch (error) {
      if (error instanceof ApiError) {
        console.error('Failed to add users to group:', error.toJSON());
        throw error;
      }
      throw error;
    }
  }

  async removeUsersFromGroup(groupId: number, userIDs: number[]): Promise<void> {
    try {
      await this.apiClient.delete<ApiResponse<{ message: string }>>({
        url: `/groups-management/groups/${groupId}/users`,
        body: JSON.stringify({ userIDs })
      });
    } catch (error) {
      if (error instanceof ApiError) {
        console.error('Failed to remove users from group:', error.toJSON());
        throw error;
      }
      throw error;
    }
  }
}
