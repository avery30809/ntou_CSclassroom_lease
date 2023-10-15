package org.sixth.Contoller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class Hello {
    @Autowired


    @RequestMapping("/hello")
    public String hello(){
        return "hello world quick";
    }

}
