/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package mainClasses;

import java.io.BufferedReader;
import java.io.IOException;
import com.google.gson.Gson;

/**
 *
 * @author micha
 */
public class JSON_Converter {

    public String getJSONFromAjax(BufferedReader reader) throws IOException {
        StringBuilder buffer = new StringBuilder();
        String line;
        while ((line = reader.readLine()) != null) {
            buffer.append(line);
        }
        String data = buffer.toString();
        return data;
    }

    public User jsonToUser(BufferedReader json) {
        Gson gson = new Gson();
        User msg = gson.fromJson(json, User.class);
        return msg;
    }

    public String userToJSON(User per) {
        Gson gson = new Gson();

        String json = gson.toJson(per, User.class);
        return json;
    }

    public Doctor jsonToDoctor(BufferedReader json) {
        Gson gson = new Gson();
        Doctor msg = gson.fromJson(json, Doctor.class);
        return msg;
    }

    public String doctorToJSON(Doctor per) {
        Gson gson = new Gson();

        String json = gson.toJson(per, Doctor.class);
        return json;
    }
}
