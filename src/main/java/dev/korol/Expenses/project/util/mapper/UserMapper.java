package dev.korol.Expenses.project.util.mapper;

import dev.korol.Expenses.project.dto.userDTO.UpdateUserRequest;
import dev.korol.Expenses.project.dto.userDTO.UserLoginRequest;
import dev.korol.Expenses.project.dto.userDTO.UserRegisterRequest;
import dev.korol.Expenses.project.dto.userDTO.UserResponse;
import dev.korol.Expenses.project.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValueMappingStrategy;
import org.springframework.stereotype.Component;

/**
 * @author Korol Artur
 * 01.09.2025
 */

@Mapper(componentModel = "spring", nullValueMapMappingStrategy = NullValueMappingStrategy.RETURN_DEFAULT)
@Component
public interface UserMapper {

    User toUser(UserRegisterRequest userRegisterRequest);
    User toUser(UserLoginRequest userLoginRequest);
    @Mapping(source = "id", target = "userId")
    UserResponse toUserResponse(User user);
    void updateUserFromUpdateRequest(UpdateUserRequest updateUserRequest, @MappingTarget User user);

}
