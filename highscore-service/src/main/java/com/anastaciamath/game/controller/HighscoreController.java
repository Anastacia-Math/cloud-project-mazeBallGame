package com.anastaciamath.game.controller;

import com.anastaciamath.game.domain.UsersDAO;
import com.anastaciamath.game.domain.dto.UserHighscoreDTO;
import com.anastaciamath.game.service.HighscoreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@RestController
public class HighscoreController {
    private HighscoreService highscoreService;

    @Autowired
    public HighscoreController(HighscoreService highscoreService) {
        this.highscoreService = highscoreService;
    }


    @GetMapping(value = "/highscores")
    @ResponseBody
    public List<UserHighscoreDTO> getHighscores() {
        List<UserHighscoreDTO> scores = new ArrayList<>();
        highscoreService.findAllHighscores().forEach(score -> {
            UserHighscoreDTO uhdto = new UserHighscoreDTO();
            uhdto.setLogin(score.getUser().getLogin());
            uhdto.setScore(score.getScore());
            scores.add(uhdto);
        });
        scores.sort(Comparator.comparingInt(UserHighscoreDTO::getScore));
        return scores;
    }

    @PostMapping(value = "/highscores")
    public void setHighscore (@RequestBody UserHighscoreDTO usrDTO) {
        UsersDAO user = highscoreService.getUser(usrDTO.getLogin());
        highscoreService.setHighscore(user, usrDTO.getScore());
    }
}
