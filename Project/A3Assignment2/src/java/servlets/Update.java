/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package servlets;

import database.tables.EditDoctorTable;
import database.tables.EditSimpleUserTable;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import mainClasses.JSON_Converter;
import mainClasses.User;

/**
 *
 * @author Ειρήνη
 */
public class Update extends HttpServlet {

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
        //processRequest(request, response);
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
        System.out.println("mphke update");
        JSON_Converter jc = new JSON_Converter();
        User u = jc.jsonToUser(request.getReader());
        String JsonString = jc.userToJSON(u);
        String username = request.getParameter("current_user");

        PrintWriter out = response.getWriter();
        //response.setContentType("application/json");
        //response.setCharacterEncoding("UTF-8");
        response.setContentType("text/html;charset=UTF-8");
        //String email = u.getEmail();
        //System.out.println("username: " + username);

        EditSimpleUserTable eut = new EditSimpleUserTable();
        EditDoctorTable edt = new EditDoctorTable();
        //try {
            //SimpleUser su1 = eut.databaseToSimpleUserEmail(email);
            //Doctor su4 = edt.databaseToDoctorEmail(email);
            //if ((su1 != null) || (su4 != null)) {
            // response.setStatus(402);
            //} else {
                eut.updateSimpleUserFromJSON(JsonString, username);
                response.setStatus(200);
                response.getWriter().write(JsonString);
            //}
        /*} catch (SQLException ex) {
            Logger.getLogger(Register.class.getName()).log(Level.SEVERE, null, ex);
        } catch (ClassNotFoundException ex) {
            Logger.getLogger(Register.class.getName()).log(Level.SEVERE, null, ex);
        }*/
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
