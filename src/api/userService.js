// src/api/userService.js
import apiClient from './client'

export const getUser = async (documentNumber) => {
  try {
    const response = await apiClient.get(`/users/${documentNumber}`)
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al obtener usuario')
  }
}

export const getAllUsers = async (queryParams = {}) => {
  try {
    const response = await apiClient.get('/users', { params: queryParams })
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al obtener usuarios')
  }
}

export const createUser = async (userData) => {
  try {
    const response = await apiClient.post('/users', userData)
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al crear usuario')
  }
}

export const updateUser = async (documentNumber, updateData) => {
  try {
    const response = await apiClient.patch(`/users/${documentNumber}`, updateData)
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al actualizar usuario')
  }
}

export const deactivateUser = async (documentNumber) => {
  try {
    const response = await apiClient.delete(`/users/${documentNumber}`)
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al desactivar usuario')
  }
}

export const getCurrentUser = async () => {
  try {
    const response = await apiClient.get('/users/me')
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al obtener usuario actual')
  }
}

export const updateUserPoints = async (documentNumber, pointsData) => {
  try {
    const response = await apiClient.patch(`/users/${documentNumber}/points`, pointsData)
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al actualizar puntos')
  }
}

export const createComplaint = async (documentNumber, complaintData) => {
  try {
    const response = await apiClient.post(`/users/${documentNumber}/complaints`, complaintData)
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al crear PQRSD')
  }
}