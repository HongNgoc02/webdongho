package com.bandongho.dtos;

import com.bandongho.entities.User;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateUserRequest {
    // All fields are optional - update only what is provided
    private String fullName;
    
    private String phone;
    
    private String address;
    
    // Password is optional - only set if changing password
    // If provided, must be at least 6 characters
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;
    
    // Email is optional - only for admin updates
    @Email(message = "Email should be valid")
    private String email;
    
    // Role is optional - only for admin updates
    private User.UserRole role;
}

