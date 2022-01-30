/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package servlets;

import com.google.gson.Gson;
import com.itextpdf.text.DocumentException;
import database.tables.EditDoctorTable;
import database.tables.EditRandevouzTable;
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
import mainClasses.CreatePDF;
import mainClasses.Doctor;
import mainClasses.JSON_Converter;
import mainClasses.Randevouz;

/**
 *
 * @author Ειρήνη
 */
public class Randevou extends HttpServlet {

    /**
     * Processes requests for both HTTP <code>GET</code> and <code>POST</code> and <code>PUT</code>methods.
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
        System.out.println("mphke sthn get Randevou");
        try (PrintWriter out = response.getWriter()) {
            HttpSession session = request.getSession();
            String username = session.getAttribute("loggedIn").toString();
            EditRandevouzTable ert = new EditRandevouzTable();
            EditDoctorTable edt = new EditDoctorTable();
            Doctor d = edt.databaseToDoctorUsername(username);
            ArrayList<Randevouz> r = new ArrayList<Randevouz>();
            String day = request.getParameter("day");
            String p = request.getParameter("p");
            System.out.println(p);
            System.out.println(day);
            if (day.equals("0")) {
                r = ert.databaseToRandevouzs(d.getDoctor_id());
            } else {
                System.out.println("mphke gia get rantevou by day");
                r = ert.databaseToRandevouzs(d.getDoctor_id(), day);
            }
            if (r != null) {
                Gson gson = new Gson();
                String json = gson.toJson(r);
                System.out.println(json);
                out.println(json);
                response.setStatus(200);
                if (p.equals("1")) {
                    System.out.println("mphke sto na kalesei create pdf");
                    CreatePDF pdf = new CreatePDF();
                     try {
                        pdf.create(r);
                    } catch (DocumentException ex) {
                        Logger.getLogger(Randevou.class.getName()).log(Level.SEVERE, null, ex);
                    }
                }

            } else {
                out.println("You have no appointments!");
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
     * Handles the HTTP <code>PUT</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    protected void doPut(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        try (PrintWriter out = response.getWriter()) {
            System.out.println("mphke put randevou");
            String newstatus = request.getParameter("newstatus");
            int r_id = Integer.parseInt(request.getParameter("r_id"));
            EditRandevouzTable ert = new EditRandevouzTable();
            Randevouz r = ert.databaseToRandevouz(r_id);
            if (r.getStatus().equals("cancelled")) {
                response.setStatus(403);
                out.println("Appointment was canceled!");
            } else {
                if (newstatus.equals("done") && r.getUser_id() == 0) {
                    response.setStatus(403);
                    out.println("User hasn't come!");
                } else {
                    ert.updateRandevouz(r_id, newstatus);
                    out.println("Success!<br>Now the status of this appointment is " + newstatus + ".");
                    response.setStatus(200);
                }
            }
        } catch (SQLException | ClassNotFoundException ex) {
            Logger.getLogger(Randevou.class.getName()).log(Level.SEVERE, null, ex);
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
