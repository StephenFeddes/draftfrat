package com.draftbash.interfaces;

import com.draftbash.dtos.UserCreationDTO;
import com.draftbash.dtos.UserCredentialsDTO;
import com.draftbash.dtos.UserDTO;
import java.util.List;
import java.util.Optional;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Repository;

/**
 * Interface for the AppUsers repository.
 */
@Repository
public interface IUserRepository {

    public int createUser(UserCreationDTO user);

    public List<UserDTO> getUsersByUsername(String username, int excludeUserId);

    @Nullable
    public Optional<UserCredentialsDTO> getUserByUsername(String username);

    @Nullable
    public Optional<UserCredentialsDTO> getUserByEmail(String email);
}
