/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package servlets;

import database.tables.EditDoctorTable;
import database.tables.EditRandevouzTable;
import database.tables.EditSimpleUserTable;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import mainClasses.Doctor;
import mainClasses.JSON_Converter;
import mainClasses.Randevouz;
import mainClasses.SimpleUser;

/**
 *
 * @author Ειρήνη
 */
public class Randevou extends HttpServlet {

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
        //System.out.println("mphke sthn getdata");
        try (PrintWriter out = response.getWriter()) {
            //JSONConverter jc = new JSONConverter();

            //String username = request.getParameter("current_user");
            HttpSession session = request.getSession();
            String username = session.getAttribute("loggedIn").toString();
            EditSimpleUserTable eut = new EditSimpleUserTable();
            EditDoctorTable edt = new EditDoctorTable();
            SimpleUser su = eut.databaseToSimpleUserUsername(username);
            Doctor d = edt.databaseToDoctorUsername(username);
            if (su != null) {
                String json = eut.simpleUserToJSON(su);
                out.println(json);
                response.setStatus(200);
            } else if (edt != null) {
                String json = edt.doctorToJSON(d);
                out.println(json);
                response.setStatus(200);
            } else {
                response.setStatus(404);
            }
        } catch (SQLException ex) {
            Logger.getLogger(Data.class.getName()).log(Level.SEVERE, null, ex);
        } catch (ClassNotFoundException ex) {
            Logger.getLogger(Data.class.getName()).log(Level.SEVERE, null, ex);
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
        try {
            System.out.println("mphke post randevou");
            JSON_Converter jc = new JSON_Converter();

            Randevouz r = jc.jsonToRandevouz(request.getReader());
            int id = r.getDoctor_id();
            String date = r.getDate_time();
            String JsonString = jc.randevouzToJSON(r);
            System.out.println(JsonString);

            //HttpSession session = request.getSession();
            //String username = session.getAttribute("loggedIn").toString();
            PrintWriter out = response.getWriter();
            response.setContentType("text/html;charset=UTF-8");

            EditRandevouzTable ert = new EditRandevouzTable();
            Randevouz rd = ert.databaseToRandevouz(id, date);
            //SimpleUser su = eut.databaseToSimpleUserUsername(username);
            //Doctor d = edt.databaseToDoctorUsername(username);

            if (rd != null) {
                response.setStatus(403);
                response.getWriter().write("Randevou arleady exists!");
            } else {
                ert.addRandevouzFromJSON(JsonString);
                response.getWriter().write(JsonString);
                response.setStatus(200);

            }
        } catch (SQLException ex) {
            Logger.getLogger(Data.class.getName()).log(Level.SEVERE, null, ex);
        } catch (ClassNotFoundException ex) {
            Logger.getLogger(Data.class.getName()).log(Level.SEVERE, null, ex);
        }
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
