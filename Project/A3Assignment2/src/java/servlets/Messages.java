/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package servlets;

import com.google.gson.Gson;
import database.tables.EditDoctorTable;
import database.tables.EditMessageTable;
import database.tables.EditRandevouzTable;
import database.tables.EditSimpleUserTable;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import mainClasses.Doctor;
import mainClasses.Message;
import mainClasses.SimpleUser;

/**
 *
 * @author Ειρήνη
 */
public class Messages extends HttpServlet {

    /**
     * Processes requests for both HTTP <code>GET</code> and <code>POST</code> methods.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
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
        HttpSession session = request.getSession();
        String username = session.getAttribute("loggedIn").toString();
        EditRandevouzTable ert = new EditRandevouzTable();
        EditMessageTable emt = new EditMessageTable();
        EditDoctorTable edt = new EditDoctorTable();
        EditSimpleUserTable esut = new EditSimpleUserTable();
        ArrayList<Message> m = new ArrayList<Message>();
        ArrayList<Message> mr = new ArrayList<Message>();
        try (PrintWriter out = response.getWriter()) {
            Doctor d = edt.databaseToDoctorUsername(username);
            SimpleUser su = esut.databaseToSimpleUserUsername(username);
            if (d != null) {
                m = emt.databaseToMessageDoctorID(d.getDoctor_id());
                System.out.println(m);
                for (int i = 0; i < m.size(); i++) {
                    int user_id = m.get(i).getUser_id();
                    String sender = m.get(i).getSender();
                    if (sender.equals("user")) {
                        System.out.println("if (sender.equals(user))");
                        if (ert.databaseToRandevouz(d.getDoctor_id(), user_id)) {
                            System.out.println("mphke");
                            mr.add(m.get(i));
                        }
                    }
                }
                Gson gson = new Gson();
                String json = gson.toJson(mr);
                out.println(json);
                response.setStatus(200);
            } else if (su != null) {
                //get messages when logged simple user
                m = emt.databaseToMessageUserID(su.getUser_id());
                System.out.println(m);
                for (int i = 0; i < m.size(); i++) {
                    String sender = m.get(i).getSender();
                    if (sender.equals("doctor")) {
                        System.out.println("if (sender.equals(doctor))");
                        System.out.println("mphke");
                        mr.add(m.get(i));
                    }
                }
                Gson gson = new Gson();
                String json = gson.toJson(mr);
                out.println(json);
                response.setStatus(200);
            }
        } catch (SQLException | ClassNotFoundException ex) {
            Logger.getLogger(Messages.class.getName()).log(Level.SEVERE, null, ex);
        }
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
