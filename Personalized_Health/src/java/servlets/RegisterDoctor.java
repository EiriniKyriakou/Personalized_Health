/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package servlets;

import database.tables.EditDoctorTable;
import database.tables.EditSimpleUserTable;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.io.PrintWriter;
import mainClasses.JSON_Converter;
import java.sql.SQLException;
import java.util.logging.Level;
import java.util.logging.Logger;
import mainClasses.Doctor;
import mainClasses.SimpleUser;

/**
 *
 * @author mountant
 */
public class RegisterDoctor extends HttpServlet {

    /**
     * Processes requests for both HTTP <code>GET</code> and <code>POST</code>
     * methods.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException, SQLException, ClassNotFoundException {
        response.setContentType("text/html;charset=UTF-8");
    }

    // <editor-fold defaultstate="collapsed" desc="HttpServlet methods. Click on the + sign on the left to edit the code.">
    /**
     * Handles the HTTP <code>GET</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        JSON_Converter jc = new JSON_Converter();
        HttpSession session = request.getSession();
        //User p=Resources.registeredUsers.get(session.getAttribute("loggedIn").toString());
        //String json = jc.JavaObjectToJSONRemoveElements(p, "password");//personToJSON(p);
        response.setStatus(200);
        //response.getWriter().write(json);

    }

    /**
     * Handles the HTTP <code>POST</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        System.out.println("mphke doctor");
        JSON_Converter jc = new JSON_Converter();
        Doctor d = jc.jsonToDoctor(request.getReader());
        String JsonString = jc.doctorToJSON(d);

        PrintWriter out = response.getWriter();
        //response.setContentType("application/json");
        //response.setCharacterEncoding("UTF-8");
        response.setContentType("text/html;charset=UTF-8");
        String username = d.getUsername();
        String email = d.getEmail();
        String amka = d.getAmka();
        System.out.println(username);

        EditSimpleUserTable eut = new EditSimpleUserTable();
        EditDoctorTable edt = new EditDoctorTable();
        try {
            SimpleUser su0 = eut.databaseToSimpleUserUsername(username);
            SimpleUser su1 = eut.databaseToSimpleUserEmail(email);
            SimpleUser su2 = eut.databaseToSimpleUserAmka(amka);
            Doctor su3 = edt.databaseToDoctorUsername(username);
            System.out.println(su3);
            Doctor su4 = edt.databaseToDoctorEmail(email);
            Doctor su5 = edt.databaseToDoctorAmka(amka);
            if ((su0 != null) || (su3 != null)) {
                response.setStatus(403);
            } else if ((su1 != null) || (su4 != null)) {
                response.setStatus(402);
            } else if ((su2 != null) || (su5 != null)) {
                response.setStatus(401);
            } else {
                edt.addDoctorFromJSON(JsonString);
                response.setStatus(200);
                response.getWriter().write(JsonString);
            }
        } catch (SQLException ex) {
            Logger.getLogger(Register.class.getName()).log(Level.SEVERE, null, ex);
        } catch (ClassNotFoundException ex) {
            Logger.getLogger(Register.class.getName()).log(Level.SEVERE, null, ex);
        }

        //Resources.registeredUsers.put(p.getUsername(), p);
        response.setStatus(200);
        response.getWriter().write(JsonString);

        //}
    }

    /**
     * Returns a short description of the servlet.
     *
     * @return a String containing servlet description
     */
    @Override
    public String getServletInfo() {
        return "Short description";
    }// </editor-fold>

}
