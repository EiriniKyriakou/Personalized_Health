/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package servlets;

import com.google.gson.Gson;
import database.tables.EditDoctorTable;
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

/**
 *
 * @author Ειρήνη
 */
public class UncertifiedDoctors extends HttpServlet {

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
        System.out.println("mphke sthn getdoctor");
        try (PrintWriter out = response.getWriter()) {
            //JSONConverter jc = new JSONConverter();
            int certified = 0;
            EditDoctorTable edt = new EditDoctorTable();
            ArrayList<Doctor> d = new ArrayList<Doctor>();
            d = edt.databaseToCertifiedDoctors(certified);
            if (d == null) {
                response.setStatus(404);
            } else {
                Gson gson = new Gson();
                String json = gson.toJson(d);
                //String json = edt.simpleUserToJSON(d);
                out.println(json);

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

    protected void doPut(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        System.out.println("mphke sthn getdoctor put");
        try (PrintWriter out = response.getWriter()) {
            //JSONConverter jc = new JSONConverter();
            int certified = 0;
            String username = request.getParameter("username");
            EditDoctorTable edt = new EditDoctorTable();
            ArrayList<Doctor> d = new ArrayList<Doctor>();
            d = edt.databaseToCertifiedDoctors(certified);
            if (d == null) {
                response.setStatus(404);
            } else {
                System.out.println("mphke sthn getdoctor put mesa sto else");
                edt.certifyDoctor(username);
                Gson gson = new Gson();
                String json = gson.toJson(d);
                out.println(json);

                response.setStatus(200);
            }
        } catch (SQLException ex) {
            Logger.getLogger(Data.class.getName()).log(Level.SEVERE, null, ex);
        } catch (ClassNotFoundException ex) {
            Logger.getLogger(Data.class.getName()).log(Level.SEVERE, null, ex);
        }

    }

}
