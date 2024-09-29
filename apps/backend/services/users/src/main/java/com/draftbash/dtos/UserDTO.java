package com.draftbash.dtos;

/**
 * Data transfer object for user creation request data.

 * @param id      The id of the user.
 * @param username The username of the user.
 * @param email    The email of the user.
 */
public record UserDTO(
    int id,
    String username,
    String email
) {}
