package com.anastaciamath.game.repository;

import com.anastaciamath.game.domain.HighscoresDAO;
import com.anastaciamath.game.domain.UsersDAO;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HighscoreRepo extends JpaRepository<HighscoresDAO, Long> {
    HighscoresDAO findByUser(UsersDAO user);
}
