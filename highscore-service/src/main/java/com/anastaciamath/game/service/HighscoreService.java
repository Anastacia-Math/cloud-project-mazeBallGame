package com.anastaciamath.game.service;

import com.anastaciamath.game.domain.HighscoresDAO;
import com.anastaciamath.game.domain.UsersDAO;
import com.anastaciamath.game.repository.HighscoreRepo;
import com.anastaciamath.game.repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HighscoreService {
    private HighscoreRepo highscoreRepo;
    private UserRepo userRepo;

    @Autowired
    public HighscoreService(HighscoreRepo highscoreRepo, UserRepo userRepo) {
        this.highscoreRepo = highscoreRepo;
        this.userRepo = userRepo;
    }

    public UsersDAO getUser (String login) {
        UsersDAO byLogin = userRepo.findByLogin(login);
        if (byLogin != null ) {
            return byLogin;
        }
        UsersDAO user = new UsersDAO();
        user.setLogin(login);
        userRepo.save(user);
        return userRepo.findByLogin(login);
    }

    public void setHighscore (UsersDAO user, int score) {
        HighscoresDAO byUser = highscoreRepo.findByUser(user);
        if (byUser != null && byUser.getScore()>score )  {
                     byUser.setScore(score);
                     highscoreRepo.save(byUser);
                     return;
        }
        HighscoresDAO highscoresDAO = new HighscoresDAO();
        highscoresDAO.setUser(user);
        highscoresDAO.setScore(score);
        highscoreRepo.save(highscoresDAO);
    }

    public List<HighscoresDAO> findAllHighscores() {
        return highscoreRepo.findAll();
    }
}
