/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package servlets;

import com.google.gson.Gson;
import database.tables.EditDoctorTable;
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
import mainClasses.Doctor;
import mainClasses.SimpleUser;

/**
 *
 * @author Ειρήνη
 */
public class AllUsers extends HttpServlet {

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
        System.out.println("mphke sthn getallusers");
        try (PrintWriter out = response.getWriter()) {
            //JSONConverter jc = new JSONConverter();
            EditDoctorTable edt = new EditDoctorTable();
            ArrayList<Doctor> d = new ArrayList<Doctor>();
            d = edt.databaseToDoctors();
            EditSimpleUserTable esut = new EditSimpleUserTable();
            ArrayList<SimpleUser> su = new ArrayList<SimpleUser>();
            su = esut.databaseToSimpleUsers();
            if (d == null && su == null) {
                response.setStatus(404);
            } else {
                Gson gson = new Gson();
                String json1 = gson.toJson(su);
                //System.out.println(json1);
                String substring1 = json1.substring(0, json1.length() - 1);
                System.out.println(substring1);
                String json2 = gson.toJson(d);
                String substring2 = json2.substring(1, json2.length());
                System.out.println(substring2);
                //String json = edt.simpleUserToJSON(d);
                System.out.println(substring1 + "," + substring2);
                out.println(substring1 + "," + substring2);
                response.setStatus(200);
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

    /**
     * Handles the HTTP <code>DELETE</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    protected void doDelete(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        System.out.println("mphke sthn doDelete allusers");
        try (PrintWriter out = response.getWriter()) {
            String username = request.getParameter("name");
            //JSONConverter jc = new JSONConverter();
            EditDoctorTable edt = new EditDoctorTable();
            Doctor d = edt.databaseToDoctorUsername(username);
            if (d != null) {
                edt.deleteDoctorUsername(username);
                response.setStatus(200);
            } else {
                EditSimpleUserTable esut = new EditSimpleUserTable();
                SimpleUser su = esut.databaseToSimpleUserUsername(username);
                if (su == null) {
                    response.setStatus(404);
                } else {
                    esut.deleteSimpleUserUsername(username);
                    response.setStatus(200);
                }
            }
        } catch (SQLException ex) {
            Logger.getLogger(Data.class.getName()).log(Level.SEVERE, null, ex);
        } catch (ClassNotFoundException ex) {
            Logger.getLogger(Data.class.getName()).log(Level.SEVERE, null, ex);
        }

    }

}
