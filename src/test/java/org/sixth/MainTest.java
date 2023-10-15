package org.sixth;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.sixth.database.ConnectionDB;
import org.sixth.database.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.ArrayList;

@RunWith(SpringRunner.class)
@SpringBootTest
public class MainTest {
    @Autowired
    ConnectionDB test;
    @Test
    public void contextLoads(){
        ArrayList<User> res = test.SearchAllUser();
        for (int i = 0; i < res.size(); i++) {
            System.out.println(res.get(i));
        }
    }
}
