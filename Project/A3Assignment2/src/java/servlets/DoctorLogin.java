/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package servlets;

import database.tables.EditDoctorTable;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.http.HttpSession;
import mainClasses.Doctor;

/**
 *
 * @author micha
 */
public class DoctorLogin extends HttpServlet {

    /**
     * Processes requests for both HTTP <code>GET</code> and <code>POST</code> methods.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException, SQLException, ClassNotFoundException {
        //
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
        if (session.getAttribute("loggedIn") != null) {
            try (PrintWriter out = response.getWriter()) {
                System.out.println("einai logged in doctor");
                String username = session.getAttribute("loggedIn").toString();
                System.out.println(username);
                EditDoctorTable edt = new EditDoctorTable();
                Doctor d = edt.databaseToDoctorUsername(username);
                if (d == null) {
                    response.setStatus(404);
                } else {
                    out.println(d.getUsername());
                    response.setStatus(200);
                }
            } catch (SQLException ex) {
                Logger.getLogger(Login.class.getName()).log(Level.SEVERE, null, ex);
            } catch (ClassNotFoundException ex) {
                Logger.getLogger(Login.class.getName()).log(Level.SEVERE, null, ex);
            }
        } else {
            response.setStatus(403);
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
//        processRequest(request, response);
        response.setContentType("text/html;charset=UTF-8");
        System.out.println("mphke Post DoctorLogin");
        String username = request.getParameter("username");
        String password = request.getParameter("password");
        System.out.println(username);
        try (PrintWriter out = response.getWriter()) {
            /* TODO output your page here. You may use following sample code. */
            EditDoctorTable edt = new EditDoctorTable();
            Doctor d = edt.databaseToDoctor(username, password);
            if (d == null) {
                response.setStatus(404);
            } else if (d.getCertified() == 1) {
                HttpSession session = request.getSession(true);
                System.out.println("true");
                session.setAttribute("loggedIn", username);
                int activeUsers = 0;
                if (request.getServletContext().getAttribute("activeUsers") != null) {
                    activeUsers = (int) request.getServletContext().getAttribute("activeUsers");
                }
                request.getServletContext().setAttribute("activeUsers", activeUsers + 1);
                String json = edt.doctorToJSON(d);
                out.println(d.getUsername());
                response.setStatus(200);
            } else if (d.getCertified() == 0) {
                response.setStatus(406);
            } else {
                response.setStatus(404);
            }
        } catch (SQLException ex) {
            Logger.getLogger(Login.class.getName()).log(Level.SEVERE, null, ex);
        } catch (ClassNotFoundException ex) {
            Logger.getLogger(Login.class.getName()).log(Level.SEVERE, null, ex);
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
