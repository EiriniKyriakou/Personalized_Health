/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package servlets;

import com.google.gson.Gson;
import database.tables.EditBloodTestTable;
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
import javax.servlet.http.HttpSession;
import mainClasses.BloodTest;
import mainClasses.Doctor;
import mainClasses.SimpleUser;

/**
 *
 * @author alvir
 */
//@WebServlet(name = "BloodTest", urlPatterns = {"/BloodTest"})
public class BloodTests extends HttpServlet {

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
        /*try (PrintWriter out = response.getWriter()) {
            /* TODO output your page here. You may use following sample code.
            out.println("<!DOCTYPE html>");
            out.println("<html>");
            out.println("<head>");
            out.println("<title>Servlet BloodTest</title>");
            out.println("</head>");
            out.println("<body>");
            out.println("<h1>Servlet BloodTest at " + request.getContextPath() + "</h1>");
            out.println("</body>");
            out.println("</html>");
        }*/
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
        System.out.println("mphke sthn getbloodtests");
        try (PrintWriter out = response.getWriter()) {
            //int certified = 1;
            HttpSession session = request.getSession();
            String username1 = session.getAttribute("loggedIn").toString();
            EditDoctorTable edt1 = new EditDoctorTable();
            Doctor d1 = edt1.databaseToDoctorUsername(username1);
            String date = request.getParameter("date");
            String Test = request.getParameter("Test");
            if (d1 != null && null == date && Test == null) {
                String amka1 = request.getParameter("amka");
                System.out.println("\tamka=" + amka1 + ".");
                ArrayList<BloodTest> d = new ArrayList<BloodTest>();
                EditBloodTestTable edt = new EditBloodTestTable();
                d = edt.databaseToBloodtest(amka1);
                if (d.isEmpty()) {
                    response.setStatus(403);
                } else {
                    Gson gson = new Gson();
                    String json = gson.toJson(d);
                    System.out.println("\tbloodtests:" + json);
                    out.println(json);
                    response.setStatus(200);
                }
            } else {
                //String date = request.getParameter("date");
                //String Test = request.getParameter("Test");
                if (date != null) {
                    System.out.println("\tmphke sthn date=" + date);
                    ArrayList<BloodTest> d = new ArrayList<BloodTest>();
                    String username = session.getAttribute("loggedIn").toString();
                    EditBloodTestTable edt = new EditBloodTestTable();
                    EditSimpleUserTable eut = new EditSimpleUserTable();
                    SimpleUser bt = eut.databaseToSimpleUserUsername(username);
                    String amka;
                    if (d1 != null) {
                        amka = request.getParameter("amka");
                    } else {
                        amka = bt.getAmka();
                    }
                    d = edt.databaseToBloodtestDate(amka, date);
                    if (d.isEmpty()) {
                        response.setStatus(403);
                    } else {
                        int i = 0, j = 0;
                        if (d.get(i).test_date.compareTo(d.get(i + 1).test_date) == -1) {
                            System.out.println(d.size());
                        }
                        if (d.size() > 1) {
                            while (j == 0) {
                                j = 1;
                                for (i = 0; i < d.size() - 1; i++) {
                                    System.out.println(i);
                                    System.out.println(d.get(i).test_date);
                                    System.out.println(d.get(i + 1).test_date);
                                    System.out.println(d.get(i).test_date.compareTo(d.get(i + 1).test_date));
                                    if (d.get(i).test_date.compareTo(d.get(i + 1).test_date) == 1) {
                                        System.out.println("\t\tnai2");
                                        BloodTest temp = d.get(i);
                                        d.set(i, d.get(i + 1));
                                        d.set(i + 1, temp);
                                        j = 0;
                                    }
                                }
                            }
                        }

                        Gson gson = new Gson();
                        String json = gson.toJson(d);
                        out.println(json);
                        response.setStatus(200);
                    }
                } else if (Test != null) {
                    System.out.println("\tmphke sthn test");
                    ArrayList<BloodTest> d = new ArrayList<BloodTest>();
                    String username = session.getAttribute("loggedIn").toString();
                    EditBloodTestTable edt = new EditBloodTestTable();
                    EditSimpleUserTable eut = new EditSimpleUserTable();
                    SimpleUser bt = eut.databaseToSimpleUserUsername(username);
                    String amka;
                    if (d1 != null) {
                        amka = request.getParameter("amka");
                        System.out.println("\t\tamka apo giatro=" + amka);
                    } else {
                        amka = bt.getAmka();
                        System.out.println("\t\tamka apo xrhsth=" + amka);
                    }
                    d = edt.databaseToTest(amka, Test);
                    if (d.isEmpty()) {
                        response.setStatus(403);
                    } else {
                        Gson gson = new Gson();
                        String json = gson.toJson(d);
                        out.println(json);
                        response.setStatus(200);
                    }
                } else {
                    EditBloodTestTable edt = new EditBloodTestTable();
                    EditSimpleUserTable eut = new EditSimpleUserTable();
                    ArrayList<BloodTest> d = new ArrayList<BloodTest>();
                    String username = session.getAttribute("loggedIn").toString();
                    SimpleUser bt = eut.databaseToSimpleUserUsername(username);
                    String amka = bt.getAmka();
                    d = edt.databaseToBloodtest(amka);
                    Gson gson = new Gson();
                    String json = gson.toJson(d);
                    out.println(json);
                    response.setStatus(200);
                }
            }
        } catch (SQLException ex) {
            Logger.getLogger(BloodTests.class.getName()).log(Level.SEVERE, null, ex);
        } catch (ClassNotFoundException ex) {
            Logger.getLogger(BloodTests.class.getName()).log(Level.SEVERE, null, ex);
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
            System.out.println("mphke bloodtest");
            HttpSession session = request.getSession();
            String username = session.getAttribute("loggedIn").toString();
            EditSimpleUserTable eut = new EditSimpleUserTable();
            SimpleUser bt = eut.databaseToSimpleUserUsername(username);
            String amka = bt.getAmka();
            System.out.println("\tphre to amka:" + amka);
            //JSON_Converter jc = new JSON_Converter();
            Gson gson = new Gson();
            BloodTest u = gson.fromJson(request.getReader(), BloodTest.class);
            //BloodTest u = jc.jsonToBloodTest(request.getReader());
            u.setAmka(amka);
            u.setValues();
            String JsonString = gson.toJson(u, BloodTest.class);
            System.out.println("\tekane json:" + JsonString);
            //String JsonString = jc.BloodTestToJSon(u);
            System.out.println(JsonString);
            PrintWriter out = response.getWriter();
            //response.setContentType("application/json");
            //response.setCharacterEncoding("UTF-8");
            response.setContentType("text/html;charset=UTF-8");
            /*String username = u.getUsername();
            String email = u.getEmail();
            String amka = u.getAmka();*/
            //System.out.println("username: " + username);

            //EditSimpleUserTable eut = new EditSimpleUserTable();
            EditBloodTestTable ebt = new EditBloodTestTable();
            try {
                /*SimpleUser su0 = eut.databaseToSimpleUserUsername(username);
                SimpleUser su1 = eut.databaseToSimpleUserEmail(email);
                SimpleUser su2 = eut.databaseToSimpleUserAmka(amka);
                Doctor su3 = edt.databaseToDoctorUsername(username);
                Doctor su4 = edt.databaseToDoctorEmail(email);
                Doctor su5 = edt.databaseToDoctorAmka(amka);
                if ((su0 != null) || (su3 != null)) {
                response.setStatus(403);
                } else if ((su1 != null) || (su4 != null)) {
                response.setStatus(402);
                } else if ((su2 != null) || (su5 != null)) {
                response.setStatus(401);
                } else {*/
                ebt.addBloodTestFromJSON(JsonString);
                System.out.println("\tekane add");
                response.setStatus(200);
                response.getWriter().write(JsonString);
                //}
            } catch (ClassNotFoundException ex) {
                Logger.getLogger(BloodTests.class.getName()).log(Level.SEVERE, null, ex);
            }
            //processRequest(request, response);

            //processRequest(request, response);
        } catch (SQLException ex) {
            Logger.getLogger(BloodTests.class.getName()).log(Level.SEVERE, null, ex);
        } catch (ClassNotFoundException ex) {
            Logger.getLogger(BloodTests.class.getName()).log(Level.SEVERE, null, ex);
        }
        //processRequest(request, response);

        //processRequest(request, response);
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
