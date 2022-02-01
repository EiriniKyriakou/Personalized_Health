/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package mainClasses;

import com.google.gson.Gson;
import java.io.BufferedReader;
import java.io.IOException;

/**
 *
 * @author micha
 */
public class JSON_Converter {
    
    public String getJSONFromAjax(BufferedReader reader) throws IOException{
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

    public BloodTest jsonToBloodTest(BufferedReader json) {
        Gson gson = new Gson();
        BloodTest msg = gson.fromJson(json, BloodTest.class);
        return msg;
    }

    public String BloodTestToJSon(BloodTest bdt) {
        Gson gson = new Gson();

        String json = gson.toJson(bdt, BloodTest.class);
        return json;
    }

    public Randevouz jsonToRandevouz(BufferedReader json) {
        Gson gson = new Gson();
        Randevouz msg = gson.fromJson(json, Randevouz.class);
        return msg;
    }

    public String randevouzToJSON(Randevouz ran) {
        Gson gson = new Gson();
        String json = gson.toJson(ran, Randevouz.class);
        return json;
    }

    public Message jsonToMessage(BufferedReader json) {
        Gson gson = new Gson();
        Message msg = gson.fromJson(json, Message.class);
        return msg;
    }

    public String messageToJSON(Message msg) {
        Gson gson = new Gson();
        String json = gson.toJson(msg, Message.class);
        return json;
    }

    public Treatment jsonToTreatment(BufferedReader json) {
        Gson gson = new Gson();
        Treatment trt = gson.fromJson(json, Treatment.class);
        return trt;
    }

    public String treatmentToJSON(Treatment trt) {
        Gson gson = new Gson();
        String json = gson.toJson(trt, Treatment.class);
        return json;
    }
}
