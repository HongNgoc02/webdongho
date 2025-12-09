package com.bandongho.services;

import com.bandongho.dtos.RegisterRequest;
import com.bandongho.dtos.UpdateUserRequest;
import com.bandongho.dtos.UserDTO;
import com.bandongho.entities.User;

import java.util.List;

public interface UserService {
    UserDTO register(RegisterRequest request);
    UserDTO login(String email, String password);
    UserDTO getUserById(Long id);
    UserDTO updateUser(Long id, UpdateUserRequest request);
    List<UserDTO> getAllUsers();
    List<UserDTO> searchUsers(String keyword);
    void deleteUser(Long id);
    User getUserEntity(Long id);
}

