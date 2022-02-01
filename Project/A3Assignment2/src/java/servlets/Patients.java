/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package servlets;

import com.google.gson.Gson;
import database.tables.EditDoctorTable;
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
import mainClasses.Randevouz;
import mainClasses.SimpleUser;

/**
 *
 * @author Ειρήνη
 */
public class Patients extends HttpServlet {

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
        System.out.println("mphke sthn get patients");
        HttpSession session = request.getSession();
        String username = session.getAttribute("loggedIn").toString();
        EditDoctorTable edt = new EditDoctorTable();
        EditRandevouzTable ert = new EditRandevouzTable();
        EditSimpleUserTable esut = new EditSimpleUserTable();
        ArrayList<Randevouz> r = new ArrayList<Randevouz>();
        ArrayList<SimpleUser> p = new ArrayList<SimpleUser>();
        try (PrintWriter out = response.getWriter()) {
            Doctor d = edt.databaseToDoctorUsername(username);
            r = ert.databaseToRandevouzs(d.getDoctor_id());
            System.out.println("\t randevous: " + r);
            if (r != null) {
                for (int i = 0; i < r.size(); i++) {
                    if (r.get(i).getStatus().equals("done") && r.get(i).getUser_id() != 0) {
                        int id = r.get(i).getUser_id();
                        System.out.println("\tPatients id: " + id);
                        p.add(esut.databaseToSimpleUserUserID(id));
                    }
                }
                Gson gson = new Gson();
                String json = gson.toJson(p);
                out.println(json);
            } else {
                out.println("You have no Patients!");
                response.setStatus(403);
            }
        } catch (SQLException | ClassNotFoundException ex) {
            Logger.getLogger(Patients.class.getName()).log(Level.SEVERE, null, ex);
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
        processRequest(request, response);
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
