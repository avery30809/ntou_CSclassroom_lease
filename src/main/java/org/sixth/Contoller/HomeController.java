package org.sixth.Contoller;


import org.sixth.database.ConnectionDB;
import org.sixth.database.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.ArrayList;

@Controller
public class HomeController {


    private ConnectionDB connection;
    private ArrayList<User> res;
    @Autowired
    public HomeController(ConnectionDB connection){
        this.connection = connection;
        this.res = connection.SearchAllUser();
    }

    @GetMapping("/database")
    public String database(Model model){
        model.addAttribute("userdata", this.res);
        return "database";
    }

    @GetMapping("/")
    public String index(){ return "welcome";}

    @GetMapping("/test")
    public String test(){ return "test"; }

}
