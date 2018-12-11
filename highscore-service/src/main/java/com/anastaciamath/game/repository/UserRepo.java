package com.anastaciamath.game.repository;

import com.anastaciamath.game.domain.UsersDAO;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepo extends JpaRepository<UsersDAO, Long> {
    UsersDAO findByLogin (String login);
}
