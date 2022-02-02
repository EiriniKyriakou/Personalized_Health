/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package servlets;

import com.google.gson.Gson;
import database.tables.EditTreatmentTable;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import mainClasses.JSON_Converter;
import mainClasses.Treatment;

/**
 *
 * @author Ειρήνη
 */
public class Treatments extends HttpServlet {

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
        System.out.println("mphke sthn get treatments");
        int bloodtest_id = Integer.parseInt(request.getParameter("bloodtest_id"));
        System.out.println("\tbloodtestid=" + bloodtest_id);
        EditTreatmentTable ett = new EditTreatmentTable();
        try (PrintWriter out = response.getWriter()) {
            Treatment t = ett.databaseToTreatmentBloodtestID(bloodtest_id);
            if (t == null) {
                response.setStatus(403);
            } else {
                Gson gson = new Gson();
                String json = gson.toJson(t);
                out.println(json);
                response.setStatus(200);
            }
        } catch (SQLException | ClassNotFoundException ex) {
            Logger.getLogger(Treatments.class.getName()).log(Level.SEVERE, null, ex);
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
        //only doctor does post
        System.out.println("mphke post treatments");
        EditTreatmentTable ett = new EditTreatmentTable();
        JSON_Converter jc = new JSON_Converter();
        Treatment t = jc.jsonToTreatment(request.getReader());
        String JsonString = jc.treatmentToJSON(t);
        System.out.println("\t" + JsonString);
        try {
            if (ett.databaseToTreatmentBloodtestID(t.getBloodtest_id()) == null) {
                ett.addTreatmentFromJSON(JsonString);
                response.getWriter().write(JsonString);
                response.setStatus(200);
            } else {
                response.setStatus(403);
            }
        } catch (SQLException | ClassNotFoundException ex) {
            Logger.getLogger(Treatments.class.getName()).log(Level.SEVERE, null, ex);
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
